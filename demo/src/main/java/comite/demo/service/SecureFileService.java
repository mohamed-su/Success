package comite.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Service de gestion de fichiers sécurisé
 * Protection contre Path Traversal et validation stricte
 */
@Service
public class SecureFileService {
    
    private static final Logger logger = LoggerFactory.getLogger(SecureFileService.class);
    
    private final Path uploadDirectory;
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(".pdf", ".doc", ".docx", ".txt");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    
    public SecureFileService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
        createDirectoryIfNotExists();
    }
    
    public String saveFile(MultipartFile file, String category) throws FileOperationException {
        validateFile(file);
        
        try {
            String sanitizedFilename = sanitizeFilename(file.getOriginalFilename());
            String uniqueFilename = generateUniqueFilename(sanitizedFilename);
            
            Path categoryPath = uploadDirectory.resolve(category).normalize();
            if (!categoryPath.startsWith(uploadDirectory)) {
                throw new FileOperationException("Invalid category path");
            }
            
            Files.createDirectories(categoryPath);
            Path targetPath = categoryPath.resolve(uniqueFilename);
            
            // Double vérification du chemin final
            if (!targetPath.startsWith(uploadDirectory)) {
                throw new FileOperationException("Path traversal attempt detected");
            }
            
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            
            logger.info("File saved successfully: {}", targetPath.toString());
            return targetPath.toString();
            
        } catch (IOException e) {
            logger.error("Failed to save file: {}", file.getOriginalFilename(), e);
            throw new FileOperationException("Failed to save file", e);
        }
    }
    
    public byte[] getFile(String filePath) throws FileOperationException {
        try {
            Path path = Paths.get(filePath).toAbsolutePath().normalize();
            
            // Vérification de sécurité
            if (!path.startsWith(uploadDirectory)) {
                logger.warn("Path traversal attempt: {}", filePath);
                throw new FileOperationException("Access denied");
            }
            
            if (!Files.exists(path)) {
                throw new FileOperationException("File not found");
            }
            
            return Files.readAllBytes(path);
            
        } catch (IOException e) {
            logger.error("Failed to read file: {}", filePath, e);
            throw new FileOperationException("Failed to read file", e);
        }
    }
    
    public boolean deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath).toAbsolutePath().normalize();
            
            if (!path.startsWith(uploadDirectory)) {
                logger.warn("Path traversal attempt in delete: {}", filePath);
                return false;
            }
            
            return Files.deleteIfExists(path);
            
        } catch (IOException e) {
            logger.error("Failed to delete file: {}", filePath, e);
            return false;
        }
    }
    
    private void validateFile(MultipartFile file) throws FileOperationException {
        if (file == null || file.isEmpty()) {
            throw new FileOperationException("File is empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileOperationException("File size exceeds maximum allowed size");
        }
        
        String filename = file.getOriginalFilename();
        if (filename == null || filename.trim().isEmpty()) {
            throw new FileOperationException("Invalid filename");
        }
        
        String extension = getFileExtension(filename);
        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new FileOperationException("File type not allowed");
        }
    }
    
    private String sanitizeFilename(String filename) {
        if (filename == null) return "unknown";
        
        // Supprimer les caractères dangereux
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_")
                      .replaceAll("_{2,}", "_")
                      .substring(0, Math.min(filename.length(), 100));
    }
    
    private String generateUniqueFilename(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String baseName = originalFilename.substring(0, originalFilename.lastIndexOf('.'));
        return baseName + "_" + UUID.randomUUID().toString() + extension;
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        return lastDotIndex > 0 ? filename.substring(lastDotIndex) : "";
    }
    
    private void createDirectoryIfNotExists() {
        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            logger.error("Failed to create upload directory: {}", uploadDirectory, e);
            throw new RuntimeException("Failed to initialize file service", e);
        }
    }
    
    public static class FileOperationException extends Exception {
        public FileOperationException(String message) {
            super(message);
        }
        
        public FileOperationException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}