package eu.cvmatch.backend.dto;

import eu.cvmatch.backend.model.JobPosting;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Data Transfer Object for JobPosting to avoid serialization issues with Firebase objects
 */
public class JobPostingDTO {
    private String id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("industry")
    private String industry;

    @JsonProperty("description")
    private String description;

    @JsonProperty("company")
    private String company;

    @JsonProperty("location")
    private String location;

    @JsonProperty("technicalSkills")
    private List<TechnicalSkillDTO> technicalSkills;

    @JsonProperty("userId")
    private String userId;

    @JsonProperty("createdAt")
    private Date createdAt;


    @JsonProperty("updatedAt")
    private Date updatedAt;

    @JsonProperty("applicants")
    private int applicants;

    public static class TechnicalSkillDTO {
        @JsonProperty("skill")
        private String skill;

        @JsonProperty("weight")
        private int weight;

        // Default constructor for Jackson
        public TechnicalSkillDTO() {}

        public TechnicalSkillDTO(JobPosting.TechnicalSkill skill) {
            if (skill != null) {
                this.skill = skill.getSkill();
                this.weight = skill.getWeight();
            }
        }

        // Getters and setters
        public String getSkill() { return skill; }
        public void setSkill(String skill) { this.skill = skill; }

        public int getWeight() { return weight; }
        public void setWeight(int weight) { this.weight = weight; }
    }

    // Default constructor for Jackson
    public JobPostingDTO() {}

    /**
     * Create a DTO from a JobPosting model
     */
    public JobPostingDTO(JobPosting jobPosting) {
        if (jobPosting != null) {
            this.id = jobPosting.getId();
            this.title = jobPosting.getJobTitle();
            this.industry = jobPosting.getIndustry();
            this.description = jobPosting.getDescription();
            this.company = jobPosting.getCompany();
            this.location = jobPosting.getLocation();
            this.userId = jobPosting.getUserId(); // This will get the ID from the reference
            this.createdAt = jobPosting.getCreatedAt();
            this.updatedAt = jobPosting.getUpdatedAt();
            this.applicants = jobPosting.getApplicants();

            // Convert technical skills
            if (jobPosting.getTechnicalSkills() != null) {
                this.technicalSkills = jobPosting.getTechnicalSkills().stream()
                    .map(TechnicalSkillDTO::new)
                    .collect(Collectors.toList());
            }
        }
    }

    /**
     * Convert back to JobPosting model
     */
    public JobPosting toJobPosting() {
        JobPosting job = new JobPosting();
        job.setId(this.id);
        job.setJobTitle(this.title);
        job.setIndustry(this.industry);
        job.setDescription(this.description);
        job.setCompany(this.company);
        job.setLocation(this.location);
        job.setUserId(this.userId);
        job.setCreatedAt(this.createdAt);
        job.setUpdatedAt(this.updatedAt);
        job.setApplicants(this.applicants);

        // Convert technical skills back
        if (this.technicalSkills != null) {
            List<JobPosting.TechnicalSkill> skills = this.technicalSkills.stream()
                .map(skillDTO -> {
                    JobPosting.TechnicalSkill skill = new JobPosting.TechnicalSkill();
                    skill.setSkill(skillDTO.getSkill());
                    skill.setWeight(skillDTO.getWeight());
                    return skill;
                })
                .collect(Collectors.toList());
            job.setTechnicalSkills(skills);
        }

        return job;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getJobTitle() { return title; }
    public void setJobTitle(String title) { this.title = title; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public List<TechnicalSkillDTO> getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(List<TechnicalSkillDTO> technicalSkills) { this.technicalSkills = technicalSkills; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public int getApplicants() { return applicants; }
    public void setApplicants(int applicants) { this.applicants = applicants; }
}