package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CV;
import eu.cvmatch.backend.service.FirebaseService;
import eu.cvmatch.backend.utils.TextExtractor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cvs")
public class CVListController {

    private final FirebaseService firebaseService;

    public CVListController(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    /**
     * GET /cvs/user/{userId}
     * → returns all CVs uploaded by that user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CV>> listUserCVs(@PathVariable String userId) {
        try {
            List<CV> cvs = firebaseService.getCVsForUser(userId);
            return ResponseEntity.ok(cvs);
        } catch (Exception e) {
            // optionally log the exception here
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    @PostMapping()
    public ResponseEntity<?> uploadCV(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file) {

        try {
            String cvText = TextExtractor.extract(file);

            CV cv = new CV();
            cv.setUserId(userId);
            cv.setFileName(file.getOriginalFilename());
            cv.setContentText(cvText);
            cv.setUploadedAt(Instant.now().toString());

            String cvId = firebaseService.saveCV(cv);

            return ResponseEntity.ok(Map.of(
                    "message", "CV uploaded successfully",
                    "cvId", cvId
            ));

        } catch (UnsupportedOperationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Unsupported file format. Please upload a DOCX, DOC, PDF, or TXT file."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload CV: " + e.getMessage()));
        }
    }
}
