package eu.cvmatch.backend.service;

import com.google.gson.*;
import com.google.gson.stream.JsonReader;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.util.List;

@Service
public class CVScoring {

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    @Value("${GEMINI_MODEL_ID:gemini-2.0-flash}")
    private String modelId;

    @Value("${GEMINI_EMBED_MODEL_ID:embedding-001}")
    private String embedModelId;

    private final Gson gson = new Gson();

    public CVMatchResult calculateScore(String cvText, JobPosting job) throws Exception {
        // 1) Call Gemini
        GenerativeLanguageClient glClient = new GenerativeLanguageClient();
        String instruction = buildPrompt(cvText, job);
        JsonArray candidates = glClient.generateMessage(
                List.of(instruction), /* modelId */ null, /* candidateCount */ 1
        );
        if (candidates == null || candidates.isEmpty()) {
            throw new IllegalStateException("Gemini returned no candidates");
        }

        // 2) Extract raw content
        JsonObject first = candidates.get(0).getAsJsonObject();
        String content = first.get("content").getAsString().trim();

        // 3) Parse leniently
        JsonReader reader = new JsonReader(new StringReader(content));
        reader.setLenient(true);
        JsonElement elem = JsonParser.parseReader(reader);

        // 4) If the model wrapped your JSON in quotes, unwrap and re‑parse
        if (elem.isJsonPrimitive()) {
            String inner = elem.getAsString()
                    .replaceAll("^\"|\"$", "")   // strip outer quotes
                    .replace("\\\"", "\"")       // unescape quotes
                    .replace("\\\\n", "\n");     // unescape newlines
            JsonReader innerReader = new JsonReader(new StringReader(inner));
            innerReader.setLenient(true);
            elem = JsonParser.parseReader(innerReader);
        }

        JsonObject data = elem.getAsJsonObject();

        // 5) Pull out scores
        double industryScore = data.get("industryScore").getAsDouble();
        double techScore     = data.get("techScore").getAsDouble();
        double jdScore       = data.get("jdScore").getAsDouble();
        double finalScore    = data.get("score").getAsDouble();
        String explanation   = data.get("explanation").getAsString();

        return new CVMatchResult(finalScore, industryScore, techScore, jdScore, explanation);
    }

    private String buildPrompt(String cv, JobPosting job) {
        return String.format(
                "You are an expert recruiter. Score this CV using exactly:\n" +
                        "• Industry Knowledge (10%%)\n" +
                        "• Technical Skills (30%%)\n" +
                        "• Job Description match (60%%)\n\n" +
                        "Job Industry: %s\n" +
                        "Job Skills+Weights: %s\n" +
                        "Job Description: %s\n\n" +
                        "CV: %s\n\n" +
                        "Return valid JSON with fields: industryScore, techScore, jdScore, score, explanation." +
                        "Do not write anything else, no code blocks, no comments, nothing beside the valid json field.",
                job.getIndustry(),
                gson.toJson(job.getTechnicalSkills()),
                job.getDescription(),
                cv
        );
    }

}
