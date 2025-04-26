package eu.cvmatch.backend.utils;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.usermodel.Range;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.*;

public class TextExtractorTest {

    @Test
    public void testExtractDocx() throws Exception {
        // Create a DOCX document
        XWPFDocument document = new XWPFDocument();
        document.createParagraph().createRun().setText("DOCX Test Content");
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        document.write(out);
        document.close();

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                out.toByteArray()
        );

        String extractedText = TextExtractor.extract(file);
        assertTrue(extractedText.contains("DOCX Test Content"));
    }

    @Test
    public void testExtractPdf() throws Exception {
        // Create a PDF document
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                content.beginText();
                content.setFont(PDType1Font.HELVETICA, 12);
                content.newLineAtOffset(100, 700);
                content.showText("PDF Test Content");
                content.endText();
            }

            document.save(out);
        }

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.pdf",
                "application/pdf",
                out.toByteArray()
        );

        String extractedText = TextExtractor.extract(file);
        assertTrue(extractedText.contains("PDF Test Content"));
    }

    @Test
    public void testExtractTxt() throws Exception {
        // Create a simple text file
        String content = "Plain Text Test Content";

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                content.getBytes()
        );

        String extractedText = TextExtractor.extract(file);
        assertEquals(content, extractedText.trim());
    }

    @Test
    public void testUnsupportedFormat() {
        // Create an unsupported file
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.xyz",
                "application/octet-stream",
                "Some content".getBytes()
        );

        Exception exception = assertThrows(UnsupportedOperationException.class, () -> {
            TextExtractor.extract(file);
        });

        assertTrue(exception.getMessage().contains("Unsupported file format"));
    }

    @Test
    public void testNoFilename() {
        // Create a file with no filename
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "",
                "text/plain",
                "Some content".getBytes()
        );

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            TextExtractor.extract(file);
        });

        assertEquals("File must have a name", exception.getMessage());
    }
}