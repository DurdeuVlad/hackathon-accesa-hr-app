package eu.cvmatch.backend.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import eu.cvmatch.backend.model.CVMatchResult;
import eu.cvmatch.backend.model.JobPosting;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FirebaseServiceTest {

    private FirebaseService firebaseService;

    @Mock private Firestore mockFirestore;
    @Mock private CollectionReference mockJobsCollection;
    @Mock private CollectionReference mockCvsCollection;
    @Mock private DocumentReference mockJobDocRef;
    @Mock private DocumentReference mockCvDocRef;
    @Mock private CollectionReference mockCvMatches;
    @Mock private CollectionReference mockJobMatches;
    @Mock private ApiFuture<DocumentSnapshot> mockApiFuture;
    @Mock private DocumentSnapshot mockDocumentSnapshot;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        firebaseService = new FirebaseService(mockFirestore);
    }

    @Test
    public void testGetJobById_Success() throws Exception {
        String jobId = "job123";
        JobPosting dummy = new JobPosting();
        dummy.setJobTitle("Test Job");
        when(mockFirestore.collection("jobs")).thenReturn(mockJobsCollection);
        when(mockJobsCollection.document(jobId)).thenReturn(mockJobDocRef);
        when(mockJobDocRef.get()).thenReturn(mockApiFuture);
        when(mockApiFuture.get()).thenReturn(mockDocumentSnapshot);
        when(mockDocumentSnapshot.exists()).thenReturn(true);
        when(mockDocumentSnapshot.toObject(JobPosting.class)).thenReturn(dummy);

        JobPosting result = firebaseService.getJobById(jobId);
        assertNotNull(result);
        assertEquals("Test Job", result.getJobTitle());
    }

    @Test
    public void testGetJobById_NotFound() throws Exception {
        String jobId = "job123";
        when(mockFirestore.collection("jobs")).thenReturn(mockJobsCollection);
        when(mockJobsCollection.document(jobId)).thenReturn(mockJobDocRef);
        when(mockJobDocRef.get()).thenReturn(mockApiFuture);
        when(mockApiFuture.get()).thenReturn(mockDocumentSnapshot);
        when(mockDocumentSnapshot.exists()).thenReturn(false);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> firebaseService.getJobById(jobId)
        );
        assertTrue(ex.getMessage().contains("Job ID not found"));
    }

    @Test
    public void testSaveCVMatch() {
        String jobId = "job123";
        String cvId  = "cv123";
        CVMatchResult result = new CVMatchResult();

        // stub the jobs path
        when(mockFirestore.collection("jobs")).thenReturn(mockJobsCollection);
        when(mockJobsCollection.document(jobId)).thenReturn(mockJobDocRef);
        when(mockJobDocRef.collection("cvMatches")).thenReturn(mockCvMatches);
        // *new*: stub document(cvId) to get a non-null ref
        when(mockCvMatches.document(cvId)).thenReturn(mockCvDocRef);

        firebaseService.saveCVMatch(jobId, cvId, result);

        // verify we wrote to jobs/{jobId}/cvMatches/{cvId}
        verify(mockCvMatches).document(cvId);
        // the map payload should contain exactly cvId ref, score, explanation, createdAt
        ArgumentCaptor<Map<String, Object>> captor = ArgumentCaptor.forClass(Map.class);
        verify(mockCvDocRef).set(captor.capture());

        Map<String, Object> written = captor.getValue();
        assertTrue(written.containsKey("cvId"));
        assertTrue(written.containsKey("score"));
        assertTrue(written.containsKey("explanation"));
        assertTrue(written.containsKey("createdAt"));
    }

    @Test
    public void testSaveJobMatch() {
        String cvId  = "cv123";
        String jobId = "job123";
        CVMatchResult result = new CVMatchResult();

        // stub the cvs path
        when(mockFirestore.collection("cvs")).thenReturn(mockCvsCollection);
        when(mockCvsCollection.document(cvId)).thenReturn(mockCvDocRef);
        when(mockCvDocRef.collection("jobMatches")).thenReturn(mockJobMatches);
        // stub document(jobId)
        when(mockJobMatches.document(jobId)).thenReturn(mockJobDocRef);

        firebaseService.saveJobMatch(cvId, jobId, result);

        verify(mockJobMatches).document(jobId);
        ArgumentCaptor<Map<String, Object>> captor = ArgumentCaptor.forClass(Map.class);
        verify(mockJobDocRef).set(captor.capture());

        Map<String, Object> written = captor.getValue();
        assertTrue(written.containsKey("jobId"));
        assertTrue(written.containsKey("score"));
        assertTrue(written.containsKey("explanation"));
        assertTrue(written.containsKey("createdAt"));
    }
}
