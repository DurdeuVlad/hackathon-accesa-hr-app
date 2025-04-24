package eu.cvmatch.backend.service;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import eu.cvmatch.backend.model.MatchDetails;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.springframework.stereotype.Service;

@Service
public class MatchDetailsService {

    private final Firestore firebase;
    private final FirebaseService firebaseService;

    public MatchDetailsService(Firestore firebase, FirebaseService firebaseService) {
        this.firebase = firebase;
        this.firebaseService = firebaseService;
    }

    public MatchDetails getMatchDetails(String jobId, String cvId) throws Exception {
        // Fetch the job posting details
        JobPosting job = firebaseService.getJobById(jobId);
        if (job == null) {
            return null;
        }

        // Fetch the CV match details from the cvMatches subcollection
        DocumentSnapshot matchDoc = firebase.collection("jobs")
                .document(jobId)
                .collection("cvMatches")
                .document(cvId)
                .get()
                .get();

        if (!matchDoc.exists()) {
            return null;
        }

        // Convert the document data to a CVMatchResult object
        CVMatchResult cvMatch = new CVMatchResult();
        cvMatch.setFileName(cvId);
        cvMatch.setScore(matchDoc.getDouble("score"));
        cvMatch.setIndustryScore(matchDoc.getDouble("industryScore"));
        cvMatch.setTechScore(matchDoc.getDouble("techScore"));
        cvMatch.setJdScore(matchDoc.getDouble("jdScore"));
        cvMatch.setExplanation(matchDoc.getString("explanation"));

        // Timestamp is stored as a Firestore timestamp, convert to ISO string
        if (matchDoc.getTimestamp("createdAt") != null) {
            cvMatch.setUploadedAt(matchDoc.getTimestamp("createdAt").toDate().toInstant().toString());
        }

        // Combine the job and CV match data into a DTO
        return new MatchDetails(job, cvMatch);
    }
}