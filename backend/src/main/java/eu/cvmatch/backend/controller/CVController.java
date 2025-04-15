package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.service.CVProcessingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/processcv")
public class CVController {

    private final CVProcessingService cvProcessingService;

    public CVController(CVProcessingService cvProcessingService) {
        this.cvProcessingService = cvProcessingService;
    }

    @PostMapping
    public ResponseEntity<String> processCV(
            @RequestParam("jobId") String jobId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            CVMatchResult result = cvProcessingService.process(jobId, file);
            return ResponseEntity.ok("✅ CV processed. Score: " + result.getScore());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Failed to process CV: " + e.getMessage());
        }
    }
}
