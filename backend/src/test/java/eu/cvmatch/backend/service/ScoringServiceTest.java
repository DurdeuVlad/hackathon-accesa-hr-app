package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ScoringServiceTest {

    private final ScoringService scoringService = new ScoringService(new CVScoring());

    @Test
    public void testScoreCVAgainstJob() throws Exception {
        String cvText = "I have experience in Finance and Java and Spring.";

        JobPosting job = getJobPosting();

        CVMatchResult result = scoringService.scoreCVAgainstJob(cvText, job);

        // Expected:
        // Industry: contains "Finance" => 100
        // Skills: both "Java" (3) and "Spring" (2) found => 5
        // JD Match: The JD has 5 words ("Looking", "for", "experienced", "Java", "developer")
        // Only "Java" appears in CV text, so 1/5*100 = 20
        double expectedFinalScore = (100 * 0.10) + (5 * 0.30) + (20 * 0.60);
        // 10 + 1.5 + 12 = 23.5
        assertEquals(23.5, result.getScore(), 0.01);
        assertEquals(100, result.getIndustryScore(), 0.01);
        assertEquals(5, result.getTechScore(), 0.01);
        assertEquals(20, result.getJdScore(), 0.01);
    }

    private static JobPosting getJobPosting() {
        JobPosting job = new JobPosting();
        job.setIndustry("Finance");
        job.setDescription("Looking for experienced Java developer");

        List<JobPosting.TechnicalSkill> skills = new ArrayList<>();
        JobPosting.TechnicalSkill skill1 = new JobPosting.TechnicalSkill();
        skill1.setSkill("Java");
        skill1.setWeight(3);
        skills.add(skill1);
        JobPosting.TechnicalSkill skill2 = new JobPosting.TechnicalSkill();
        skill2.setSkill("Spring");
        skill2.setWeight(2);
        skills.add(skill2);
        job.setTechnicalSkills(skills);
        return job;
    }
}
