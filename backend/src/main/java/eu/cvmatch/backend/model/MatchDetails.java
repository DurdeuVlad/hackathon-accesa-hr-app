package eu.cvmatch.backend.model;

public class MatchDetails {
    private JobPosting job;
    private CVMatchResult cvMatch;

    public MatchDetails() {
    }

    public MatchDetails(JobPosting job, CVMatchResult cvMatch) {
        this.job = job;
        this.cvMatch = cvMatch;
    }

    public JobPosting getJob() {
        return job;
    }

    public void setJob(JobPosting job) {
        this.job = job;
    }

    public CVMatchResult getCvMatch() {
        return cvMatch;
    }

    public void setCvMatch(CVMatchResult cvMatch) {
        this.cvMatch = cvMatch;
    }
}
