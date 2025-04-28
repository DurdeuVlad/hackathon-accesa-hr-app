package eu.cvmatch.backend.utils;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.stream.Collectors;

public class TextExtractor {
    public static String extract(MultipartFile file) throws Exception {
        if (file == null) {
            throw new IllegalArgumentException("File cannot be null");
        }

        String filename = file.getOriginalFilename();
        String contentType = file.getContentType();

        if (filename == null || filename.isEmpty()) {
            throw new IllegalArgumentException("File must have a name");
        }

        if (isDocx(filename, contentType)) {
            return extractDocx(file);
        } else if (isDoc(filename, contentType)) {
            return extractDoc(file);
        } else if (isPdf(filename, contentType)) {
            return extractPdf(file);
        } else if (isTextFile(filename, contentType)) {
            return extractTextFile(file);
        } else {
            throw new UnsupportedOperationException("Unsupported file format: " +
                    (contentType != null ? contentType : filename));
        }
    }

    private static boolean isDocx(String filename, String contentType) {
        return (filename.toLowerCase().endsWith(".docx") ||
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document".equals(contentType));
    }

    private static boolean isDoc(String filename, String contentType) {
        return (filename.toLowerCase().endsWith(".doc") ||
                "application/msword".equals(contentType));
    }

    private static boolean isPdf(String filename, String contentType) {
        return (filename.toLowerCase().endsWith(".pdf") ||
                "application/pdf".equals(contentType));
    }

    private static boolean isTextFile(String filename, String contentType) {
        return (filename.toLowerCase().endsWith(".txt") ||
                "text/plain".equals(contentType) ||
                filename.toLowerCase().endsWith(".rtf") ||
                "application/rtf".equals(contentType) ||
                "text/rtf".equals(contentType));
    }

    private static String extractDocx(MultipartFile file) throws Exception {
        try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {
            return doc.getParagraphs()
                    .stream()
                    .map(XWPFParagraph::getText)
                    .collect(Collectors.joining(" "));
        }
    }

    private static String extractDoc(MultipartFile file) throws Exception {
        try (HWPFDocument doc = new HWPFDocument(file.getInputStream())) {
            WordExtractor extractor = new WordExtractor(doc);
            return extractor.getText();
        }
    }

    private static String extractPdf(MultipartFile file) throws Exception {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private static String extractTextFile(MultipartFile file) throws Exception {
        try (InputStream inputStream = file.getInputStream();
             BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            return reader.lines().collect(Collectors.joining(" "));
        }
    }
}