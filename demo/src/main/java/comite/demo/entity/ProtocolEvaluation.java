package comite.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "protocol_evaluations")
public class ProtocolEvaluation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "protocol_id")
    private Long protocolId;
    
    @Column(name = "evaluator_id")
    private Long evaluatorId;
    
    @Column(name = "nom_evaluateur")
    private String nomEvaluateur;
    
    @Column(name = "recommandation_finale")
    private String recommandationFinale;
    
    @Column(name = "evaluation_form_data", columnDefinition = "TEXT")
    private String evaluationFormData;
    
    @Column(name = "evaluation_date")
    private LocalDateTime evaluationDate;
    
    @Column(name = "is_final")
    private Boolean isFinal;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "president_signature_date")
    private LocalDateTime presidentSignatureDate;
    
    @Column(name = "president_name")
    private String presidentName;
    
    @Column(name = "secretary_stamp_date")
    private LocalDateTime secretaryStampDate;
    
    @Column(name = "secretary_name")
    private String secretaryName;
    
    @Column(name = "status")
    private String status;

    // ===== COLONNES MANQUANTES =====
    
    @Column(name = "deliberation_number")
    private String deliberationNumber;
    
    @Column(name = "research_title")
    private String researchTitle;
    
    @Column(name = "protocol_reference")
    private String protocolReference;
    
    @Column(name = "principal_investigator")
    private String principalInvestigator;
    
    @Column(name = "requester_reference")
    private String requesterReference;
    
    @Column(name = "research_site")
    private String researchSite;
    
    @Column(name = "deliberation_date")
    private LocalDate deliberationDate;
    
    @Column(name = "documentation")
    private String documentation;
    
    @Column(name = "scientific_conception")
    private Boolean scientificConception;
    
    @Column(name = "participant_protection")
    private Boolean participantProtection;
    
    @Column(name = "data_confidentiality")
    private Boolean dataConfidentiality;
    
    @Column(name = "consent_process")
    private Boolean consentProcess;
    
    @Column(name = "research_budget")
    private Boolean researchBudget;
    
    @Column(name = "cv_documents")
    private Boolean cvDocuments;
    
    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;
    
    @Column(name = "reserves", columnDefinition = "TEXT")
    private String reserves;
    
    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;
    
    @Column(name = "members_present", columnDefinition = "TEXT")
    private String membersPresent;
    
    @Column(name = "president_signature", columnDefinition = "TEXT")
    private String presidentSignature;

    // Constructeurs
    public ProtocolEvaluation() {}
    
    public ProtocolEvaluation(Long protocolId, Long evaluatorId) {
        this.protocolId = protocolId;
        this.evaluatorId = evaluatorId;
        this.createdAt = LocalDateTime.now();
        this.evaluationDate = LocalDateTime.now();
        this.isFinal = false;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getProtocolId() { return protocolId; }
    public void setProtocolId(Long protocolId) { this.protocolId = protocolId; }
    
    public Long getEvaluatorId() { return evaluatorId; }
    public void setEvaluatorId(Long evaluatorId) { this.evaluatorId = evaluatorId; }
    
    public String getNomEvaluateur() { return nomEvaluateur; }
    public void setNomEvaluateur(String nomEvaluateur) { this.nomEvaluateur = nomEvaluateur; }
    
    public String getRecommandationFinale() { return recommandationFinale; }
    public void setRecommandationFinale(String recommandationFinale) { this.recommandationFinale = recommandationFinale; }
    
    public String getEvaluationFormData() { return evaluationFormData; }
    public void setEvaluationFormData(String evaluationFormData) { this.evaluationFormData = evaluationFormData; }
    
    public LocalDateTime getEvaluationDate() { return evaluationDate; }
    public void setEvaluationDate(LocalDateTime evaluationDate) { this.evaluationDate = evaluationDate; }
    
    public Boolean getIsFinal() { return isFinal; }
    public void setIsFinal(Boolean isFinal) { this.isFinal = isFinal; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getPresidentSignatureDate() { return presidentSignatureDate; }
    public void setPresidentSignatureDate(LocalDateTime presidentSignatureDate) { this.presidentSignatureDate = presidentSignatureDate; }
    
    public String getPresidentName() { return presidentName; }
    public void setPresidentName(String presidentName) { this.presidentName = presidentName; }
    
    public LocalDateTime getSecretaryStampDate() { return secretaryStampDate; }
    public void setSecretaryStampDate(LocalDateTime secretaryStampDate) { this.secretaryStampDate = secretaryStampDate; }
    
    public String getSecretaryName() { return secretaryName; }
    public void setSecretaryName(String secretaryName) { this.secretaryName = secretaryName; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    // ===== GETTERS ET SETTERS DES NOUVELLES COLONNES =====
    
    public String getDeliberationNumber() { return deliberationNumber; }
    public void setDeliberationNumber(String deliberationNumber) { this.deliberationNumber = deliberationNumber; }
    
    public String getResearchTitle() { return researchTitle; }
    public void setResearchTitle(String researchTitle) { this.researchTitle = researchTitle; }
    
    public String getProtocolReference() { return protocolReference; }
    public void setProtocolReference(String protocolReference) { this.protocolReference = protocolReference; }
    
    public String getPrincipalInvestigator() { return principalInvestigator; }
    public void setPrincipalInvestigator(String principalInvestigator) { this.principalInvestigator = principalInvestigator; }
    
    public String getRequesterReference() { return requesterReference; }
    public void setRequesterReference(String requesterReference) { this.requesterReference = requesterReference; }
    
    public String getResearchSite() { return researchSite; }
    public void setResearchSite(String researchSite) { this.researchSite = researchSite; }
    
    public LocalDate getDeliberationDate() { return deliberationDate; }
    public void setDeliberationDate(LocalDate deliberationDate) { this.deliberationDate = deliberationDate; }
    
    public String getDocumentation() { return documentation; }
    public void setDocumentation(String documentation) { this.documentation = documentation; }
    
    public Boolean getScientificConception() { return scientificConception; }
    public void setScientificConception(Boolean scientificConception) { this.scientificConception = scientificConception; }
    
    public Boolean getParticipantProtection() { return participantProtection; }
    public void setParticipantProtection(Boolean participantProtection) { this.participantProtection = participantProtection; }
    
    public Boolean getDataConfidentiality() { return dataConfidentiality; }
    public void setDataConfidentiality(Boolean dataConfidentiality) { this.dataConfidentiality = dataConfidentiality; }
    
    public Boolean getConsentProcess() { return consentProcess; }
    public void setConsentProcess(Boolean consentProcess) { this.consentProcess = consentProcess; }
    
    public Boolean getResearchBudget() { return researchBudget; }
    public void setResearchBudget(Boolean researchBudget) { this.researchBudget = researchBudget; }
    
    public Boolean getCvDocuments() { return cvDocuments; }
    public void setCvDocuments(Boolean cvDocuments) { this.cvDocuments = cvDocuments; }
    
    public String getObservations() { return observations; }
    public void setObservations(String observations) { this.observations = observations; }
    
    public String getReserves() { return reserves; }
    public void setReserves(String reserves) { this.reserves = reserves; }
    
    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    
    public String getMembersPresent() { return membersPresent; }
    public void setMembersPresent(String membersPresent) { this.membersPresent = membersPresent; }
    
    public String getPresidentSignature() { return presidentSignature; }
    public void setPresidentSignature(String presidentSignature) { this.presidentSignature = presidentSignature; }
    
    // ===== MÉTHODES DE COMPATIBILITÉ =====
    
    public Boolean getProtocoleFrancais() { return true; }
    public Boolean getCvInvestigateurs() { return this.cvDocuments; }
    public Boolean getFormulaireConsentement() { return this.consentProcess; }
    public Boolean getCertificatAssurance() { return true; }
    public Boolean getPiecesPaiement() { return true; }
    public String getResumeObservations() { return this.evaluationFormData != null ? this.evaluationFormData : ""; }
}