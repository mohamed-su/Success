package comite.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class ProtocolSubmissionRequestDto {
    
    @NotBlank(message = "Le titre est obligatoire")
    private String title;
    
    @NotBlank(message = "La description est obligatoire")
    private String description;
    
    private String studyType;
    
    private String principalInvestigator;
    
    private String institution;
    
    @Min(value = 1, message = "La durée doit être d'au moins 1 mois")
    @Max(value = 120, message = "La durée ne peut pas dépasser 120 mois")
    private Integer studyDurationMonths;
    
    @Min(value = 1, message = "Le nombre de participants doit être d'au moins 1")
    private Integer participantCount;
    
    private String ethicalConsiderations;
    
    // Informations du soumetteur (pour soumission publique)
    private String submitterName;
    private String submitterEmail;
    
    // Constructeurs
    public ProtocolSubmissionRequestDto() {}
    
    public ProtocolSubmissionRequestDto(String title, String description) {
        this.title = title;
        this.description = description;
    }
    
    // Getters et Setters
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
    
    public Integer getStudyDurationMonths() { return studyDurationMonths; }
    public void setStudyDurationMonths(Integer studyDurationMonths) { this.studyDurationMonths = studyDurationMonths; }
    
    public Integer getParticipantCount() { return participantCount; }
    public void setParticipantCount(Integer participantCount) { this.participantCount = participantCount; }
    
    public String getEthicalConsiderations() { return ethicalConsiderations; }
    public void setEthicalConsiderations(String ethicalConsiderations) { this.ethicalConsiderations = ethicalConsiderations; }
    
    public String getSubmitterName() { return submitterName; }
    public void setSubmitterName(String submitterName) { this.submitterName = submitterName; }
    
    public String getSubmitterEmail() { return submitterEmail; }
    public void setSubmitterEmail(String submitterEmail) { this.submitterEmail = submitterEmail; }
    
    @Override
    public String toString() {
        return "ProtocolSubmissionRequestDto{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", studyType='" + studyType + '\'' +
                ", principalInvestigator='" + principalInvestigator + '\'' +
                ", institution='" + institution + '\'' +
                ", studyDurationMonths=" + studyDurationMonths +
                ", participantCount=" + participantCount +
                ", submitterName='" + submitterName + '\'' +
                ", submitterEmail='" + submitterEmail + '\'' +
                '}';
    }
}