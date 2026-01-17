package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluation_pdfs")
public class EvaluationPdf {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "protocol_id", nullable = false)
    private Long protocolId;
    
    @Column(name = "evaluator_id", nullable = false)
    private Long evaluatorId;
    
    @Column(name = "evaluator_name")
    private String evaluatorName;
    
    @Column(name = "evaluator_role")
    private String evaluatorRole;
    
    @Column(name = "criteria_id")
    private Long criteriaId; // Référence vers ProtocolEvaluationCriteria
    
    @Column(name = "file_name", nullable = false)
    private String fileName;
    
    @Column(name = "file_path", nullable = false)
    private String filePath;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "mime_type")
    private String mimeType = "application/pdf";
    
    @Column(name = "status")
    private String status = "GENERATED"; // GENERATED, DOWNLOADED, ARCHIVED
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Constructeurs
    public EvaluationPdf() {}
    
    public EvaluationPdf(Long protocolId, Long evaluatorId, String evaluatorName, String evaluatorRole, 
                        Long criteriaId, String fileName, String filePath) {
        this.protocolId = protocolId;
        this.evaluatorId = evaluatorId;
        this.evaluatorName = evaluatorName;
        this.evaluatorRole = evaluatorRole;
        this.criteriaId = criteriaId;
        this.fileName = fileName;
        this.filePath = filePath;
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProtocolId() { return protocolId; }
    public void setProtocolId(Long protocolId) { this.protocolId = protocolId; }
    
    public Long getEvaluatorId() { return evaluatorId; }
    public void setEvaluatorId(Long evaluatorId) { this.evaluatorId = evaluatorId; }
    
    public String getEvaluatorName() { return evaluatorName; }
    public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }
    
    public String getEvaluatorRole() { return evaluatorRole; }
    public void setEvaluatorRole(String evaluatorRole) { this.evaluatorRole = evaluatorRole; }
    
    public Long getCriteriaId() { return criteriaId; }
    public void setCriteriaId(Long criteriaId) { this.criteriaId = criteriaId; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getMimeType() { return mimeType; }
    public void setMimeType(String mimeType) { this.mimeType = mimeType; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}