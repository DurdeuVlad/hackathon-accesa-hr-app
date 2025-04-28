package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.stereotype.Service;

@Service
public class ScoringService {

    private final CVScoring cvScoring;

    public ScoringService(CVScoring cvScoring) {
        this.cvScoring = cvScoring;
    }

    public CVMatchResult scoreCVAgainstJob(String cvText, JobPosting job) throws Exception {
        // delegate to our Gemini-backed scorer
        return cvScoring.calculateScore(cvText, job);
    }
}
