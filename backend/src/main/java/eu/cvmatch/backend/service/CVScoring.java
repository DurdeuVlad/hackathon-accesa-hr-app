package eu.cvmatch.backend.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class CVScoring {

    // Now picks up GEMINI_API_KEY from your .env
    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    // Optional override in .env; defaults to
    @Value("${GEMINI_MODEL_ID:}")
    private String modelId;

    private final Gson gson = new Gson();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public CVMatchResult calculateScore(String cvText, JobPosting job) throws Exception {
        JsonObject full = callGemini(buildPrompt(cvText, job));

        JsonArray candidates = full.getAsJsonArray("candidates");
        if (candidates == null || candidates.size() == 0) {
            throw new IllegalStateException("Gemini response missing candidates: " + full);
        }

        JsonObject first = candidates.get(0).getAsJsonObject();
        String content = first.get("content").getAsString();
        JsonObject data = gson.fromJson(content, JsonObject.class);

        double industryScore = data.get("industryScore").getAsDouble();
        double techScore     = data.get("techScore").getAsDouble();
        double jdScore       = data.get("jdScore").getAsDouble();
        double finalScore    = data.get("score").getAsDouble();
        String explanation   = data.get("explanation").getAsString();

        return new CVMatchResult(finalScore, industryScore, techScore, jdScore, explanation);
    }

    private String buildPrompt(String cv, JobPosting job) {
        JsonObject body = new JsonObject();
        body.addProperty("prompt", String.format(
                "You are an expert recruiter. Score this CV using exactly:\n" +
                        "• Industry Knowledge (10%%)\n" +
                        "• Technical Skills (30%%)\n" +
                        "• Job Description match (60%%)\n\n" +
                        "Job Industry: %s\n" +
                        "Job Skills+Weights: %s\n" +
                        "Job Description: %s\n\n" +
                        "CV: %s\n\n" +
                        "Return valid JSON with fields: industryScore, techScore, jdScore, score, explanation.",
                job.getIndustry(),
                gson.toJson(job.getTechnicalSkills()),
                job.getDescription(),
                cv
        ));
        return gson.toJson(body);
    }

    private JsonObject callGemini(String payload) throws Exception {
        String url = String.format(
                "https://generativelanguage.googleapis.com/v1beta2/models/%s:generateMessage?key=%s",
                modelId, apiKey
        );


        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString());
        return gson.fromJson(resp.body(), JsonObject.class);
    }
}