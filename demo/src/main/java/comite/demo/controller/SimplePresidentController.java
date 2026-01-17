package comite.demo.controller;

import comite.demo.entity.ProtocolSubmission;
import comite.demo.entity.SimpleProtocolAssignment;
import comite.demo.entity.User;
import comite.demo.entity.ProtocolEvaluation;
import comite.demo.repository.ProtocolEvaluationRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import comite.demo.repository.SimpleAssignmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// @RestController
// @RequestMapping("/api/president")
// @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SimplePresidentController {
    
    // ===== FONCTIONNALITÉS D'AUTO-ASSIGNATION FUSIONNÉES =====
    
    @GetMapping("/protocols-with-status")
    public ResponseEntity<?> getProtocolsWithStatus() {
        try {
            List<ProtocolSubmission> verifiedProtocols = protocolRepository.findByStatus("VERIFIED");
            List<ProtocolSubmission> assignedProtocols = protocolRepository.findByStatus("ASSIGNED_TO_MEMBER");
            
            List<Map<String, Object>> allProtocols = new ArrayList<>();
            
            // Ajouter les protocoles vérifiés
            for (ProtocolSubmission protocol : verifiedProtocols) {
                Map<String, Object> protocolInfo = createProtocolInfo(protocol, false);
                allProtocols.add(protocolInfo);
            }
            
            // Ajouter les protocoles assignés avec leurs informations d'assignation
            for (ProtocolSubmission protocol : assignedProtocols) {
                Map<String, Object> protocolInfo = createProtocolInfo(protocol, true);
                
                // Trouver l'assignation
                List<SimpleProtocolAssignment> assignments = assignmentRepository.findByProtocolId(protocol.getId());
                if (!assignments.isEmpty()) {
                    SimpleProtocolAssignment assignment = assignments.get(0);
                    User assignedUser = userRepository.findById(assignment.getAssignedMemberId()).orElse(null);
                    if (assignedUser != null) {
                        protocolInfo.put("assignedTo", assignedUser.getFirstName() + " " + assignedUser.getLastName());
                        protocolInfo.put("assignedAt", assignment.getAssignedAt());
                    }
                }
                allProtocols.add(protocolInfo);
            }
            
            // Récupérer les membres éligibles (président, rapporteur, membres du comité - PAS les chercheurs)
            List<User> eligibleMembers = userRepository.findByActiveTrue().stream()
                .filter(user -> user.getRole() == User.Role.PRESIDENT || 
                               user.getRole() == User.Role.RAPPORTEUR || 
                               user.getRole() == User.Role.COMMITTEE_MEMBER)
                .collect(Collectors.toList());
            
            List<Map<String, Object>> members = eligibleMembers.stream()
                .map(this::createMemberInfo)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("protocols", allProtocols);
            response.put("members", members);
            response.put("verifiedCount", verifiedProtocols.size());
            response.put("assignedCount", assignedProtocols.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/bulk-assign")
    public ResponseEntity<?> bulkAssignProtocols(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Integer> protocolIds = (List<Integer>) request.get("protocolIds");
            @SuppressWarnings("unchecked")
            List<Integer> memberIds = (List<Integer>) request.get("memberIds");
            
            int successCount = 0;
            int alreadyAssignedCount = 0;
            List<String> messages = new ArrayList<>();
            
            for (Integer protocolIdInt : protocolIds) {
                Long protocolId = protocolIdInt.longValue();
                
                // Vérifier si déjà assigné
                List<SimpleProtocolAssignment> existingAssignments = assignmentRepository.findByProtocolId(protocolId);
                if (!existingAssignments.isEmpty()) {
                    alreadyAssignedCount++;
                    continue;
                }
                
                // Distribuer le protocole à tous les membres sélectionnés
                for (Integer memberIdInt : memberIds) {
                    Long memberId = memberIdInt.longValue();
                    
                    User member = userRepository.findById(memberId).orElse(null);
                    if (member != null) {
                        SimpleProtocolAssignment assignment = new SimpleProtocolAssignment(protocolId, memberId);
                        assignmentRepository.save(assignment);
                        
                        successCount++;
                        messages.add("PROT-" + protocolId + " → " + member.getFirstName() + " " + member.getLastName());
                    }
                }
                
                // Mettre à jour le statut du protocole une seule fois
                ProtocolSubmission protocol = protocolRepository.findById(protocolId).orElse(null);
                if (protocol != null) {
                    protocol.setStatus("ASSIGNED_TO_MEMBER");
                    protocolRepository.save(protocol);
                }
            }
            
            String message = String.format("%d assignation(s) effectuée(s), %d déjà assigné(s)", 
                successCount, alreadyAssignedCount);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", message,
                "successCount", successCount,
                "alreadyAssignedCount", alreadyAssignedCount,
                "details", messages
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @Autowired
    private ProtocolSubmissionRepository repository;
    
    @Autowired
    private ProtocolSubmissionRepository protocolRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SimpleAssignmentRepository assignmentRepository;
    
    @Autowired
    private ProtocolEvaluationRepository evaluationRepository;

    @GetMapping("/protocols/verified")
    public ResponseEntity<?> getVerifiedProtocols() {
        try {
            List<ProtocolSubmission> protocols = repository.findByStatusOrderByIdAsc("VERIFIED");
            List<ProtocolSubmission> assignedProtocols = repository.findByStatus("ASSIGNED_TO_MEMBER");
            
            // Combiner les protocoles vérifiés et assignés avec leur statut d'assignation
            List<Map<String, Object>> allProtocols = new ArrayList<>();
            
            // Ajouter les protocoles vérifiés
            for (ProtocolSubmission protocol : protocols) {
                Map<String, Object> protocolInfo = new HashMap<>();
                protocolInfo.put("id", protocol.getId());
                protocolInfo.put("title", protocol.getTitle());
                protocolInfo.put("principalInvestigator", protocol.getPrincipalInvestigator());
                protocolInfo.put("institution", protocol.getInstitution());
                protocolInfo.put("participants", protocol.getParticipants());
                protocolInfo.put("duration", protocol.getDuration());
                protocolInfo.put("verifiedAt", protocol.getVerifiedAt());
                protocolInfo.put("submitterName", protocol.getSubmitterName());
                protocolInfo.put("status", "VERIFIED");
                protocolInfo.put("isAssigned", false);
                allProtocols.add(protocolInfo);
            }
            
            // Ajouter les protocoles assignés
            for (ProtocolSubmission protocol : assignedProtocols) {
                Map<String, Object> protocolInfo = new HashMap<>();
                protocolInfo.put("id", protocol.getId());
                protocolInfo.put("title", protocol.getTitle());
                protocolInfo.put("principalInvestigator", protocol.getPrincipalInvestigator());
                protocolInfo.put("institution", protocol.getInstitution());
                protocolInfo.put("participants", protocol.getParticipants());
                protocolInfo.put("duration", protocol.getDuration());
                protocolInfo.put("verifiedAt", protocol.getVerifiedAt());
                protocolInfo.put("submitterName", protocol.getSubmitterName());
                protocolInfo.put("status", "ASSIGNED_TO_MEMBER");
                protocolInfo.put("isAssigned", true);
                
                // Trouver l'assignation pour ce protocole
                List<SimpleProtocolAssignment> assignments = assignmentRepository.findByProtocolId(protocol.getId());
                if (!assignments.isEmpty()) {
                    SimpleProtocolAssignment assignment = assignments.get(0);
                    User assignedUser = userRepository.findById(assignment.getAssignedMemberId()).orElse(null);
                    if (assignedUser != null) {
                        protocolInfo.put("assignedTo", assignedUser.getFirstName() + " " + assignedUser.getLastName());
                        protocolInfo.put("assignedAt", assignment.getAssignedAt());
                    }
                }
                allProtocols.add(protocolInfo);
            }
            
            // Récupérer les membres éligibles (président, rapporteur, membres du comité - PAS les chercheurs)
            List<User> eligibleMembers = userRepository.findByActiveTrue().stream()
                .filter(user -> user.getRole() == User.Role.PRESIDENT || 
                               user.getRole() == User.Role.RAPPORTEUR || 
                               user.getRole() == User.Role.COMMITTEE_MEMBER)
                .collect(Collectors.toList());
            
            List<Map<String, Object>> members = eligibleMembers.stream()
                .map(user -> {
                    Map<String, Object> memberInfo = new HashMap<>();
                    memberInfo.put("id", user.getId());
                    memberInfo.put("name", user.getFirstName() + " " + user.getLastName());
                    memberInfo.put("username", user.getUsername());
                    memberInfo.put("role", user.getRole().toString());
                    memberInfo.put("active", user.isActive());
                    return memberInfo;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("protocols", allProtocols);
            response.put("count", protocols.size());
            response.put("assignedCount", assignedProtocols.size());
            response.put("members", members);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{id}/assign")
    public ResponseEntity<?> assignProtocolToMember(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            // Vérifier que le protocole existe dans protocol_submissions
            var protocol = repository.findById(id);
            if (protocol.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Protocol with ID " + id + " not found"
                ));
            }

            String memberIdStr = request.get("memberId");
            String memberName = request.get("memberName");
            
            if (memberIdStr == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Member ID is required"
                ));
            }
            
            Long memberId = Long.parseLong(memberIdStr);
            
            // Vérifier que le membre existe
            var member = userRepository.findById(memberId);
            if (member.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Member with ID " + memberId + " not found"
                ));
            }
            
            // Vérifier si le protocole n'est pas déjà assigné
            List<SimpleProtocolAssignment> existingAssignments = assignmentRepository.findByProtocolId(id);
            if (!existingAssignments.isEmpty()) {
                // Si déjà assigné, retourner un succès avec un message informatif
                User existingMember = userRepository.findById(existingAssignments.get(0).getAssignedMemberId()).orElse(null);
                String existingMemberName = existingMember != null ? 
                    existingMember.getFirstName() + " " + existingMember.getLastName() : "Membre inconnu";
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Protocole PROT-" + id + " déjà assigné à " + existingMemberName,
                    "assignedTo", existingMemberName,
                    "alreadyAssigned", true
                ));
            }
            
            // Créer l'assignation
            SimpleProtocolAssignment assignment = new SimpleProtocolAssignment(id, memberId);
            assignmentRepository.save(assignment);
            
            // Mettre à jour le statut du protocole
            ProtocolSubmission p = protocol.get();
            p.setStatus("ASSIGNED_TO_MEMBER");
            repository.save(p);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Protocole PROT-" + id + " assigné à " + memberName,
                "assignedTo", memberName,
                "alreadyAssigned", false
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/assignments")
    public ResponseEntity<?> getProtocolAssignments() {
        try {
            List<SimpleProtocolAssignment> assignments = assignmentRepository.findAll();
            List<User> eligibleMembers = userRepository.findByActiveTrue().stream()
                .filter(user -> user.getRole() != User.Role.ADMIN && user.getRole() != User.Role.SECRETARY)
                .limit(9)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("assignments", assignments);
            
            // Compter par membre
            Map<String, Long> assignmentsByMember = new HashMap<>();
            for (User member : eligibleMembers) {
                String memberName = member.getFirstName() + " " + member.getLastName();
                long count = assignments.stream()
                    .filter(a -> a.getAssignedMemberId().equals(member.getId()))
                    .count();
                assignmentsByMember.put(memberName, count);
            }
            response.put("assignmentsByMember", assignmentsByMember);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/protocols/status")
    public ResponseEntity<?> getProtocolStatus() {
        try {
            List<ProtocolSubmission> pendingProtocols = repository.findByStatus("VERIFIED");
            List<ProtocolSubmission> assignedProtocols = repository.findByStatus("ASSIGNED_TO_MEMBER");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("pending", pendingProtocols.size());
            response.put("assigned", assignedProtocols.size());
            response.put("assignedProtocols", assignedProtocols);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // ===== MÉTHODES UTILITAIRES FUSIONNÉES =====
    
    private Map<String, Object> createProtocolInfo(ProtocolSubmission protocol, boolean isAssigned) {
        Map<String, Object> info = new HashMap<>();
        info.put("id", protocol.getId());
        info.put("title", protocol.getTitle());
        info.put("principalInvestigator", protocol.getPrincipalInvestigator());
        info.put("institution", protocol.getInstitution());
        info.put("participants", protocol.getParticipants());
        info.put("duration", protocol.getDuration());
        info.put("verifiedAt", protocol.getVerifiedAt());
        info.put("submitterName", protocol.getSubmitterName());
        info.put("status", protocol.getStatus());
        info.put("isAssigned", isAssigned);
        return info;
    }

    private Map<String, Object> createMemberInfo(User user) {
        Map<String, Object> info = new HashMap<>();
        info.put("id", user.getId());
        info.put("name", user.getFirstName() + " " + user.getLastName());
        info.put("username", user.getUsername());
        info.put("role", user.getRole().toString());
        info.put("active", user.isActive());
        
        // Compter les assignations pour ce membre
        long assignmentCount = assignmentRepository.findByAssignedMemberId(user.getId()).size();
        info.put("assignmentCount", assignmentCount);
        
        return info;
    }
    
    // ===== ENDPOINTS D'ÉVALUATION =====
    
    @GetMapping("/evaluation/{protocolId}")
    public ResponseEntity<?> getEvaluation(@PathVariable Long protocolId, @RequestParam Long evaluatorId) {
        try {
            Optional<ProtocolEvaluation> evaluation = evaluationRepository.findByProtocolIdAndEvaluatorId(protocolId, evaluatorId);
            
            if (evaluation.isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "evaluation", evaluation.get(),
                    "isNew", false
                ));
            } else {
                ProtocolEvaluation newEvaluation = new ProtocolEvaluation(protocolId, evaluatorId);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "evaluation", newEvaluation,
                    "isNew", true
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/evaluation/save")
    public ResponseEntity<?> saveEvaluation(@RequestBody ProtocolEvaluation evaluation) {
        try {
            evaluation.setEvaluationDate(LocalDateTime.now());
            ProtocolEvaluation saved = evaluationRepository.save(evaluation);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Évaluation sauvegardée avec succès",
                "evaluation", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/evaluation/finalize")
    public ResponseEntity<?> finalizeEvaluation(@RequestBody Map<String, Object> request) {
        try {
            Long evaluationId = Long.valueOf(request.get("evaluationId").toString());
            
            ProtocolEvaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new RuntimeException("Évaluation non trouvée"));
            
            evaluation.setIsFinal(true);
            evaluation.setEvaluationDate(LocalDateTime.now());
            
            ProtocolEvaluation saved = evaluationRepository.save(evaluation);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Évaluation finalisée avec succès",
                "evaluation", saved
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/evaluations/{protocolId}")
    public ResponseEntity<?> getAllEvaluationsForProtocol(@PathVariable Long protocolId) {
        try {
            List<ProtocolEvaluation> evaluations = evaluationRepository.findByProtocolId(protocolId);
            
            List<Map<String, Object>> evaluationDetails = evaluations.stream()
                .map(eval -> {
                    Map<String, Object> details = new HashMap<>();
                    details.put("id", eval.getId());
                    details.put("evaluatorId", eval.getEvaluatorId());
                    details.put("isFinal", eval.getIsFinal());
                    details.put("evaluationDate", eval.getEvaluationDate());
                    
                    User evaluator = userRepository.findById(eval.getEvaluatorId()).orElse(null);
                    if (evaluator != null) {
                        details.put("evaluatorName", evaluator.getFirstName() + " " + evaluator.getLastName());
                    }
                    return details;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "evaluations", evaluationDetails,
                "count", evaluations.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/protocols/my-assigned")
    public ResponseEntity<?> getMyAssignedProtocols(@RequestParam Long userId) {
        try {
            List<SimpleProtocolAssignment> assignments = assignmentRepository.findByAssignedMemberId(userId);
            List<Map<String, Object>> protocols = new ArrayList<>();

            for (SimpleProtocolAssignment assignment : assignments) {
                ProtocolSubmission protocol = protocolRepository.findById(assignment.getProtocolId()).orElse(null);
                if (protocol != null) {
                    Map<String, Object> protocolInfo = new HashMap<>();
                    protocolInfo.put("id", protocol.getId());
                    protocolInfo.put("title", protocol.getTitle());
                    protocolInfo.put("principalInvestigator", protocol.getPrincipalInvestigator());
                    protocolInfo.put("institution", protocol.getInstitution());
                    protocolInfo.put("participants", protocol.getParticipants());
                    protocolInfo.put("duration", protocol.getDuration());
                    protocolInfo.put("description", protocol.getDescription());
                    protocolInfo.put("submitterName", protocol.getSubmitterName());
                    protocolInfo.put("assignedAt", assignment.getAssignedAt());
                    protocolInfo.put("status", protocol.getStatus());
                    protocols.add(protocolInfo);
                }
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size(),
                "message", protocols.isEmpty() ? "Aucun protocole assigné" : "Protocoles récupérés avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}