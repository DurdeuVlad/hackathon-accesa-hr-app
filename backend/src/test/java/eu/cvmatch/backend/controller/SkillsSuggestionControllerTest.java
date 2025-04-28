package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.JobPosting;
import eu.cvmatch.backend.service.SkillsSuggestionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class SkillsSuggestionControllerTest {

    @Mock
    private SkillsSuggestionService skillsService;

    @InjectMocks
    private SkillsSuggestionController controller;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void suggestSkills_validJobDescription_returnsSkills() throws Exception {
        // Arrange
        String jobDescription = "We are looking for a Java developer with Spring experience";

        List<JobPosting.TechnicalSkill> mockSkills = new ArrayList<>();

        JobPosting.TechnicalSkill skill1 = new JobPosting.TechnicalSkill();
        skill1.setSkill("Java");
        skill1.setWeight(40);
        mockSkills.add(skill1);

        JobPosting.TechnicalSkill skill2 = new JobPosting.TechnicalSkill();
        skill2.setSkill("Spring");
        skill2.setWeight(30);
        mockSkills.add(skill2);

        JobPosting.TechnicalSkill skill3 = new JobPosting.TechnicalSkill();
        skill3.setSkill("REST APIs");
        skill3.setWeight(20);
        mockSkills.add(skill3);

        JobPosting.TechnicalSkill skill4 = new JobPosting.TechnicalSkill();
        skill4.setSkill("SQL");
        skill4.setWeight(10);
        mockSkills.add(skill4);

        when(skillsService.suggestSkills(anyString())).thenReturn(mockSkills);

        // Act & Assert
        mockMvc.perform(post("/job-skills")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(jobDescription))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(4))
                .andExpect(jsonPath("$[0].skill").value("Java"))
                .andExpect(jsonPath("$[0].weight").value(40))
                .andExpect(jsonPath("$[1].skill").value("Spring"))
                .andExpect(jsonPath("$[1].weight").value(30))
                .andExpect(jsonPath("$[2].skill").value("REST APIs"))
                .andExpect(jsonPath("$[2].weight").value(20))
                .andExpect(jsonPath("$[3].skill").value("SQL"))
                .andExpect(jsonPath("$[3].weight").value(10));
    }

    @Test
    void suggestSkills_emptyJobDescription_returnsBadRequest() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/job-skills")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void suggestSkills_serviceThrowsException_returnsInternalServerError() throws Exception {
        // Arrange
        String jobDescription = "We are looking for a Java developer";

        when(skillsService.suggestSkills(anyString()))
                .thenThrow(new RuntimeException("Service error"));

        // Act & Assert
        mockMvc.perform(post("/job-skills")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(jobDescription))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void suggestSkills_serviceThrowsIllegalArgumentException_returnsBadRequest() throws Exception {
        // Arrange
        String jobDescription = "Too short";

        when(skillsService.suggestSkills(anyString()))
                .thenThrow(new IllegalArgumentException("Invalid input"));

        // Act & Assert
        mockMvc.perform(post("/job-skills")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(jobDescription))
                .andExpect(status().isBadRequest());
    }
}