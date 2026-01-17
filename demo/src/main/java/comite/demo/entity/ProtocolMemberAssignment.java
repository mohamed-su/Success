package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "protocol_member_assignments")
public class ProtocolMemberAssignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "protocol_id")
    private Long protocolId;
    
    @Column(name = "member_id")
    private Long memberId;
    
    @Column(name = "member_name")
    private String memberName;
    
    @Column(name = "assigned_by_id")
    private Long assignedById;
    
    @Column(name = "assigned_by_name")
    private String assignedByName;
    
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
    
    @Column(name = "status")
    private String status;
    
    @Column(name = "comments")
    private String comments;
    
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    
    public ProtocolMemberAssignment() {}
    
    public ProtocolMemberAssignment(Long protocolId, Long memberId, String memberName, 
                                   Long assignedById, String assignedByName) {
        this.protocolId = protocolId;
        this.memberId = memberId;
        this.memberName = memberName;
        this.assignedById = assignedById;
        this.assignedByName = assignedByName;
        this.assignedAt = LocalDateTime.now();
        this.status = "ASSIGNED";
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProtocolId() { return protocolId; }
    public void setProtocolId(Long protocolId) { this.protocolId = protocolId; }
    
    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }
    
    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }
    
    public Long getAssignedById() { return assignedById; }
    public void setAssignedById(Long assignedById) { this.assignedById = assignedById; }
    
    public String getAssignedByName() { return assignedByName; }
    public void setAssignedByName(String assignedByName) { this.assignedByName = assignedByName; }
    
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}