package eu.cvmatch.backend.model;

public class JobMatchResult {
    private String jobTitle;
    private String industry;
    private double matchScore;
    private double industryScore;
    private double techScore;
    private double jdScore;
    private String explanation;

    public JobMatchResult(String jobTitle, String industry, double matchScore, double industryScore, double techScore, double jdScore, String explanation) {
        this.jobTitle = jobTitle;
        this.industry = industry;
        this.matchScore = matchScore;
        this.industryScore = industryScore;
        this.techScore = techScore;
        this.jdScore = jdScore;
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

    public double getIndustryScore() {
        return industryScore;
    }

    public void setIndustryScore(double industryScore) {
        this.industryScore = industryScore;
    }

    public double getTechScore() {
        return techScore;
    }

    public void setTechScore(double techScore) {
        this.techScore = techScore;
    }

    public double getJdScore() {
        return jdScore;
    }

    public void setJdScore(double jdScore) {
        this.jdScore = jdScore;
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
                ", industryScore=" + industryScore +
                ", techScore=" + techScore +
                ", jdScore=" + jdScore +
                ", explanation='" + explanation + '\'' +
                '}';
    }
}