package eu.cvmatch.backend.model;

import java.util.List;

public class ScoreResponse {
    private List<CVMatchResult> results;

    public ScoreResponse(List<CVMatchResult> results) {
        this.results = results;
    }

    public List<CVMatchResult> getResults() {
        return results;
    }

    public void setResults(List<CVMatchResult> results) {
        this.results = results;
    }
}