package eu.cvmatch.backend.service;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FieldValue;
import com.google.firebase.cloud.FirestoreClient;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class FirebaseService {

    private final Firestore db;

    // Default production constructor.
    public FirebaseService() {
        this(FirestoreClient.getFirestore());
    }

    // Constructor for testing that accepts a Firestore instance.
    FirebaseService(Firestore db) {
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
}
