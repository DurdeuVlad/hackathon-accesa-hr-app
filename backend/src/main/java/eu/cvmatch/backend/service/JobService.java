package eu.cvmatch.backend.service;

import eu.cvmatch.backend.model.JobMatchResult;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class JobService {
    public List<JobMatchResult> matchCVToJobs(String cvText) {
        return Collections.emptyList();
    }
}
