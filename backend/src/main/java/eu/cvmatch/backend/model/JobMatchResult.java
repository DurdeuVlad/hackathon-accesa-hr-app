package eu.cvmatch.backend.model;

public class JobMatchResult {
    private String jobTitle;
    private String industry;
    private double matchScore;
    private String explanation;

    public JobMatchResult(String jobTitle, String industry, double matchScore, String explanation) {
        this.jobTitle = jobTitle;
        this.industry = industry;
        this.matchScore = matchScore;
        this.explanation = explanation;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    @Override
    public String toString() {
        return "JobMatchResult{" +
                "jobTitle='" + jobTitle + '\'' +
                ", industry='" + industry + '\'' +
                ", matchScore=" + matchScore +
                ", explanation='" + explanation + '\'' +
                '}';
    }
}