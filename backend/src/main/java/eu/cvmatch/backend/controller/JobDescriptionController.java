package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.JobMatchResult;
import eu.cvmatch.backend.service.JobService;
import eu.cvmatch.backend.utils.TextExtractor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/searchjobsforcv")
public class JobDescriptionController {
    private final JobService jobService;

    public JobDescriptionController(JobService jobService) {
        this.jobService = jobService;
    }

    public List<JobMatchResult> findMatchingJobs(@RequestParam("file") MultipartFile cvFile) throws Exception {
        String cvText = TextExtractor.extract(cvFile);
        return jobService.matchCVToJobs(cvText);
    }
}
