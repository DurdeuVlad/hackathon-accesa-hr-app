package eu.cvmatch.backend.test;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.InputStream;
import java.util.*;

public class FirestoreSeederTest {

    @BeforeAll
    public static void initFirebase() throws Exception {
        // Only initialize the FirebaseApp if not already initialized.
        if (FirebaseApp.getApps().isEmpty()) {
            // Use the real firebase key from the path "firebase/serviceAccountKey.json"
            try (InputStream serviceAccount = FirestoreSeederTest.class
                    .getClassLoader().getResourceAsStream("firebase/serviceAccountKey.json")) {
                if (serviceAccount == null) {
                    throw new IllegalStateException("Service account key file not found at firebase/serviceAccountKey.json");
                }
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();
                FirebaseApp.initializeApp(options);
                System.out.println("✅ Firebase initialized for testing.");
            }
        }
    }

    @Test
    public void testFirestoreSeeding() throws Exception {
        // Get the Firestore instance from the initialized FirebaseApp.
        Firestore db = FirestoreClient.getFirestore();

        // --- Create a user document ---
        String userId = "user_1";
        Map<String, Object> userData = new HashMap<>();
        userData.put("email", "user1@example.com");
        userData.put("role", "admin");
        userData.put("createdAt", Timestamp.now());
        ApiFuture<WriteResult> future = db.collection("users").document(userId).set(userData);
        System.out.println("User created at: " + future.get().getUpdateTime());

        // Reference to the user document
        DocumentReference userRef = db.collection("users").document(userId);

        // --- Create a CV document ---
        String cvId = "cv_1";
        Map<String, Object> cvData = new HashMap<>();
        cvData.put("userId", userRef); // storing a reference to the user
        cvData.put("fileName", "john_smith_cv.pdf");
        cvData.put("contentText", "This is the parsed content of John Smith's CV.");
        cvData.put("uploadedAt", Timestamp.now());
        cvData.put("industryTags", Arrays.asList("banking", "finance"));
        cvData.put("techSkills", Arrays.asList("Java", "Spring"));
        future = db.collection("cvs").document(cvId).set(cvData);
        System.out.println("CV created at: " + future.get().getUpdateTime());

        // --- Create a Job document ---
        String jobId = "job_1";
        Map<String, Object> jobData = new HashMap<>();
        jobData.put("userId", userRef); // reference to the user who entered the job
        jobData.put("title", "React Developer");
        jobData.put("industry", "banking");
        jobData.put("description", "We need someone with React + banking experience.");
        // Map for skill weights as described in your structure
        Map<String, Object> skillWeights = new HashMap<>();
        skillWeights.put("React", 40);
        skillWeights.put("JavaScript", 30);
        skillWeights.put("CSS", 30);
        jobData.put("skillWeights", skillWeights);
        future = db.collection("jobs").document(jobId).set(jobData);
        System.out.println("Job created at: " + future.get().getUpdateTime());

        // --- Create a cvMatches subcollection under the job document ---
        String cvMatchId = "match_cv_1";
        Map<String, Object> cvMatchData = new HashMap<>();
        cvMatchData.put("cvId", db.collection("cvs").document(cvId)); // reference to the CV document
        cvMatchData.put("score", 84.2);
        cvMatchData.put("explanation", "Strong React + banking background.");
        cvMatchData.put("createdAt", Timestamp.now());
        future = db.collection("jobs").document(jobId)
                .collection("cvMatches").document(cvMatchId).set(cvMatchData);
        System.out.println("CV Match created at: " + future.get().getUpdateTime());

        // --- Create a jobMatches subcollection under the CV document ---
        String jobMatchId = "match_job_1";
        Map<String, Object> jobMatchData = new HashMap<>();
        jobMatchData.put("jobId", db.collection("jobs").document(jobId)); // reference to the Job document
        jobMatchData.put("score", 91.3);
        jobMatchData.put("explanation", "High match on domain + skills.");
        jobMatchData.put("createdAt", Timestamp.now());
        future = db.collection("cvs").document(cvId)
                .collection("jobMatches").document(jobMatchId).set(jobMatchData);
        System.out.println("Job Match created at: " + future.get().getUpdateTime());

        // --- Create a document in the matchesStats collection ---
        String statId = "stat_1";
        Map<String, Object> statData = new HashMap<>();
        statData.put("jobId", db.collection("jobs").document(jobId)); // reference to the Job document

        // Create a list of top CVs with score
        List<Map<String, Object>> topCVs = new ArrayList<>();
        Map<String, Object> topCV1 = new HashMap<>();
        topCV1.put("cvId", cvId);
        topCV1.put("score", 90);
        topCVs.add(topCV1);
        statData.put("topCVs", topCVs);
        statData.put("averageScore", 74.2);
        statData.put("computedAt", Timestamp.now());
        future = db.collection("matchesStats").document(statId).set(statData);
        System.out.println("Matches Stats created at: " + future.get().getUpdateTime());
    }
}
