package eu.cvmatch.backend.model;

public class CVMatchResult {
    private String fileName;
    private double score;
    private double industryScore;
    private double techScore;
    private double jdScore;
    private String explanation;
    private String uploadedAt;

    public CVMatchResult() {}

    public CVMatchResult(double score, double industryScore, double techScore, double jdScore, String explanation) {
        this.score = score;
        this.industryScore = industryScore;
        this.techScore = techScore;
        this.jdScore = jdScore;
        this.explanation = explanation;
    }

    // Getters and setters
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public double getIndustryScore() { return industryScore; }
    public void setIndustryScore(double industryScore) { this.industryScore = industryScore; }

    public double getTechScore() { return techScore; }
    public void setTechScore(double techScore) { this.techScore = techScore; }

    public double getJdScore() { return jdScore; }
    public void setJdScore(double jdScore) { this.jdScore = jdScore; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }

    @Override
    public String toString() {
        return "CVMatchResult{" +
                "fileName='" + fileName + '\'' +
                ", score=" + score +
                ", industryScore=" + industryScore +
                ", techScore=" + techScore +
                ", jdScore=" + jdScore +
                ", explanation='" + explanation + '\'' +
                ", uploadedAt='" + uploadedAt + '\'' +
                '}';
    }
}
