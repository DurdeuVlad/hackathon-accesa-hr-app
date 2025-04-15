package eu.cvmatch.backend.utils;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.ByteArrayOutputStream;

import static org.junit.jupiter.api.Assertions.*;

public class TextExtractorTest {

    @Test
    public void testExtract() throws Exception {
        XWPFDocument document = new XWPFDocument();
        document.createParagraph().createRun().setText("Hello World");
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        document.write(out);
        byte[] docBytes = out.toByteArray();

        MockMultipartFile file = new MockMultipartFile("file", "hello.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", docBytes);

        String text = TextExtractor.extract(file);
        assertTrue(text.contains("Hello World"));
    }
}
