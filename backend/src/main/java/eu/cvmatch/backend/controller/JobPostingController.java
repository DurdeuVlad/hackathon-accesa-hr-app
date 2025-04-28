package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.dto.JobPostingDTO;
import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.service.JobPostingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/job-postings")
public class JobPostingController {

    private final JobPostingService jobPostingService;

    public JobPostingController(JobPostingService jobPostingService) {
        this.jobPostingService = jobPostingService;
    }

    /**
     * GET /job-postings/user/{userId}
     * Returns all job postings created by the specified user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JobPostingDTO>> getUserJobPostings(@PathVariable String userId) {
        try {
            List<JobPosting> jobs = jobPostingService.getJobsForUser(userId);

            // Convert to DTOs
            List<JobPostingDTO> jobDTOs = jobs.stream()
                .map(JobPostingDTO::new)
                .collect(Collectors.toList());

            return ResponseEntity.ok(jobDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /job-postings
     * Creates a new job posting
     */
    @PostMapping
    public ResponseEntity<?> createJobPosting(@RequestBody JobPostingDTO jobPostingDTO) {
        try {
            if (jobPostingDTO.getJobTitle() == null || jobPostingDTO.getJobTitle().isEmpty() ||
                jobPostingDTO.getIndustry() == null || jobPostingDTO.getIndustry().isEmpty() ||
                jobPostingDTO.getDescription() == null || jobPostingDTO.getDescription().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            // Convert DTO to model
            JobPosting jobPosting = jobPostingDTO.toJobPosting();

            // Normalize technical skills weights
            if (jobPosting.getTechnicalSkills() != null) {
                jobPosting.normalizeTechnicalSkillsScore();
            }

            String jobId = jobPostingService.saveJob(jobPosting);
            return ResponseEntity.ok(Map.of(
                "message", "Job posting created successfully",
                "jobId", jobId
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create job posting: " + e.getMessage()));
        }
    }

    /**
     * GET /job-postings/{jobId}
     * Returns a specific job posting by ID
     */
    @GetMapping("/{jobId}")
    public ResponseEntity<JobPostingDTO> getJobPosting(@PathVariable String jobId) {
        try {
            JobPosting job = jobPostingService.getJobById(jobId);
            if (job == null) {
                return ResponseEntity.notFound().build();
            }
            // Convert to DTO to avoid serialization issues
            return ResponseEntity.ok(new JobPostingDTO(job));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /job-postings/{jobId}
     * Updates an existing job posting
     */
    @PutMapping("/{jobId}")
    public ResponseEntity<?> updateJobPosting(
            @PathVariable String jobId,
            @RequestBody JobPostingDTO jobPostingDTO) {
        try {
            // Convert DTO to model
            JobPosting jobPosting = jobPostingDTO.toJobPosting();

            // Make sure it has the right ID
            jobPosting.setId(jobId);

            // Normalize technical skills weights
            if (jobPosting.getTechnicalSkills() != null) {
                jobPosting.normalizeTechnicalSkillsScore();
            }

            jobPostingService.updateJob(jobId, jobPosting);
            return ResponseEntity.ok(Map.of("message", "Job posting updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Job posting not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update job posting: " + e.getMessage()));
        }
    }

    /**
     * DELETE /job-postings/{jobId}
     * Deletes a job posting
     */
    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> deleteJobPosting(@PathVariable String jobId) {
        try {
            jobPostingService.deleteJob(jobId);
            return ResponseEntity.ok(Map.of("message", "Job posting deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Job posting not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete job posting: " + e.getMessage()));
        }
    }
}