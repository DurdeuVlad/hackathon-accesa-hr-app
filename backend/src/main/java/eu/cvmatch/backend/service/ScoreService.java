package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScoreService {

    private final ScoringService scoringService;

    @Autowired
    public ScoreService(ScoringService scoringService) {
        this.scoringService = scoringService;
    }

    public List<CVMatchResult> scoreCvs(JobPosting job, List<String> cvContents) {
        if (job == null || cvContents == null || cvContents.isEmpty()) {
            return new ArrayList<>();
        }

        List<CVMatchResult> results = new ArrayList<>();

        for (int i = 0; i < cvContents.size(); i++) {
            String cvText = cvContents.get(i);
            if (cvText == null || cvText.trim().isEmpty()) {
                continue;
            }

            CVMatchResult result = scoringService.scoreCVAgainstJob(cvText, job);

            results.add(result);
        }

        return results.stream()
                .sorted(Comparator.comparingDouble(CVMatchResult::getScore).reversed())
                .collect(Collectors.toList());
    }
}
