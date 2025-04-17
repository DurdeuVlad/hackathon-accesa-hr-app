package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class CVProcessingServiceTest {

    private FirebaseService firebaseService;
    private ScoringService scoringService;
    private CVProcessingService cvProcessingService;

    @BeforeEach
    public void setUp() {
        firebaseService = mock(FirebaseService.class);
        scoringService = mock(ScoringService.class);
        cvProcessingService = new CVProcessingService(firebaseService, scoringService);
    }

    @Test
    public void testProcess() throws Exception {
        // Create an in-memory DOCX with sample text.
        XWPFDocument document = new XWPFDocument();
        document.createParagraph().createRun().setText("Dummy CV Content");
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        document.write(out);
        byte[] docBytes = out.toByteArray();

        MockMultipartFile file = new MockMultipartFile("file", "dummy.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", docBytes);

        JobPosting dummyJob = new JobPosting();
        dummyJob.setIndustry("Dummy Industry");
        dummyJob.setDescription("Dummy JD");

        when(firebaseService.getJobById("job123")).thenReturn(dummyJob);
        CVMatchResult expectedResult = new CVMatchResult(90, 100, 80, 70, "Industry: 100%, Skills: 80%, JD Match: 70%");
        expectedResult.setFileName("dummy.docx");
        when(scoringService.scoreCVAgainstJob("Dummy CV Content", dummyJob)).thenReturn(expectedResult);

        CVMatchResult result = cvProcessingService.process("job123", file);

        assertEquals("dummy.docx", result.getFileName());
        assertNotNull(result.getUploadedAt());
        assertEquals(90, result.getScore());
        verify(firebaseService).saveCVMatch(eq("job123"), eq("dummy.docx"), eq(result));
    }
}
