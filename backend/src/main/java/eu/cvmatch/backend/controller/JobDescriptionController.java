package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.JobMatchResult;
import eu.cvmatch.backend.service.JobService;
import eu.cvmatch.backend.utils.TextExtractor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/searchjobsforcv")
public class JobDescriptionController {
    private final JobService jobService;

    public JobDescriptionController(JobService jobService) {
        this.jobService = jobService;
    }

    /**
     * This endpoint is used to find matching jobs based on a CV file.
     * @param cvFile The CV file to match against job postings.
     * @return A list of matching job postings.
     */
    @PostMapping
    public ResponseEntity<List<JobMatchResult>> findMatchingJobs(@RequestParam("file") MultipartFile cvFile) {
        try {
            String cvText = TextExtractor.extract(cvFile);

            List<JobMatchResult> matchingJobs = jobService.matchCVToJobs(cvText);

            return ResponseEntity.ok(matchingJobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    /**
     * This endpoint is used to find matching jobs based on CV text.
     * @param cvText The CV text to match against job postings.
     * @return A list of matching job postings.
     */
    @PostMapping("/bytext")
    public ResponseEntity<List<JobMatchResult>> findMatchingJobsByText(@RequestParam("cvText") String cvText) {
        try {
            List<JobMatchResult> matchingJobs = jobService.matchCVToJobs(cvText);

            return ResponseEntity.ok(matchingJobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }


}