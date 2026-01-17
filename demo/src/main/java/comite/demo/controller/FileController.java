package comite.demo.controller;

import comite.demo.entity.ProtocolFile;
import comite.demo.repository.ProtocolFileRepository;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.service.SecureFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;
import comite.demo.entity.ProtocolFile;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private ProtocolFileRepository protocolFileRepository;

    @Autowired
    private ProtocolSubmissionRepository protocolSubmissionRepository;

    @Autowired
    private SecureFileService secureFileService;

    @GetMapping("/download/{fileId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'PRESIDENT', 'COMMITTEE_MEMBER', 'RAPPORTEUR', 'RESEARCHER')")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            Optional<ProtocolFile> fileOptional = protocolFileRepository.findById(fileId);
            if (fileOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ProtocolFile protocolFile = fileOptional.get();
            byte[] fileContent = secureFileService.getFile(protocolFile.getFilePath());
            
            ByteArrayResource resource = new ByteArrayResource(fileContent);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(protocolFile.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                           "attachment; filename=\"" + protocolFile.getOriginalFileName() + "\"")
                    .contentLength(fileContent.length)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/view/{fileId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'PRESIDENT', 'COMMITTEE_MEMBER', 'RAPPORTEUR', 'RESEARCHER')")
    public ResponseEntity<Resource> viewFile(@PathVariable Long fileId) {
        try {
            Optional<ProtocolFile> fileOptional = protocolFileRepository.findById(fileId);
            if (fileOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ProtocolFile protocolFile = fileOptional.get();
            byte[] fileContent = secureFileService.getFile(protocolFile.getFilePath());
            
            ByteArrayResource resource = new ByteArrayResource(fileContent);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(protocolFile.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .contentLength(fileContent.length)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/info/{fileId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'PRESIDENT', 'COMMITTEE_MEMBER', 'RAPPORTEUR', 'RESEARCHER')")
    public ResponseEntity<?> getFileInfo(@PathVariable Long fileId) {
        Optional<ProtocolFile> fileOptional = protocolFileRepository.findById(fileId);
        if (fileOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProtocolFile file = fileOptional.get();
        return ResponseEntity.ok(new FileInfoResponse(
            file.getId(),
            file.getOriginalFileName(),
            file.getFileType().getDisplayName(),
            file.getFileSize(),
            file.getContentType(),
            file.getUploadedAt()
        ));
    }

    @GetMapping("/protocol/{protocolId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SECRETARY', 'PRESIDENT', 'COMMITTEE_MEMBER', 'RAPPORTEUR', 'RESEARCHER')")
    public ResponseEntity<?> getProtocolFiles(@PathVariable Long protocolId) {
        try {
            var files = protocolFileRepository.findByProtocolId(protocolId);
            var fileInfos = files.stream()
                .map(file -> new FileInfoResponse(
                    file.getId(),
                    file.getOriginalFileName(),
                    file.getFileType().getDisplayName(),
                    file.getFileSize(),
                    file.getContentType(),
                    file.getUploadedAt()
                ))
                .toList();
            
            return ResponseEntity.ok(java.util.Map.of(
                "success", true,
                "files", fileInfos,
                "count", fileInfos.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(java.util.Map.of("success", false, "error", e.getMessage()));
        }
    }

    @GetMapping("/view-by-protocol/{protocolId}/{fileType}")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
    public ResponseEntity<Resource> viewFileByType(@PathVariable Long protocolId, @PathVariable String fileType) {
        try {
            System.out.println("Recherche fichier - Protocol ID: [REDACTED], Type: " + fileType.replaceAll("[\r\n]", ""));
            
            String fileName = getFileNameFromProtocol(protocolId, fileType);
            System.out.println("Nom fichier depuis DB: [REDACTED]");
            
            if (fileName == null || fileName.equals("Aucun")) {
                System.out.println("Fichier non trouvé en DB");
                return ResponseEntity.notFound().build();
            }
            
            // Chercher le fichier dans uploads/protocols/
            String actualFileName = findActualFile(fileName, fileType);
            System.out.println("Fichier réel trouvé: [REDACTED]");
            
            if (actualFileName == null) {
                System.out.println("Fichier physique non trouvé");
                return ResponseEntity.notFound().build();
            }
            
            java.nio.file.Path uploadsDir = java.nio.file.Paths.get("uploads/protocols/").toAbsolutePath().normalize();
            java.nio.file.Path filePath = uploadsDir.resolve(actualFileName).normalize();
            
            // Vérification de traversée de chemin
            if (!filePath.startsWith(uploadsDir)) {
                System.err.println("Tentative de traversée de chemin détectée");
                return ResponseEntity.badRequest().build();
            }
            System.out.println("Chemin complet: " + filePath.toAbsolutePath());
            
            if (!java.nio.file.Files.exists(filePath)) {
                System.out.println("Le fichier n'existe pas physiquement");
                return ResponseEntity.notFound().build();
            }
            
            byte[] fileContent = java.nio.file.Files.readAllBytes(filePath);
            ByteArrayResource resource = new ByteArrayResource(fileContent);
            
            String contentType = getContentType(actualFileName);
            System.out.println("Fichier trouvé et lu, taille: " + fileContent.length + " bytes");
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .contentLength(fileContent.length)
                    .body(resource);

        } catch (Exception e) {
            System.err.println("Erreur lors de la lecture du fichier: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    private String getFileNameFromProtocol(Long protocolId, String fileType) {
        try {
            var protocol = protocolSubmissionRepository.findById(protocolId);
            if (protocol.isEmpty()) {
                return null;
            }
            
            var p = protocol.get();
            switch (fileType.toLowerCase()) {
                case "protocol":
                    return p.getProtocolFileName();
                case "consent":
                    return p.getConsentFormFileName();
                case "cv":
                    return p.getCvFilesNames();
                case "receipt":
                    return p.getPaymentReceiptFileName();
                case "president_letter":
                    return p.getPresidentLetterFileName();
                case "information_notice":
                    return p.getInformationNoticeFileName();
                case "informed_consent":
                    return p.getInformedConsentFileName();
                case "chronogram":
                    return p.getChronogramFileName();
                case "detailed_budget":
                    return p.getDetailedBudgetFileName();
                case "evaluation_report":
                    return p.getEvaluationReportFileName();
                default:
                    return null;
            }
        } catch (Exception e) {
            return null;
        }
    }
    
    private String findActualFile(String originalFileName, String fileType) {
        try {
            java.nio.file.Path uploadsPath = java.nio.file.Paths.get("uploads/protocols/");
            System.out.println("Chemin uploads: " + uploadsPath.toAbsolutePath());
            
            if (!java.nio.file.Files.exists(uploadsPath)) {
                System.out.println("Le répertoire uploads/protocols/ n'existe pas");
                return null;
            }
            
            String prefix = fileType.toLowerCase() + "_";
            System.out.println("Recherche fichier avec nom: " + originalFileName + " et préfixe: " + prefix);
            
            java.util.List<String> allFiles = java.nio.file.Files.list(uploadsPath)
                .map(path -> path.getFileName().toString())
                .collect(java.util.stream.Collectors.toList());
            
            System.out.println("Fichiers disponibles (" + allFiles.size() + "): " + allFiles.stream().limit(10).collect(java.util.stream.Collectors.toList()));
            
            // Stratégie 1: Chercher fichier exact
            if (allFiles.contains(originalFileName)) {
                System.out.println("Fichier trouvé (exact): " + originalFileName);
                return originalFileName;
            }
            
            // Stratégie 2: Chercher avec préfixe
            String withPrefix = allFiles.stream()
                .filter(name -> name.startsWith(prefix))
                .findFirst()
                .orElse(null);
            if (withPrefix != null) {
                System.out.println("Fichier trouvé (avec préfixe): " + withPrefix);
                return withPrefix;
            }
            
            // Stratégie 3: Chercher fichier qui contient le nom original (sans extension)
            if (originalFileName != null && !originalFileName.equals("Aucun")) {
                String nameWithoutExt = originalFileName.contains(".") ? 
                    originalFileName.substring(0, originalFileName.lastIndexOf(".")) : originalFileName;
                String containing = allFiles.stream()
                    .filter(name -> name.contains(nameWithoutExt))
                    .findFirst()
                    .orElse(null);
                if (containing != null) {
                    System.out.println("Fichier trouvé (contient): " + containing);
                    return containing;
                }
            }
            
            System.out.println("Aucun fichier trouvé pour: " + originalFileName);
            return null;
        } catch (Exception e) {
            System.err.println("Erreur dans findActualFile: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    private String getContentType(String fileName) {
        if (fileName == null) return "application/octet-stream";
        
        String lower = fileName.toLowerCase(java.util.Locale.ROOT);
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".doc")) return "application/msword";
        if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        return "application/octet-stream";
    }

    private boolean matchesFileType(ProtocolFile.FileType fileType, String typeString) {
        switch (typeString.toLowerCase()) {
            case "protocol":
                return fileType == ProtocolFile.FileType.PROTOCOL_DOCUMENT;
            case "consent":
                return fileType == ProtocolFile.FileType.CONSENT_FORM;
            case "cv":
                return fileType == ProtocolFile.FileType.CV_INVESTIGATOR;
            case "receipt":
                return fileType == ProtocolFile.FileType.PAYMENT_RECEIPT;
            case "president_letter":
                return fileType == ProtocolFile.FileType.PRESIDENT_LETTER;
            case "information_notice":
                return fileType == ProtocolFile.FileType.INFORMATION_NOTICE;
            case "informed_consent":
                return fileType == ProtocolFile.FileType.INFORMED_CONSENT;
            case "chronogram":
                return fileType == ProtocolFile.FileType.CHRONOGRAM;
            case "detailed_budget":
                return fileType == ProtocolFile.FileType.DETAILED_BUDGET;
            case "evaluation_report":
                return fileType == ProtocolFile.FileType.EVALUATION_REPORT;
            default:
                return false;
        }
    }

    public static class FileInfoResponse {
        public Long id;
        public String originalFileName;
        public String fileType;
        public Long fileSize;
        public String contentType;
        public java.time.LocalDateTime uploadedAt;

        public FileInfoResponse(Long id, String originalFileName, String fileType, 
                              Long fileSize, String contentType, java.time.LocalDateTime uploadedAt) {
            this.id = id;
            this.originalFileName = originalFileName;
            this.fileType = fileType;
            this.fileSize = fileSize;
            this.contentType = contentType;
            this.uploadedAt = uploadedAt;
        }
    }
}