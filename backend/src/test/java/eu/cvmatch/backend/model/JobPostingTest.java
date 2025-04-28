package eu.cvmatch.backend.model;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class JobPostingTest {

    @Test
    public void testGettersAndSetters() {
        JobPosting job = new JobPosting();
        job.setJobTitle("Developer");
        job.setIndustry("Tech");
        job.setDescription("Job description here");

        List<JobPosting.TechnicalSkill> skills = new ArrayList<>();
        JobPosting.TechnicalSkill skill = new JobPosting.TechnicalSkill();
        skill.setSkill("Java");
        skill.setWeight(5);
        skills.add(skill);
        job.setTechnicalSkills(skills);

        assertEquals("Developer", job.getJobTitle());
        assertEquals("Tech", job.getIndustry());
        assertEquals("Job description here", job.getDescription());
        assertEquals(1, job.getTechnicalSkills().size());
        assertEquals("Java", job.getTechnicalSkills().get(0).getSkill());
        assertEquals(5, job.getTechnicalSkills().get(0).getWeight());
    }

    @Test
    public void testTechnicalSkillNormalization() {
        // create a dummy job posting
        JobPosting job = new JobPosting();
        job.setJobTitle("Developer");
        job.setIndustry("Tech");
        job.setDescription("Job description here");
        List<JobPosting.TechnicalSkill> skills = new ArrayList<>();
        JobPosting.TechnicalSkill skill1 = new JobPosting.TechnicalSkill();
        skill1.setSkill("Java");
        skill1.setWeight(5);
        skills.add(skill1);
        JobPosting.TechnicalSkill skill2 = new JobPosting.TechnicalSkill();
        skill2.setSkill("Python");
        skill2.setWeight(3);
        skills.add(skill2);
        job.setTechnicalSkills(skills);
        // normalize the skills
        job.normalizeTechnicalSkillsScore();
        // check that the weights are normalized 0-100%
        for (JobPosting.TechnicalSkill skill : job.getTechnicalSkills()) {
            assertTrue(skill.getWeight() >= 0 && skill.getWeight() <= 100,
                    "Skill weight should be between 0 and 100");
        }
        // check that the sum of weights is 100
        int sum = 0;
        for (JobPosting.TechnicalSkill skill : job.getTechnicalSkills()) {
            sum += skill.getWeight();
        }
        assertEquals(100, sum, "Sum of skill weights should be 100");
        // check that the skills are sorted by weight
        for (int i = 0; i < job.getTechnicalSkills().size() - 1; i++) {
            assertTrue(job.getTechnicalSkills().get(i).getWeight() >= job.getTechnicalSkills().get(i + 1).getWeight(),
                    "Skills should be sorted by weight");
        }

    }
}
