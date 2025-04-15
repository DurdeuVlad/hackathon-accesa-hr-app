package eu.cvmatch.backend.service;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.stereotype.Service;

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
        var future = docRef.get();
        var snapshot = future.get();

        if (!snapshot.exists()) {
            throw new IllegalArgumentException("Job ID not found: " + jobId);
        }

        return snapshot.toObject(JobPosting.class);
    }

    public void saveCVMatch(String jobId, CVMatchResult result) {
        var matches = db.collection("jobs")
                .document(jobId)
                .collection("cvMatches");

        matches.add(result);
    }
}
