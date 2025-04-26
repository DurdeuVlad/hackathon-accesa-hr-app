package eu.cvmatch.backend.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Method;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CVScoringTest {

    @Mock
    private GenerativeLanguageClient glClient;

    @Mock
    private OnnxSentenceEmbeddingService onnxService;

    @InjectMocks
    private CVScoring cvScoring;

    private JobPosting jobPosting;

    @BeforeEach
    void setUp() {
        jobPosting = new JobPosting();
        jobPosting.setIndustry("Industry");
        jobPosting.setDescription("Job description");
        List<JobPosting.TechnicalSkill> skills = List.of(
                createSkill("Skill1", 1),
                createSkill("Skill2", 2)
        );
        jobPosting.setTechnicalSkills(skills);
    }

    @Test
    void testCalculateScore_happyPath() throws Exception {
        String cvText = "Candidate CV text";

        // Stub LLM breakdown JSON
        JsonObject breakdown = new JsonObject();
        breakdown.addProperty("industryScore", 50.0);
        breakdown.addProperty("techScore", 75.0);
        breakdown.addProperty("jdScore", 100.0);
        breakdown.addProperty("explanation", "Good fit");
        JsonArray arr = new JsonArray();
        JsonObject container = new JsonObject();
        container.add("content", breakdown);
        arr.add(container);
        when(glClient.generateMessage(anyList(), isNull(), eq(1))).thenReturn(arr);

        // Stub ONNX embed to non-zero vectors for a valid cosine similarity
        when(onnxService.embed(anyString())).thenReturn(new float[]{1f, 1f, 1f});

        // Act
        CVMatchResult result = cvScoring.calculateScore(cvText, jobPosting);

        // Embed similarity = 100%, blendedJdScore = 100%
        // finalScore = 50*0.1 + 75*0.3 + 100*0.6 = 87.5
        assertEquals(87.5, result.getScore(), 1e-6);
        String explanation = result.getExplanation();
        assertTrue(explanation.contains("Good fit"));
        assertTrue(explanation.contains("ONNX Embedding similarity: 100,00%"),
                "Explanation should contain formatted ONNX similarity");
        assertTrue(explanation.contains("Blended JD Match: 100,00%"),
                "Explanation should contain formatted blended JD match");
    }

    @Test
    void testExtractRawContent_variousScenarios() throws Exception {
        Method method = CVScoring.class.getDeclaredMethod("extractRawContent", JsonObject.class);
        method.setAccessible(true);

        // Case 1: No "content" field
        JsonObject noContent = new JsonObject();
        noContent.addProperty("a", "b");
        assertEquals(noContent.toString(), method.invoke(cvScoring, noContent));

        // Case 2: Primitive content
        JsonObject primitive = new JsonObject();
        primitive.add("content", new JsonPrimitive("text"));
        assertEquals("text", method.invoke(cvScoring, primitive));

        // Case 3: Nested object with inner "content"
        JsonObject nested = new JsonObject();
        nested.addProperty("content", "inner");
        JsonObject withNested = new JsonObject();
        withNested.add("content", nested);
        assertEquals("inner", method.invoke(cvScoring, withNested));

        // Case 4: Nested object without inner "content"
        JsonObject nested2 = new JsonObject();
        nested2.addProperty("x", "y");
        JsonObject withNested2 = new JsonObject();
        withNested2.add("content", nested2);
        assertEquals(nested2.toString(), method.invoke(cvScoring, withNested2));
    }

    @Test
    void testTryParseOrFix_validAndInvalid() throws Exception {
        Method method = CVScoring.class.getDeclaredMethod("tryParseOrFix", String.class);
        method.setAccessible(true);

        // Valid JSON input should parse directly
        String validJson = "{\"key\":123}";
        JsonObject parsed = (JsonObject) method.invoke(cvScoring, validJson);
        assertEquals(123, parsed.get("key").getAsInt());

        // Invalid JSON triggers fixJson
        String invalid = "invalid";
        JsonObject fixed = new JsonObject();
        fixed.addProperty("fixedKey", 42);
        when(glClient.fixJson(eq(invalid))).thenReturn(fixed);

        JsonObject parsedFixed = (JsonObject) method.invoke(cvScoring, invalid);
        assertEquals(42, parsedFixed.get("fixedKey").getAsInt());
    }

    private JobPosting.TechnicalSkill createSkill(String skill, int weight) {
        JobPosting.TechnicalSkill ts = new JobPosting.TechnicalSkill();
        ts.setSkill(skill);
        ts.setWeight(weight);
        return ts;
    }
}
