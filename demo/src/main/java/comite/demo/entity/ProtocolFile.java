package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "protocol_files")
public class ProtocolFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "protocol_id")
    private ProtocolSubmission protocol;

    private String fileName;
    private String originalFileName;
    private String filePath;
    private String contentType;
    private Long fileSize;
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private FileType fileType;

    public enum FileType {
        PROTOCOL_DOCUMENT("Fichier de protocole"),
        CONSENT_FORM("Formulaire de consentement"),
        CV_INVESTIGATOR("CV des investigateurs"),
        PAYMENT_RECEIPT("Reçu de paiement"),
        PRESIDENT_LETTER("Lettre au Président du Comité"),
        INFORMATION_NOTICE("Notice d'information"),
        INFORMED_CONSENT("Consentement éclairé"),
        CHRONOGRAM("Chronogramme"),
        DETAILED_BUDGET("Budget détaillé en Franc CFA"),
        EVALUATION_REPORT("Rapport d'évaluation (décision finale)"),
        OTHER("Autre");
        
        private final String displayName;
        
        FileType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }

    public ProtocolFile() {}

    public ProtocolFile(ProtocolSubmission protocol, String fileName, String originalFileName, 
                       String filePath, String contentType, Long fileSize, FileType fileType) {
        this.protocol = protocol;
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.filePath = filePath;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.fileType = fileType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ProtocolSubmission getProtocol() { return protocol; }
    public void setProtocol(ProtocolSubmission protocol) { this.protocol = protocol; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    
    public FileType getFileType() { return fileType; }
    public void setFileType(FileType fileType) { this.fileType = fileType; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }


}