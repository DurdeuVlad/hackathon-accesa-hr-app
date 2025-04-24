package eu.cvmatch.backend.model;

import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class StatisticsDtoTest {

    @Test
    void testTopJobGetterSetter() {
        TopJob job = new TopJob("id123", "Engineer", 88.5);
        assertEquals("id123", job.getJobId());
        assertEquals("Engineer", job.getTitle());
        assertEquals(88.5, job.getAvgScore());

        job.setJobId("xyz");
        job.setTitle("Dev");
        job.setAvgScore(75.0);
        assertEquals("xyz", job.getJobId());
        assertEquals("Dev", job.getTitle());
        assertEquals(75.0, job.getAvgScore());
    }

    @Test
    void testAvgScoreComponentsGetterSetter() {
        AvgScoreComponents c = new AvgScoreComponents(10.0, 20.0, 30.0);
        assertEquals(10.0, c.getIndustry());
        assertEquals(20.0, c.getTech());
        assertEquals(30.0, c.getJd());

        c.setIndustry(15.0);
        c.setTech(25.0);
        c.setJd(35.0);
        assertEquals(15.0, c.getIndustry());
        assertEquals(25.0, c.getTech());
        assertEquals(35.0, c.getJd());
    }

    @Test
    void testStatisticsGetterSetter() {
        Statistics s = new Statistics();
        s.setTotalUsers(2);
        s.setRolesDistribution(Map.of("admin",1L, "user",1L));
        s.setTotalCVs(3);
        s.setTotalJobs(4);
        s.setAvgMatchScore(55.5);
        TopJob t1 = new TopJob("j1","T1",99.9);
        s.setTopJobsByAvgScore(List.of(t1));
        Map<String, Long> dist = Map.of("0-50", 1L);
        s.setScoreDistribution(dist);
        AvgScoreComponents comp = new AvgScoreComponents(5.0,6.0,7.0);
        s.setAvgScoreComponents(comp);

        assertEquals(2, s.getTotalUsers());
        assertEquals(Map.of("admin",1L, "user",1L), s.getRolesDistribution());
        assertEquals(3, s.getTotalCVs());
        assertEquals(4, s.getTotalJobs());
        assertEquals(55.5, s.getAvgMatchScore());
        assertEquals(1, s.getTopJobsByAvgScore().size());
        assertEquals(dist, s.getScoreDistribution());
        assertEquals(comp, s.getAvgScoreComponents());
    }
}

