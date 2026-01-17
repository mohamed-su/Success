package comite.demo.service;

import comite.demo.entity.User;
import comite.demo.entity.ProtocolSubmission;
import comite.demo.entity.ProtocolMemberAssignment;
import comite.demo.repository.UserRepository;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.ProtocolMemberAssignmentRepository;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service pour la gestion personnalisée des protocoles basée sur JWT
 * Chaque utilisateur accède uniquement à ses protocoles avec une interface adaptée
 */
@Service
@Transactional
public class PersonalizedProtocolService {

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProtocolSubmissionRepository protocolRepository;
    
    @Autowired
    private ProtocolMemberAssignmentRepository assignmentRepository;

    /**
     * Récupère les protocoles personnalisés selon le token JWT
     */
    public Map<String, Object> getPersonalizedProtocols(String token) {
        try {
            // Valider le token et extraire les informations utilisateur
            JwtService.TokenValidationResult validation = jwtService.validateToken(token);
            if (!validation.isValid()) {
                return createErrorResponse("Token invalide ou expiré");
            }

            Claims claims = validation.getClaims();
            String username = claims.getSubject();
            String role = claims.get("role", String.class);
            Long userId = claims.get("userId", Long.class);

            // Récupérer l'utilisateur complet
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            // Générer la réponse personnalisée selon le rôle
            return generatePersonalizedResponse(user, role);

        } catch (Exception e) {
            return createErrorResponse("Erreur lors de la récupération des protocoles: " + e.getMessage());
        }
    }

    /**
     * Assigne un protocole avec vérification JWT stricte
     */
    public Map<String, Object> assignProtocolWithJwtValidation(String token, Long protocolId, Long memberId) {
        try {
            // Valider le token et les permissions
            if (!validateAssignmentPermissions(token)) {
                return createErrorResponse("Permissions insuffisantes pour l'assignation");
            }

            Claims claims = jwtService.validateToken(token).getClaims();
            Long assignerId = claims.get("userId", Long.class);
            String assignerRole = claims.get("role", String.class);

            // Vérifier que seuls les présidents et admins peuvent assigner
            if (!Arrays.asList("PRESIDENT", "ADMIN").contains(assignerRole)) {
                return createErrorResponse("Seuls les présidents et administrateurs peuvent assigner des protocoles");
            }

            return performSecureAssignment(protocolId, memberId, assignerId);

        } catch (Exception e) {
            return createErrorResponse("Erreur lors de l'assignation: " + e.getMessage());
        }
    }

    /**
     * Génère une interface personnalisée selon le rôle utilisateur
     */
    private Map<String, Object> generatePersonalizedResponse(User user, String role) {
        Map<String, Object> response = new HashMap<>();
        
        switch (role.toUpperCase()) {
            case "PRESIDENT":
                response = generatePresidentInterface(user);
                break;
            case "COMMITTEE_MEMBER":
            case "RAPPORTEUR":
                response = generateMemberInterface(user);
                break;
            case "SECRETARY":
                response = generateSecretaryInterface(user);
                break;
            case "RESEARCHER":
                response = generateResearcherInterface(user);
                break;
            case "ADMIN":
                response = generateAdminInterface(user);
                break;
            default:
                return createErrorResponse("Rôle non reconnu");
        }

        // Ajouter les informations utilisateur sécurisées
        response.put("userInfo", createSecureUserInfo(user));
        response.put("accessLevel", role);
        response.put("timestamp", LocalDateTime.now());
        
        return response;
    }

    /**
     * Interface personnalisée pour le président
     */
    private Map<String, Object> generatePresidentInterface(User user) {
        List<Map<String, Object>> protocols = new ArrayList<>();
        
        // Protocoles assignés au président
        List<ProtocolMemberAssignment> assignments = assignmentRepository.findByMemberId(user.getId());
        for (ProtocolMemberAssignment assignment : assignments) {
            ProtocolSubmission protocol = protocolRepository.findById(assignment.getProtocolId()).orElse(null);
            if (protocol != null) {
                protocols.add(createPresidentProtocolView(protocol, assignment));
            }
        }

        // Tous les protocoles pour supervision
        List<ProtocolSubmission> allProtocols = protocolRepository.findAll();
        List<Map<String, Object>> supervisionProtocols = allProtocols.stream()
            .map(this::createSupervisionProtocolView)
            .collect(Collectors.toList());

        return Map.of(
            "success", true,
            "role", "PRESIDENT",
            "assignedProtocols", protocols,
            "supervisionProtocols", supervisionProtocols,
            "canAssign", true,
            "canApprove", true,
            "dashboardType", "president"
        );
    }

