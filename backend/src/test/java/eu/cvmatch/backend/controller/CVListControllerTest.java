package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.CV;
import eu.cvmatch.backend.service.FirebaseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class CVListControllerTest {

    @Mock
    private FirebaseService firebaseService;

    @InjectMocks
    private CVListController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void listUserCVs_success() throws Exception {
        CV cv = new CV();
        cv.setId("cv1");
        cv.setUserId("user123");
        cv.setFileName("john_smith_cv.pdf");

        when(firebaseService.getCVsForUser("user123"))
                .thenReturn(List.of(cv));

        mockMvc.perform(get("/cvs/user/user123")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("cv1"))
                .andExpect(jsonPath("$[0].userId").value("user123"))
                .andExpect(jsonPath("$[0].fileName").value("john_smith_cv.pdf"));
    }

    @Test
    void listUserCVs_failure() throws Exception {
        when(firebaseService.getCVsForUser("user123"))
                .thenThrow(new RuntimeException("db down"));

        mockMvc.perform(get("/cvs/user/user123")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$").isEmpty());
    }
}
