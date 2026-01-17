package comite.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "member_evaluation_grids")
public class MemberEvaluationGrid {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "protocol_id", nullable = false)
    @NotNull(message = "L'ID du protocole est obligatoire")
    private Long protocolId;
    
    @Column(name = "member_id", nullable = false)
    @NotNull(message = "L'ID du membre est obligatoire")
    private Long memberId;
    
    @Column(name = "member_name", nullable = false)
    @NotBlank(message = "Le nom du membre est obligatoire")
    private String memberName;
    
    // Critères d'évaluation OBLIGATOIRES (échelle 1-5)
    @Column(name = "scientific_quality", nullable = false)
    @NotNull(message = "La qualité scientifique doit être évaluée")
    @Min(value = 1, message = "La note doit être entre 1 et 5")
    @Max(value = 5, message = "La note doit être entre 1 et 5")
    private Integer scientificQuality;
    
    @Column(name = "ethical_compliance", nullable = false)
    @NotNull(message = "La conformité éthique doit être évaluée")
    @Min(value = 1, message = "La note doit être entre 1 et 5")
    @Max(value = 5, message = "La note doit être entre 1 et 5")
    private Integer ethicalCompliance;
    
    @Column(name = "methodology_clarity", nullable = false)
    @NotNull(message = "La clarté méthodologique doit être évaluée")
    @Min(value = 1, message = "La note doit être entre 1 et 5")
    @Max(value = 5, message = "La note doit être entre 1 et 5")
    private Integer methodologyClarity;
    
    @Column(name = "risk_benefit_ratio", nullable = false)
    @NotNull(message = "Le rapport risque/bénéfice doit être évalué")
    @Min(value = 1, message = "La note doit être entre 1 et 5")
    @Max(value = 5, message = "La note doit être entre 1 et 5")
    private Integer riskBenefitRatio;
    
    @Column(name = "informed_consent_quality", nullable = false)
    @NotNull(message = "La qualité du consentement éclairé doit être évaluée")
    @Min(value = 1, message = "La note doit être entre 1 et 5")
    @Max(value = 5, message = "La note doit être entre 1 et 5")
    private Integer informedConsentQuality;
    
    @Column(name = "data_protection")
    private Integer dataProtection;
    
    @Column(name = "participant_safety")
    private Integer participantSafety;
    
    // Critères spécifiques Section 1
    @Column(name = "protocol_french")
    private String protocolFrench; // "Oui" ou "Non"
    
    @Column(name = "cv_signed")
    private String cvSigned; // "Oui" ou "Non"
    
    @Column(name = "consent_form")
    private String consentForm; // "Oui" ou "Non"
    
    @Column(name = "insurance")
    private String insurance; // "Oui", "Non", ou "NA"
    
    @Column(name = "payment_proof")
    private String paymentProof; // "Oui" ou "Non"
    
    @Column(name = "investigator_qualified", columnDefinition = "TEXT")
    private String investigatorQualified;
    
    @Column(name = "associated_investigators", columnDefinition = "TEXT")
    private String associatedInvestigators;
    
    @Column(name = "justification_objectives", columnDefinition = "TEXT")
    private String justificationObjectives;
    
    @Column(name = "methodology_solid", columnDefinition = "TEXT")
    private String methodologySolid;
    
    @Column(name = "budget_appropriate", columnDefinition = "TEXT")
    private String budgetAppropriate;
    
    @Column(name = "trial_product", columnDefinition = "TEXT")
    private String trialProduct;
    
    @Column(name = "comparator_product", columnDefinition = "TEXT")
    private String comparatorProduct;
    
    @Column(name = "concomitant_product", columnDefinition = "TEXT")
    private String concomitantProduct;
    
    @Column(name = "feasibility")
    private Integer feasibility;
    
    // Commentaires OBLIGATOIRES
    @Column(columnDefinition = "TEXT")
    private String strengths;
    
    @Column(columnDefinition = "TEXT")
    private String weaknesses;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    @NotBlank(message = "Les recommandations sont obligatoires")
    private String recommendations;
    
    @Column(name = "general_comments", columnDefinition = "TEXT")
    private String generalComments;
    
    // Commentaires par critère (JSON)
    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;
    
    // Décision finale et signature
    @Column(name = "final_decision")
    private String finalDecision;
    
    @Column(name = "signature_image", columnDefinition = "TEXT")
    private String signatureImage;
    
    @Column(name = "evaluator_name")
    private String evaluatorName;
    
    @Column(name = "evaluation_date")
    private java.time.LocalDate evaluationDate;
    
    // Décision OBLIGATOIRE
    @Column(nullable = false)
    @NotBlank(message = "La décision finale est obligatoire")
    @Pattern(regexp = "APPROVE|MINOR_REVISION|MAJOR_REVISION|REJECT", 
             message = "La décision doit être: APPROVE, MINOR_REVISION, MAJOR_REVISION ou REJECT")
    private String decision;
    
    @Column(nullable = false)
    private String status = "DRAFT";
    
    // Chemin du PDF généré
    @Column(name = "pdf_path")
    private String pdfPath;
    
    @Column(name = "pdf_generated_at")
    private LocalDateTime pdfGeneratedAt;
    
    // Dates
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Constructeurs
    public MemberEvaluationGrid() {}
    
    public MemberEvaluationGrid(Long protocolId, Long memberId, String memberName) {
        this.protocolId = protocolId;
        this.memberId = memberId;
        this.memberName = memberName;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Validation métier
    public List<String> validateForSubmission() {
        List<String> errors = new ArrayList<>();
        
        // Validation flexible - au moins la décision et les recommandations sont obligatoires
        if (recommendations == null || recommendations.trim().isEmpty()) {
            errors.add("Les recommandations sont obligatoires");
        }
        
        if (decision == null || decision.trim().isEmpty()) {
            errors.add("La décision finale est obligatoire");
        }
        
        return errors;
    }
    
    public boolean isReadyForSubmission() {
        return validateForSubmission().isEmpty();
    }
    
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
    
    public String getAssociatedInvestigators() { return associatedInvestigators; }
    public void setAssociatedInvestigators(String associatedInvestigators) { this.associatedInvestigators = associatedInvestigators; }
    
    public String getJustificationObjectives() { return justificationObjectives; }
    public void setJustificationObjectives(String justificationObjectives) { this.justificationObjectives = justificationObjectives; }
    
    public String getMethodologySolid() { return methodologySolid; }
    public void setMethodologySolid(String methodologySolid) { this.methodologySolid = methodologySolid; }
    
    public String getBudgetAppropriate() { return budgetAppropriate; }
    public void setBudgetAppropriate(String budgetAppropriate) { this.budgetAppropriate = budgetAppropriate; }
    
    public String getTrialProduct() { return trialProduct; }
    public void setTrialProduct(String trialProduct) { this.trialProduct = trialProduct; }
    
    public String getComparatorProduct() { return comparatorProduct; }
    public void setComparatorProduct(String comparatorProduct) { this.comparatorProduct = comparatorProduct; }
    
    public String getConcomitantProduct() { return concomitantProduct; }
    public void setConcomitantProduct(String concomitantProduct) { this.concomitantProduct = concomitantProduct; }
    
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
    
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    
    public String getFinalDecision() { return finalDecision; }
    public void setFinalDecision(String finalDecision) { this.finalDecision = finalDecision; }
    
    public String getSignatureImage() { return signatureImage; }
    public void setSignatureImage(String signatureImage) { this.signatureImage = signatureImage; }
    
    public String getEvaluatorName() { return evaluatorName; }
    public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }
    
    public java.time.LocalDate getEvaluationDate() { return evaluationDate; }
    public void setEvaluationDate(java.time.LocalDate evaluationDate) { this.evaluationDate = evaluationDate; }
    
    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getPdfPath() { return pdfPath; }
    public void setPdfPath(String pdfPath) { this.pdfPath = pdfPath; }
    
    public LocalDateTime getPdfGeneratedAt() { return pdfGeneratedAt; }
    public void setPdfGeneratedAt(LocalDateTime pdfGeneratedAt) { this.pdfGeneratedAt = pdfGeneratedAt; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
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
    
    // Méthode pour soumettre la grille avec validation
    public void submit() {
        if (!isReadyForSubmission()) {
            throw new IllegalStateException("Impossible de soumettre: critères manquants");
        }
        this.status = "COMPLETED";
        this.submittedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}