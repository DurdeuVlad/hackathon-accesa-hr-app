package eu.cvmatch.backend.model;

import java.util.List;

public class CV {
    private String id;
    private String userId;
    private String fileName;
    private String contentText;
    private String uploadedAt;       // ISO-8601 timestamp string
    private List<String> industryTags;
    private List<String> techSkills;

    public CV() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getContentText() { return contentText; }
    public void setContentText(String contentText) { this.contentText = contentText; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }

    public List<String> getIndustryTags() { return industryTags; }
    public void setIndustryTags(List<String> industryTags) { this.industryTags = industryTags; }

    public List<String> getTechSkills() { return techSkills; }
    public void setTechSkills(List<String> techSkills) { this.techSkills = techSkills; }
}
