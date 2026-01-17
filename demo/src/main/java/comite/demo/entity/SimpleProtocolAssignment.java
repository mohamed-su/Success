package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "protocol_assignments")
public class SimpleProtocolAssignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "protocol_id", nullable = false)
    private Long protocolId;
    
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
    
    @Column(name = "can_edit", nullable = false)
    private Boolean canEdit = true;
    
    @Column(name = "downloaded", nullable = false)
    private Boolean downloaded = false;
    
    @Column(name = "assigned_member_id")
    private Long assignedMemberId;
    
    public SimpleProtocolAssignment() {}
    
    public SimpleProtocolAssignment(Long protocolId, Long assignedMemberId) {
        if (protocolId == null || protocolId <= 0) {
            throw new IllegalArgumentException("Protocol ID must be valid and positive");
        }
        if (assignedMemberId == null || assignedMemberId <= 0) {
            throw new IllegalArgumentException("Assigned member ID must be valid and positive");
        }
        this.protocolId = protocolId;
        this.assignedMemberId = assignedMemberId;
        this.assignedAt = LocalDateTime.now();
        this.canEdit = true;
        this.downloaded = false;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProtocolId() { return protocolId; }
    public void setProtocolId(Long protocolId) { this.protocolId = protocolId; }
    
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    
    public Boolean getCanEdit() { return canEdit; }
    public void setCanEdit(Boolean canEdit) { this.canEdit = canEdit; }
    
    public Boolean getDownloaded() { return downloaded; }
    public void setDownloaded(Boolean downloaded) { this.downloaded = downloaded; }
    
    public boolean isDownloaded() { return downloaded != null && downloaded; }
    
    public Long getAssignedMemberId() { return assignedMemberId; }
    public void setAssignedMemberId(Long assignedMemberId) { this.assignedMemberId = assignedMemberId; }
}