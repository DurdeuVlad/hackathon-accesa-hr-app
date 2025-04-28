package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.service.FirebaseService;
import eu.cvmatch.backend.service.CVScoring;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/scorecvs")
public class ScoreController {

    private final FirebaseService firebaseService;
    private final CVScoring cvScoring;

    public ScoreController(FirebaseService firebaseService, CVScoring cvScoring) {
        this.firebaseService = firebaseService;
        this.cvScoring = cvScoring;
    }

    @PostMapping
    public ResponseEntity<?> scoreAndSave(
            @RequestParam String jobId,
            @RequestParam String cvId,
            @RequestBody String cvText
    ) {
        try {
            JobPosting job = firebaseService.getJobById(jobId);

            CVMatchResult result = cvScoring.calculateScore(cvText, job);
            result.setFileName(cvId);
            result.setUploadedAt(Instant.now().toString());

            firebaseService.saveCVMatch(jobId, cvId, result);
            firebaseService.saveJobMatch(cvId, jobId, result);

            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            // explicitly catch and return HTTP 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        } catch (Exception e) {
            // catch other unforeseen exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }
}
