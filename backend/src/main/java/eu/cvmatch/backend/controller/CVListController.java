package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CV;
import eu.cvmatch.backend.service.FirebaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
