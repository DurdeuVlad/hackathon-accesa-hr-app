package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.service.CVProcessingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProcessCVControllerTest {

    @Mock
    private CVProcessingService processingService;

    @InjectMocks
    private ProcessCVController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void processCV_success() throws Exception {
        // arrange
        CVMatchResult fakeResult = new CVMatchResult();
        fakeResult.setFileName("resume.pdf");
        fakeResult.setScore(85.5);
        fakeResult.setIndustryScore(90.0);
        fakeResult.setTechScore(80.0);
        fakeResult.setJdScore(86.5);
        fakeResult.setExplanation("Strong match for the position");
        when(processingService.process(eq("job123"), any()))
                .thenReturn(fakeResult);

        MockMultipartFile file = new MockMultipartFile(
                "file", "resume.pdf", MediaType.APPLICATION_PDF_VALUE, "dummy".getBytes()
        );

        // act & assert
        mockMvc.perform(multipart("/processcv")
                        .file(file)
                        .param("jobId", "job123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("✅ CV processed successfully"))
                .andExpect(jsonPath("$.score").value(85.5))
                .andExpect(jsonPath("$.result.score").value(85.5));
    }

    @Test
    void processCV_invalidFormat_failure() throws Exception {
        // arrange
        when(processingService.process(eq("job123"), any()))
                .thenThrow(new IllegalArgumentException("Unsupported file format. Please upload a DOCX, DOC, PDF, or TXT file."));

        MockMultipartFile file = new MockMultipartFile(
                "file", "resume.xyz", "application/octet-stream", "dummy".getBytes()
        );

        // act & assert
        mockMvc.perform(multipart("/processcv")
                        .file(file)
                        .param("jobId", "job123"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Unsupported file format. Please upload a DOCX, DOC, PDF, or TXT file."));
    }

    @Test
    void processCV_serverError_failure() throws Exception {
        // arrange
        when(processingService.process(eq("job123"), any()))
                .thenThrow(new RuntimeException("Internal server error"));

        MockMultipartFile file = new MockMultipartFile(
                "file", "resume.pdf", MediaType.APPLICATION_PDF_VALUE, "dummy".getBytes()
        );

        // act & assert
        mockMvc.perform(multipart("/processcv")
                        .file(file)
                        .param("jobId", "job123"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("❌ Failed to process CV: Internal server error"));
    }
}