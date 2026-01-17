package comite.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Service
public class FileValidationService {
    
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "doc", "docx");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    public void validateFile(MultipartFile file, String fieldName) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " est obligatoire");
        }

        // Vérifier la taille
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(fieldName + " ne peut pas dépasser 10MB");
        }

        // Vérifier l'extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !hasValidExtension(originalFilename)) {
            throw new IllegalArgumentException(fieldName + " doit être un fichier PDF, DOC ou DOCX");
        }

        // Vérifier le type MIME
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new IllegalArgumentException(fieldName + " a un type de fichier non autorisé");
        }
    }

    public void validateOptionalFile(MultipartFile file, String fieldName) {
        if (file != null && !file.isEmpty()) {
            validateFile(file, fieldName);
        }
    }

    public void validateFileList(List<MultipartFile> files, String fieldName, int maxCount) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " est obligatoire");
        }

        if (files.size() > maxCount) {
            throw new IllegalArgumentException(fieldName + " ne peut pas contenir plus de " + maxCount + " fichiers");
        }

        for (int i = 0; i < files.size(); i++) {
            validateFile(files.get(i), fieldName + " #" + (i + 1));
        }
    }

    private boolean hasValidExtension(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return ALLOWED_EXTENSIONS.contains(extension);
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex > 0 ? filename.substring(lastDotIndex + 1) : "";
    }
}