package eu.cvmatch.backend.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JobMatchResultTest {

    @Test
    void testConstructorAndGetters() {
        // Setup test data
        String jobTitle = "Java Developer";
        String industry = "Software Development";
        double matchScore = 85.5;
        String explanation = "Good match for skills";

        // Create JobMatchResult object using constructor
        JobMatchResult result = new JobMatchResult(jobTitle, industry, matchScore, explanation);

        // Verify all fields were correctly set
        assertEquals(jobTitle, result.getJobTitle());
        assertEquals(industry, result.getIndustry());
        assertEquals(matchScore, result.getMatchScore());
        assertEquals(explanation, result.getExplanation());
    }

    @Test
    void testSetters() {
        // Create JobMatchResult object
        JobMatchResult result = new JobMatchResult("Initial Title", "Initial Industry", 50.0, "Initial Explanation");

        // Test setters
        String newJobTitle = "Senior Java Developer";
        String newIndustry = "Enterprise Software";
        double newMatchScore = 95.5;
        String newExplanation = "Excellent match";

        result.setJobTitle(newJobTitle);
        result.setIndustry(newIndustry);
        result.setMatchScore(newMatchScore);
        result.setExplanation(newExplanation);

        // Verify all fields were correctly updated
        assertEquals(newJobTitle, result.getJobTitle());
        assertEquals(newIndustry, result.getIndustry());
        assertEquals(newMatchScore, result.getMatchScore());
        assertEquals(newExplanation, result.getExplanation());
    }

    @Test
    void testWithNullValues() {
        // Create JobMatchResult with null values for String fields
        JobMatchResult result = new JobMatchResult(null, null, 70.0, null);

        // Verify null values are handled correctly
        assertNull(result.getJobTitle());
        assertNull(result.getIndustry());
        assertEquals(70.0, result.getMatchScore());
        assertNull(result.getExplanation());
    }

    @Test
    void testWithEmptyStrings() {
        // Create JobMatchResult with empty strings
        JobMatchResult result = new JobMatchResult("", "", 60.0, "");

        // Verify empty strings are handled correctly
        assertEquals("", result.getJobTitle());
        assertEquals("", result.getIndustry());
        assertEquals(60.0, result.getMatchScore());
        assertEquals("", result.getExplanation());
    }

    @Test
    void testWithSpecialCharacters() {
        // Create JobMatchResult with special characters
        String titleWithSpecialChars = "Java & Spring Developer (Remote)";
        String industryWithSpecialChars = "IT & Software Development";
        String explanationWithSpecialChars = "90% match for Java, 85% match for Spring Boot";

        JobMatchResult result = new JobMatchResult(
                titleWithSpecialChars,
                industryWithSpecialChars,
                87.5,
                explanationWithSpecialChars
        );

        // Verify special characters are handled correctly
        assertEquals(titleWithSpecialChars, result.getJobTitle());
        assertEquals(industryWithSpecialChars, result.getIndustry());
        assertEquals(87.5, result.getMatchScore());
        assertEquals(explanationWithSpecialChars, result.getExplanation());
    }

    @Test
    void testWithExtremeScoreValues() {
        // Test minimum score (0.0)
        JobMatchResult minResult = new JobMatchResult("No Match Job", "Testing", 0.0, "No match");
        assertEquals(0.0, minResult.getMatchScore());

        // Test maximum score (100.0)
        JobMatchResult maxResult = new JobMatchResult("Perfect Match Job", "Testing", 100.0, "Perfect match");
        assertEquals(100.0, maxResult.getMatchScore());

        // Test negative score (should not happen in real application, but testing edge case)
        JobMatchResult negativeResult = new JobMatchResult("Negative Score Job", "Testing", -10.0, "Negative match");
        assertEquals(-10.0, negativeResult.getMatchScore());

        // Test score above 100 (should not happen in real application, but testing edge case)
        JobMatchResult highResult = new JobMatchResult("High Score Job", "Testing", 110.0, "Above max match");
        assertEquals(110.0, highResult.getMatchScore());
    }
}