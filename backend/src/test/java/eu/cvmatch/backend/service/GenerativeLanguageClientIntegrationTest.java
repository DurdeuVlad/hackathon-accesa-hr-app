package eu.cvmatch.backend.service;

import static org.junit.jupiter.api.Assertions.*;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;

class GenerativeLanguageClientIntegrationTest {

    private static GenerativeLanguageClient glClient;
    private static String apiKey;
    private static String modelId;
    private static String modelEmbeddedId;

    @BeforeAll
    static void init() {
        // Load .env from src/test/resources
        Dotenv dotenv = Dotenv.configure()
                .directory("src/main/resources")
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();
        apiKey  = dotenv.get("GEMINI_API_KEY");
        modelId = dotenv.get("GEMINI_MODEL_ID");
        modelEmbeddedId = dotenv.get("GEMINI_MODEL_EMBEDDED_ID");

        assertNotNull(apiKey,  "GEMINI_API_KEY must be set");
        assertFalse(apiKey.isBlank(), "GEMINI_API_KEY must not be blank");
        assertNotNull(modelId, "GEMINI_MODEL_ID must be set");
        assertFalse(modelId.isBlank(), "GEMINI_MODEL_ID must not be blank");
        assertNotNull(modelEmbeddedId, "GEMINI_MODEL_EMBEDDED_ID must be set");
        assertFalse(modelEmbeddedId.isBlank(), "GEMINI_MODEL_EMBEDDED_ID must not be blank");

        glClient = new GenerativeLanguageClient(apiKey, modelId, modelEmbeddedId);
    }

    @Test
    void testListModels() throws Exception {
        JsonArray models = glClient.listModels();
        assertNotNull(models, "listModels returned null");
        assertTrue(models.size() > 0, "No models listed");
        System.out.println("Available models:");
        for (int i = 0; i < models.size(); i++) {
            JsonObject m = models.get(i).getAsJsonObject();
            System.out.println("  " + m.get("name").getAsString());
        }
        // Ensure configured model is present
        boolean found = models.toString().contains(modelId);
        assertTrue(found, "Configured modelId not found in listModels");
    }

    @Test
    void testGenerateMessage() throws Exception {
        JsonArray responses = glClient.generateMessage(
                List.of("Hello, how are you?"), null, 1
        );
        assertNotNull(responses, "generateMessage returned null");
        assertTrue(responses.size() == 1, "Expected exactly 1 candidate");
        String reply = responses.get(0).getAsJsonObject().get("content").getAsString();
        assertNotNull(reply);
        assertFalse(reply.isBlank(), "Empty response content");
        System.out.println("Chat reply: " + reply);
    }

    @Test
    void testGenerateText() throws Exception {
        JsonArray completions = glClient.generateText(
                "Once upon a time", null, 1
        );
        assertNotNull(completions, "generateText returned null");
        assertTrue(completions.size() == 1, "Expected exactly 1 text candidate");
        String text = completions.get(0).getAsJsonObject().get("content").getAsString();
        assertNotNull(text);
        assertFalse(text.isBlank(), "generateText returned blank");
        System.out.println("Text completion: " + text);
    }

    @Test
    void testEmbedText() throws Exception {
        JsonArray embeds = glClient.embedText(
                "Test embedding", null
        );
        assertNotNull(embeds, "embedText returned null");
        assertTrue(embeds.size() > 0, "Expected at least one embedding result");
        System.out.println("Embedding vector length: " +
                embeds.get(0).getAsJsonObject()
                        .getAsJsonArray("values")
                        .size()
        );
    }

    @Test
    void testFixJson() throws Exception {
        // Deliberately broken JSON:
        String bad = "{ \"key\": \"value\", }";
        JsonObject fixed = glClient.fixJson(bad);
        assertNotNull(fixed, "fixJson returned null");
        assertTrue(fixed.has("key"), "Fixed JSON missing 'key'");
        assertEquals("value", fixed.get("key").getAsString());
    }
}
