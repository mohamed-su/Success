package comite.demo.service;

import comite.demo.dto.ProtocolSubmissionDTO;
import comite.demo.entity.ProtocolSubmission;
import comite.demo.entity.User;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProtocolSubmissionService {
    
    @Autowired
    private ProtocolSubmissionRepository repository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private UserRepository userRepository;
    
    public ProtocolSubmission submitProtocol(ProtocolSubmissionDTO dto,
                                           MultipartFile protocolFile,
                                           MultipartFile consentForm,
                                           MultipartFile[] cvFiles,
                                           MultipartFile paymentReceipt) {
        
        ProtocolSubmission submission = new ProtocolSubmission();
        
        // Copier les données du DTO
        submission.setTitle(dto.getTitle());
        submission.setDescription(dto.getDescription());
        submission.setStudyType(dto.getStudyType());
        submission.setPrincipalInvestigator(dto.getPrincipalInvestigator());
        submission.setInstitution(dto.getInstitution());
        submission.setDuration(dto.getDuration());
        submission.setParticipants(dto.getParticipants());
        submission.setEthicsConsiderations(dto.getEthicsConsiderations());
        
        // Gérer les noms de fichiers
        submission.setProtocolFileName(getFileName(protocolFile));
        submission.setConsentFormFileName(getFileName(consentForm));
        submission.setPaymentReceiptFileName(getFileName(paymentReceipt));
        submission.setCvFilesNames(getCvFileNames(cvFiles));
        
        // Définir les valeurs par défaut
        submission.setStatus("SUBMITTED");
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setSubmitterName("Chercheur Test");
        
        ProtocolSubmission savedSubmission = repository.save(submission);
        
        // Envoyer email de confirmation au chercheur
        sendSubmissionConfirmationEmail(savedSubmission);
        
        // Envoyer email de notification aux secrétaires
        sendAssignmentNotificationToSecretaries(savedSubmission);
        
        return savedSubmission;
    }
    
    private String getFileName(MultipartFile file) {
        return (file != null && !file.isEmpty()) ? file.getOriginalFilename() : "Aucun fichier";
    }
    
    private String getCvFileNames(MultipartFile[] files) {
        if (files == null || files.length == 0) return "Aucun CV";
        
        StringBuilder names = new StringBuilder();
        for (int i = 0; i < files.length; i++) {
            if (files[i] != null && !files[i].isEmpty()) {
                names.append(files[i].getOriginalFilename());
                if (i < files.length - 1) names.append(", ");
            }
        }
        return names.toString();
    }
    
    public List<ProtocolSubmission> getAllSubmissions() {
        return repository.findAll();
    }
    
    public ProtocolSubmission getSubmissionById(Long id) {
        return repository.findById(id).orElse(null);
    }
    
    public void updateProtocolStatus(Long protocolId, String status, String comments) {
        ProtocolSubmission protocol = repository.findById(protocolId).orElse(null);
        if (protocol != null) {
            protocol.setStatus(status);
            if ("APPROVED".equals(status)) {
                protocol.setEvaluatedAt(LocalDateTime.now());
                sendApprovalNotificationEmail(protocol);
            } else if ("REJECTED".equals(status)) {
                protocol.setEvaluatedAt(LocalDateTime.now());
                sendRejectionNotificationEmail(protocol, comments);
            }
            repository.save(protocol);
        }
    }
    
    private void sendSubmissionConfirmationEmail(ProtocolSubmission submission) {
        try {
            // Essayer de trouver l'utilisateur par submitterIdentifier ou submitterName
            String submitterEmail = findSubmitterEmail(submission);
            if (submitterEmail != null) {
                emailService.sendProtocolSubmissionConfirmation(
                    submitterEmail,
                    submission.getSubmitterName(),
                    submission.getTitle(),
                    submission.getId()
                );
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email de confirmation: " + e.getMessage());
        }
    }
    
    private void sendAssignmentNotificationToSecretaries(ProtocolSubmission submission) {
        try {
            // Trouver tous les utilisateurs avec le rôle SECRETARY
            List<User> secretaries = userRepository.findByRole(User.Role.SECRETARY);
            for (User secretary : secretaries) {
                if (secretary.getEmail() != null) {
                    emailService.sendProtocolAssignmentNotification(
                        secretary.getEmail(),
                        secretary.getFirstName() + " " + secretary.getLastName(),
                        submission.getTitle(),
                        submission.getId(),
                        submission.getSubmitterName()
                    );
                }
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi des emails aux secrétaires: " + e.getMessage());
        }
    }
    
    private void sendApprovalNotificationEmail(ProtocolSubmission submission) {
        try {
            String submitterEmail = findSubmitterEmail(submission);
            if (submitterEmail != null) {
                emailService.sendProtocolApprovalNotification(
                    submitterEmail,
                    submission.getSubmitterName(),
                    submission.getTitle(),
                    submission.getId()
                );
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email d'approbation: " + e.getMessage());
        }
    }
    
    private void sendRejectionNotificationEmail(ProtocolSubmission submission, String rejectionReason) {
        try {
            String submitterEmail = findSubmitterEmail(submission);
            if (submitterEmail != null) {
                emailService.sendProtocolRejectionNotification(
                    submitterEmail,
                    submission.getSubmitterName(),
                    submission.getTitle(),
                    submission.getId(),
                    rejectionReason != null ? rejectionReason : "Voir les commentaires du comité"
                );
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email de rejet: " + e.getMessage());
        }
    }
    
    private String findSubmitterEmail(ProtocolSubmission submission) {
        // Essayer de trouver l'email par submitterIdentifier
        if (submission.getSubmitterIdentifier() != null) {
            User user = userRepository.findByUserIdentifier(submission.getSubmitterIdentifier()).orElse(null);
            if (user != null && user.getEmail() != null) {
                return user.getEmail();
            }
        }
        
        // Essayer de trouver par nom d'utilisateur (submitterName)
        if (submission.getSubmitterName() != null) {
            User user = userRepository.findByUsername(submission.getSubmitterName()).orElse(null);
            if (user != null && user.getEmail() != null) {
                return user.getEmail();
            }
        }
        
        return null;
    }
}