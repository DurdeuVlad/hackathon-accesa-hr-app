package eu.cvmatch.backend.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class CVMatchResultTest {

    @Test
    public void testGettersAndSetters() {
        CVMatchResult result = new CVMatchResult();
        result.setFileName("file.docx");
        result.setScore(88.5);
        result.setIndustryScore(100);
        result.setTechScore(50);
        result.setJdScore(75);
        result.setExplanation("Test explanation");
        result.setUploadedAt("2025-04-15T12:00:00Z");

        assertEquals("file.docx", result.getFileName());
        assertEquals(88.5, result.getScore());
        assertEquals(100, result.getIndustryScore());
        assertEquals(50, result.getTechScore());
        assertEquals(75, result.getJdScore());
        assertEquals("Test explanation", result.getExplanation());
        assertEquals("2025-04-15T12:00:00Z", result.getUploadedAt());
    }
}
