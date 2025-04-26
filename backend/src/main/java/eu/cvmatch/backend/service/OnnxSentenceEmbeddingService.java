package eu.cvmatch.backend.service;

import ai.djl.huggingface.tokenizers.HuggingFaceTokenizer;
import ai.djl.huggingface.tokenizers.Encoding;
import ai.onnxruntime.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.ByteBuffer;
import java.util.Map;

@Service
public class OnnxSentenceEmbeddingService {

    private final OrtEnvironment env;
    private final OrtSession session;
    private final HuggingFaceTokenizer tokenizer;

    public OnnxSentenceEmbeddingService() throws OrtException, IOException {
        // 1) ONNX runtime setup: load model from classpath resources
        env = OrtEnvironment.getEnvironment();
        Path modelFile = extractResourceToTemp("/models/model.onnx", "model", ".onnx");
        session = env.createSession(
                modelFile.toString(),
                new OrtSession.SessionOptions()
        );

        // 2) Load HuggingFace tokenizer.json from resources
        Path tokFile = extractResourceToTemp("/models/tokenizer.json", "tokenizer", ".json");
        tokenizer = HuggingFaceTokenizer.newInstance(tokFile);
    }

    private static Path extractResourceToTemp(String resourcePath,
                                              String prefix,
                                              String suffix) throws IOException {
        InputStream in = OnnxSentenceEmbeddingService.class.getResourceAsStream(resourcePath);
        if (in == null) {
            throw new IOException("Resource not found: " + resourcePath);
        }
        Path tempFile = Files.createTempFile(prefix, suffix);
        tempFile.toFile().deleteOnExit();
        Files.copy(in, tempFile, StandardCopyOption.REPLACE_EXISTING);
        return tempFile;
    }

    /**
     * Embed the given text into a sentence-level 384-dim float vector.
     */
    public float[] embed(String text) throws OrtException {
        // Tokenize
        Encoding enc = tokenizer.encode(text);
        long[] inputIds      = enc.getIds();
        long[] attentionMask = enc.getAttentionMask();

        // token_type_ids: all zeros
        long[] tokenTypeIds = new long[inputIds.length]; // default 0

        // Build ONNX tensors
        OnnxTensor idsTensor       = OnnxTensor.createTensor(env,
                java.nio.LongBuffer.wrap(inputIds), new long[]{1, inputIds.length});
        OnnxTensor maskTensor      = OnnxTensor.createTensor(env,
                java.nio.LongBuffer.wrap(attentionMask), new long[]{1, attentionMask.length});
        OnnxTensor typeIdsTensor   = OnnxTensor.createTensor(env,
                java.nio.LongBuffer.wrap(tokenTypeIds), new long[]{1, tokenTypeIds.length});

        // Run inference
        OrtSession.Result result = session.run(Map.of(
                "input_ids",      idsTensor,
                "attention_mask", maskTensor,
                "token_type_ids", typeIdsTensor
        ));

        // Cleanup input tensors
        idsTensor.close();
        maskTensor.close();
        typeIdsTensor.close();

        // Extract raw output
        Object raw = result.get(0).getValue();
        float[] embedding;

        if (raw instanceof float[][]) {
            // shape [1, hidden_size]
            embedding = ((float[][]) raw)[0];
        } else if (raw instanceof float[][][]) {
            // shape [1, seq_len, hidden_size]: average over tokens
            float[][][] arr3d = (float[][][]) raw;
            float[][] tokenEmbs = arr3d[0];
            int seqLen = tokenEmbs.length;
            int dim = tokenEmbs[0].length;
            float[] sentEmb = new float[dim];
            for (int i = 0; i < seqLen; i++) {
                for (int j = 0; j < dim; j++) {
                    sentEmb[j] += tokenEmbs[i][j];
                }
            }
            for (int j = 0; j < dim; j++) {
                sentEmb[j] /= seqLen;
            }
            embedding = sentEmb;
        } else {
            throw new IllegalStateException("Unexpected ONNX output type: " + raw.getClass());
        }

        // Close the result
        result.close();
        return embedding;
    }

    /** Cosine similarity between two vectors. */
    public static double cosineSimilarity(float[] a, float[] b) {
        double dot = 0, normA = 0, normB = 0;
        for (int i = 0; i < a.length; i++) {
            dot   += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        if (normA == 0 || normB == 0) return 0.0;
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}