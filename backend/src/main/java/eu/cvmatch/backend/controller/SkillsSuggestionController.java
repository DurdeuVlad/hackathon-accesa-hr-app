package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.service.SkillsSuggestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/job-skills")
public class SkillsSuggestionController {

    private final SkillsSuggestionService skillsService;

    public SkillsSuggestionController(SkillsSuggestionService skillsService) {
        this.skillsService = skillsService;
    }

    @PostMapping
    public ResponseEntity<?> suggestSkills(@RequestBody String jobDescription) {
        try {
            if (jobDescription == null || jobDescription.isBlank()) {
                return ResponseEntity.badRequest().body("Job description cannot be empty");
            }

            List<JobPosting.TechnicalSkill> skills = skillsService.suggestSkills(jobDescription);
            return ResponseEntity.ok(skills);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body("Failed to generate skill suggestions: " + e.getMessage());
        }
    }
}