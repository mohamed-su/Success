package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "protocol_evaluation_forms")
public class ProtocolEvaluationForm {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long protocolId;
    
    @Column(nullable = false)
    private Long memberId;
    
    @Column(nullable = false)
    private Long researcherId;
    
    private String protocolFrench;
    private String cvSigned;
    private String consentForm;
    private String insurance;
    private String paymentProof;
    
    private String investigatorQualified;
    
    @Column(columnDefinition = "TEXT")
    private String investigatorExplanation;
    
    private String associatedInvestigators;
    private String studyJustification;
    private String methodology;
    private String budget;
    private String investigationProduct;
    private String comparatorProduct;
    private String concomitantProduct;
    
    @Column(columnDefinition = "TEXT")
    private String comments;
    
    private String decision;
    
    @Column(columnDefinition = "TEXT")
    private String observations;
    
    private String evaluatorName;
    private String signatureFileName;
    private String status;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime submittedAt;
    
    public ProtocolEvaluationForm() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProtocolId() { return protocolId; }
    public void setProtocolId(Long protocolId) { this.protocolId = protocolId; }
    
    public Long getMemberId() { return memberId; }
    public void setMemberId(Long memberId) { this.memberId = memberId; }
    
    public Long getResearcherId() { return researcherId; }
    public void setResearcherId(Long researcherId) { this.researcherId = researcherId; }
    
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
    
    public String getEvaluatorName() { return evaluatorName; }
    public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }
    
    public String getSignatureFileName() { return signatureFileName; }
    public void setSignatureFileName(String signatureFileName) { this.signatureFileName = signatureFileName; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
