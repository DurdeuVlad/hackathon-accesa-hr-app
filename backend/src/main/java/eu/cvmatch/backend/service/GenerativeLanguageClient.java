package eu.cvmatch.backend.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.stream.JsonReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GenerativeLanguageClient {
    private final HttpClient httpClient;
    private final Gson gson;
    private final String apiKey;
    private final String defaultModel;
    private final String defaultEmbedModel;
    private final String v1Base = "https://generativelanguage.googleapis.com/v1";

    /**
     * No-args constructor: reads configuration from .env
     */
    public GenerativeLanguageClient() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .ignoreIfMalformed()
                .load();
        this.apiKey = dotenv.get("GEMINI_API_KEY");
        this.defaultModel = dotenv.get("GEMINI_MODEL_ID", "gemini-2.0-flash");
        this.defaultEmbedModel = dotenv.get("GEMINI_EMBED_MODEL_ID", "embedding-001");
        this.httpClient = HttpClient.newHttpClient();
        this.gson = new Gson();
    }

    public GenerativeLanguageClient(
            @Value("${GEMINI_API_KEY}") String apiKey,
            @Value("${GEMINI_MODEL_ID:gemini-2.0-flash}") String defaultModel,
            @Value("${GEMINI_EMBED_MODEL_ID:embedding-001}") String defaultEmbedModel
    ) {
        this.httpClient       = HttpClient.newHttpClient();
        this.gson             = new Gson();
        this.apiKey           = apiKey;
        this.defaultModel     = defaultModel;
        this.defaultEmbedModel = defaultEmbedModel;
    }

    /** List all models available to your API key. */
    public JsonArray listModels() throws Exception {
        String url = String.format("%s/models?key=%s", v1Base, apiKey);
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();
        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() != 200) {
            throw new IllegalStateException("listModels failed: " + resp.body());
        }
        JsonObject json = JsonParser.parseString(resp.body()).getAsJsonObject();
        return json.getAsJsonArray("models");
    }

    private JsonArray generateContentRaw(
            List<String> messages,
            String modelId,
            int candidateCount
    ) throws Exception {
        String model = (modelId == null || modelId.isBlank())
                ? defaultModel
                : modelId;

        JsonObject body = new JsonObject();
        body.addProperty("model", model);

        JsonArray contents = new JsonArray();
        JsonObject bucket = new JsonObject();
        JsonArray parts = new JsonArray();
        for (String m : messages) {
            JsonObject part = new JsonObject();
            part.addProperty("text", m);
            parts.add(part);
        }
        bucket.add("parts", parts);
        contents.add(bucket);
        body.add("contents", contents);

        JsonObject cfg = new JsonObject();
        cfg.addProperty("temperature", 0.0);
        cfg.addProperty("candidateCount", candidateCount);
        body.add("generationConfig", cfg);

        String url = String.format("%s/models/%s:generateContent?key=%s",
                v1Base, model, apiKey);

        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json; charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(body), StandardCharsets.UTF_8))
                .build();

        // ----------- RETRY BLOCK START ------------
        int maxRetries = 1;
        int retryDelayMs = 30000; // 30 seconds
        int attempt = 0;

        HttpResponse<String> resp = null;
        boolean success = false;

        while (attempt <= maxRetries && !success) {
            resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());

            if (resp.statusCode() == 429) {
                if (attempt < maxRetries) {
                    System.out.printf("Quota limit reached (attempt %d/%d). Waiting 30 seconds before retry...%n", attempt + 1, maxRetries + 1);
                    try {
                        Thread.sleep(retryDelayMs);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        throw new RuntimeException("Interrupted during retry delay", e);
                    }
                    attempt++;
                } else {
                    break; // Give up after maxRetries
                }
            } else {
                success = true;
            }
        }

        if (resp.statusCode() != 200) {
            throw new IllegalStateException("generateContent failed: " + resp.body());
        }
        // ----------- RETRY BLOCK END ------------

        JsonObject json = gson.fromJson(resp.body(), JsonObject.class);
        return json.getAsJsonArray("candidates");
    }


    public JsonArray generateMessage(
            List<String> messages,
            String modelId,
            int candidateCount
    ) throws Exception {
        JsonArray raw = generateContentRaw(messages, modelId, candidateCount);
        JsonArray out = new JsonArray();

        // Pattern to capture text between ```json``` or ``` fences
        Pattern fence = Pattern.compile("```(?:json)?\\s*(.*?)\\s*```", Pattern.DOTALL);

        for (var el : raw) {
            JsonObject cand = el.getAsJsonObject();
            String txt = cand
                    .getAsJsonObject("content")
                    .getAsJsonArray("parts")
                    .get(0)
                    .getAsJsonObject()
                    .get("text")
                    .getAsString();

            // 1) If txt contains a fenced block, extract the inner part
            Matcher m = fence.matcher(txt);
            if (m.find()) {
                txt = m.group(1);
            }

            // 2) Trim any other leading/trailing whitespace or stray backticks
            txt = txt.replaceAll("^`+|`+$", "").trim();

            JsonObject wrap = new JsonObject();
            wrap.addProperty("content", txt);
            out.add(wrap);
        }
        return out;
    }

    public JsonArray generateText(
            String promptText,
            String modelId,
            int candidateCount
    ) throws Exception {
        return generateMessage(List.of(promptText), modelId, candidateCount);
    }

    /**
     * Text embedding via v1 embedContent, defaulting to Gemini’s embedding model.
     */
    public JsonArray embedText(String inputText, String modelId) throws Exception {
        String model = (modelId == null || modelId.isBlank())
                ? defaultEmbedModel
                : modelId;

        // Build the EmbedContentRequest payload
        JsonObject body = new JsonObject();
        body.addProperty("model", model);

        JsonObject content = new JsonObject();
        JsonArray parts = new JsonArray();
        JsonObject part = new JsonObject();
        part.addProperty("text", inputText);
        parts.add(part);
        content.add("parts", parts);
        body.add("content", content);

        // Call v1 embedContent
        String url = String.format("%s/models/%s:embedContent?key=%s", v1Base, model, apiKey);
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json; charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(body), StandardCharsets.UTF_8))
                .build();
        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());

        if (resp.statusCode() != 200) {
            throw new IllegalStateException("embedText failed: " + resp.body());
        }

        // Parse the single-embedding response and wrap it in an array
        JsonObject json = gson.fromJson(resp.body(), JsonObject.class);
        JsonObject embedding = json.getAsJsonObject("embedding");
        JsonArray out = new JsonArray();
        out.add(embedding);
        return out;
    }

    public JsonObject fixJson(String badJson) throws Exception {
        String prompt = String.format(
                "The following text is intended to be valid JSON. Correct any errors and return only the fixed JSON object.\nInput: %s",
                badJson
        );
        JsonArray cands = generateMessage(List.of(prompt), defaultModel, 1);
        String corrected = cands
                .get(0)
                .getAsJsonObject()
                .get("content")
                .getAsString();

        int start = corrected.indexOf('{');
        int end   = corrected.lastIndexOf('}');
        if (start >= 0 && end > start) {
            corrected = corrected.substring(start, end + 1);
        }

        JsonReader reader = new JsonReader(new StringReader(corrected));
        reader.setLenient(true);
        return JsonParser.parseReader(reader).getAsJsonObject();
    }
}
