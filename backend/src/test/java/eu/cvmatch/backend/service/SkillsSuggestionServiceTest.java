package eu.cvmatch.backend.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import eu.cvmatch.backend.model.JobPosting;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class SkillsSuggestionServiceTest {

    @Mock
    private GenerativeLanguageClient mockGlClient;

    private SkillsSuggestionService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new SkillsSuggestionService(mockGlClient);
    }

    @Test
    void suggestSkills_validJobDescription_returnsSkills() throws Exception {
        // Arrange
        String jobDescription = "We are looking for a Java developer with Spring experience";

        // Create mock Gemini API response
        JsonArray mockCandidates = new JsonArray();
        JsonObject mockContent = new JsonObject();
        mockContent.addProperty("content", """
                {
                  "industry": "Software Development",
                  "technicalSkills": [
                    {"skill": "Java", "weight": 40},
                    {"skill": "Spring", "weight": 30},
                    {"skill": "REST APIs", "weight": 20},
                    {"skill": "SQL", "weight": 10}
                  ]
                }
                """);
        mockCandidates.add(mockContent);

        when(mockGlClient.generateMessage(anyList(), isNull(), eq(1)))
                .thenReturn(mockCandidates);

        // Act
        List<JobPosting.TechnicalSkill> result = service.suggestSkills(jobDescription);

        // Assert
        assertNotNull(result);
        assertEquals(4, result.size());
        assertEquals("Java", result.get(0).getSkill());
        assertEquals(40, result.get(0).getWeight());
        assertEquals("Spring", result.get(1).getSkill());
        assertEquals(30, result.get(1).getWeight());
    }

    @Test
    void suggestSkills_emptyJobDescription_throwsException() {
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            service.suggestSkills("");
        });

        assertEquals("Job description cannot be empty", exception.getMessage());
    }

    @Test
    void suggestSkills_nullJobDescription_throwsException() {
        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            service.suggestSkills(null);
        });

        assertEquals("Job description cannot be empty", exception.getMessage());
    }

    @Test
    void suggestSkills_geminiReturnsEmptyResponse_throwsException() throws Exception {
        // Arrange
        String jobDescription = "Valid job description";

        // Mock empty response from Gemini
        when(mockGlClient.generateMessage(anyList(), isNull(), eq(1)))
                .thenReturn(new JsonArray());

        // Act & Assert
        Exception exception = assertThrows(IllegalStateException.class, () -> {
            service.suggestSkills(jobDescription);
        });

        assertTrue(exception.getMessage().contains("Gemini returned no candidates"));
    }

    @Test
    void extractIndustry_validJobDescription_returnsIndustry() throws Exception {
        // Arrange
        String jobDescription = "We are looking for a Java developer with Spring experience";

        // Create mock Gemini API response
        JsonArray mockCandidates = new JsonArray();
        JsonObject mockContent = new JsonObject();
        mockContent.addProperty("content", """
                {
                  "industry": "Software Development",
                  "technicalSkills": [
                    {"skill": "Java", "weight": 40},
                    {"skill": "Spring", "weight": 30},
                    {"skill": "REST APIs", "weight": 20},
                    {"skill": "SQL", "weight": 10}
                  ]
                }
                """);
        mockCandidates.add(mockContent);

        when(mockGlClient.generateMessage(anyList(), isNull(), eq(1)))
                .thenReturn(mockCandidates);

        // Act
        String result = service.extractIndustry(jobDescription);

        // Assert
        assertEquals("Software Development", result);
    }
}