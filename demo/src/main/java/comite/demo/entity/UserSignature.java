package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_signatures")
public class UserSignature {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", unique = true)
    private Long userId;
    
    @Column(name = "signature_file_path")
    private String signatureFilePath;
    
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;

    // Constructeurs
    public UserSignature() {}

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getSignatureFilePath() { return signatureFilePath; }
    public void setSignatureFilePath(String signatureFilePath) { this.signatureFilePath = signatureFilePath; }
    
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}