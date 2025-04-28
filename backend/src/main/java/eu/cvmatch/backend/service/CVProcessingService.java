package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CV;
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
            e.printStackTrace();
            throw new Exception("Failed to extract text from the file: " + e.getMessage());
        }
        System.out.println("Extracted CV text: " + cvText);
        JobPosting job = firebaseService.getJobById(jobId);
        if (job == null) {
            throw new Exception("Job not found");
        }
        System.out.println("Job details: " + job);

        String cvId = getOrCreateCvId(file);

        CVMatchResult result = scoringService.scoreCVAgainstJob(cvText, job);
        result.setFileName(file.getOriginalFilename());
        result.setUploadedAt(Instant.now().toString());

        firebaseService.saveCVMatch(jobId, cvId, result);

        return result;
    }

    private String getOrCreateCvId(MultipartFile file) {
        String filename = file.getOriginalFilename();
        return (filename != null && !filename.isBlank()) ? filename : UUID.randomUUID().toString();
    }
}