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

        // basic sanity checks—no hard‑coded values
        assertNotNull(result, "Result should not be null");
        assertNotNull(result.getExplanation(), "Explanation should not be null or empty");

        // scores should be defined and in [0,100]
        assertTrue(result.getIndustryScore()  >= 0 && result.getIndustryScore()  <= 100,
                "Industry score must be between 0 and 100");
        assertTrue(result.getTechScore()      >= 0 && result.getTechScore()      <= 100,
                "Tech score must be between 0 and 100");
        assertTrue(result.getJdScore()        >= 0 && result.getJdScore()        <= 100,
                "JD score must be between 0 and 100");
        assertTrue(result.getScore()          >= 0 && result.getScore()          <= 100,
                "Final score must be between 0 and 100");
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
