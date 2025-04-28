package eu.cvmatch.backend.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.stereotype.Service;

@Service
public class EmbeddingSimilarityService {
    private final GenerativeLanguageClient glClient;

    public EmbeddingSimilarityService(GenerativeLanguageClient glClient) {
        this.glClient = glClient;
    }

    /**
     * Returns cosine similarity between text1 and text2, as a [0.0–1.0] double.
     */
    public double cosineSimilarity(String text1, String text2) throws Exception {
        JsonArray e1 = glClient.embedText(text1, null);
        JsonArray e2 = glClient.embedText(text2, null);

        JsonObject emb1 = e1.get(0).getAsJsonObject();
        JsonObject emb2 = e2.get(0).getAsJsonObject();

        var arr1 = emb1.getAsJsonArray("values");
        var arr2 = emb2.getAsJsonArray("values");

        int len = Math.min(arr1.size(), arr2.size());
        double dot = 0, norm1 = 0, norm2 = 0;
        for (int i = 0; i < len; i++) {
            double v1 = arr1.get(i).getAsDouble();
            double v2 = arr2.get(i).getAsDouble();
            dot   += v1 * v2;
            norm1 += v1 * v1;
            norm2 += v2 * v2;
        }
        if (norm1 == 0 || norm2 == 0) return 0.0;
        return dot / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
}
