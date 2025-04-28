package eu.cvmatch.backend.integration;

import com.google.gson.*;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.service.CVScoring;
import eu.cvmatch.backend.service.GenerativeLanguageClient;
import eu.cvmatch.backend.utils.TextExtractor;
import org.assertj.core.api.Assertions;
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
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies that the scorer gives a higher score to the CVs we
 * (humans) believe are the best match for a given job posting.
 *
 * HOW IT WORKS
 * ─────────────
 * 1. Build a JobPosting object from the .docx job description
 *    (same helper code as the existing "fairness" test).
 * 2. Iterate over all CVs in classpath:/cvs.
 * 3. Call cvScoring.calculateScore(…) for each CV.
 * 4. Sort the results descending by score.
 * 5. Assert that a CV-we-expect sits at the top and another one
 *    we KNOW is a weaker fit sits at the bottom.
 *
 * ⚠  Update the EXPECTED_BEST and EXPECTED_WORST maps if you
 *    add more jobs or CVs.
 */
@SpringBootTest
@ActiveProfiles("integration")
class CVScoringRankingIntegrationTest {

    @Autowired
    private CVScoring cvScoring;

    @Autowired
    private GenerativeLanguageClient glClient;

    /* ========== 1) Tell the test what “good” looks like ========== */

    /** Map <job file → CV file that SHOULD be the best match> */
    private static final Map<String,String> EXPECTED_BEST = Map.of(
            "job_description_1_Tech Lead.docx",  "cv_4_Andrei_Mihailescu.docx",
            "job_description_2_Project Manager.docx", "cv_4_Andrei_Mihailescu.docx"
    );



    private static final Map<String,String> EXPECTED_WORST = Map.of(
            "job_description_1_Tech Lead.docx",  "cv_3_Cătălin_Mihai_Dumitrescu.docx",
            "job_description_2_Project Manager.docx", "cv_9_Adrian_Munteanu.docx"
    );


    /* ============================================================ */

    @Test
    void scorerRanksBetterCVsHigher() throws Exception {

        var resolver = new PathMatchingResourcePatternResolver();

        Resource[] jobResources = resolver.getResources("classpath:jobDescription/*.docx");
        Resource[] cvResources  = resolver.getResources("classpath:cvs/*.docx");

        assertThat(jobResources).isNotEmpty();
        assertThat(cvResources).isNotEmpty();

        Path cacheDir = Paths.get("jobDescriptionCache");
        Files.createDirectories(cacheDir);

        for (Resource jobRes : jobResources) {

            String jobFileName = Objects.requireNonNull(jobRes.getFilename());

            // ------- build JobPosting exactly like the fairness test -------
            String jdText;
            try (InputStream in = jobRes.getInputStream()) {
                jdText = TextExtractor.extract(new MockMultipartFile(
                        jobFileName, jobFileName,
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        in));
            }
            String jobJsonString = loadOrFetchJobJson(cacheDir, jobFileName, jdText);
            JobPosting job = buildJobPosting(jobJsonString, jdText);

            // ------------- score ALL CVs against this job -------------
            List<CVMatchResult> results = new ArrayList<>();
            for (Resource cvRes : cvResources) {
                String cvName = Objects.requireNonNull(cvRes.getFilename());
                String cvText;
                try (InputStream in = cvRes.getInputStream()) {
                    cvText = TextExtractor.extract(new MockMultipartFile(
                            cvName, cvName,
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            in));
                }
                CVMatchResult r = cvScoring.calculateScore(cvText, job);
                r.setFileName(cvName);                 // keep for later assertions
                results.add(r);
            }

            // ------------- verify the ordering -------------
            results.sort(Comparator.comparingDouble(CVMatchResult::getScore).reversed());

            assertThat(results)                       // sanity-check so we don't index an empty list
                    .as("no scores produced for %s", jobFileName)
                    .isNotEmpty();

            String expectedTop    = EXPECTED_BEST.get(jobFileName);
            String expectedBottom = EXPECTED_WORST.get(jobFileName);

            // Optional-but-nice: print a tiny leaderboard so you can eyeball it
            System.out.printf("%n=== %s – leaderboard ===%n", jobFileName);
            results.forEach(r -> System.out.printf("%6.2f  %s%n", r.getScore(), r.getFileName()));

            int k = 2;          // pass if expected is in top-2
            List<String> topK = results.stream()
                    .limit(k)
                    .map(CVMatchResult::getFileName)
                    .toList();

            assertThat(topK)
                    .withFailMessage("Expected best CV should be in the top-%d for %s", k, jobFileName)
                    .contains(expectedTop);

            int bottomWindow = 2;
            List<String> bottom = results.subList(results.size() - bottomWindow, results.size())
                    .stream()
                    .map(CVMatchResult::getFileName)
                    .toList();

            assertThat(bottom)
                    .as("expected worst CV should be in the bottom-%d for %s", bottomWindow, jobFileName)
                    .contains(expectedBottom);


        }
    }

    /* ---------- helper methods – lifted from the fairness test ---------- */

    private String loadOrFetchJobJson(Path cacheDir, String jobFileName, String jdText)
            throws Exception {

        String baseName  = jobFileName.replaceAll("\\.docx$", "");
        Path   cacheFile = cacheDir.resolve(baseName + ".json");

        if (Files.exists(cacheFile)) {
            return Files.readString(cacheFile, StandardCharsets.UTF_8);
        }

        String prompt = """
                Extract from this job description:
                  – industry
                  – top 5 technical skills + weights (sum 100)
                Return ONLY JSON:
                {"industry":"...","technicalSkills":[{"skill":"...","weight":...},...]}
                Job description:
                %s
                """.formatted(jdText);

        JsonArray cands = glClient.generateMessage(List.of(prompt), null, 1);
        String json     = cands.get(0).getAsJsonObject().get("content").getAsString().trim();

        Files.writeString(cacheFile, json, StandardCharsets.UTF_8);
        return json;
    }

    private JobPosting buildJobPosting(String json, String jdText) {
        JsonObject obj  = JsonParser.parseString(json).getAsJsonObject();
        JobPosting job  = new JobPosting();

        job.setIndustry(obj.get("industry").getAsString());
        job.setDescription(jdText);

        List<JobPosting.TechnicalSkill> skills = new ArrayList<>();
        obj.getAsJsonArray("technicalSkills").forEach(el -> {
            JsonObject s = el.getAsJsonObject();
            JobPosting.TechnicalSkill ts = new JobPosting.TechnicalSkill();
            ts.setSkill(s.get("skill").getAsString());
            ts.setWeight(s.get("weight").getAsInt());
            skills.add(ts);
        });
        job.setTechnicalSkills(skills);
        return job;
    }
}
