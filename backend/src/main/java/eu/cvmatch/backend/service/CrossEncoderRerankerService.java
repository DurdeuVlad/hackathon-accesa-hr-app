package eu.cvmatch.backend.service;

import ai.djl.MalformedModelException;
import ai.djl.ModelException;
import ai.djl.huggingface.tokenizers.HuggingFaceTokenizer;
import ai.djl.inference.Predictor;
import ai.djl.modality.nlp.translator.NlpTranslatorFactory;
import ai.djl.repository.zoo.Criteria;
import ai.djl.repository.zoo.ZooModel;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class CrossEncoderRerankerService {

    private final ZooModel<List<String>, float[]> model;
    private final Predictor<List<String>, float[]> predictor;

    public CrossEncoderRerankerService() throws IOException, ModelException {
        // Load the Hugging Face cross-encoder model for MS MARCO :contentReference[oaicite:7]{index=7}
        Criteria<List<String>, float[]> criteria = Criteria.builder()
                .setTypes(List.class, float[].class)
                .optModelUrls("huggingface://cross-encoder/ms-marco-MiniLM-L-6-v2")
                .optTranslatorFactory(NlpTranslatorFactory.class)
                .build();
        this.model = criteria.loadModel();
        this.predictor = model.newPredictor();
    }

    /**
     * Given a query and a list of candidate texts, returns their cross-encoder scores.
     */
    public float[] score(List<String> queryAndDocs) throws Exception {
        return predictor.predict(queryAndDocs);
    }
}
