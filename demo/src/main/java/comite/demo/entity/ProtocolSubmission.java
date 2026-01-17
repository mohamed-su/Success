package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "protocol_submissions")
public class ProtocolSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    private String studyType;
    private String principalInvestigator;
    private String institution;
    private Integer duration;
    private Integer participants;
    
    @Column(columnDefinition = "TEXT")
    private String ethicsConsiderations;
    
    private String protocolFileName;
    private String consentFormFileName;
    private String cvFilesNames;
    private String paymentReceiptFileName;
    
    // Nouveaux fichiers obligatoires
    private String presidentLetterFileName;
    private String informationNoticeFileName;
    private String informedConsentFileName;
    private String chronogramFileName;
    private String detailedBudgetFileName;
    private String evaluationReportFileName;
    
    @Column(nullable = false)
    private String status = "DRAFT";
    
    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    private LocalDateTime verifiedAt;
    
    private String submitterName;
    private String submitterIdentifier;
    
    @Column(columnDefinition = "TEXT")
    private String verificationComments;
    
    // Champs pour la gestion des paiements
    @Column(nullable = false)
    private String paymentStatus = "PENDING"; // PENDING, PAID, VERIFIED
    
    private LocalDateTime paymentVerifiedAt;
    
    private Long paymentVerifiedBy; // ID de l'administrateur qui a vérifié
    
    @Column(columnDefinition = "TEXT")
    private String paymentComments;
    
    // Champs pour l'évaluation des protocoles
    @Column(name = "ethical_considerations", columnDefinition = "TEXT")
    private String ethicalConsiderations;
    
    @Column(name = "evaluation_comments", columnDefinition = "TEXT")
    private String evaluationComments;
    
    @Column(name = "evaluated_by")
    private String evaluatedBy;
    
    @Column(name = "evaluated_at")
    private LocalDateTime evaluatedAt;
    
    // Constructeurs
    public ProtocolSubmission() {}
    
    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getStudyType() { return studyType; }
    public void setStudyType(String studyType) { this.studyType = studyType; }
    
    public String getPrincipalInvestigator() { return principalInvestigator; }
    public void setPrincipalInvestigator(String principalInvestigator) { this.principalInvestigator = principalInvestigator; }
    
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public Integer getParticipants() { return participants; }
    public void setParticipants(Integer participants) { this.participants = participants; }
    
    public String getEthicsConsiderations() { return ethicsConsiderations; }
    public void setEthicsConsiderations(String ethicsConsiderations) { this.ethicsConsiderations = ethicsConsiderations; }
    
    public String getProtocolFileName() { return protocolFileName; }
    public void setProtocolFileName(String protocolFileName) { this.protocolFileName = protocolFileName; }
    
    public String getConsentFormFileName() { return consentFormFileName; }
    public void setConsentFormFileName(String consentFormFileName) { this.consentFormFileName = consentFormFileName; }
    
    public String getCvFilesNames() { return cvFilesNames; }
    public void setCvFilesNames(String cvFilesNames) { this.cvFilesNames = cvFilesNames; }
    
    public String getPaymentReceiptFileName() { return paymentReceiptFileName; }
    public void setPaymentReceiptFileName(String paymentReceiptFileName) { this.paymentReceiptFileName = paymentReceiptFileName; }
    
    public String getPresidentLetterFileName() { return presidentLetterFileName; }
    public void setPresidentLetterFileName(String presidentLetterFileName) { this.presidentLetterFileName = presidentLetterFileName; }
    
    public String getInformationNoticeFileName() { return informationNoticeFileName; }
    public void setInformationNoticeFileName(String informationNoticeFileName) { this.informationNoticeFileName = informationNoticeFileName; }
    
    public String getInformedConsentFileName() { return informedConsentFileName; }
    public void setInformedConsentFileName(String informedConsentFileName) { this.informedConsentFileName = informedConsentFileName; }
    
    public String getChronogramFileName() { return chronogramFileName; }
    public void setChronogramFileName(String chronogramFileName) { this.chronogramFileName = chronogramFileName; }
    
    public String getDetailedBudgetFileName() { return detailedBudgetFileName; }
    public void setDetailedBudgetFileName(String detailedBudgetFileName) { this.detailedBudgetFileName = detailedBudgetFileName; }
    
    public String getEvaluationReportFileName() { return evaluationReportFileName; }
    public void setEvaluationReportFileName(String evaluationReportFileName) { this.evaluationReportFileName = evaluationReportFileName; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public String getSubmitterName() { return submitterName; }
    public void setSubmitterName(String submitterName) { this.submitterName = submitterName; }
    
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
    
    public String getVerificationComments() { return verificationComments; }
    public void setVerificationComments(String verificationComments) { this.verificationComments = verificationComments; }
    
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public LocalDateTime getPaymentVerifiedAt() { return paymentVerifiedAt; }
    public void setPaymentVerifiedAt(LocalDateTime paymentVerifiedAt) { this.paymentVerifiedAt = paymentVerifiedAt; }
    
    public Long getPaymentVerifiedBy() { return paymentVerifiedBy; }
    public void setPaymentVerifiedBy(Long paymentVerifiedBy) { this.paymentVerifiedBy = paymentVerifiedBy; }
    
    public String getPaymentComments() { return paymentComments; }
    public void setPaymentComments(String paymentComments) { this.paymentComments = paymentComments; }
    
    public String getSubmitterIdentifier() { return submitterIdentifier; }
    public void setSubmitterIdentifier(String submitterIdentifier) { this.submitterIdentifier = submitterIdentifier; }
    
    public String getEthicalConsiderations() { return ethicalConsiderations; }
    public void setEthicalConsiderations(String ethicalConsiderations) { this.ethicalConsiderations = ethicalConsiderations; }
    
    public String getEvaluationComments() { return evaluationComments; }
    public void setEvaluationComments(String evaluationComments) { this.evaluationComments = evaluationComments; }
    
    public String getEvaluatedBy() { return evaluatedBy; }
    public void setEvaluatedBy(String evaluatedBy) { this.evaluatedBy = evaluatedBy; }
    
    public LocalDateTime getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(LocalDateTime evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}