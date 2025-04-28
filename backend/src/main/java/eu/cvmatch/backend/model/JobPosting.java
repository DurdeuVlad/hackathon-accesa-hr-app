package eu.cvmatch.backend.model;

import com.google.cloud.firestore.DocumentReference;
import java.util.Comparator;
import java.util.List;
import java.util.StringJoiner;
import java.util.Date;

public class JobPosting {
    private String id;
    private String jobTitle;
    private String industry;
    private String description;
    private String company;
    private String location;
    private List<TechnicalSkill> technicalSkills;
    private DocumentReference userIdRef; // For Firestore DocumentReference format
    private String userId; // For String format
    private Date createdAt;
    private Date updatedAt;
    private int applicants; // Count of CVs matched with this job

    public static class TechnicalSkill {
        private String skill;
        private int weight;

        // Getters and setters
        public String getSkill() { return skill; }
        public void setSkill(String skill) { this.skill = skill; }

        public int getWeight() { return weight; }
        public void setWeight(int weight) { this.weight = weight; }

        @Override
        public String toString() {
            return skill + "(" + weight + "%)";
        }
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public List<TechnicalSkill> getTechnicalSkills() { return technicalSkills; }
    public void setTechnicalSkills(List<TechnicalSkill> technicalSkills) { this.technicalSkills = technicalSkills; }

    public String getUserId() {
        // If we have a DocumentReference, extract the ID
        if (userIdRef != null) {
            return userIdRef.getId();
        }
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    // Getters and setters for DocumentReference userId
    public DocumentReference getUserIdRef() {
        return userIdRef;
    }

    public void setUserIdRef(DocumentReference userIdRef) {
        this.userIdRef = userIdRef;
    }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public int getApplicants() { return applicants; }
    public void setApplicants(int applicants) { this.applicants = applicants; }

    // Field to capture any field that might be in Firestore but not in this model
    private Object skillWeights; // This is to avoid the warning

    public Object getSkillWeights() { return skillWeights; }
    public void setSkillWeights(Object skillWeights) { this.skillWeights = skillWeights; }

    /**
     * Normalizes the technical skills' weights so they sum exactly to 100.
     * Negative weights are clamped to zero. After proportional rounding,
     * any leftover delta is applied to the largest-weight skill.
     */
    public void normalizeTechnicalSkillsScore() {
        if (technicalSkills == null || technicalSkills.isEmpty()) {
            return;
        }

        // 1) Clamp negatives to zero
        technicalSkills.forEach(skill -> {
            if (skill.getWeight() < 0) {
                skill.setWeight(0);
            }
        });

        // 2) First pass: proportional rounding
        int total = technicalSkills.stream()
                .mapToInt(TechnicalSkill::getWeight)
                .sum();
        if (total > 0) {
            for (TechnicalSkill skill : technicalSkills) {
                int w = skill.getWeight();
                skill.setWeight((int) Math.round((double) w / total * 100));
            }
        }

        // 3) Fix any rounding drift by adjusting the largest-weight skill
        total = technicalSkills.stream()
                .mapToInt(TechnicalSkill::getWeight)
                .sum();
        if (total != 100) {
            int delta = 100 - total;
            TechnicalSkill top = technicalSkills.stream()
                    .max(Comparator.comparingInt(TechnicalSkill::getWeight))
                    .orElseThrow();  // safe because we checked non-empty
            top.setWeight(top.getWeight() + delta);
        }
    }

    @Override
    public String toString() {
        StringJoiner sj = new StringJoiner(", ", "JobPosting[", "]");
        sj.add("id=" + id);
        sj.add("jobTitle=" + jobTitle);
        sj.add("industry=" + industry);
        sj.add("company=" + company);
        sj.add("description=" + (description != null && description.length() > 50
                ? description.substring(0, 47) + "..."
                : description));
        if (technicalSkills != null && !technicalSkills.isEmpty()) {
            sj.add("technicalSkills=" + technicalSkills);
        } else {
            sj.add("technicalSkills=[]");
        }
        return sj.toString();
    }
}