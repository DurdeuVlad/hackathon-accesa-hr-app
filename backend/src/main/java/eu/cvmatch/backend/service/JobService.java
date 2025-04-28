package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final FirebaseService firebaseService;
    private final ScoringService scoringService;

    public JobService(FirebaseService firebaseService, ScoringService scoringService) {
        this.firebaseService = firebaseService;
        this.scoringService = scoringService;
    }

    public List<JobMatchResult> matchCVToJobs(String cvText) {
        try {
            List<JobPosting> allJobs = firebaseService.getAllJobs();
            List<JobMatchResult> results = new ArrayList<>();

            for (JobPosting job : allJobs) {
                try {
                    CVMatchResult cvMatchResult = scoringService.scoreCVAgainstJob(cvText, job);

                    JobMatchResult result = new JobMatchResult(
                            job.getJobTitle(),
                            job.getIndustry(),
                            cvMatchResult.getScore(),
                            cvMatchResult.getExplanation()
                    );

                    results.add(result);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            return results.stream()
                    .sorted((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}