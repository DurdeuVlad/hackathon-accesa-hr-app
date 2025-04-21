package eu.cvmatch.backend.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("integration")
class CVScoringIntegrationTest {

    @Autowired
    private CVScoring cvScoring;

    @Autowired
    private GenerativeLanguageClient glClient;

    @Test
    void allCvsAgainstAllJobs_generateJobDataViaGemini_andValidate() throws Exception {
        var resolver = new PathMatchingResourcePatternResolver();

        // Load all job description files
        Resource[] jobResources = resolver.getResources("classpath:jobDescription/*.docx");
        assertThat(jobResources)
                .withFailMessage("No job descriptions found in src/test/resources/jobDescription")
                .isNotEmpty();

        // Load all CV files
        Resource[] cvResources = resolver.getResources("classpath:cvs/*.docx");
        assertThat(cvResources)
                .withFailMessage("No CVs found in src/test/resources/cvs")
                .isNotEmpty();

        // For each job description...
        for (Resource jobRes : jobResources) {
            String jobName = jobRes.getFilename();

            // 1) extract JD text
            String jdText;
            try (InputStream in = jobRes.getInputStream()) {
                jdText = TextExtractor.extract(new MockMultipartFile(
                        jobName, jobName,
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        in
                ));
            }

            // 2) ask Gemini to extract industry & top‑5 skills with weights
            String prompt = String.format(
                    "Extract from this job description:\n" +
                            "• industry (single word or short phrase),\n" +
                            "• the top 5 technical skills and their relative weights summing to 100.\n" +
                            "Return ONLY valid JSON with fields:\n" +
                            "  { \"industry\": \"...\", \"technicalSkills\": [{\"skill\":\"...\",\"weight\":...}, ...] }\n\n" +
                            "Job Description:\n%s",
                    jdText
            );
            JsonArray cands = glClient.generateMessage(List.of(prompt), null, 1);
            String json = cands.get(0).getAsJsonObject().get("content").getAsString().trim();
            JsonObject jobJson = JsonParser.parseString(json).getAsJsonObject();

            // 3) build JobPosting
            JobPosting job = new JobPosting();
            job.setIndustry(jobJson.get("industry").getAsString());
            job.setDescription(jdText);

            List<JobPosting.TechnicalSkill> skills = new ArrayList<>();
            for (JsonElement el : jobJson.getAsJsonArray("technicalSkills")) {
                JsonObject obj = el.getAsJsonObject();
                JobPosting.TechnicalSkill ts = new JobPosting.TechnicalSkill();
                ts.setSkill(obj.get("skill").getAsString());
                ts.setWeight(obj.get("weight").getAsInt());
                skills.add(ts);
            }
            job.setTechnicalSkills(skills);

            System.out.printf(
                    "=== Job: %s ===%nIndustry: %s%nSkills: %s%nDescription snippet: %.50s...%n%n",
                    jobName,
                    job.getIndustry(),
                    skills,
                    jdText.replaceAll("\\s+", " ").trim()
            );

            // 4) score every CV against this job
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

                CVMatchResult result = cvScoring.calculateScore(cvText, job);

                // Print out results
                System.out.printf(
                        "--- CV: %s vs Job: %s --- %n" +
                                "Final Score:    %.2f%n" +
                                "Industry Score: %.2f%n" +
                                "Tech Score:     %.2f%n" +
                                "JD Score:       %.2f%n" +
                                "Explanation:    %s%n%n",
                        cvName,
                        jobName,
                        result.getScore(),
                        result.getIndustryScore(),
                        result.getTechScore(),
                        result.getJdScore(),
                        result.getExplanation().replaceAll("\\s+", " ").trim()
                );

                // Assertions
                assertThat(result.getScore())
                        .as("%s vs %s: score", cvName, jobName).isBetween(0.0, 100.0);
                assertThat(result.getIndustryScore())
                        .as("%s vs %s: industryScore", cvName, jobName).isBetween(0.0, 100.0);
                assertThat(result.getTechScore())
                        .as("%s vs %s: techScore", cvName, jobName).isBetween(0.0, 100.0);
                assertThat(result.getJdScore())
                        .as("%s vs %s: jdScore", cvName, jobName).isBetween(0.0, 100.0);
                assertThat(result.getExplanation())
                        .as("%s vs %s: explanation", cvName, jobName).isNotBlank();
            }
        }
    }
}
