package eu.cvmatch.backend.service;

import com.google.cloud.firestore.*;
import com.google.firebase.database.GenericTypeIndicator;
import eu.cvmatch.backend.model.CV;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseService {

    private final Firestore db;

    public FirebaseService(Firestore db) {
        this.db = db;
    }

    public JobPosting getJobById(String jobId) throws Exception {
        var docRef = db.collection("jobs").document(jobId);
        var snapshot = docRef.get().get();

        if (!snapshot.exists()) {
            throw new IllegalArgumentException("Job ID not found: " + jobId);
        }

        return snapshot.toObject(JobPosting.class);
    }

    public List<JobPosting> getAllJobs() {
        try {
            List<JobPosting> jobs = new ArrayList<>();

            // Fetch all jobs from the collection
            QuerySnapshot allJobs = db.collection("jobs").get().get();
            System.out.println("Total jobs in database: " + allJobs.size());

            // Process each document with manual conversion
            for (DocumentSnapshot document : allJobs.getDocuments()) {
                try {
                    // Get the job ID
                    String jobId = document.getId();

                    // Manually build the JobPosting object
                    JobPosting job = new JobPosting();
                    job.setId(jobId);
                    job.setJobTitle(document.getString("jobTitle"));
                    job.setIndustry(document.getString("industry"));
                    job.setCompany(document.getString("company"));
                    job.setLocation(document.getString("location"));
                    job.setDescription(document.getString("description"));

                    // Handle userId which could be a DocumentReference or String
                    Object docUserId = document.get("userId");
                    if (docUserId instanceof DocumentReference) {
                        DocumentReference userDocRef = (DocumentReference) docUserId;
                        job.setUserIdRef(userDocRef);
                        job.setUserId(userDocRef.getId());
                    } else if (docUserId instanceof String) {
                        job.setUserId((String) docUserId);
                    }

                    // Handle date fields
                    if (document.getDate("createdAt") != null) {
                        job.setCreatedAt(document.getDate("createdAt"));
                    }
                    if (document.getDate("updatedAt") != null) {
                        job.setUpdatedAt(document.getDate("updatedAt"));
                    }

                    // Handle applicants count
                    Object applicantsObj = document.get("applicants");
                    if (applicantsObj instanceof Number) {
                        job.setApplicants(((Number) applicantsObj).intValue());
                    } else if (applicantsObj instanceof String) {
                        try {
                            job.setApplicants(Integer.parseInt((String) applicantsObj));
                        } catch (NumberFormatException e) {
                            job.setApplicants(0);
                        }
                    }

                    // Handle technical skills
                    Object skillsObject = document.get("technicalSkills");
                    List<JobPosting.TechnicalSkill> skills = new ArrayList<>();

                    if (skillsObject instanceof Map) {
                        // Handle as map of skill -> weight
                        Map<String, Object> skillsMap = (Map<String, Object>) skillsObject;
                        for (Map.Entry<String, Object> entry : skillsMap.entrySet()) {
                            JobPosting.TechnicalSkill skill = new JobPosting.TechnicalSkill();
                            skill.setSkill(entry.getKey());

                            // Handle weight which could be Long, Integer, etc.
                            Object weightObj = entry.getValue();
                            if (weightObj instanceof Number) {
                                skill.setWeight(((Number) weightObj).intValue());
                            } else if (weightObj instanceof String) {
                                try {
                                    skill.setWeight(Integer.parseInt((String) weightObj));
                                } catch (NumberFormatException e) {
                                    skill.setWeight(0);
                                }
                            }

                            skills.add(skill);
                        }
                    } else if (skillsObject instanceof List) {
                        // Handle as list of skill objects
                        List<Map<String, Object>> skillsList = (List<Map<String, Object>>) skillsObject;
                        for (Map<String, Object> skillMap : skillsList) {
                            JobPosting.TechnicalSkill skill = new JobPosting.TechnicalSkill();

                            Object skillName = skillMap.get("skill");
                            if (skillName != null) {
                                skill.setSkill(skillName.toString());
                            }

                            Object weight = skillMap.get("weight");
                            if (weight instanceof Number) {
                                skill.setWeight(((Number) weight).intValue());
                            } else if (weight instanceof String) {
                                try {
                                    skill.setWeight(Integer.parseInt((String) weight));
                                } catch (NumberFormatException e) {
                                    skill.setWeight(0);
                                }
                            }

                            skills.add(skill);
                        }
                    }

                    job.setTechnicalSkills(skills);
                    jobs.add(job);

                } catch (Exception e) {
                    System.err.println("Error processing document " + document.getId() + ": " + e.getMessage());
                }
            }

            return jobs;
        } catch (Exception e) {
            System.err.println("Error in getAllJobs: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * Retrieves all job postings created by a specific user
     * This method tries a custom approach to handle document references
     */
    public List<JobPosting> getJobsForUser(String userId) {
        try {
            List<JobPosting> jobs = new ArrayList<>();
            DocumentReference userRef = db.document("users/" + userId);

            System.out.println("Looking for jobs with userId: " + userId);

            // Try directly fetching the jobs collection
            QuerySnapshot allJobs = db.collection("jobs").get().get();
            System.out.println("Total jobs in database: " + allJobs.size());

            // Use a custom approach to extract data and manually build JobPosting objects
            for (DocumentSnapshot document : allJobs.getDocuments()) {
                try {
                    // Get the job ID
                    String jobId = document.getId();

                    // Get userId from document (DocumentReference or String)
                    Object docUserId = document.get("userId");
                    String docUserIdStr = null;

                    if (docUserId instanceof DocumentReference) {
                        DocumentReference userDocRef = (DocumentReference) docUserId;
                        docUserIdStr = userDocRef.getId();

                        // Log for debugging
                        System.out.println("Document " + jobId + " has userId reference: " + docUserIdStr);

                        // Check if this document belongs to the user we're looking for
                        if (userId.equals(docUserIdStr)) {
                            // Manually build the JobPosting object
                            JobPosting job = new JobPosting();
                            job.setId(jobId);
                            job.setJobTitle(document.getString("jobTitle"));
                            job.setIndustry(document.getString("industry"));
                            job.setCompany(document.getString("company"));
                            job.setLocation(document.getString("location"));
                            job.setDescription(document.getString("description"));
                            job.setUserIdRef((DocumentReference) docUserId);

                            // Handle date fields
                            if (document.getDate("createdAt") != null) {
                                job.setCreatedAt(document.getDate("createdAt"));
                            }
                            if (document.getDate("updatedAt") != null) {
                                job.setUpdatedAt(document.getDate("updatedAt"));
                            }

                            // Handle applicants count
                            Object applicantsObj = document.get("applicants");
                            if (applicantsObj instanceof Number) {
                                job.setApplicants(((Number) applicantsObj).intValue());
                            } else if (applicantsObj instanceof String) {
                                try {
                                    job.setApplicants(Integer.parseInt((String) applicantsObj));
                                } catch (NumberFormatException e) {
                                    // Default to 0 if cannot parse
                                    job.setApplicants(0);
                                }
                            }

                            // Handle technical skills which could be a List or a Map
                            Object skillsObject = document.get("technicalSkills");
                            List<JobPosting.TechnicalSkill> skills = new ArrayList<>();

                            if (skillsObject instanceof Map) {
                                // Handle as map of skill -> weight
                                Map<String, Object> skillsMap = (Map<String, Object>) skillsObject;
                                for (Map.Entry<String, Object> entry : skillsMap.entrySet()) {
                                    JobPosting.TechnicalSkill skill = new JobPosting.TechnicalSkill();
                                    skill.setSkill(entry.getKey());

                                    // Handle weight which could be Long, Integer, etc.
                                    Object weightObj = entry.getValue();
                                    if (weightObj instanceof Number) {
                                        skill.setWeight(((Number) weightObj).intValue());
                                    } else if (weightObj instanceof String) {
                                        try {
                                            skill.setWeight(Integer.parseInt((String) weightObj));
                                        } catch (NumberFormatException e) {
                                            skill.setWeight(0);
                                        }
                                    }

                                    skills.add(skill);
                                }
                            }

                            job.setTechnicalSkills(skills);

                            jobs.add(job);
                        }
                    } else {
                        System.out.println("Document " + jobId + " has userId (non-reference): " + docUserId);
                    }
                } catch (Exception e) {
                    System.err.println("Error processing document " + document.getId() + ": " + e.getMessage());
                }
            }

            return jobs;
        } catch (Exception e) {
            System.err.println("Error in getJobsForUser: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * Gets a job posting by its ID
     */
    public JobPosting getJobByJobId(String jobId) throws ExecutionException, InterruptedException {
        try {
            DocumentSnapshot document = db.collection("jobs").document(jobId).get().get();

            if (!document.exists()) {
                return null;
            }

            // Since we can't use document.toObject due to serialization issues,
            // we'll manually construct the JobPosting object
            JobPosting job = new JobPosting();
            job.setId(document.getId());
            job.setJobTitle(document.getString("jobTitle"));
            job.setIndustry(document.getString("industry"));
            job.setCompany(document.getString("company"));
            job.setLocation(document.getString("location"));
            job.setDescription(document.getString("description"));

            // Handle userId (could be DocumentReference or String)
            Object docUserId = document.get("userId");
            if (docUserId instanceof DocumentReference) {
                DocumentReference userDocRef = (DocumentReference) docUserId;
                job.setUserIdRef(userDocRef);
                job.setUserId(userDocRef.getId());
            } else if (docUserId instanceof String) {
                job.setUserId((String) docUserId);
            }

            // Handle date fields
            if (document.getDate("createdAt") != null) {
                job.setCreatedAt(document.getDate("createdAt"));
            }
            if (document.getDate("updatedAt") != null) {
                job.setUpdatedAt(document.getDate("updatedAt"));
            }

            // Handle technical skills which could be a List or a Map
            Object skillsObject = document.get("technicalSkills");
            List<JobPosting.TechnicalSkill> skills = new ArrayList<>();

            if (skillsObject instanceof Map) {
                // Handle as map of skill -> weight
                Map<String, Object> skillsMap = (Map<String, Object>) skillsObject;
                for (Map.Entry<String, Object> entry : skillsMap.entrySet()) {
                    JobPosting.TechnicalSkill skill = new JobPosting.TechnicalSkill();
                    skill.setSkill(entry.getKey());

                    // Handle weight which could be Long, Integer, etc.
                    Object weightObj = entry.getValue();
                    if (weightObj instanceof Number) {
                        skill.setWeight(((Number) weightObj).intValue());
                    } else if (weightObj instanceof String) {
                        try {
                            skill.setWeight(Integer.parseInt((String) weightObj));
                        } catch (NumberFormatException e) {
                            skill.setWeight(0);
                        }
                    }

                    skills.add(skill);
                }
            }

            job.setTechnicalSkills(skills);

            return job;
        } catch (Exception e) {
            System.err.println("Error in getJobById: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<CV> getAllCVs() {
        try {
            QuerySnapshot querySnapshot = db.collection("cvs").get().get();
            List<CV> cvs = new ArrayList<>();

            for (DocumentSnapshot doc : querySnapshot.getDocuments()) {
                try {
                    // Manually construct CV object to handle DocumentReferences properly
                    CV cv = new CV();
                    cv.setId(doc.getId());
                    cv.setFileName(doc.getString("fileName"));
                    cv.setContentText(doc.getString("contentText"));

                    // Handle userId which could be a DocumentReference
                    Object userIdObj = doc.get("userId");
                    if (userIdObj instanceof DocumentReference) {
                        DocumentReference userRef = (DocumentReference) userIdObj;
                        cv.setUserId(userRef.getId());
                    } else if (userIdObj instanceof String) {
                        cv.setUserId((String) userIdObj);
                    }

                    // Handle uploadedAt timestamp
                    if (doc.getTimestamp("uploadedAt") != null) {
                        cv.setUploadedAt(doc.getTimestamp("uploadedAt").toDate().toInstant().toString());
                    }

                    // Handle array fields
                    List<String> industryTags = (List<String>) doc.get("industryTags");
                    cv.setIndustryTags(industryTags != null ? industryTags : List.of());

                    List<String> techSkills = (List<String>) doc.get("techSkills");
                    cv.setTechSkills(techSkills != null ? techSkills : List.of());

                    cvs.add(cv);
                } catch (Exception e) {
                    System.err.println("Error processing CV document " + doc.getId() + ": " + e.getMessage());
                }
            }

            return cvs;
        } catch (Exception e) {
            System.err.println("Error in getAllCVs: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public String saveJob(JobPosting job) {
        String jobId = UUID.randomUUID().toString();

        Map<String, Object> data = new HashMap<>();
        data.put("jobTitle", job.getJobTitle());
        data.put("industry", job.getIndustry());
        data.put("description", job.getDescription());
        data.put("technicalSkills", job.getTechnicalSkills());
        data.put("createdAt", FieldValue.serverTimestamp());

        // Save to Firestore
        db.collection("jobs").document(jobId).set(data);

        return jobId;
    }

    /**
     * Save a CV match under jobs/{jobId}/cvMatches/{cvId}
     * according to the exact Firestore structure:
     *  - cvId: reference to /cvs/{cvId}
     *  - score, explanation, createdAt
     */
    public void saveCVMatch(String jobId, String cvId, CVMatchResult result) {
        DocumentReference docRef = db.collection("jobs")
                .document(jobId)
                .collection("cvMatches")
                .document(cvId);

        Map<String, Object> data = new HashMap<>();
        data.put("cvId", db.document("cvs/" + cvId));
        data.put("score", result.getScore());
        data.put("industryScore", result.getIndustryScore()); // ← new
        data.put("techScore",     result.getTechScore());     // ← new
        data.put("jdScore",       result.getJdScore());       // ← new
        data.put("explanation", result.getExplanation());
        data.put("createdAt", FieldValue.serverTimestamp());

        docRef.set(data);
    }

    /**
     * Save a job match under cvs/{cvId}/jobMatches/{jobId}
     * according to the exact Firestore structure:
     *  - jobId: reference to /jobs/{jobId}
     *  - score, explanation, createdAt
     */
    public void saveJobMatch(String cvId, String jobId, CVMatchResult result) {
        DocumentReference docRef = db.collection("cvs")
                .document(cvId)
                .collection("jobMatches")
                .document(jobId);

        Map<String, Object> data = new HashMap<>();
        data.put("jobId", db.document("jobs/" + jobId));
        data.put("score", result.getScore());
        data.put("explanation", result.getExplanation());
        data.put("createdAt", FieldValue.serverTimestamp());

        docRef.set(data);
    }


    /**
     * Fetch all CVs whose userId field is a DocumentReference to /users/{userId}.
     */
    public List<CV> getCVsForUser(String userId) throws Exception {
        // build the /users/{userId} ref for the query filter
        DocumentReference userRef = db.document("users/" + userId);

        QuerySnapshot snap = db.collection("cvs")
                .whereEqualTo("userId", userRef)
                .get()
                .get();

        // GenericTypeIndicator for List<String>
        GenericTypeIndicator<List<String>> stringListType =
                new GenericTypeIndicator<>() {};

        return snap.getDocuments().stream().map(doc -> {
            CV cv = new CV();
            cv.setId(doc.getId());

            DocumentReference storedRef =
                    doc.get("userId", DocumentReference.class);
            cv.setUserId(storedRef != null ? storedRef.getId() : null);

            cv.setFileName(doc.getString("fileName"));
            cv.setContentText(doc.getString("contentText"));

            var ts = doc.getTimestamp("uploadedAt");
            if (ts != null) {
                cv.setUploadedAt(ts.toDate().toInstant().toString());
            }

            // correctly fetch List<String> fields
            List<String> industryTags = (List<String>) doc.get("industryTags");
            cv.setIndustryTags(industryTags != null ? industryTags : List.of());

            List<String> techSkills = (List<String>) doc.get("techSkills");
            cv.setTechSkills(techSkills != null ? techSkills : List.of());

            return cv;
        }).toList();
    }

    public String saveCV(CV cv,String filename) {
        String cvId = cv.getId();
        if (cvId == null || cvId.isBlank()) {
            cvId = extractId(filename);
            cv.setId(cvId);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("fileName", cv.getFileName());
        data.put("contentText", cv.getContentText());
        data.put("uploadedAt", FieldValue.serverTimestamp());

        if (cv.getUserId() != null && !cv.getUserId().isBlank()) {
            data.put("userId", db.document("users/" + cv.getUserId()));
        }

        if (cv.getIndustryTags() != null) {
            data.put("industryTags", cv.getIndustryTags());
        }

        if (cv.getTechSkills() != null) {
            data.put("techSkills", cv.getTechSkills());
        }

        db.collection("cvs").document(cvId).set(data);

        return cvId;
    }
    private static String extractId(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        if (dotIndex != -1) {
            fileName = fileName.substring(0, dotIndex);
        }

        int secondUnderscore = fileName.indexOf('_', fileName.indexOf('_') + 1);
        if (secondUnderscore != -1) {
            return fileName.substring(0, secondUnderscore);
        } else {
            return fileName;
        }
    }

}