    /**
     * Interface personnalisée pour les membres du comité
     */
    private Map<String, Object> generateMemberInterface(User user) {
        List<Map<String, Object>> protocols = new ArrayList<>();
        
        // Seuls les protocoles assignés à ce membre
        List<ProtocolMemberAssignment> assignments = assignmentRepository.findByMemberId(user.getId());
        for (ProtocolMemberAssignment assignment : assignments) {
            ProtocolSubmission protocol = protocolRepository.findById(assignment.getProtocolId()).orElse(null);
            if (protocol != null) {
                protocols.add(createMemberProtocolView(protocol, assignment));
            }
        }

        return Map.of(
            "success", true,
            "role", "COMMITTEE_MEMBER",
            "assignedProtocols", protocols,
            "canEvaluate", true,
            "canDownload", true,
            "dashboardType", "member"
        );
    }

    /**
     * Interface personnalisée pour le secrétaire
     */
    private Map<String, Object> generateSecretaryInterface(User user) {
        // Protocoles en attente de validation
        List<ProtocolSubmission> pendingProtocols = protocolRepository.findByStatus("SUBMITTED");
        List<Map<String, Object>> protocols = pendingProtocols.stream()
            .map(this::createSecretaryProtocolView)
            .collect(Collectors.toList());

        return Map.of(
            "success", true,
            "role", "SECRETARY",
            "pendingProtocols", protocols,
            "canValidate", true,
            "canGenerateReports", true,
            "dashboardType", "secretary"
        );
    }

    /**
     * Interface personnalisée pour le chercheur
     */
    private Map<String, Object> generateResearcherInterface(User user) {
        // Seuls les protocoles soumis par ce chercheur
        List<ProtocolSubmission> userProtocols = protocolRepository.findBySubmitterIdentifierOrderByIdAsc(user.getUserIdentifier());
        List<Map<String, Object>> protocols = userProtocols.stream()
            .map(this::createResearcherProtocolView)
            .collect(Collectors.toList());

        return Map.of(
            "success", true,
            "role", "RESEARCHER",
            "myProtocols", protocols,
            "canSubmit", true,
            "canEdit", true,
            "dashboardType", "researcher"
        );
    }

    /**
     * Interface personnalisée pour l'administrateur
     */
    private Map<String, Object> generateAdminInterface(User user) {
        List<ProtocolSubmission> allProtocols = protocolRepository.findAll();
        List<Map<String, Object>> protocols = allProtocols.stream()
            .map(this::createAdminProtocolView)
            .collect(Collectors.toList());

        return Map.of(
            "success", true,
            "role", "ADMIN",
            "allProtocols", protocols,
            "canManageUsers", true,
            "canAssign", true,
            "canViewAll", true,
            "dashboardType", "admin"
        );
    }

