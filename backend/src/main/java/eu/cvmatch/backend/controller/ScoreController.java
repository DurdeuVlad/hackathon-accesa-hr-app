package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.service.FirebaseService;
import eu.cvmatch.backend.service.CVScoring;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/scorecvs")
public class ScoreController {

    private final FirebaseService firebaseService;
    private final CVScoring      cvScoring;

    public ScoreController(FirebaseService firebaseService, CVScoring cvScoring) {
        this.firebaseService = firebaseService;
        this.cvScoring = cvScoring;
    }

    @PostMapping
    public ResponseEntity<CVMatchResult> scoreAndSave(
            @RequestParam String jobId,
            @RequestParam String cvId,
            @RequestBody String cvText
    ) throws Exception {
        // 1) load the job
        JobPosting job = firebaseService.getJobById(jobId);

        // 2) score
        CVMatchResult result = cvScoring.calculateScore(cvText, job);
        result.setFileName(cvId);
        result.setUploadedAt(Instant.now().toString());

        // 3) persist under both collections, passing cvId into saveCVMatch
        firebaseService.saveCVMatch(jobId, cvId, result);
        firebaseService.saveJobMatch(cvId, jobId, result);

        // 4) return full object
        return ResponseEntity.ok(result);
    }
}
