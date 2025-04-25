package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.JobPosting;
import io.github.cdimascio.dotenv.Dotenv;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.fail;

@SpringBootTest
@ActiveProfiles("integration")
class SkillsSuggestionServiceIntegrationTest {

    @Autowired
    private SkillsSuggestionService skillsService;

    private static boolean isApiKeyAvailable() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .ignoreIfMalformed()
                .load();
        return dotenv.get("GEMINI_API_KEY") != null && !dotenv.get("GEMINI_API_KEY").isBlank();
    }

    @Test
    @EnabledIf("isApiKeyAvailable")
    void suggestSkills_realJobDescription_returnsReasonableSkills() throws Exception {
        // Arrange
        String jobDescription = """
                Software Engineer - Java Backend
                
                We are looking for an experienced Java developer to join our backend team.
                
                Responsibilities:
                - Design and develop high-volume, low-latency applications
                - Write clean, efficient, and well-tested code
                - Participate in code reviews and contribute to architectural decisions
                
                Requirements:
                - 3+ years of experience with Java
                - Strong knowledge of Spring Framework and Spring Boot
                - Experience with RESTful APIs and microservices architecture
                - Familiarity with databases (SQL and NoSQL)
                - Understanding of containerization technologies (Docker, Kubernetes)
                - Knowledge of cloud platforms (AWS, GCP, or Azure)
                """;

        // Act
        List<JobPosting.TechnicalSkill> skills = null;

        // Try with backoff retry logic to handle rate limits
        int maxRetries = 3;
        int retryCount = 0;
        int backoffMs = 2000; // Start with 2 seconds

        while (retryCount < maxRetries) {
            try {
                skills = skillsService.suggestSkills(jobDescription);
                break; // Success, exit the loop
            } catch (Exception e) {
                if (e.getMessage().contains("RESOURCE_EXHAUSTED") ||
                        e.getMessage().contains("exceeded your current quota")) {
                    retryCount++;
                    if (retryCount >= maxRetries) {
                        // Skip test instead of failing if we've exhausted retries
                        System.out.println("Skipping test due to API rate limits after " + retryCount + " retries");
                        return;
                    }

                    // Apply exponential backoff
                    try {
                        System.out.println("Rate limit hit, retrying in " + backoffMs + "ms (attempt " + retryCount + " of " + maxRetries + ")");
                        Thread.sleep(backoffMs);
                        backoffMs *= 2; // Double the backoff time for next retry
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        fail("Test interrupted during backoff");
                    }
                } else {
                    // For other exceptions, fail the test
                    throw e;
                }
            }
        }

        // If we got here with null skills, we failed all retries
        if (skills == null) {
            System.out.println("Skipping assertions due to API rate limits");
            return;
        }

        // Assert
        assertThat(skills).isNotEmpty();
        assertThat(skills.size()).isGreaterThanOrEqualTo(3);

        // Verify that the weights sum to 100
        int totalWeight = skills.stream()
                .mapToInt(JobPosting.TechnicalSkill::getWeight)
                .sum();
        assertThat(totalWeight).isEqualTo(100);

        // Check for expected skills (not all will be present, but some should be)
        List<String> skillNames = skills.stream()
                .map(JobPosting.TechnicalSkill::getSkill)
                .toList();

        // We expect some of these skills to be detected
        List<String> expectedSkills = List.of(
                "Java", "Spring", "REST", "Microservices",
                "SQL", "NoSQL", "Docker", "Kubernetes", "AWS", "Cloud"
        );

        boolean hasAnyExpectedSkill = skillNames.stream()
                .anyMatch(skill ->
                        expectedSkills.stream()
                                .anyMatch(expected ->
                                        skill.toLowerCase().contains(expected.toLowerCase())
                                )
                );

        assertThat(hasAnyExpectedSkill).isTrue();
    }

    @Test
    @EnabledIf("isApiKeyAvailable")
    void extractIndustry_realJobDescription_returnsReasonableIndustry() throws Exception {
        // Arrange
        String jobDescription = """
                Marketing Manager
                
                We are looking for a Marketing Manager to promote our company's products and services.
                
                Responsibilities:
                - Develop marketing strategies and plans
                - Manage marketing budget and campaigns
                - Analyze market trends and competitor activities
                
                Requirements:
                - Bachelor's degree in Marketing or related field
                - 5+ years of experience in marketing roles
                - Strong understanding of digital marketing channels
                - Experience with marketing analytics and tools
                """;

        // Act
        String industry = null;

        // Try with backoff retry logic to handle rate limits
        int maxRetries = 3;
        int retryCount = 0;
        int backoffMs = 2000; // Start with 2 seconds

        while (retryCount < maxRetries) {
            try {
                industry = skillsService.extractIndustry(jobDescription);
                break; // Success, exit the loop
            } catch (Exception e) {
                if (e.getMessage().contains("RESOURCE_EXHAUSTED") ||
                        e.getMessage().contains("exceeded your current quota")) {
                    retryCount++;
                    if (retryCount >= maxRetries) {
                        // Skip test instead of failing if we've exhausted retries
                        System.out.println("Skipping test due to API rate limits after " + retryCount + " retries");
                        return;
                    }

                    // Apply exponential backoff
                    try {
                        System.out.println("Rate limit hit, retrying in " + backoffMs + "ms (attempt " + retryCount + " of " + maxRetries + ")");
                        Thread.sleep(backoffMs);
                        backoffMs *= 2; // Double the backoff time for next retry
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        fail("Test interrupted during backoff");
                    }
                } else {
                    // For other exceptions, fail the test
                    throw e;
                }
            }
        }

        // If we got here with null industry, we failed all retries
        if (industry == null) {
            System.out.println("Skipping assertions due to API rate limits");
            return;
        }

        // Assert
        assertThat(industry).isNotEmpty();
        assertThat(industry.toLowerCase()).contains("marketing");
    }
}