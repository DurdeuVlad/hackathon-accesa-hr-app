package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.AvgScoreComponents;
import eu.cvmatch.backend.model.Statistics;
import eu.cvmatch.backend.model.TopJob;
import eu.cvmatch.backend.service.StatisticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class StatisticsControllerTest {
    private MockMvc mockMvc;
    @Mock private StatisticsService statisticsService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        StatisticsController controller = new StatisticsController(statisticsService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void testGetStatisticsReturnsJson() throws Exception {
        // prepare test data
        Statistics stats = new Statistics();
        stats.setTotalUsers(5);
        stats.setRolesDistribution(Map.of("user",3L, "admin",2L));
        stats.setTotalCVs(10);
        stats.setTotalJobs(4);
        stats.setAvgMatchScore(77.7);
        stats.setTopJobsByAvgScore(List.of(new TopJob("jobA","TitleA",88.8)));
        stats.setScoreDistribution(Map.of("0-50",2L, "51-75",3L, "76-100",5L));
        stats.setAvgScoreComponents(new AvgScoreComponents(11.1,22.2,33.3));

        when(statisticsService.getStatistics()).thenReturn(stats);

        mockMvc.perform(get("/statistics").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.totalUsers").value(5))
                .andExpect(jsonPath("$.rolesDistribution.user").value(3))
                .andExpect(jsonPath("$.totalCVs").value(10))
                .andExpect(jsonPath("$.totalJobs").value(4))
                .andExpect(jsonPath("$.avgMatchScore").value(77.7))
                .andExpect(jsonPath("$.topJobsByAvgScore[0].jobId").value("jobA"))
                .andExpect(jsonPath("$.scoreDistribution['76-100']").value(5))
                .andExpect(jsonPath("$.avgScoreComponents.tech").value(22.2));
    }
}