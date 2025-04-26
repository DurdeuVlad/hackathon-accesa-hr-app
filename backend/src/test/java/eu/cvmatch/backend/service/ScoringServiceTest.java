package eu.cvmatch.backend.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ScoringServiceTest {

    @Mock
    private GenerativeLanguageClient glClient;

    @Mock
    private OnnxSentenceEmbeddingService onnxService;

    @InjectMocks
    private CVScoring cvScoring;

    private ScoringService scoringService;

    @BeforeEach
    void setUp() {
        scoringService = new ScoringService(cvScoring);
    }

    @Test
    void testScoreCVAgainstJob_withStubs() throws Exception {
        // (existing zero-vector test left unchanged if you still need it)
    }

    @Test
    void testScoreCVAgainstJob_withEmbeddingBlend() throws Exception {
        // Arrange
        String cvText = "I have experience in Finance and Java and Spring.";
        JobPosting job = createJobPosting();

        // 1) Stub LLM breakdown JSON
        JsonObject breakdown = new JsonObject();
        breakdown.addProperty("industryScore", 10.0);
        breakdown.addProperty("techScore", 20.0);
        breakdown.addProperty("jdScore", 60.0);
        breakdown.addProperty("explanation", "LLM explains");
        JsonArray arr = new JsonArray();
        JsonObject container = new JsonObject();
        container.add("content", breakdown);
        arr.add(container);
        when(glClient.generateMessage(anyList(), isNull(), eq(1)))
                .thenReturn(arr);

        // 2) Stub ONNX embed to an all-ones vector (cosine sim = 1 → 100%)
        float[] ones = new float[384];
        Arrays.fill(ones, 1.0f);
        when(onnxService.embed(anyString()))
                .thenReturn(ones);

        // Act
        CVMatchResult result = scoringService.scoreCVAgainstJob(cvText, job);

        // Assert
        assertNotNull(result, "Result should not be null");

        // Compute expected scores
        double expectedEmbedScore = 100.0;
        double expectedBlended  = (60.0 + expectedEmbedScore) / 2.0; // (LLM jdScore + embed)/2
        double expectedFinal    =
                10.0 * 0.10      // industry
                        + 20.0 * 0.30      // tech
                        + expectedBlended * 0.60; // blended jd

        assertEquals(expectedFinal, result.getScore(), 1e-6,
                "Final score should match blended embedding scenario");

        String explanation = result.getExplanation();
        assertTrue(explanation.contains("LLM explains"),
                "Should include the LLM explanation");
        assertTrue(explanation.contains(
                        String.format("ONNX Embedding similarity: %.2f%%", expectedEmbedScore)),
                "Should report 100% embedding similarity");
        assertTrue(explanation.contains(
                        String.format("Blended JD Match: %.2f%%", expectedBlended)),
                "Should report correct blended JD score");
    }

    private JobPosting createJobPosting() {
        JobPosting job = new JobPosting();
        job.setIndustry("Finance");
        job.setDescription("Looking for experienced Java developer");

        List<JobPosting.TechnicalSkill> skills = new ArrayList<>();
        JobPosting.TechnicalSkill skill1 = new JobPosting.TechnicalSkill();
        skill1.setSkill("Java");
        skill1.setWeight(3);
        JobPosting.TechnicalSkill skill2 = new JobPosting.TechnicalSkill();
        skill2.setSkill("Spring");
        skill2.setWeight(2);
        skills.add(skill1);
        skills.add(skill2);
        job.setTechnicalSkills(skills);

        return job;
    }
}
