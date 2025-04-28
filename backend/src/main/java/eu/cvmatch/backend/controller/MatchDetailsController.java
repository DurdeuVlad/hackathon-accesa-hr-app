package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.MatchDetails;
import eu.cvmatch.backend.service.MatchDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/match-details")
public class MatchDetailsController {

    private final MatchDetailsService matchDetailsService;

    public MatchDetailsController(MatchDetailsService matchDetailsService) {
        this.matchDetailsService = matchDetailsService;
    }

    /**
     * GET /match-details?jobId=...&cvId=...
     * → returns full details about a specific job-CV match
     */
    @GetMapping
    public ResponseEntity<MatchDetails> getMatchDetails(
            @RequestParam String jobId,
            @RequestParam String cvId) {
        try {
            MatchDetails matchDetails = matchDetailsService.getMatchDetails(jobId, cvId);
            if (matchDetails == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(matchDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
