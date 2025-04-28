package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CV;
import eu.cvmatch.backend.service.FirebaseService;
import eu.cvmatch.backend.utils.TextExtractor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.text.Normalizer;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

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
    @GetMapping("/{userId}")
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

    @GetMapping
    public ResponseEntity<List<CV>> listAllCVs() {
        try {
            List<CV> cvs = firebaseService.getAllCVs();
            return ResponseEntity.ok(cvs);
        } catch (Exception e) {
            System.err.println("Error listing all CVs: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    @PostMapping
    public ResponseEntity<?> uploadCV(
            @RequestParam(value = "userId", required = false) String userId,
            @RequestParam("file") MultipartFile file) {

        try {
            String effectiveUserId = (userId == null || userId.isBlank()) ?
                    extractName(file.getOriginalFilename()) : userId;
            String cvText = TextExtractor.extract(file);

            CV cv = new CV();
            cv.setUserId(effectiveUserId);
            cv.setFileName(file.getOriginalFilename() != null ? file.getOriginalFilename() : UUID.randomUUID().toString());
            cv.setContentText(cvText);
            cv.setUploadedAt(Instant.now().toString());

            String cvId = firebaseService.saveCV(cv, file.getOriginalFilename());

            return ResponseEntity.ok(Map.of(
                    "message", "CV uploaded successfully",
                    "cvId", cvId,
                    "userId", effectiveUserId,
                    "fileName", cv.getFileName(),
                    "cvText", cvText,
                    "uploadedAt", cv.getUploadedAt()

            ));

        } catch (UnsupportedOperationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Unsupported file format. Please upload a DOCX, DOC, PDF, or TXT file."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload CV: " + e.getMessage()));
        }
    }

    private static String extractName(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex != -1) {
            fileName = fileName.substring(0, dotIndex);
        }

        fileName = normalizeDiacritics(fileName);

        fileName = fileName.replaceAll("_", " ");

        fileName = fileName.replaceAll("[^a-zA-ZăîâșțĂÎÂȘȚ\\s]", " ");

        fileName = fileName.replaceAll("\\s+", " ").trim();

        String[] words = fileName.split(" ");

        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty() && Character.isUpperCase(word.charAt(0))) {
                if (sb.length() > 0) {
                    sb.append("_");
                }
                sb.append(word);
            }
        }

        return sb.toString().trim();
    }

    private static String normalizeDiacritics(String input) {
        String nfd = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(nfd).replaceAll("");
    }
}
