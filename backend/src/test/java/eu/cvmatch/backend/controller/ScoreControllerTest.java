package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.service.CVScoring;
import eu.cvmatch.backend.service.FirebaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ScoreControllerTest {

    @Mock FirebaseService firebaseService;
    @Mock CVScoring     cvScoring;
    @InjectMocks ScoreController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void whenValidRequest_thenScoresAndSaves() throws Exception {
        // arrange
        JobPosting job = new JobPosting();
        job.setIndustry("banking");
        job.setDescription("React + banking");
        job.setTechnicalSkills(Collections.emptyList());

        CVMatchResult fake = new CVMatchResult(88.8, 10, 30, 48.8, "Strong match");
        when(firebaseService.getJobById("job123")).thenReturn(job);
        when(cvScoring.calculateScore(anyString(), eq(job))).thenReturn(fake);

        // act & assert
        mockMvc.perform(post("/scorecvs")
                        .param("jobId", "job123")
                        .param("cvId",  "cv456")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("some-cv-text"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(88.8))
                .andExpect(jsonPath("$.industryScore").value(10.0))
                .andExpect(jsonPath("$.techScore").value(30.0))
                .andExpect(jsonPath("$.jdScore").value(48.8))
                .andExpect(jsonPath("$.explanation").value("Strong match"))
                .andExpect(jsonPath("$.fileName").value("cv456"))
                .andExpect(jsonPath("$.uploadedAt").isNotEmpty());

        // verify new signature: saveCVMatch(jobId, cvId, result)
        verify(firebaseService).saveCVMatch("job123", "cv456", fake);
        verify(firebaseService).saveJobMatch("cv456", "job123", fake);
    }

    @Test
    public void whenJobNotFound_thenReturns500() throws Exception {
        // Arrange
        String invalidJobId = "nonExistingJobId";
        String cvId = "sampleCvId";
        String cvText = "Sample CV text";

        when(firebaseService.getJobById(invalidJobId))
                .thenThrow(new IllegalArgumentException("not found"));

        // Act & Assert
        mockMvc.perform(post("/scorecvs")
                        .param("jobId", invalidJobId)
                        .param("cvId", cvId)
                        .content(cvText)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }
}
