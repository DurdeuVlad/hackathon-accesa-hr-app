package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.utils.TextExtractor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Service
public class CVProcessingService {

    private final FirebaseService firebaseService;
    private final ScoringService scoringService;

    public CVProcessingService(FirebaseService firebaseService, ScoringService scoringService) {
        this.firebaseService = firebaseService;
        this.scoringService = scoringService;
    }

    public CVMatchResult process(String jobId, MultipartFile file) throws Exception {
        String cvText = TextExtractor.extract(file);
        JobPosting job = firebaseService.getJobById(jobId);

        CVMatchResult result = scoringService.scoreCVAgainstJob(cvText, job);
        result.setFileName(file.getOriginalFilename());
        result.setUploadedAt(Instant.now().toString());

        firebaseService.saveCVMatch(jobId, result);
        return result;
    }
}
