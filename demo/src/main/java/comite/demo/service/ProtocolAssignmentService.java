package comite.demo.service;

import comite.demo.entity.ProtocolSubmission;
import comite.demo.entity.SimpleProtocolAssignment;
import comite.demo.entity.User;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.SimpleAssignmentRepository;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProtocolAssignmentService {

    @Autowired
    private SimpleAssignmentRepository assignmentRepository;
    
    @Autowired
    private ProtocolSubmissionRepository protocolRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProtocolValidationService validationService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Récupère tous les protocoles assignés à un utilisateur spécifique
     */
    public Map<String, Object> getUserAssignedProtocols(Long userId) {
        try {
            // Vérifier que l'utilisateur existe
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return createErrorResponse("Utilisateur non trouvé");
            }

            // Récupérer les assignations des deux tables
            List<SimpleProtocolAssignment> assignments = new ArrayList<>();
            try {
                assignments = assignmentRepository.findByAssignedMemberId(userId);
            } catch (Exception e) {
                assignments = new ArrayList<>();
            }
            
            // Ajouter les assignations de protocol_member_assignments
            try {
                String sql = "SELECT protocol_id FROM protocol_member_assignments WHERE member_id = ?";
                List<Map<String, Object>> memberAssignments = jdbcTemplate.queryForList(sql, userId);
                for (Map<String, Object> assignment : memberAssignments) {
                    Long protocolId = ((Number) assignment.get("protocol_id")).longValue();
                    boolean exists = assignments.stream().anyMatch(a -> a.getProtocolId().equals(protocolId));
                    if (!exists) {
                        SimpleProtocolAssignment newAssignment = new SimpleProtocolAssignment(protocolId, userId);
                        assignments.add(newAssignment);
                    }
                }
            } catch (Exception e) {
                // Ignorer les erreurs
            }
            
            // Construire la liste des protocoles avec leurs détails
            List<Map<String, Object>> protocols = assignments.stream()
                .map(assignment -> {
                    ProtocolSubmission protocol = protocolRepository.findById(assignment.getProtocolId()).orElse(null);
                    if (protocol != null) {
                        return buildProtocolResponse(protocol, assignment, user);
                    }
                    return null;
                })
                .filter(p -> p != null)
                .collect(Collectors.toList());

            return Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size(),
                "user", buildUserInfo(user)
            );
            
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of(
                "success", true,
                "protocols", new ArrayList<>(),
                "count", 0,
                "error", "Aucun protocole assigné"
            );
        }
    }

    /**
     * Assigne un protocole à un membre du comité
     */
    public Map<String, Object> assignProtocolToMember(Long protocolId, Long memberId) {
        try {
            // Vérifications
            ProtocolSubmission protocol = protocolRepository.findById(protocolId).orElse(null);
            if (protocol == null) {
                return createErrorResponse("Protocole non trouvé");
            }

            User member = userRepository.findById(memberId).orElse(null);
            if (member == null) {
                return createErrorResponse("Membre non trouvé");
            }

            // Vérifier si déjà assigné
            List<SimpleProtocolAssignment> existing = assignmentRepository.findByProtocolId(protocolId);
            if (!existing.isEmpty()) {
                User existingMember = userRepository.findById(existing.get(0).getAssignedMemberId()).orElse(null);
                return Map.of(
                    "success", true,
                    "message", "Protocole déjà assigné à " + (existingMember != null ? 
                        existingMember.getFirstName() + " " + existingMember.getLastName() : "un membre"),
                    "alreadyAssigned", true
                );
            }

            // Valider avant création
            validationService.validateProtocolAssignment(protocolId, memberId);
            
            // Créer l'assignation
            SimpleProtocolAssignment assignment = new SimpleProtocolAssignment(protocolId, memberId);
            assignmentRepository.save(assignment);

            // Mettre à jour le statut du protocole
            protocol.setStatus("ASSIGNED_TO_MEMBER");
            protocolRepository.save(protocol);

            return Map.of(
                "success", true,
                "message", "Protocole PROT-" + protocolId + " assigné à " + 
                    member.getFirstName() + " " + member.getLastName(),
                "assignment", buildAssignmentResponse(assignment, protocol, member),
                "protocolId", protocolId,
                "memberId", memberId
            );

        } catch (Exception e) {
            return createErrorResponse("Erreur lors de l'assignation: " + e.getMessage());
        }
    }

    /**
     * Marque un protocole comme téléchargé
     */
    public Map<String, Object> markProtocolAsDownloaded(Long protocolId, Long userId) {
        try {
            SimpleProtocolAssignment assignment = assignmentRepository.findByProtocolIdAndAssignedMemberId(protocolId, userId).orElse(null);
            if (assignment == null) {
                return createErrorResponse("Assignation non trouvée");
            }

            assignment.setDownloaded(true);
            assignmentRepository.save(assignment);

            return Map.of(
                "success", true,
                "message", "Protocole marqué comme téléchargé"
            );

        } catch (Exception e) {
            return createErrorResponse("Erreur lors de la mise à jour: " + e.getMessage());
        }
    }

    /**
     * Évalue un protocole
     */
    public Map<String, Object> evaluateProtocol(Long protocolId, Long userId, String decision, String comments) {
        try {
            // Vérifier l'assignation
            SimpleProtocolAssignment assignment = assignmentRepository.findByProtocolIdAndAssignedMemberId(protocolId, userId).orElse(null);
            if (assignment == null) {
                return createErrorResponse("Vous n'êtes pas assigné à ce protocole");
            }

            // Récupérer le protocole et l'utilisateur
            ProtocolSubmission protocol = protocolRepository.findById(protocolId).orElse(null);
            User user = userRepository.findById(userId).orElse(null);
            
            if (protocol == null || user == null) {
                return createErrorResponse("Protocole ou utilisateur non trouvé");
            }

            // Mettre à jour le protocole
            if ("APPROVED".equals(decision)) {
                protocol.setStatus("COMMITTEE_APPROVED");
            } else if ("REJECTED".equals(decision)) {
                protocol.setStatus("COMMITTEE_REJECTED");
            }

            protocol.setEvaluationComments(comments);
            protocol.setEvaluatedBy(user.getFirstName() + " " + user.getLastName());
            protocol.setEvaluatedAt(LocalDateTime.now());

            protocolRepository.save(protocol);

            return Map.of(
                "success", true,
                "message", "Évaluation enregistrée avec succès",
                "newStatus", protocol.getStatus()
            );

        } catch (Exception e) {
            return createErrorResponse("Erreur lors de l'évaluation: " + e.getMessage());
        }
    }

    // Méthodes utilitaires privées
    private Map<String, Object> buildProtocolResponse(ProtocolSubmission protocol, SimpleProtocolAssignment assignment, User user) {
        Map<String, Object> protocolInfo = new HashMap<>();
        protocolInfo.put("id", protocol.getId());
        protocolInfo.put("title", protocol.getTitle());
        protocolInfo.put("description", protocol.getDescription());
        protocolInfo.put("principalInvestigator", protocol.getPrincipalInvestigator());
        protocolInfo.put("institution", protocol.getInstitution());
        protocolInfo.put("participants", protocol.getParticipants());
        protocolInfo.put("duration", protocol.getDuration());
        protocolInfo.put("status", protocol.getStatus());
        protocolInfo.put("submittedAt", protocol.getSubmittedAt());
        protocolInfo.put("ethicalConsiderations", protocol.getEthicalConsiderations());
        protocolInfo.put("protocolCode", "PROT-" + protocol.getId());
        
        // Informations d'assignation
        protocolInfo.put("assignedAt", assignment.getAssignedAt());
        protocolInfo.put("canEdit", assignment.getCanEdit());
        protocolInfo.put("downloaded", assignment.getDownloaded());
        
        return protocolInfo;
    }

    private Map<String, Object> buildUserInfo(User user) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("firstName", user.getFirstName());
        userInfo.put("lastName", user.getLastName());
        userInfo.put("username", user.getUsername());
        userInfo.put("role", user.getRole().toString());
        return userInfo;
    }

    private Map<String, Object> buildAssignmentResponse(SimpleProtocolAssignment assignment, ProtocolSubmission protocol, User member) {
        Map<String, Object> response = new HashMap<>();
        response.put("assignmentId", assignment.getId());
        response.put("protocolId", protocol.getId());
        response.put("protocolTitle", protocol.getTitle());
        response.put("memberName", member.getFirstName() + " " + member.getLastName());
        response.put("assignedAt", assignment.getAssignedAt());
        return response;
    }

    /**
     * Récupérer les fichiers d'un protocole
     */
    public ResponseEntity<?> getProtocolFiles(Long protocolId) {
        try {
            ProtocolSubmission protocol = protocolRepository.findById(protocolId).orElse(null);
            if (protocol == null) {
                return ResponseEntity.notFound().build();
            }

            List<Map<String, Object>> files = new ArrayList<>();
            
            if (protocol.getProtocolFileName() != null) {
                files.add(Map.of(
                    "type", "protocol",
                    "name", "Protocole complet",
                    "fileName", protocol.getProtocolFileName(),
                    "available", true
                ));
            }
            
            if (protocol.getConsentFormFileName() != null) {
                files.add(Map.of(
                    "type", "consent",
                    "name", "Formulaire de consentement",
                    "fileName", protocol.getConsentFormFileName(),
                    "available", true
                ));
            }
            
            if (protocol.getCvFilesNames() != null) {
                files.add(Map.of(
                    "type", "cv",
                    "name", "CVs des investigateurs",
                    "fileName", protocol.getCvFilesNames(),
                    "available", true
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "files", files
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(createErrorResponse("Erreur: " + e.getMessage()));
        }
    }

    /**
     * Visualiser un fichier spécifique
     */
    public ResponseEntity<?> viewProtocolFile(Long protocolId, String fileType) {
        try {
            // Rediriger vers le FileController existant
            return ResponseEntity.status(302)
                .header("Location", "/api/files/view-by-protocol/" + protocolId + "/" + fileType)
                .build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(createErrorResponse("Erreur: " + e.getMessage()));
        }
    }

    private String generateProtocolPDFContent(ProtocolSubmission protocol) {
        StringBuilder content = new StringBuilder();
        content.append("PROTOCOLE DE RECHERCHE\n\n");
        content.append("Code: PROT-").append(protocol.getId()).append("\n");
        content.append("Titre: ").append(protocol.getTitle()).append("\n\n");
        content.append("INFORMATIONS GÉNÉRALES\n");
        content.append("Chercheur principal: ").append(protocol.getPrincipalInvestigator()).append("\n");
        content.append("Institution: ").append(protocol.getInstitution()).append("\n");
        content.append("Participants: ").append(protocol.getParticipants()).append("\n");
        content.append("Durée: ").append(protocol.getDuration()).append(" mois\n\n");
        content.append("DESCRIPTION\n");
        content.append(protocol.getDescription()).append("\n\n");
        content.append("CONSIDÉRATIONS ÉTHIQUES\n");
        content.append(protocol.getEthicalConsiderations() != null ? protocol.getEthicalConsiderations() : "Non spécifiées").append("\n\n");
        content.append("STATUT: ").append(protocol.getStatus()).append("\n");
        content.append("Soumis le: ").append(protocol.getSubmittedAt()).append("\n");
        
        if (protocol.getEvaluatedBy() != null) {
            content.append("\nÉVALUATION\n");
            content.append("Évalué par: ").append(protocol.getEvaluatedBy()).append("\n");
            content.append("Évalué le: ").append(protocol.getEvaluatedAt()).append("\n");
            content.append("Commentaires: ").append(protocol.getEvaluationComments() != null ? protocol.getEvaluationComments() : "Aucun").append("\n");
        }
        
        return content.toString();
    }

    private Map<String, Object> createErrorResponse(String message) {
        return Map.of(
            "success", false,
            "error", message
        );
    }
}