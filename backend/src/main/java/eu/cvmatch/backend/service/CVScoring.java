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
                "You are an expert recruiter and resume evaluator. Your task is to score the candidate’s CV against the given job posting.\n\n" +

                        "Evaluation Criteria (with weights):\n" +
                        "- Industry Knowledge (10%%)\n" +
                        "- Technical Skills (30%%)\n" +
                        "- Job Description Match (60%%)\n\n" +

                        "Instructions:\n" +
                        "1. Use ONLY the information in the job posting and CV provided below. Do NOT assume facts not given.\n" +
                        "2. Industry Knowledge (10%%):\n" +
                        "   • Scan the CV for references to the required industry (e.g., past banking projects).\n" +
                        "   • Assign a score between 0–100%%: 0%% = no relevant experience; partial mentions = partial score; extensive direct experience = 100%%.\n" +
                        "3. Technical Skills (30%%):\n" +
                        "   • For each predefined job skill and its weight, check the CV for that skill.\n" +
                        "   • Calculate a weighted average: sum(match_presence(skill) × skillWeight) across all skills, where match_presence is 1 if found, else 0 (or partial if context suggests).\n" +
                        "4. Job Description Match (60%%):\n" +
                        "   • Compare the CV to the full job description using keyword matching or semantic similarity.\n" +
                        "   • Generate a match score 0–100%% based on overall relevance of experience and skills.\n" +
                        "5. Compute the final score as:\n" +
                        "   finalScore = (industryScore × 0.10) + (techScore × 0.30) + (jdScore × 0.60).\n" +
                        "6. EXPLANATION: Provide a brief rationale for each score and the final match.\n" +
                        "7. OUTPUT ONLY a single RAW JSON object with EXACTLY these keys: industryScore, techScore, jdScore, score, explanation. " +
                        "No extra text, no markdown, no code fences, no comments.\n\n" +

                        "Job Posting:\n" +
                        "Industry: %s\n" +
                        "Required Skills and Weights: %s\n" +
                        "Description: %s\n\n" +

                        "Candidate CV:\n" +
                        "%s\n\n" +

                        "TASK: Evaluate the CV against the criteria above and PRODUCE THE JSON RESULT.",
                job.getIndustry(),
                gson.toJson(job.getTechnicalSkills()),
                job.getDescription(),
                cv
        );
    }



}
