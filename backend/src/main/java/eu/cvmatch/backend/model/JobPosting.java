package eu.cvmatch.backend.model;

import java.util.List;

public class JobPosting {
    private String jobTitle;
    private String industry;
    private String description;
    private List<TechnicalSkill> technicalSkills;

    public static class TechnicalSkill {
        private String skill;
        private int weight;

        // Getters and setters
        public String getSkill() { return skill; }
        public void setSkill(String skill) { this.skill = skill; }

        public int getWeight() { return weight; }
        public void setWeight(int weight) { this.weight = weight; }
    }

    // Getters and setters
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<TechnicalSkill> getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(List<TechnicalSkill> technicalSkills) { this.technicalSkills = technicalSkills; }
}
