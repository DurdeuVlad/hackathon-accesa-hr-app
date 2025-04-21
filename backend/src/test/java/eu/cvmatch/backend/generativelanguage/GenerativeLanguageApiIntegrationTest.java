package eu.cvmatch.backend.generativelanguage;

import static org.junit.jupiter.api.Assertions.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class GenerativeLanguageApiIntegrationTest {

    private static String apiKey;
    private static String modelId;
    private static HttpClient httpClient;

    @BeforeAll
    static void setup() {
        // Load .env from test resources
        Dotenv dotenv = Dotenv.configure()
                .directory("src/main/resources")
                .filename(".env")
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        apiKey  = dotenv.get("GEMINI_API_KEY");
        modelId = dotenv.get("GEMINI_MODEL_ID");

        assertNotNull(apiKey,  "GEMINI_API_KEY must be set in .env or environment");  // loaded via Dotenv :contentReference[oaicite:3]{index=3}
        assertFalse(apiKey.isBlank(), "GEMINI_API_KEY must not be blank");
        assertNotNull(modelId, "GEMINI_MODEL_ID must be set in .env or environment");
        assertFalse(modelId.isBlank(), "GEMINI_MODEL_ID must not be blank");

        httpClient = HttpClient.newHttpClient();  // Java 11 HttpClient :contentReference[oaicite:4]{index=4}
    }

    @Test
    void testListModelsEndpoint() throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta2/models?key=" + apiKey;
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        assertEquals(200, resp.statusCode(), "ListModels should return HTTP 200");  // correct REST path :contentReference[oaicite:5]{index=5}

        JsonObject json = JsonParser.parseString(resp.body()).getAsJsonObject();  // parse with Gson :contentReference[oaicite:6]{index=6}
        JsonArray models = json.getAsJsonArray("models");
        assertNotNull(models, "Missing 'models' array in ListModels response");     // response schema :contentReference[oaicite:7]{index=7}
        assertTrue(models.size() > 0, "'models' array should not be empty");

        // Print every available model ID
        System.out.println("Available Generative Language Models:");              // printing to stdout
        for (int i = 0; i < models.size(); i++) {
            JsonObject m = models.get(i).getAsJsonObject();
            String name = m.getAsJsonPrimitive("name").getAsString();             // each model name like "models/gemini-2.0-flash" :contentReference[oaicite:8]{index=8}
            System.out.println("  " + name);
        }

        // Verify that the configured modelId is present
        boolean found = false;
        for (int i = 0; i < models.size(); i++) {
            String name = models.get(i).getAsJsonObject().get("name").getAsString();
            if (name.equals("models/" + modelId)) {
                found = true;
                break;
            }
        }
        assertTrue(found, "Model ID '" + modelId + "' should be listed by ListModels");  // check your target model :contentReference[oaicite:9]{index=9}
    }

    @Test
    void testGenerateMessageEndpoint() throws Exception {
        // Ensure the model list test runs and prints models first
        testListModelsEndpoint();

        String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta2/models/%s:generateMessage?key=%s",
                modelId, apiKey
        );
        String payload = """
        {
          "prompt": { "messages": [{ "content": "Hello Gemini!" }] },
          "temperature": 0.0,
          "candidateCount": 1
        }
        """;

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json; charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        assertEquals(200, resp.statusCode(), "GenerateMessage should return HTTP 200");  // correct path & model :contentReference[oaicite:10]{index=10}

        JsonObject json = JsonParser.parseString(resp.body()).getAsJsonObject();
        JsonArray candidates = json.getAsJsonArray("candidates");
        assertNotNull(candidates, "Missing 'candidates' array in GenerateMessage response");
        assertTrue(candidates.size() > 0, "'candidates' array should not be empty");
    }
}
