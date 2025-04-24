package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.JobMatchResult;
import eu.cvmatch.backend.service.JobService;
import eu.cvmatch.backend.utils.TextExtractor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobDescriptionControllerTest {

    @Mock
    private JobService jobService;

    @InjectMocks
    private JobDescriptionController controller;

    private MockMultipartFile cvFile;

    @BeforeEach
    void setUp() {
        cvFile = new MockMultipartFile(
                "file",
                "resume.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Sample CV content".getBytes()
        );
    }

    @Test
    void testFindMatchingJobsSuccess() throws Exception {
        // Setup test data
        String extractedText = "Sample CV content";
        List<JobMatchResult> expectedResults = Arrays.asList(
                new JobMatchResult("Java Developer", "Software", 85.0, "Good match"),
                new JobMatchResult("DevOps Engineer", "Cloud", 75.0, "Average match")
        );

        // Mock TextExtractor and JobService
        try (MockedStatic<TextExtractor> mockedTextExtractor = Mockito.mockStatic(TextExtractor.class)) {
            mockedTextExtractor.when(() -> TextExtractor.extract(any(MultipartFile.class)))
                    .thenReturn(extractedText);

            when(jobService.matchCVToJobs(extractedText)).thenReturn(expectedResults);

            // Execute the controller method
            ResponseEntity<List<JobMatchResult>> response = controller.findMatchingJobs(cvFile);

            // Verify
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertEquals(2, response.getBody().size());
            assertEquals("Java Developer", response.getBody().get(0).getJobTitle());
            assertEquals("DevOps Engineer", response.getBody().get(1).getJobTitle());

            verify(jobService, times(1)).matchCVToJobs(extractedText);
        }
    }

    @Test
    void testFindMatchingJobsWithEmptyResults() throws Exception {
        // Setup test data
        String extractedText = "Sample CV content";
        List<JobMatchResult> emptyResults = new ArrayList<>();

        // Mock TextExtractor and JobService
        try (MockedStatic<TextExtractor> mockedTextExtractor = Mockito.mockStatic(TextExtractor.class)) {
            mockedTextExtractor.when(() -> TextExtractor.extract(any(MultipartFile.class)))
                    .thenReturn(extractedText);

            when(jobService.matchCVToJobs(extractedText)).thenReturn(emptyResults);

            // Execute the controller method
            ResponseEntity<List<JobMatchResult>> response = controller.findMatchingJobs(cvFile);

            // Verify
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertNotNull(response.getBody());
            assertTrue(response.getBody().isEmpty());

            verify(jobService, times(1)).matchCVToJobs(extractedText);
        }
    }

    @Test
    void testFindMatchingJobsWithTextExtractionError() throws Exception {
        // Mock TextExtractor to throw an exception
        try (MockedStatic<TextExtractor> mockedTextExtractor = Mockito.mockStatic(TextExtractor.class)) {
            mockedTextExtractor.when(() -> TextExtractor.extract(any(MultipartFile.class)))
                    .thenThrow(new Exception("Failed to extract text"));

            // Execute the controller method
            ResponseEntity<List<JobMatchResult>> response = controller.findMatchingJobs(cvFile);

            // Verify
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
            assertNull(response.getBody());

            // Verify JobService was never called
            verify(jobService, never()).matchCVToJobs(anyString());
        }
    }

    @Test
    void testFindMatchingJobsWithJobServiceError() throws Exception {
        // Setup test data
        String extractedText = "Sample CV content";

        // Mock TextExtractor and JobService
        try (MockedStatic<TextExtractor> mockedTextExtractor = Mockito.mockStatic(TextExtractor.class)) {
            mockedTextExtractor.when(() -> TextExtractor.extract(any(MultipartFile.class)))
                    .thenReturn(extractedText);

            when(jobService.matchCVToJobs(extractedText)).thenThrow(new RuntimeException("Service error"));

            // Execute the controller method
            ResponseEntity<List<JobMatchResult>> response = controller.findMatchingJobs(cvFile);

            // Verify
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
            assertNull(response.getBody());

            verify(jobService, times(1)).matchCVToJobs(extractedText);
        }
    }

    @Test
    void testFindMatchingJobsWithNullFile() throws Exception {
        // Execute the controller method with null file
        ResponseEntity<List<JobMatchResult>> response = controller.findMatchingJobs(null);

        // Verify
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNull(response.getBody());

        // Verify JobService was never called
        verify(jobService, never()).matchCVToJobs(anyString());
    }
}