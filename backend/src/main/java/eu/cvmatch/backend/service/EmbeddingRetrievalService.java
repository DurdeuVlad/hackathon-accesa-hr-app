package eu.cvmatch.backend.service;

import com.facebook.faiss.IndexFlatL2;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmbeddingRetrievalService {

    private final OnnxSentenceEmbeddingService embedder;
    private final IndexFlatL2 faissIndex;
    private final int dimension;

    public EmbeddingRetrievalService(OnnxSentenceEmbeddingService embedder, int dimension) {
        this.embedder = embedder;
        this.dimension = dimension;
        this.faissIndex = new IndexFlatL2(dimension);              // FAISS L2 index :contentReference[oaicite:5]{index=5}
    }

    /** Add a batch of vectors (e.g. all CV embeddings) to the FAISS index. */
    public void addAll(List<float[]> vectors) {
        faissIndex.add(vectors.toArray(new float[0][0]));
    }

    /**
     * Returns the indices of the top-K nearest neighbors for the given text.
     */
    public long[] search(String text, int k) throws Exception {
        float[] q = embedder.embed(text);
        float[] dists = new float[k];
        long[] labels = new long[k];
        faissIndex.search(q, k, dists, labels);
        return labels;
    }
}
