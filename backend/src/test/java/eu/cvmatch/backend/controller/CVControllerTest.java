package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.service.CVProcessingService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CVController.class)
@Import(CVControllerTest.TestConfig.class)
public class CVControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CVProcessingService cvProcessingService; // Now injected via TestConfig

    static class TestConfig {
        @Bean
        public CVProcessingService cvProcessingService() {
            return Mockito.mock(CVProcessingService.class);
        }
    }

    @Test
    public void testProcessCV_Success() throws Exception {
        CVMatchResult matchResult = new CVMatchResult();
        matchResult.setScore(85.5);
        matchResult.setFileName("test.docx");
        matchResult.setUploadedAt(Instant.now().toString());

        when(cvProcessingService.process(anyString(), any())).thenReturn(matchResult);

        MockMultipartFile file = new MockMultipartFile("file", "test.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Dummy content".getBytes());

        mockMvc.perform(multipart("/processcv")
                        .file(file)
                        .param("jobId", "job123"))
                .andExpect(status().isOk())
                .andExpect(content().string("✅ CV processed. Score: " + matchResult.getScore()));
    }

    @Test
    public void testProcessCV_Failure() throws Exception {
        when(cvProcessingService.process(anyString(), any())).thenThrow(new Exception("Processing error"));

        MockMultipartFile file = new MockMultipartFile("file", "test.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Dummy content".getBytes());

        mockMvc.perform(multipart("/processcv")
                        .file(file)
                        .param("jobId", "job123"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string("❌ Failed to process CV: Processing error"));
    }
}
