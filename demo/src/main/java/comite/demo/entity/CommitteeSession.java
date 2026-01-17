package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "committee_sessions")
public class CommitteeSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "session_date")
    private LocalDateTime sessionDate;
    
    @Column(name = "rapporteur_id")
    private Long rapporteurId;
    
    @Column(name = "rapporteur_name")
    private String rapporteurName;
    
    @Column(name = "designated_by_id")
    private Long designatedById;
    
    @Column(name = "designated_by_name")
    private String designatedByName;
    
    @Column(name = "status")
    private String status; // ACTIVE, COMPLETED
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Constructeurs
    public CommitteeSession() {}
    
    public CommitteeSession(Long rapporteurId, String rapporteurName, Long designatedById, String designatedByName) {
        this.rapporteurId = rapporteurId;
        this.rapporteurName = rapporteurName;
        this.designatedById = designatedById;
        this.designatedByName = designatedByName;
        this.sessionDate = LocalDateTime.now();
        this.status = "ACTIVE";
    }
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDateTime getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDateTime sessionDate) { this.sessionDate = sessionDate; }
    
    public Long getRapporteurId() { return rapporteurId; }
    public void setRapporteurId(Long rapporteurId) { this.rapporteurId = rapporteurId; }
    
    public String getRapporteurName() { return rapporteurName; }
    public void setRapporteurName(String rapporteurName) { this.rapporteurName = rapporteurName; }
    
    public Long getDesignatedById() { return designatedById; }
    public void setDesignatedById(Long designatedById) { this.designatedById = designatedById; }
    
    public String getDesignatedByName() { return designatedByName; }
    public void setDesignatedByName(String designatedByName) { this.designatedByName = designatedByName; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}