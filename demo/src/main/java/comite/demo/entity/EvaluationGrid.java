package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evaluation_grids")
public class EvaluationGrid {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long protocolId;
    
    @Column(nullable = false)
    private Long memberId;
    
    private String memberName;
    
    // Critères d'évaluation (échelle 1-5)
    private Integer scientificQuality; // Qualité scientifique
    private Integer ethicalCompliance; // Conformité éthique
    private Integer methodologyClarity; // Clarté méthodologique
    private Integer riskBenefitRatio; // Rapport risque/bénéfice
    private Integer informedConsentQuality; // Qualité du consentement éclairé
    private Integer dataProtection; // Protection des données
    private Integer participantSafety; // Sécurité des participants
    private Integer feasibility; // Faisabilité
    
    @Column(columnDefinition = "TEXT")
    private String strengths; // Points forts
    
    @Column(columnDefinition = "TEXT")
    private String weaknesses; // Points faibles
    
    @Column(columnDefinition = "TEXT")
    private String recommendations; // Recommandations
    
    @Column(columnDefinition = "TEXT")
    private String generalComments; // Commentaires généraux
    
    @Column
    private String decision; // APPROVE, MINOR_REVISION, MAJOR_REVISION, REJECT
    
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, COMPLETED
    
    @Column(nullable = false)
    private LocalDateTime assignedAt = LocalDateTime.now();
    
    private LocalDateTime completedAt;
    
    // Constructeurs
    public EvaluationGrid() {}
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProtocolId() { return protocolId; }
    public void setProtocolId(Long protocolId) { this.protocolId = protocolId; }
    
    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }
    
    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }
    
    public Integer getScientificQuality() { return scientificQuality; }
    public void setScientificQuality(Integer scientificQuality) { this.scientificQuality = scientificQuality; }
    
    public Integer getEthicalCompliance() { return ethicalCompliance; }
    public void setEthicalCompliance(Integer ethicalCompliance) { this.ethicalCompliance = ethicalCompliance; }
    
    public Integer getMethodologyClarity() { return methodologyClarity; }
    public void setMethodologyClarity(Integer methodologyClarity) { this.methodologyClarity = methodologyClarity; }
    
    public Integer getRiskBenefitRatio() { return riskBenefitRatio; }
    public void setRiskBenefitRatio(Integer riskBenefitRatio) { this.riskBenefitRatio = riskBenefitRatio; }
    
    public Integer getInformedConsentQuality() { return informedConsentQuality; }
    public void setInformedConsentQuality(Integer informedConsentQuality) { this.informedConsentQuality = informedConsentQuality; }
    
    public Integer getDataProtection() { return dataProtection; }
    public void setDataProtection(Integer dataProtection) { this.dataProtection = dataProtection; }
    
    public Integer getParticipantSafety() { return participantSafety; }
    public void setParticipantSafety(Integer participantSafety) { this.participantSafety = participantSafety; }
    
    public Integer getFeasibility() { return feasibility; }
    public void setFeasibility(Integer feasibility) { this.feasibility = feasibility; }
    
    public String getStrengths() { return strengths; }
    public void setStrengths(String strengths) { this.strengths = strengths; }
    
    public String getWeaknesses() { return weaknesses; }
    public void setWeaknesses(String weaknesses) { this.weaknesses = weaknesses; }
    
    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    
    public String getGeneralComments() { return generalComments; }
    public void setGeneralComments(String generalComments) { this.generalComments = generalComments; }
    
    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    // Méthode utilitaire pour calculer le score moyen
    public Double getAverageScore() {
        int count = 0;
        int sum = 0;
        
        if (scientificQuality != null) { sum += scientificQuality; count++; }
        if (ethicalCompliance != null) { sum += ethicalCompliance; count++; }
        if (methodologyClarity != null) { sum += methodologyClarity; count++; }
        if (riskBenefitRatio != null) { sum += riskBenefitRatio; count++; }
        if (informedConsentQuality != null) { sum += informedConsentQuality; count++; }
        if (dataProtection != null) { sum += dataProtection; count++; }
        if (participantSafety != null) { sum += participantSafety; count++; }
        if (feasibility != null) { sum += feasibility; count++; }
        
        return count > 0 ? (double) sum / count : 0.0;
    }
}
