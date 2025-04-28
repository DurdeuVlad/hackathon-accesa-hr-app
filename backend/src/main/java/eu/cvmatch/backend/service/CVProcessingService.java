package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.utils.TextExtractor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.UUID;

@Service
public class CVProcessingService {

    private final FirebaseService firebaseService;
    private final ScoringService scoringService;

    public CVProcessingService(FirebaseService firebaseService, ScoringService scoringService) {
        this.firebaseService = firebaseService;
        this.scoringService = scoringService;
    }

    public CVMatchResult process(String jobId, MultipartFile file) throws Exception {
        String cvText;
        try {
            cvText = TextExtractor.extract(file);
        } catch (UnsupportedOperationException e) {
            throw new IllegalArgumentException("Unsupported file format. Please upload a DOCX, DOC, PDF, or TXT file.");
        } catch (Exception e) {
            throw new Exception("Failed to extract text from file: " + e.getMessage(), e);
        }
        String cvId = getOrCreateCvId(file.getOriginalFilename());
        return scoreAndSaveMatch(jobId, cvText, cvId, file.getOriginalFilename());
    }

    public CVMatchResult processById(String jobId, String cvId) throws Exception {
        if (jobId == null || jobId.isBlank() || cvId == null || cvId.isBlank()) {
            throw new IllegalArgumentException("Job ID and CV ID cannot be null or blank");
        }
        String cvText = (String) firebaseService.getCVText(cvId);
        if (cvText == null || cvText.isBlank()) {
            throw new Exception("CV text not found for ID: " + cvId);
        }
        return scoreAndSaveMatch(jobId, cvText, cvId, cvId);
    }

    private CVMatchResult scoreAndSaveMatch(String jobId, String cvText, String cvId, String fileName) throws Exception {
        JobPosting job = firebaseService.getJobById(jobId);
        if (job == null) {
            throw new Exception("Job not found");
        }
        CVMatchResult result = scoringService.scoreCVAgainstJob(cvText, job);
        if (result == null) {
            throw new Exception("Failed to score CV against Job");
        }
        result.setFileName(fileName);
        result.setUploadedAt(Instant.now().toString());

        firebaseService.saveCVMatch(jobId, cvId, result);

        return result;
    }

    private String getOrCreateCvId(String filename) {
        return (filename != null && !filename.isBlank()) ? filename : UUID.randomUUID().toString();
    }
}
