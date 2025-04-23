package eu.cvmatch.backend.controller;

import eu.cvmatch.backend.model.Statistics;
import eu.cvmatch.backend.service.StatisticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;           // ← import SLF4J
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {
    private static final Logger logger = LoggerFactory.getLogger(StatisticsController.class);

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping
    public ResponseEntity<Statistics> getStats() {
        try {
            Statistics stats = statisticsService.getStatistics();

            // Log via SLF4J
            logger.info("Retrieved statistics: {}", stats);
            // Also print to stdout for quick-and-dirty debugging
            System.out.println("=== STATISTICS PAYLOAD ===");
            System.out.println(stats);
            System.out.println("==========================");

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            // Log the stack trace
            logger.error("Error fetching statistics", e);
            // Print minimal info to stdout
            System.err.println("Failed to fetch statistics: " + e.getMessage());
            e.printStackTrace(System.err);

            return ResponseEntity.status(500).build();
        }
    }
}
