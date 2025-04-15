package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class ScoringService {

    public CVMatchResult scoreCVAgainstJob(String cvText, JobPosting job) {
        double industryScore = scoreIndustry(cvText, job.getIndustry());
        double techScore = scoreSkills(cvText, job.getTechnicalSkills());
        double jdScore = scoreJDMatch(cvText, job.getDescription());

        double finalScore = (industryScore * 0.10) + (techScore * 0.30) + (jdScore * 0.60);

        String explanation = String.format("Industry: %.0f%%, Skills: %.0f%%, JD Match: %.0f%%",
                industryScore, techScore, jdScore);

        return new CVMatchResult(finalScore, industryScore, techScore, jdScore, explanation);
    }

    private double scoreIndustry(String text, String industry) {
        return text.toLowerCase().contains(industry.toLowerCase()) ? 100 : 0;
    }

    private double scoreSkills(String text, List<JobPosting.TechnicalSkill> skills) {
        int total = 0;
        if (skills == null || skills.isEmpty()) {
            // log warning: No skills provided
            System.out.println("No skills provided for scoring.");
            return 0;
        }
        for (JobPosting.TechnicalSkill skill : skills) {
            if (text.toLowerCase().contains(skill.getSkill().toLowerCase())) {
                total += skill.getWeight();
            }
        }
        return total;
    }

    private double scoreJDMatch(String cv, String jd) {
        if (jd == null || jd.trim().isEmpty()) {
            // Return 0 if the job description is null or empty
            return 0;
        }
        long matches = Arrays.stream(jd.split("\\W+"))
                .filter(word -> cv.toLowerCase().contains(word.toLowerCase()))
                .count();
        return (double) matches / jd.split("\\W+").length * 100;
    }
}
