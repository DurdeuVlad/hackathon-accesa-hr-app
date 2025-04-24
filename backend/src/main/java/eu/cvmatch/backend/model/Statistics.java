// Statistics.java
package eu.cvmatch.backend.model;

import java.util.List;
import java.util.Map;

public class Statistics {
    private long totalUsers;
    private Map<String, Long> rolesDistribution;

    private long totalCVs;
    private long totalJobs;
    private double avgMatchScore;
    private List<TopJob> topJobsByAvgScore;
    private Map<String, Long> scoreDistribution;
    private AvgScoreComponents avgScoreComponents;


    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Map<String, Long> getRolesDistribution() {
        return rolesDistribution;
    }

    public void setRolesDistribution(Map<String, Long> rolesDistribution) {
        this.rolesDistribution = rolesDistribution;
    }

    public long getTotalCVs() {
        return totalCVs;
    }

    public void setTotalCVs(long totalCVs) {
        this.totalCVs = totalCVs;
    }

    public long getTotalJobs() {
        return totalJobs;
    }

    public void setTotalJobs(long totalJobs) {
        this.totalJobs = totalJobs;
    }

    public double getAvgMatchScore() {
        return avgMatchScore;
    }

    public void setAvgMatchScore(double avgMatchScore) {
        this.avgMatchScore = avgMatchScore;
    }

    public List<TopJob> getTopJobsByAvgScore() {
        return topJobsByAvgScore;
    }

    public void setTopJobsByAvgScore(List<TopJob> topJobsByAvgScore) {
        this.topJobsByAvgScore = topJobsByAvgScore;
    }

    public Map<String, Long> getScoreDistribution() {
        return scoreDistribution;
    }

    public void setScoreDistribution(Map<String, Long> scoreDistribution) {
        this.scoreDistribution = scoreDistribution;
    }

    public AvgScoreComponents getAvgScoreComponents() {
        return avgScoreComponents;
    }

    public void setAvgScoreComponents(AvgScoreComponents avgScoreComponents) {
        this.avgScoreComponents = avgScoreComponents;
    }

    public String toString() {
        return "Statistics{" +
                "totalUsers=" + totalUsers +
                ", rolesDistribution=" + rolesDistribution +
                ", totalCVs=" + totalCVs +
                ", totalJobs=" + totalJobs +
                ", avgMatchScore=" + avgMatchScore +
                ", topJobsByAvgScore=" + topJobsByAvgScore +
                ", scoreDistribution=" + scoreDistribution +
                ", avgScoreComponents=" + avgScoreComponents +
                '}';
    }
}
