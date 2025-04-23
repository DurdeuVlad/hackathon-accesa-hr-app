package eu.cvmatch.backend.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.database.GenericTypeIndicator;
import eu.cvmatch.backend.model.CV;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class FirebaseServiceTest {

    @Mock Firestore mockDb;
    @Mock CollectionReference mockCvs;
    @Mock Query mockQuery;
    @Mock ApiFuture<QuerySnapshot> mockFuture;
    @Mock QuerySnapshot mockSnapshot;
    @Mock QueryDocumentSnapshot mockDoc;
    @Mock DocumentReference mockUserRef;

    private FirebaseService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        service = new FirebaseService(mockDb);

        // 1) stub the user reference lookup
        when(mockDb.document("users/user123")).thenReturn(mockUserRef);

        // 2) stub collection and query
        when(mockDb.collection("cvs")).thenReturn(mockCvs);
        when(mockCvs.whereEqualTo("userId", mockUserRef))
                .thenReturn(mockQuery);

        // 3) stub the async get
        when(mockQuery.get()).thenReturn(mockFuture);
    }

    @Test
    void getCVsForUser_happyPath() throws Exception {
        // arrange: QuerySnapshot and DocumentSnapshot
        when(mockFuture.get()).thenReturn(mockSnapshot);
        when(mockSnapshot.getDocuments()).thenReturn(List.of(mockDoc));

        // stub doc fields
        when(mockDoc.getId()).thenReturn("cv123");
        when(mockUserRef.getId()).thenReturn("user123");
        when(mockDoc.get("userId", DocumentReference.class))
                .thenReturn(mockUserRef);

        when(mockDoc.getString("fileName"))
                .thenReturn("john_smith_cv.pdf");
        when(mockDoc.getString("contentText"))
                .thenReturn("Parsed text…");

        Timestamp ts = Timestamp.ofTimeSecondsAndNanos(1_700_000_000, 0);
        when(mockDoc.getTimestamp("uploadedAt")).thenReturn(ts);

        // lists via GenericTypeIndicator
        @SuppressWarnings("unchecked")
        GenericTypeIndicator<List<String>> listType =
                new GenericTypeIndicator<>() {};
        when(mockDoc.get("industryTags"))
                .thenReturn(List.of("banking", "finance"));
        when(mockDoc.get("techSkills"))
                .thenReturn(List.of("Java", "Spring"));

        // act
        List<CV> cvs = service.getCVsForUser("user123");

        // assert
        assertEquals(1, cvs.size());
        CV cv = cvs.get(0);
        assertEquals("cv123", cv.getId());
        assertEquals("user123", cv.getUserId());
        assertEquals("john_smith_cv.pdf", cv.getFileName());
        assertEquals("Parsed text…", cv.getContentText());
        assertEquals(List.of("banking", "finance"), cv.getIndustryTags());
        assertEquals(List.of("Java", "Spring"), cv.getTechSkills());
        assertNotNull(cv.getUploadedAt());
    }

    @Test
    void getCVsForUser_throwsOnFirestoreError() throws Exception {
        // leave mockQuery.get() → mockFuture as-is from your setUp()
        // now make the future throw when you call future.get()
        when(mockFuture.get())
                .thenThrow(new ExecutionException(new RuntimeException("fail")));

        assertThrows(Exception.class, () ->
                service.getCVsForUser("user123")
        );
    }
}
