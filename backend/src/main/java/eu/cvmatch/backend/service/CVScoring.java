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
    private final Gson gson = new Gson();

    private final GenerativeLanguageClient glClient = new GenerativeLanguageClient();;

    private final EmbeddingSimilarityService embeddingService = new EmbeddingSimilarityService(glClient);;

    public CVMatchResult calculateScore(String cvText, JobPosting job) throws Exception {
        job.normalizeTechnicalSkillsScore();
        // 1) get the LLM breakdown
        String prompt = buildPrompt(cvText, job);
        JsonArray candidates = glClient.generateMessage(List.of(prompt), null, 1);
        if (candidates == null || candidates.isEmpty()) {
            throw new IllegalStateException("Gemini returned no candidates");
        }
        String raw = candidates.get(0).getAsJsonObject().get("content").getAsString().trim();
        JsonObject data = tryParseOrFix(raw, glClient);

        // 2) pull out their scores
        double industryScore = data.get("industryScore").getAsDouble();
        double techScore     = data.get("techScore").getAsDouble();
        double llmJdScore    = data.get("jdScore").getAsDouble();
        String explanation   = data.get("explanation").getAsString();

        // 3) compute an embedding‑based JD match (0.0–1.0 → 0–100)
        double embedSim   = embeddingService.cosineSimilarity(job.getDescription(), cvText);
        double embedScore = embedSim * 100.0;

        // 4) blend the two JD scores
        double blendedJdScore = (llmJdScore + embedScore) / 2.0;

        // 5) compute final
        double finalScore = industryScore * 0.10
                + techScore     * 0.30
                + blendedJdScore* 0.60;

        // 6) append a note about the embedding match
        String fullExplanation = explanation
                + "\nEmbedding JD‑CV similarity: " + String.format("%.2f%%", embedScore)
                + "\nBlended JD Match: "       + String.format("%.2f%%", blendedJdScore);

        return new CVMatchResult(finalScore, industryScore, techScore, blendedJdScore, fullExplanation);
    }

    /**
     * Attempts to parse the raw JSON string leniently.
     * If that doesn't yield an object, calls glClient.fixJson(...) once, then parses its output.
     */
    private JsonObject tryParseOrFix(String raw, GenerativeLanguageClient glClient) throws Exception {
        try {
            JsonElement firstTry = parseLenient(raw);
            if (firstTry.isJsonObject()) {
                return firstTry.getAsJsonObject();
            }
        } catch (JsonSyntaxException ignored) {
            // fall through to fix
        }

        // Ask Gemini to correct the JSON
        JsonObject fixedJson = glClient.fixJson(raw);
        String fixedString = fixedJson.toString();

        JsonElement secondTry = parseLenient(fixedString);
        if (!secondTry.isJsonObject()) {
            throw new IllegalStateException("Fixed JSON is still not an object:\n" + fixedString);
        }
        return secondTry.getAsJsonObject();
    }

    /**
     * Performs lenient parsing:
     *  - allows comments/unterminated strings
     *  - unwraps quoted JSON strings
     */
    private JsonElement parseLenient(String content) throws JsonSyntaxException {
        JsonReader reader = new JsonReader(new StringReader(content));
        reader.setLenient(true);
        JsonElement elem = JsonParser.parseReader(reader);

        // If it's a primitive (i.e. model wrapped JSON in quotes), unwrap it
        if (elem.isJsonPrimitive()) {
            String inner = elem.getAsString()
                    .replaceAll("^\"|\"$", "")
                    .replace("\\\"", "\"")
                    .replace("\\\\n", "\n")
                    .replaceAll("```json|```", "");
            JsonReader reader2 = new JsonReader(new StringReader(inner));
            reader2.setLenient(true);
            elem = JsonParser.parseReader(reader2);
        }
        return elem;
    }

    private String buildPrompt(String cv, JobPosting job) {
        return String.format(
                "You are an expert recruiter and resume evaluator. Your task is to score the candidate’s CV against the given job posting.%n%n" +

                        "Evaluation Criteria (with weights):%n" +
                        "- Industry Knowledge (10%%)%n" +
                        "- Technical Skills (30%%)%n" +
                        "- Job Description Match (60%%)%n%n" +

                        "Scoring Guidelines:%n" +
                        "1) Industry Knowledge (10%% of final):%n" +
                        "   0%%   – No relevant industry experience%n" +
                        "   25%%  – Peripheral experience%n" +
                        "   50%%  – Some direct experience%n" +
                        "   75%%  – Strong experience%n" +
                        "   100%% – Extensive senior-level experience%n%n" +

                        "2) Technical Skills (30%% of final):%n" +
                        "   For each required skill:%n" +
                        "     0%%   – Not found%n" +
                        "     50%%  – Partial or implied%n" +
                        "     100%% – Explicit mention%n" +
                        "   Then compute weighted average.%n%n" +

                        "3) Job Description Match (60%% of final):%n" +
                        "   a) Responsibilities Coverage (30%%):%n" +
                        "      0%%   – None%n" +
                        "      25%%  – Few shallow mentions%n" +
                        "      50%%  – Several with detail%n" +
                        "      75%%  – Most well covered%n" +
                        "      100%% – All thoroughly covered%n%n" +
                        "   b) Qualifications Coverage (30%%):%n" +
                        "      0%%   – None%n" +
                        "      25%%  – Some mentioned%n" +
                        "      50%%  – Several with detail%n" +
                        "      75%%  – Most with examples%n" +
                        "      100%% – All with strong examples%n%n" +
                        "   jdScore = (responsibilitiesCoverage * 0.5 + qualificationsCoverage * 0.5)%n%n" +

                        "COMPUTATION:%n" +
                        " finalScore = (industryScore * 0.10) + (techScore * 0.30) + (jdScore * 0.60)%n%n" +

                        "EXPLANATION:%n" +
                        " Provide a brief rationale for Industry, Tech, JD Match, and final score, each on its own line.%n%n" +

                        "OUTPUT REQUIREMENTS:%n" +
                        " Return ONLY a single RAW JSON object: " +
                        "{\"industryScore\":… , \"techScore\":… , \"jdScore\":… , \"score\":… , \"explanation\":\"…\"}%n%n" +

                        "HINT: Use 0/25/50/75/100 as base checkpoints, but you may interpolate above the nearest lower bound if clearly warranted.%n%n" +

                        "Job Posting:%n" +
                        " Industry: %s%n" +
                        " Required Skills and Weights: %s%n" +
                        " Description: %s%n%n" +

                        "Candidate CV:%n" +
                        "%s%n%n" +

                        "TASK: Evaluate and PRODUCE THE JSON RESULT.",
                job.getIndustry(),
                gson.toJson(job.getTechnicalSkills()),
                job.getDescription(),
                cv
        );
    }

}
