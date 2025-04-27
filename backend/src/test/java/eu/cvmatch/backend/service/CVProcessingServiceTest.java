package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.utils.TextExtractor;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CVProcessingServiceTest {

    @Mock
    private FirebaseService firebaseService;

    @Mock
    private ScoringService scoringService;

    @InjectMocks
    private CVProcessingService cvProcessingService;

    private JobPosting createDummyJobPosting() {
        JobPosting jobPosting = new JobPosting();
        jobPosting.setTitle("Software Developer");
        jobPosting.setIndustry("Technology");
        jobPosting.setDescription("Job description for a software developer position");

        List<JobPosting.TechnicalSkill> skills = new ArrayList<>();
        JobPosting.TechnicalSkill skill = new JobPosting.TechnicalSkill();
        skill.setSkill("Java");
        skill.setWeight(50);
        skills.add(skill);

        JobPosting.TechnicalSkill skill2 = new JobPosting.TechnicalSkill();
        skill2.setSkill("Spring");
        skill2.setWeight(50);
        skills.add(skill2);

        jobPosting.setTechnicalSkills(skills);
        return jobPosting;
    }

    @Test
    public void testProcessTextFile() throws Exception {
        // Create a simple TXT file
        String content = "Sample CV content with Java skills";
        MockMultipartFile file = new MockMultipartFile(
                "file", "resume.txt", "text/plain", content.getBytes(StandardCharsets.UTF_8)
        );

        // Mock TextExtractor directly to avoid complex setup
        try (MockedStatic<TextExtractor> mockedTextExtractor = mockStatic(TextExtractor.class)) {
            mockedTextExtractor.when(() -> TextExtractor.extract(any(MockMultipartFile.class)))
                    .thenReturn(content);

            // Set up the job posting
            JobPosting dummyJob = createDummyJobPosting();
            when(firebaseService.getJobById("job123")).thenReturn(dummyJob);

            // Create expected result
            CVMatchResult expectedResult = new CVMatchResult();
            expectedResult.setScore(85.0);
            expectedResult.setIndustryScore(90.0);
            expectedResult.setTechScore(80.0);
            expectedResult.setJdScore(85.0);
            expectedResult.setExplanation("Good match for the position");

            // Mock scoring service
            when(scoringService.scoreCVAgainstJob(content, dummyJob)).thenReturn(expectedResult);

            // Call the service method
            CVMatchResult result = cvProcessingService.process("job123", file);

            // Verify the result
            assertEquals("resume.txt", result.getFileName());
            assertEquals(85.0, result.getScore());
            assertEquals(90.0, result.getIndustryScore());
            assertEquals(80.0, result.getTechScore());
            assertEquals(85.0, result.getJdScore());
            assertEquals("Good match for the position", result.getExplanation());
            assertNotNull(result.getUploadedAt());

            // Verify that firebaseService.saveCVMatch was called with the correct parameters
            verify(firebaseService).saveCVMatch(eq("job123"), anyString(), eq(result));
        }
    }

    @Test
    public void testUnsupportedFileFormat() throws Exception {
        // Create a mock unsupported file
        MockMultipartFile file = new MockMultipartFile(
                "file", "resume.xyz", "application/octet-stream", "dummy content".getBytes()
        );

        // Mock TextExtractor to throw UnsupportedOperationException
        try (MockedStatic<TextExtractor> mockedTextExtractor = mockStatic(TextExtractor.class)) {
            mockedTextExtractor.when(() -> TextExtractor.extract(any(MockMultipartFile.class)))
                    .thenThrow(new UnsupportedOperationException("Unsupported file format. Please upload a DOCX, DOC, PDF, or TXT file."));

            // Should throw IllegalArgumentException for unsupported format
            Exception exception = assertThrows(IllegalArgumentException.class, () -> {
                cvProcessingService.process("job123", file);
            });

            // Verify the exception message
            assertEquals("Unsupported file format. Please upload a DOCX, DOC, PDF, or TXT file.", exception.getMessage());

            // Verify that no CV match was saved and getJobById was never called
            verify(firebaseService, never()).getJobById(anyString());
            verify(firebaseService, never()).saveCVMatch(anyString(), anyString(), any(CVMatchResult.class));
        }
    }

    @Test
    public void testJobNotFound() throws Exception {
        // Create a valid file
        MockMultipartFile file = new MockMultipartFile(
                "file", "resume.txt", "text/plain", "dummy content".getBytes()
        );

        // Mock TextExtractor
        try (MockedStatic<TextExtractor> mockedTextExtractor = mockStatic(TextExtractor.class)) {
            mockedTextExtractor.when(() -> TextExtractor.extract(any(MockMultipartFile.class)))
                    .thenReturn("Sample CV content");

            // Simulate job not found in Firebase
            when(firebaseService.getJobById("nonexistent-job")).thenReturn(null);

            // Should throw Exception for job not found
            Exception exception = assertThrows(Exception.class, () -> {
                cvProcessingService.process("nonexistent-job", file);
            });

            assertEquals("Job not found", exception.getMessage());

            // Verify no interactions with scoring service
            verifyNoInteractions(scoringService);
        }
    }

    @Test
    public void testTextExtractionFailure() throws Exception {
        // Create a valid file
        MockMultipartFile file = new MockMultipartFile(
                "file", "corrupt.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "corrupted content".getBytes()
        );

        // Mock TextExtractor to throw IOException
        try (MockedStatic<TextExtractor> mockedTextExtractor = mockStatic(TextExtractor.class)) {
            mockedTextExtractor.when(() -> TextExtractor.extract(any(MockMultipartFile.class)))
                    .thenThrow(new IOException("Failed to extract text from file"));

            // Should throw Exception wrapping the IO error
            Exception exception = assertThrows(Exception.class, () -> {
                cvProcessingService.process("job123", file);
            });

            assertTrue(exception.getMessage().contains("Failed to extract text from the file"));

            // Verify no interactions with scoring service and getJobById/saveCVMatch were never called
            verifyNoInteractions(scoringService);
            verify(firebaseService, never()).getJobById(anyString());
            verify(firebaseService, never()).saveCVMatch(anyString(), anyString(), any(CVMatchResult.class));
        }
    }
}