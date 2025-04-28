package eu.cvmatch.backend.service;

import com.google.cloud.firestore.*;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class JobPostingService {

    private final Firestore db;
    private final FirebaseService firebaseService;

    public JobPostingService(Firestore db, FirebaseService firebaseService) {
        this.db = db;
        this.firebaseService = firebaseService;
    }

    /**
     * Retrieves all job postings in the system
     */
    public List<JobPosting> getAllJobs() {
        return firebaseService.getAllJobs();
    }

    /**
     * Retrieves all job postings created by a specific user
     * This method tries a custom approach to handle document references
     */
    public List<JobPosting> getJobsForUser(String userId) {
        return firebaseService.getJobsForUser(userId);
    }

    /**
     * Gets a job posting by its ID
     */
    public JobPosting getJobById(String jobId) throws ExecutionException, InterruptedException {
        return firebaseService.getJobByJobId(jobId);
    }

    /**
     * Creates a new job posting
     */
    public String saveJob(JobPosting job) throws ExecutionException, InterruptedException {
        try {
            // Generate an ID if not provided
            String jobId = job.getId();
            if (jobId == null || jobId.isBlank()) {
                jobId = UUID.randomUUID().toString();
            }

            Map<String, Object> data = convertToMap(job);

            // If userId is provided as a string, convert it to a document reference
            if (job.getUserId() != null && !job.getUserId().isEmpty()) {
                data.put("userId", db.document("users/" + job.getUserId()));
            } else if (job.getUserIdRef() != null) {
                // If already a DocumentReference, use it directly
                data.put("userId", job.getUserIdRef());
            }

            // Add server timestamp
            data.put("createdAt", FieldValue.serverTimestamp());

            // Set the document in Firestore
            db.collection("jobs").document(jobId).set(data).get();

            return jobId;
        } catch (Exception e) {
            System.err.println("Error saving job: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    /**
     * Updates an existing job posting
     */
    public void updateJob(String jobId, JobPosting job) throws ExecutionException, InterruptedException {
        // Verify the job exists first
        DocumentSnapshot doc = db.collection("jobs").document(jobId).get().get();
        if (!doc.exists()) {
            throw new IllegalArgumentException("Job with ID " + jobId + " not found");
        }

        // Convert to map of fields to update
        Map<String, Object> updates = convertToMap(job);

        // If userId is provided as a string, convert it to a document reference
        if (job.getUserId() != null && !job.getUserId().isEmpty()) {
            updates.put("userId", db.document("users/" + job.getUserId()));
        }

        // Add updatedAt timestamp
        updates.put("updatedAt", FieldValue.serverTimestamp());

        // Update the document
        db.collection("jobs").document(jobId).update(updates).get();
    }

    /**
     * Deletes a job posting
     */
    public void deleteJob(String jobId) throws ExecutionException, InterruptedException {
        // Verify the job exists first
        DocumentSnapshot doc = db.collection("jobs").document(jobId).get().get();
        if (!doc.exists()) {
            throw new IllegalArgumentException("Job with ID " + jobId + " not found");
        }

        // Delete the document
        db.collection("jobs").document(jobId).delete().get();
    }

    /**
     * Helper method to convert a JobPosting object to a Map for Firestore
     */
    private Map<String, Object> convertToMap(JobPosting job) {
        Map<String, Object> data = new HashMap<>();

        if (job.getJobTitle() != null) data.put("jobTitle", job.getJobTitle());
        if (job.getIndustry() != null) data.put("industry", job.getIndustry());
        if (job.getDescription() != null) data.put("description", job.getDescription());
        if (job.getCompany() != null) data.put("company", job.getCompany());
        if (job.getLocation() != null) data.put("location", job.getLocation());
        if (job.getTechnicalSkills() != null) data.put("technicalSkills", job.getTechnicalSkills());

        // Don't include userId or userIdRef directly - this is handled in the calling method

        return data;
    }
}