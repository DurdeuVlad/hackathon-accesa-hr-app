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
        fakeResult.setScore(85.5);
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
                .andExpect(content().string("? CV processed. Score: 85.5"));
    }

    @Test
    void processCV_failure() throws Exception {
        // arrange
        when(processingService.process(eq("job123"), any()))
                .thenThrow(new RuntimeException("boom"));

        MockMultipartFile file = new MockMultipartFile(
                "file", "resume.pdf", MediaType.APPLICATION_PDF_VALUE, "dummy".getBytes()
        );

        // act & assert
        mockMvc.perform(multipart("/processcv")
                        .file(file)
                        .param("jobId", "job123"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("? Failed to process CV: boom")));
    }
}
