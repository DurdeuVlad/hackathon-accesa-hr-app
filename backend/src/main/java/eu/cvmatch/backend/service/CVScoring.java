package eu.cvmatch.backend.service;

import com.google.gson.*;
import com.google.gson.stream.JsonReader;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class CVScoring {
    private final Gson gson;
    private final GenerativeLanguageClient glClient;
    private final OnnxSentenceEmbeddingService onnxService;

    @Autowired
    public CVScoring(GenerativeLanguageClient glClient,
                     OnnxSentenceEmbeddingService onnxService) {
        this.gson = new Gson();
        this.glClient = glClient;
        this.onnxService = onnxService;
    }

    public CVMatchResult calculateScore(String cvText, JobPosting job) throws Exception {
        // 1) Normalize technical-skill weights
        job.normalizeTechnicalSkillsScore();

        // 2) Prompt LLM and parse JSON response
        String prompt = buildPrompt(cvText, job);
        JsonArray candidates = glClient.generateMessage(List.of(prompt), null, 1);
        JsonObject candidate = candidates.get(0).getAsJsonObject();
        String raw = extractRawContent(candidate).trim();
        JsonObject data = tryParseOrFix(raw);

        // 3) Extract LLM fields
        double industryScore = data.get("industryScore").getAsDouble();
        double techScore     = data.get("techScore").getAsDouble();
        double llmJdScore    = data.get("jdScore").getAsDouble();
        String explanation   = data.get("explanation").getAsString();
        String jobSummary    = data.get("jobSummary").getAsString();
        String candidateSummary = data.get("candidateSummary").getAsString();
        JsonArray idealArr   = data.getAsJsonArray("idealProfile");
        List<String> idealProfile = new ArrayList<>();
        for (JsonElement el : idealArr) {
            idealProfile.add(el.getAsString());
        }

        // 4) Compute embeddings
        float[] jobEmb    = onnxService.embed(job.getDescription());
        float[] cvEmb     = onnxService.embed(cvText);
        float[] jobSumEmb = onnxService.embed(jobSummary);
        float[] candSumEmb= onnxService.embed(candidateSummary);
        // join ideal bullets into a single text
        String joinedIdeal = String.join(" ", idealProfile);
        float[] idealEmb  = onnxService.embed(joinedIdeal);

        // 5) Similarities (0–100)
        double simCvJob      = OnnxSentenceEmbeddingService.cosineSimilarity(jobEmb, cvEmb) * 100.0;
        double simCvSumm     = OnnxSentenceEmbeddingService.cosineSimilarity(candSumEmb, jobSumEmb) * 100.0;
        double simCvIdeal    = OnnxSentenceEmbeddingService.cosineSimilarity(cvEmb, idealEmb) * 100.0;
        double simJobIdeal   = OnnxSentenceEmbeddingService.cosineSimilarity(jobEmb, idealEmb) * 100.0;
        double embedScore    = simCvJob;

        // 6) Blend JD scores (LLM + embed)
        double blendedJdScore = (llmJdScore + embedScore) / 2.0;

        // 7) Final weighted score
        double finalScore = industryScore * 0.10
                + techScore       * 0.30
                + blendedJdScore  * 0.60;

        // 8) Assemble explanation with extras
        StringBuilder fullExplanation = new StringBuilder()
                .append(explanation)
                .append("\nONNX Embedding similarity (CV↔Job): ")
                .append(String.format("%.2f%%", simCvJob))
                .append("\nLLM JD Score: ").append(String.format("%.2f%%", llmJdScore))
                .append("\nBlended JD Match: ").append(String.format("%.2f%%", blendedJdScore))
                .append("\nJob Summary: ").append(jobSummary)
                .append("\nCandidate Summary: ").append(candidateSummary)
                .append("\nIdeal Profile: \n");
        for (String trait : idealProfile) {
            fullExplanation.append(" - ").append(trait).append("\n");
        }
        fullExplanation.append("Similarity (CV↔Ideal): ").append(String.format("%.2f%%", simCvIdeal))
                .append("\nSimilarity (Job↔Ideal): ").append(String.format("%.2f%%", simJobIdeal));

        return new CVMatchResult(finalScore, industryScore, techScore, blendedJdScore, fullExplanation.toString());
    }

    /**
     * Safely extract the LLM content field, whether primitive or nested object.
     */
    private String extractRawContent(JsonObject candidate) {
        JsonElement el = candidate.get("content");
        if (el == null) {
            return candidate.toString();
        }
        if (el.isJsonPrimitive()) {
            return el.getAsString();
        }
        JsonObject obj = el.getAsJsonObject();
        if (obj.has("content") && obj.get("content").isJsonPrimitive()) {
            return obj.get("content").getAsString();
        }
        return el.toString();
    }

    /**
     * Attempt lenient JSON parse, otherwise ask LLM to correct.
     */
    private JsonObject tryParseOrFix(String raw) throws Exception {
        try {
            JsonElement first = parseLenient(raw);
            if (first.isJsonObject()) {
                return first.getAsJsonObject();
            }
        } catch (JsonSyntaxException ignore) {
        }
        JsonObject fixed = glClient.fixJson(raw);
        JsonElement reparsed = parseLenient(fixed.toString());
        if (!reparsed.isJsonObject()) {
            throw new IllegalStateException("Fixed JSON is not an object: " + fixed);
        }
        return reparsed.getAsJsonObject();
    }

    /**
     * Parse JSON leniently, unwrapping quoted strings.
     */
    private JsonElement parseLenient(String content) throws JsonSyntaxException {
        JsonReader reader = new JsonReader(new StringReader(content));
        reader.setLenient(true);
        JsonElement elem = JsonParser.parseReader(reader);
        if (elem.isJsonPrimitive()) {
            String inner = elem.getAsString()
                    .replaceAll("^\"|\"$", "")
                    .replace("\\\"", "\"")
                    .replace("\\\\n", "\n")
                    .replaceAll("```json|```", "");
            JsonReader r2 = new JsonReader(new StringReader(inner));
            r2.setLenient(true);
            elem = JsonParser.parseReader(r2);
        }
        return elem;
    }

    private String buildPrompt(String cv, JobPosting job) {
        // original template + new summary/profile steps
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

                        "ADDITIONAL TASKS:%n" +
                        " 1) Generate a concise **Job Summary** (2–3 sentences) that captures the core responsibilities and qualifications.%n" +
                        " 2) Generate a concise **Candidate Summary** (2–3 sentences) of this CV’s key strengths and experience.%n" +
                        " 3) Generate an **Ideal Candidate Profile**: a 3–5 bullet-point list of the top traits/skills you’d look for in a perfect match.%n%n" +

                        "OUTPUT REQUIREMENTS:%n" +
                        " Return ONLY a single RAW JSON object with these fields:%n" +
                        " {\n" +
                        "   \"industryScore\":…, \n" +
                        "   \"techScore\":…, \n" +
                        "   \"jdScore\":…, \n" +
                        "   \"score\":…, \n" +
                        "   \"explanation\":\"…\",\n" +
                        "   \"jobSummary\":\"…\",\n" +
                        "   \"candidateSummary\":\"…\",\n" +
                        "   \"idealProfile\": [\"…\", …]\n" +
                        " }%n%n" +

                        "HINT: Use 0/25/50/75/100 as base checkpoints, but interpolate when warranted.%n%n" +

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