    /**
     * Valide les permissions d'assignation basées sur JWT
     */
    private boolean validateAssignmentPermissions(String token) {
        try {
            JwtService.TokenValidationResult validation = jwtService.validateToken(token);
            if (!validation.isValid()) {
                return false;
            }

            Claims claims = validation.getClaims();
            String role = claims.get("role", String.class);
            
            return Arrays.asList("PRESIDENT", "ADMIN").contains(role);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Effectue une assignation sécurisée
     */
    private Map<String, Object> performSecureAssignment(Long protocolId, Long memberId, Long assignerId) {
        // Vérifier l'existence du protocole et du membre
        ProtocolSubmission protocol = protocolRepository.findById(protocolId)
            .orElseThrow(() -> new RuntimeException("Protocole non trouvé"));
        
        User member = userRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Membre non trouvé"));
        
        User assigner = userRepository.findById(assignerId)
            .orElseThrow(() -> new RuntimeException("Assigneur non trouvé"));

        // Vérifier si déjà assigné
        List<ProtocolMemberAssignment> existing = assignmentRepository.findByProtocolId(protocolId);
        boolean alreadyAssigned = existing.stream().anyMatch(a -> a.getMemberId().equals(memberId));
        if (alreadyAssigned) {
            return Map.of(
                "success", false,
                "message", "Protocole déjà assigné à ce membre"
            );
        }

        // Créer l'assignation
        ProtocolMemberAssignment assignment = new ProtocolMemberAssignment(
            protocolId, memberId, member.getFirstName() + " " + member.getLastName(),
            assignerId, assigner.getFirstName() + " " + assigner.getLastName()
        );
        
        assignmentRepository.save(assignment);

        // Mettre à jour le statut du protocole
        protocol.setStatus("ASSIGNED_TO_MEMBER");
        protocolRepository.save(protocol);

        return Map.of(
            "success", true,
            "message", "Protocole assigné avec succès",
            "assignment", createAssignmentSummary(assignment, protocol, member)
        );
    }

    // Méthodes utilitaires pour créer les vues spécifiques à chaque rôle
    private Map<String, Object> createPresidentProtocolView(ProtocolSubmission protocol, ProtocolMemberAssignment assignment) {
        Map<String, Object> view = createBaseProtocolView(protocol);
        view.put("assignmentStatus", assignment.getStatus());
        view.put("assignedAt", assignment.getAssignedAt());
        view.put("canReassign", true);
        view.put("canApprove", true);
        return view;
    }

    private Map<String, Object> createMemberProtocolView(ProtocolSubmission protocol, ProtocolMemberAssignment assignment) {
        Map<String, Object> view = createBaseProtocolView(protocol);
        view.put("assignedAt", assignment.getAssignedAt());
        view.put("canEvaluate", "ASSIGNED".equals(assignment.getStatus()));
        view.put("evaluationDeadline", assignment.getAssignedAt().plusDays(14));
        return view;
    }

    private Map<String, Object> createSecretaryProtocolView(ProtocolSubmission protocol) {
        Map<String, Object> view = createBaseProtocolView(protocol);
        view.put("canValidate", "SUBMITTED".equals(protocol.getStatus()));
        view.put("needsValidation", true);
        return view;
    }

    private Map<String, Object> createResearcherProtocolView(ProtocolSubmission protocol) {
        Map<String, Object> view = createBaseProtocolView(protocol);
        view.put("canEdit", Arrays.asList("DRAFT", "RETURNED").contains(protocol.getStatus()));
        view.put("isOwner", true);
        return view;
    }

    private Map<String, Object> createAdminProtocolView(ProtocolSubmission protocol) {
        Map<String, Object> view = createBaseProtocolView(protocol);
        view.put("canManage", true);
        view.put("canViewDetails", true);
        view.put("assignmentCount", assignmentRepository.findByProtocolId(protocol.getId()).size());
        return view;
    }

    private Map<String, Object> createSupervisionProtocolView(ProtocolSubmission protocol) {
        Map<String, Object> view = createBaseProtocolView(protocol);
        view.put("assignmentCount", assignmentRepository.findByProtocolId(protocol.getId()).size());
        view.put("canSupervise", true);
        return view;
    }

    private Map<String, Object> createBaseProtocolView(ProtocolSubmission protocol) {
        Map<String, Object> view = new HashMap<>();
        view.put("id", protocol.getId());
        view.put("title", protocol.getTitle());
        view.put("description", protocol.getDescription());
        view.put("status", protocol.getStatus());
        view.put("submittedAt", protocol.getSubmittedAt());
        view.put("protocolCode", "PROT-" + String.format("%04d", protocol.getId()));
        view.put("principalInvestigator", protocol.getPrincipalInvestigator());
        view.put("institution", protocol.getInstitution());
        return view;
    }

    private Map<String, Object> createSecureUserInfo(User user) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("firstName", user.getFirstName());
        userInfo.put("lastName", user.getLastName());
        userInfo.put("role", user.getRole().toString());
        userInfo.put("userIdentifier", user.getUserIdentifier());
        return userInfo;
    }

    private Map<String, Object> createAssignmentSummary(ProtocolMemberAssignment assignment, 
                                                       ProtocolSubmission protocol, User member) {
        return Map.of(
            "assignmentId", assignment.getId(),
            "protocolTitle", protocol.getTitle(),
            "memberName", member.getFirstName() + " " + member.getLastName(),
            "assignedAt", assignment.getAssignedAt(),
            "status", assignment.getStatus()
        );
    }

    private Map<String, Object> createErrorResponse(String message) {
        return Map.of(
            "success", false,
            "error", message,
            "timestamp", LocalDateTime.now()
        );
    }
}