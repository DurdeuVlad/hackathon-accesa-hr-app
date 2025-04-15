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
}
