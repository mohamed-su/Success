package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "protocol_evaluation_criteria")
public class ProtocolEvaluationCriteria {
    
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
    private String evaluatorRole; // PRESIDENT, MEMBER, RAPPORTEUR
    
    // Critères spécifiques du formulaire
    @Column(name = "protocol_french")
    private String protocolFrench; // Oui/Non/NA
    
    @Column(name = "cv_signed")
    private String cvSigned; // Oui/Non/NA
    
    @Column(name = "consent_form")
    private String consentForm; // Oui/Non/NA
    
    @Column(name = "insurance")
    private String insurance; // Oui/Non/NA
    
    @Column(name = "payment_proof")
    private String paymentProof; // Oui/Non/NA
    
    @Column(name = "investigator_qualified")
    private String investigatorQualified; // Oui/Non/NA
    
    @Column(name = "investigator_explanation", columnDefinition = "TEXT")
    private String investigatorExplanation;
    
    @Column(name = "associated_investigators")
    private String associatedInvestigators; // Oui/Non/NA
    
    @Column(name = "study_justification")
    private String studyJustification; // Oui/Non/NA
    
    @Column(name = "methodology")
    private String methodology; // Oui/Non/NA
    
    @Column(name = "budget")
    private String budget; // Oui/Non/NA
    
    @Column(name = "investigation_product")
    private String investigationProduct; // Oui/Non/NA
    
    @Column(name = "comparator_product")
    private String comparatorProduct; // Oui/Non/NA
    
    @Column(name = "concomitant_product")
    private String concomitantProduct; // Oui/Non/NA
    
    // Commentaires pour chaque critère
    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments; // JSON des commentaires par critère
    
    // Décision finale
    @Column(name = "decision")
    private String decision; // Favorable/Ajourné/Non favorable
    
    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;
    
    @Column(name = "status")
    private String status = "DRAFT"; // DRAFT, SUBMITTED
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Constructeurs
    public ProtocolEvaluationCriteria() {}
    
    public ProtocolEvaluationCriteria(Long protocolId, Long evaluatorId, String evaluatorName, String evaluatorRole) {
        this.protocolId = protocolId;
        this.evaluatorId = evaluatorId;
        this.evaluatorName = evaluatorName;
        this.evaluatorRole = evaluatorRole;
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
    
    public String getProtocolFrench() { return protocolFrench; }
    public void setProtocolFrench(String protocolFrench) { this.protocolFrench = protocolFrench; }
    
    public String getCvSigned() { return cvSigned; }
    public void setCvSigned(String cvSigned) { this.cvSigned = cvSigned; }
    
    public String getConsentForm() { return consentForm; }
    public void setConsentForm(String consentForm) { this.consentForm = consentForm; }
    
    public String getInsurance() { return insurance; }
    public void setInsurance(String insurance) { this.insurance = insurance; }
    
    public String getPaymentProof() { return paymentProof; }
    public void setPaymentProof(String paymentProof) { this.paymentProof = paymentProof; }
    
    public String getInvestigatorQualified() { return investigatorQualified; }
    public void setInvestigatorQualified(String investigatorQualified) { this.investigatorQualified = investigatorQualified; }
    
    public String getInvestigatorExplanation() { return investigatorExplanation; }
    public void setInvestigatorExplanation(String investigatorExplanation) { this.investigatorExplanation = investigatorExplanation; }
    
    public String getAssociatedInvestigators() { return associatedInvestigators; }
    public void setAssociatedInvestigators(String associatedInvestigators) { this.associatedInvestigators = associatedInvestigators; }
    
    public String getStudyJustification() { return studyJustification; }
    public void setStudyJustification(String studyJustification) { this.studyJustification = studyJustification; }
    
    public String getMethodology() { return methodology; }
    public void setMethodology(String methodology) { this.methodology = methodology; }
    
    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }
    
    public String getInvestigationProduct() { return investigationProduct; }
    public void setInvestigationProduct(String investigationProduct) { this.investigationProduct = investigationProduct; }
    
    public String getComparatorProduct() { return comparatorProduct; }
    public void setComparatorProduct(String comparatorProduct) { this.comparatorProduct = comparatorProduct; }
    
    public String getConcomitantProduct() { return concomitantProduct; }
    public void setConcomitantProduct(String concomitantProduct) { this.concomitantProduct = concomitantProduct; }
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
    
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Méthode pour soumettre l'évaluation
    public void submit() {
        this.status = "SUBMITTED";
        this.submittedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}