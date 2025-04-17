package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("integration")
public class CVScoringIntegrationTest {

    @Autowired
    private CVScoring cvScoring;

    @Test
    void realGeminiCall_returnsValidScoreFields() throws Exception {
        // Arrange: a sample CV and job
        String cvText = "I have 5 years experience in Banking, Java, Spring, and REST APIs.";

        JobPosting job = new JobPosting();
        job.setIndustry("banking");
        job.setDescription("We need a Java Spring developer for banking applications.");
        job.setTechnicalSkills(List.of(
                new JobPosting.TechnicalSkill() {{ setSkill("Java"); setWeight(40); }},
                new JobPosting.TechnicalSkill() {{ setSkill("Spring"); setWeight(30); }},
                new JobPosting.TechnicalSkill() {{ setSkill("REST"); setWeight(30); }}
        ));

        // Act
        CVMatchResult result = cvScoring.calculateScore(cvText, job);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getScore()).isBetween(0.0, 100.0);
        assertThat(result.getIndustryScore()).isBetween(0.0, 100.0);
        assertThat(result.getTechScore()).isBetween(0.0, 100.0);
        assertThat(result.getJdScore()).isBetween(0.0, 100.0);
        assertThat(result.getExplanation()).isNotBlank();
    }
}
