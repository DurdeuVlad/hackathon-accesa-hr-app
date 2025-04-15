package eu.cvmatch.backend.config;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class FirebaseConfigTest {

    @Test
    public void testFirebaseConfig() {
        FirebaseConfig firebaseConfig = new FirebaseConfig();
        assertNotNull(firebaseConfig);
    }

}
