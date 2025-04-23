package eu.cvmatch.backend.model;

public class TopJob {
    private String jobId;
    private String title;    // now matches your 'jobs.title' field
    private double avgScore;

    public TopJob(String jobId, String title, double avgScore) {
        this.jobId = jobId;
        this.title = title;
        this.avgScore = avgScore;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getAvgScore() {
        return avgScore;
    }

    public void setAvgScore(double avgScore) {
        this.avgScore = avgScore;
    }

    @Override
    public String toString() {
        return "TopJob{" +
                "jobId='" + jobId + '\'' +
                ", title='" + title + '\'' +
                ", avgScore=" + avgScore +
                '}';
    }
}
