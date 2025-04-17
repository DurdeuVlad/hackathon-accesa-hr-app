package eu.cvmatch.backend.model;

import java.util.List;

public class ScoreRequest {
    private JobPosting job;
    private List<String> cvs;

    public JobPosting getJob() {
        return job;
    }

    public void setJob(JobPosting job) {
        this.job = job;
    }

    public List<String> getCvs() {
        return cvs;
    }

    public void setCvs(List<String> cvs) {
        this.cvs = cvs;
    }
}
