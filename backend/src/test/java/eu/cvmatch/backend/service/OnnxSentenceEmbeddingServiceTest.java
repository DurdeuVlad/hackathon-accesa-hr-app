package eu.cvmatch.backend.service;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

class OnnxSentenceEmbeddingServiceTest {
    private static OnnxSentenceEmbeddingService embeddingService;

    @BeforeAll
    static void setup() throws Exception {
        // Initialize the service with real ONNX model and tokenizer
        embeddingService = new OnnxSentenceEmbeddingService();
    }

    @Test
    void embed_lengthShouldBe384() throws Exception {
        String text = "The quick brown fox jumps over the lazy dog";
        float[] vector = embeddingService.embed(text);
        assertNotNull(vector, "Embedding should not be null");
        assertEquals(384, vector.length, "Embedding dimension should be 384");
    }

    @Test
    void cosineSimilarity_selfSimilarityIsOne() throws Exception {
        String text = "Consistency check text.";
        float[] vec = embeddingService.embed(text);
        double sim = OnnxSentenceEmbeddingService.cosineSimilarity(vec, vec);
        assertEquals(1.0, sim, 1e-6, "Cosine similarity of a vector with itself should be 1.0");
    }

    @Test
    void embed_differentTextsHaveDistinctVectors() throws Exception {
        float[] v1 = embeddingService.embed("Hello world");
        float[] v2 = embeddingService.embed("Goodbye world");
        assertEquals(384, v1.length);
        assertEquals(384, v2.length);
        double sim = OnnxSentenceEmbeddingService.cosineSimilarity(v1, v2);
        // Expect some difference (similarity less than 1)
        assertTrue(sim < 0.9999, "Different sentences should not have similarity of 1");
    }

    @Test
    void printEmbeddingsAndSimilarity() throws Exception {
        OnnxSentenceEmbeddingService svc = new OnnxSentenceEmbeddingService();

        String text1 = "ChatGPT is amazing!";
        String text2 = "I love natural language processing.";

        // embed
        float[] emb1 = svc.embed(text1);
        float[] emb2 = svc.embed(text2);

        // print out first 10 dims for brevity
        System.out.println("Embedding 1 (first 10 dims): " + Arrays.toString(Arrays.copyOf(emb1, 10)));
        System.out.println("Embedding 2 (first 10 dims): " + Arrays.toString(Arrays.copyOf(emb2, 10)));
        System.out.println("Full vector length: " + emb1.length);

        // compute similarities
        double simSelf  = OnnxSentenceEmbeddingService.cosineSimilarity(emb1, emb1);
        double simCross = OnnxSentenceEmbeddingService.cosineSimilarity(emb1, emb2);

        System.out.printf("Self-similarity(1 vs 1): %.6f%n", simSelf);
        System.out.printf("Cross-similarity(1 vs 2): %.6f%n", simCross);

        // sanity checks
        assertEquals(1.0, simSelf, 1e-6, "Self-similarity should be 1");
        assertTrue(simCross >= -1.0 && simCross <= 1.0, "Cross-similarity in [-1,1]");
    }
}
