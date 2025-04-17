package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.ScoreRequest;
import eu.cvmatch.backend.model.ScoreResponse;
import eu.cvmatch.backend.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/scorecvs")
public class ScoreCVController {
    private final ScoreService scoreService;

    @Autowired
    public ScoreCVController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @PostMapping
    public ResponseEntity<?> scoreCvs(@RequestBody ScoreRequest request) {
        try {
            if (request.getJob() == null) {
                return ResponseEntity.badRequest().body("Job description is required");
            }

            if (request.getCvs() == null || request.getCvs().isEmpty()) {
                return ResponseEntity.badRequest().body("At least one CV is required");
            }

            List<CVMatchResult> results = scoreService.scoreCvs(
                    request.getJob(),
                    request.getCvs()
            );

            ScoreResponse response = new ScoreResponse(results);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process CVs: " + e.getMessage());
        }
    }
}
