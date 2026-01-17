package comite.demo.dto;

public class ProtocolSubmissionDTO {
    private String title;
    private String description;
    private String studyType;
    private String principalInvestigator;
    private String institution;
    private Integer duration;
    private Integer participants;
    private String ethicsConsiderations;
    
    public ProtocolSubmissionDTO() {}
    
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
}