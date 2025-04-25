package eu.cvmatch.backend.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SkillsSuggestionService {

    private final GenerativeLanguageClient glClient;

    public SkillsSuggestionService(GenerativeLanguageClient glClient) {
        this.glClient = glClient;
    }

    public List<JobPosting.TechnicalSkill> suggestSkills(String jobDescription) throws Exception {
        if (jobDescription == null || jobDescription.isBlank()) {
            throw new IllegalArgumentException("Job description cannot be empty");
        }

        String json = loadOrFetchJobJson(jobDescription);
        JsonObject jobJson = JsonParser.parseString(json).getAsJsonObject();

        List<JobPosting.TechnicalSkill> skills = new ArrayList<>();
        JsonArray techSkillsArray = jobJson.getAsJsonArray("technicalSkills");

        for (JsonElement e : techSkillsArray) {
            JsonObject o = e.getAsJsonObject();
            JobPosting.TechnicalSkill ts = new JobPosting.TechnicalSkill();
            ts.setSkill(o.get("skill").getAsString());
            ts.setWeight(o.get("weight").getAsInt());
            skills.add(ts);
        }

        return skills;
    }

    private String loadOrFetchJobJson(String jdText) throws Exception {
        String prompt = "Extract from this job description:\n" +
                "• industry,\n" +
                "• top 5 technical skills + weights summing to 100.\n" +
                "Return ONLY valid JSON:\n" +
                "{\"industry\":\"...\",\"technicalSkills\":[{\"skill\":\"...\",\"weight\":...},...]}\n\n" +
                "Job Description:\n" + jdText;

        JsonArray cands = glClient.generateMessage(List.of(prompt), null, 1);
        if (cands.isEmpty()) {
            throw new IllegalStateException("Gemini returned no candidates for job description");
        }

        return cands.get(0).getAsJsonObject().get("content").getAsString().trim();
    }

    public String extractIndustry(String jobDescription) throws Exception {
        if (jobDescription == null || jobDescription.isBlank()) {
            throw new IllegalArgumentException("Job description cannot be empty");
        }

        String json = loadOrFetchJobJson(jobDescription);
        JsonObject jobJson = JsonParser.parseString(json).getAsJsonObject();

        return jobJson.get("industry").getAsString();
    }
}