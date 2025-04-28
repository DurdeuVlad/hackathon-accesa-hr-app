package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.service.CVProcessingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/processcv")
public class ProcessCVController {

    private final CVProcessingService cvProcessingService;

    public ProcessCVController(CVProcessingService cvProcessingService) {
        this.cvProcessingService = cvProcessingService;
    }

    @PostMapping
    public ResponseEntity<?> processCV(
            @RequestParam("jobId") String jobId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            CVMatchResult result = cvProcessingService.process(jobId, file);

            return ResponseEntity.ok(Map.of(
                    "message", "✅ CV processed successfully",
                    "score", result.getScore(),
                    "result", result
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "❌ Failed to process CV: " + e.getMessage()));
        }
    }

    @PostMapping("/byid")
    public ResponseEntity<?> processCVById(
            @RequestParam("jobId") String jobId,
            @RequestParam("cvId") String cvId
    ) {
        try {
            CVMatchResult result = cvProcessingService.processById(jobId, cvId);

            return ResponseEntity.ok(Map.of(
                    "message", "✅ CV processed successfully by ID",
                    "score", result.getScore(),
                    "result", result
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "❌ Failed to process CV by ID: " + e.getMessage()));
        }
    }
}