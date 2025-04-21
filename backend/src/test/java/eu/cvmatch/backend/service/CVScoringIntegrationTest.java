package eu.cvmatch.backend.service;

import com.google.gson.*;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.service.GenerativeLanguageClient;
import eu.cvmatch.backend.utils.TextExtractor;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("integration")
class CVScoringIntegrationTest {

    @Autowired
    private CVScoring cvScoring;

    @Autowired
    private GenerativeLanguageClient glClient;

    @Test
    void allCvsAgainstAllJobs_withCaching_andPrintDeltas() throws Exception {
        var resolver = new PathMatchingResourcePatternResolver();
        Path cacheDir = Paths.get("jobDescriptionCache");
        Files.createDirectories(cacheDir);

        Resource[] jobResources = resolver.getResources("classpath:jobDescription/*.docx");
        assertThat(jobResources).isNotEmpty()
                .withFailMessage("No job descriptions found");

        Resource[] cvResources = resolver.getResources("classpath:cvs/*.docx");
        assertThat(cvResources).isNotEmpty()
                .withFailMessage("No CVs found");

        // accumulate all score differences
        List<Double> scoreDeltas = new ArrayList<>();

        for (Resource jobRes : jobResources) {
            String jobName = jobRes.getFilename();
            String baseName = jobName.replaceAll("\\.docx$", "");
            Path cacheFile = cacheDir.resolve(baseName + ".txt");

            // Extract JD text
            String jdText;
            try (InputStream in = jobRes.getInputStream()) {
                jdText = TextExtractor.extract(new MockMultipartFile(
                        jobName, jobName,
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        in
                ));
            }

            // Load or fetch JSON metadata
            String jobJsonString = loadOrFetchJobJson(cacheFile, jdText, jobName);
            JsonObject jobJson = JsonParser.parseString(jobJsonString).getAsJsonObject();
            JobPosting job = buildJobPosting(jobJson, jdText);

            System.out.printf("=== Job: %s === Industry: %s  Skills: %s%n%n",
                    jobName, job.getIndustry(), job.getTechnicalSkills());

            for (Resource cvRes : cvResources) {
                String cvName = cvRes.getFilename();
                String cvText;
                try (InputStream in = cvRes.getInputStream()) {
                    cvText = TextExtractor.extract(new MockMultipartFile(
                            cvName, cvName,
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            in
                    ));
                }

                CVMatchResult r1 = cvScoring.calculateScore(cvText, job);
                CVMatchResult r2 = cvScoring.calculateScore(cvText, job);

                double dScore    = Math.abs(r1.getScore() - r2.getScore());
                double dIndustry = Math.abs(r1.getIndustryScore() - r2.getIndustryScore());
                double dTech     = Math.abs(r1.getTechScore() - r2.getTechScore());
                double dJd       = Math.abs(r1.getJdScore() - r2.getJdScore());

                // collect main score delta
                scoreDeltas.add(dScore);

                System.out.printf(
                        "--- %s vs %s ---%n" +
                                "Score:      %.2f vs %.2f (Δ=%.2f)%n" +
                                "Industry:   %.2f vs %.2f (Δ=%.2f)%n" +
                                "Tech:       %.2f vs %.2f (Δ=%.2f)%n" +
                                "JD Match:   %.2f vs %.2f (Δ=%.2f)%n" +
                                "Explanation1: %s%n" +
                                "Explanation2: %s%n%n",
                        cvName, jobName,
                        r1.getScore(), r2.getScore(), dScore,
                        r1.getIndustryScore(), r2.getIndustryScore(), dIndustry,
                        r1.getTechScore(), r2.getTechScore(), dTech,
                        r1.getJdScore(), r2.getJdScore(), dJd,
                        r1.getExplanation().replaceAll("\\s+", " "),
                        r2.getExplanation().replaceAll("\\s+", " ")
                );

                // basic assertions
                assertThat(r1.getScore()).isBetween(0.0, 100.0);
                assertThat(r1.getIndustryScore()).isBetween(0.0, 100.0);
                assertThat(r1.getTechScore()).isBetween(0.0, 100.0);
                assertThat(r1.getJdScore()).isBetween(0.0, 100.0);
                assertThat(r1.getExplanation()).isNotBlank();
            }
        }

        // After all entries, print aggregate error report
        double totalDelta = scoreDeltas.stream().mapToDouble(Double::doubleValue).sum();
        double maxDelta   = scoreDeltas.stream().mapToDouble(Double::doubleValue).max().orElse(0.0);
        double avgDelta   = scoreDeltas.isEmpty() ? 0.0 : totalDelta / scoreDeltas.size();

        System.out.println("\n==== Aggregate Δ Report ====");
        System.out.printf("Entries checked: %d%n", scoreDeltas.size());
        System.out.printf("Total Δ sum:     %.2f%n", totalDelta);
        System.out.printf("Max Δ:           %.2f%n", maxDelta);
        System.out.printf("Avg Δ:           %.2f%n", avgDelta);
        System.out.println("================================");
    }

    private String loadOrFetchJobJson(Path cacheFile, String jdText, String jobName) throws Exception {
        String json;
        if (Files.exists(cacheFile)) {
            json = Files.readString(cacheFile, StandardCharsets.UTF_8);
        } else {
            String prompt = """
                Extract from this job description:
                • industry,
                • top 5 technical skills + weights summing to 100.
                Return ONLY valid JSON:
                {"industry":"...","technicalSkills":[{"skill":"...","weight":...},...]}.

                Job Description:
                %s
                """.formatted(jdText);

            JsonArray cands = glClient.generateMessage(List.of(prompt), null, 1);
            assertThat(cands).isNotEmpty()
                    .withFailMessage("Gemini returned no candidates for %s", jobName);

            json = cands.get(0).getAsJsonObject().get("content").getAsString().trim();
            Files.writeString(cacheFile, json, StandardCharsets.UTF_8);
        }
        // validate
        JsonParser.parseString(json).getAsJsonObject();
        return json;
    }

    private JobPosting buildJobPosting(JsonObject jobJson, String jdText) {
        JobPosting job = new JobPosting();
        job.setIndustry(jobJson.get("industry").getAsString());
        job.setDescription(jdText);
        List<JobPosting.TechnicalSkill> skills = new ArrayList<>();
        for (JsonElement e : jobJson.getAsJsonArray("technicalSkills")) {
            JsonObject o = e.getAsJsonObject();
            JobPosting.TechnicalSkill ts = new JobPosting.TechnicalSkill();
            ts.setSkill(o.get("skill").getAsString());
            ts.setWeight(o.get("weight").getAsInt());
            skills.add(ts);
        }
        job.setTechnicalSkills(skills);
        return job;
    }
}
