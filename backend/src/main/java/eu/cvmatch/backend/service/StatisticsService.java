// StatisticsService.java
package eu.cvmatch.backend.service;

import com.google.cloud.firestore.*;
import eu.cvmatch.backend.model.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {
    private final Firestore db;

    public StatisticsService(Firestore db) {
        this.db = db;
    }

    @Cacheable(value = "statistics", unless = "#result == null")
    public Statistics getStatistics() throws Exception {
        // ——— Users ———
        List<QueryDocumentSnapshot> userDocs =
                db.collection("users").get().get().getDocuments();
        long totalUsers = userDocs.size();
        Map<String, Long> rolesDist = userDocs.stream()
                .map(d -> d.getString("role"))
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(r -> r, Collectors.counting()));

        // ——— CVs & Jobs counts ———
        long totalCVs  = db.collection("cvs").get().get().getDocuments().size();
        long totalJobs = db.collection("jobs").get().get().getDocuments().size();

        // ——— All CV-matches (collectionGroup) ———
        List<QueryDocumentSnapshot> allMatches =
                db.collectionGroup("cvMatches").get().get().getDocuments();

        double sumScore = 0, sumInd = 0, sumTech = 0, sumJd = 0;
        Map<String, Long> distribution = Map.of(
                        "0-50",   0L,
                        "51-75",  0L,
                        "76-100", 0L
                ).entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a,b)->b, LinkedHashMap::new));

        for (var doc : allMatches) {
            Double scoreObj = doc.getDouble("score");
            Double industryScoreObj = doc.getDouble("industryScore");
            Double techScoreObj = doc.getDouble("techScore");
            Double jdScoreObj = doc.getDouble("jdScore");

            double score = (scoreObj != null) ? scoreObj : 0.0;
            double industryScore = (industryScoreObj != null) ? industryScoreObj : 0.0;
            double techScore = (techScoreObj != null) ? techScoreObj : 0.0;
            double jdScore = (jdScoreObj != null) ? jdScoreObj : 0.0;

            sumScore += score;
            sumInd += industryScore;
            sumTech += techScore;
            sumJd += jdScore;

            String bucket = score <= 50 ? "0-50"
                    : score <= 75 ? "51-75"
                    : "76-100";
            distribution.merge(bucket, 1L, Long::sum);
        }

        int totalMatches = allMatches.size();
        double avgScore  = totalMatches > 0 ? sumScore / totalMatches : 0.0;
        AvgScoreComponents avgComponents = new AvgScoreComponents(
                totalMatches > 0 ? sumInd / totalMatches  : 0.0,
                totalMatches > 0 ? sumTech/ totalMatches  : 0.0,
                totalMatches > 0 ? sumJd  / totalMatches  : 0.0
        );

        // ——— Top 5 Jobs by their own avg scores ———
        List<TopJob> topJobs = db.collection("jobs")
                .get().get().getDocuments().stream()
                .map(jobDoc -> {
                    String jobId = jobDoc.getId();
                    String title = jobDoc.getString("title");      // ← use 'title'
                    try {
                        List<QueryDocumentSnapshot> matches =
                                db.collection("jobs")
                                        .document(jobId)
                                        .collection("cvMatches")
                                        .get().get().getDocuments();
                        double avg = matches.isEmpty() ? 0
                                : matches.stream()
                                .mapToDouble(d -> d.getDouble("score"))
                                .average()
                                .orElse(0.0);
                        return new TopJob(jobId, title, round(avg));
                    } catch (Exception ex) {
                        return new TopJob(jobId, title, 0.0);
                    }
                })
                .sorted(Comparator.comparingDouble(TopJob::getAvgScore).reversed())
                .limit(5)
                .collect(Collectors.toList());

        // ——— Assemble final Statistics ———
        Statistics stats = new Statistics();
        stats.setTotalUsers(totalUsers);
        stats.setRolesDistribution(rolesDist);
        stats.setTotalCVs(totalCVs);
        stats.setTotalJobs(totalJobs);
        stats.setAvgMatchScore(round(avgScore));
        stats.setTopJobsByAvgScore(topJobs);
        stats.setScoreDistribution(distribution);
        stats.setAvgScoreComponents(avgComponents);

        return stats;
    }

    private double round(double v) {
        return Math.round(v * 10) / 10.0;
    }
}
