package eu.cvmatch.backend.service;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.*;
import org.apache.lucene.search.similarities.BM25Similarity;
import org.apache.lucene.store.FSDirectory;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class LexicalRetrievalService {

    private final IndexSearcher searcher;
    private final QueryParser parser;

    public LexicalRetrievalService(Path indexPath) throws Exception {
        var dir = FSDirectory.open(indexPath);
        var reader = DirectoryReader.open(dir);
        this.searcher = new IndexSearcher(reader);
        this.searcher.setSimilarity(new BM25Similarity()); // BM25 by default (k1=1.2, b=0.75) :contentReference[oaicite:3]{index=3}
        this.parser = new QueryParser("content", new StandardAnalyzer());
    }

    /**
     * Returns the top-K document IDs (e.g. CV IDs) matching the text.
     */
    public List<String> search(String text, int k) throws Exception {
        var q = parser.parse(QueryParser.escape(text));
        TopDocs hits = searcher.search(q, k);
        return IntStream.range(0, hits.scoreDocs.length)
                .mapToObj(i -> {
                    try {
                        Document doc = searcher.doc(hits.scoreDocs[i].doc);
                        return doc.get("id");
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());
    }
}
