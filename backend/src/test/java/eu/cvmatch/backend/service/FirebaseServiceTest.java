package eu.cvmatch.backend.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import eu.cvmatch.backend.model.JobPosting;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FirebaseServiceTest {

    private FirebaseService firebaseService;

    @Mock
    private Firestore mockFirestore;
    @Mock
    private CollectionReference mockCollection;
    @Mock
    private DocumentReference mockDocRef;
    @Mock
    private ApiFuture<DocumentSnapshot> mockApiFuture;
    @Mock
    private DocumentSnapshot mockDocumentSnapshot;

    @BeforeEach
    public void setup() {
        // Initialize the mocks.
        MockitoAnnotations.openMocks(this);
        // Use the test constructor of FirebaseService to supply the mocked Firestore.
        firebaseService = new FirebaseService(mockFirestore);
    }

    @Test
    public void testGetJobById_Success() throws Exception {
        String jobId = "job123";
        JobPosting dummyJob = new JobPosting();
        dummyJob.setJobTitle("Test Job");
        dummyJob.setIndustry("Tech");
        dummyJob.setDescription("Job description");

        when(mockFirestore.collection("jobs")).thenReturn(mockCollection);
        when(mockCollection.document(jobId)).thenReturn(mockDocRef);
        when(mockDocRef.get()).thenReturn(mockApiFuture);
        when(mockApiFuture.get()).thenReturn(mockDocumentSnapshot);
        when(mockDocumentSnapshot.exists()).thenReturn(true);
        when(mockDocumentSnapshot.toObject(JobPosting.class)).thenReturn(dummyJob);

        JobPosting job = firebaseService.getJobById(jobId);
        assertNotNull(job);
        assertEquals("Test Job", job.getJobTitle());
    }

    @Test
    public void testGetJobById_NotFound() throws Exception {
        String jobId = "job123";

        when(mockFirestore.collection("jobs")).thenReturn(mockCollection);
        when(mockCollection.document(jobId)).thenReturn(mockDocRef);
        when(mockDocRef.get()).thenReturn(mockApiFuture);
        when(mockApiFuture.get()).thenReturn(mockDocumentSnapshot);
        when(mockDocumentSnapshot.exists()).thenReturn(false);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            firebaseService.getJobById(jobId);
        });
        assertTrue(exception.getMessage().contains("Job ID not found"));
    }

    @Test
    public void testSaveCVMatch() {
        String jobId = "job123";
        // Create a dummy CVMatchResult instance.
        var result = new eu.cvmatch.backend.model.CVMatchResult();

        when(mockFirestore.collection("jobs")).thenReturn(mockCollection);
        when(mockCollection.document(jobId)).thenReturn(mockDocRef);
        CollectionReference mockCvMatches = mock(CollectionReference.class);
        when(mockDocRef.collection("cvMatches")).thenReturn(mockCvMatches);

        firebaseService.saveCVMatch(jobId, result);
        verify(mockCvMatches).add(result);
    }
}
