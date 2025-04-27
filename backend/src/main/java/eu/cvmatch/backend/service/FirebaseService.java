package eu.cvmatch.backend.service;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.database.GenericTypeIndicator;
import eu.cvmatch.backend.model.CV;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.stereotype.Service;

import java.util.*;

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

    public List<JobPosting> getAllJobs() throws Exception {
        var querySnapshot = db.collection("jobs").get().get();
        List<JobPosting> jobs = new ArrayList<>();

        for (var doc : querySnapshot.getDocuments()) {
            jobs.add(doc.toObject(JobPosting.class));
        }

        return jobs;
    }

    public List<CV> getAllCVs() throws Exception {
        var querySnapshot = db.collection("cvs").get().get();
        List<CV> cvs = new ArrayList<>();

        for (var doc : querySnapshot.getDocuments()) {
            cvs.add(doc.toObject(CV.class));
        }

        return cvs;
    }

    public String saveJob(JobPosting job) {
        String jobId = UUID.randomUUID().toString();

        Map<String, Object> data = new HashMap<>();
        data.put("jobTitle", job.getTitle());
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

    public String saveCV(CV cv) {
        String cvId = cv.getId();
        if (cvId == null || cvId.isBlank()) {
            cvId = UUID.randomUUID().toString();
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
}
