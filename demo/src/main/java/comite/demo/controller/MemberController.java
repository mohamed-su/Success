package comite.demo.controller;

import comite.demo.entity.MemberEvaluationGrid;
import comite.demo.entity.ProtocolSubmission;
import comite.demo.entity.SimpleProtocolAssignment;
import comite.demo.entity.User;
import comite.demo.repository.MemberEvaluationGridRepository;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.SimpleAssignmentRepository;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/member")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MemberController {

    @Autowired
    private SimpleAssignmentRepository assignmentRepository;

    @Autowired
    private ProtocolSubmissionRepository protocolRepository;
    
    @Autowired
    private MemberEvaluationGridRepository memberEvaluationGridRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/protocols/assigned/{memberId}")
    public ResponseEntity<?> getAssignedProtocols(@PathVariable Long memberId) {
        try {
            List<SimpleProtocolAssignment> assignments = assignmentRepository.findByAssignedMemberId(memberId);
            List<Map<String, Object>> protocols = new ArrayList<>();

            for (SimpleProtocolAssignment assignment : assignments) {
                ProtocolSubmission protocol = protocolRepository.findById(assignment.getProtocolId()).orElse(null);
                if (protocol != null) {
                    Map<String, Object> protocolInfo = new HashMap<>();
                    protocolInfo.put("id", protocol.getId());
                    protocolInfo.put("title", protocol.getTitle());
                    protocolInfo.put("description", protocol.getDescription());
                    protocolInfo.put("submittedAt", protocol.getSubmittedAt());
                    protocolInfo.put("status", protocol.getStatus());
                    protocolInfo.put("assignedAt", assignment.getAssignedAt());
                    protocolInfo.put("canEdit", true);
                    protocolInfo.put("downloaded", assignment.isDownloaded());
                    protocolInfo.put("protocolCode", "PROT-" + protocol.getId());
                    protocols.add(protocolInfo);
                }
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{protocolId}/download")
    public ResponseEntity<?> markAsDownloaded(@PathVariable Long protocolId, @RequestBody Map<String, Object> request) {
        try {
            Long memberId = Long.valueOf(request.get("memberId").toString());
            
            SimpleProtocolAssignment assignment = assignmentRepository
                .findByProtocolIdAndAssignedMemberId(protocolId, memberId)
                .orElse(null);
            
            if (assignment != null) {
                assignment.setDownloaded(true);
                assignmentRepository.save(assignment);
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Protocole marqué comme téléchargé"
                ));
            }
            
            return ResponseEntity.status(404).body(Map.of(
                "success", false,
                "error", "Assignation non trouvée"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/protocols/{protocolId}/evaluation")
    public ResponseEntity<?> submitEvaluation(@PathVariable Long protocolId, @RequestBody Map<String, Object> evaluationData) {
        try {
            Long memberId = Long.valueOf(evaluationData.get("memberId").toString());
            
            // Vérifier que le membre est assigné au protocole
            Optional<SimpleProtocolAssignment> assignment = assignmentRepository
                .findByProtocolIdAndAssignedMemberId(protocolId, memberId);
            
            if (assignment.isEmpty()) {
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "error", "Membre non assigné à ce protocole"
                ));
            }
            
            // Récupérer le nom du membre
            User member = userRepository.findById(memberId).orElse(null);
            String memberName = member != null ? member.getFirstName() + " " + member.getLastName() : "Membre inconnu";
            
            // Chercher une grille existante ou en créer une nouvelle
            MemberEvaluationGrid grid = memberEvaluationGridRepository
                .findByProtocolIdAndMemberId(protocolId, memberId)
                .orElse(new MemberEvaluationGrid(protocolId, memberId, memberName));
            
            // Mettre à jour les données
            if (evaluationData.get("scientificQuality") != null) {
                grid.setScientificQuality(Integer.valueOf(evaluationData.get("scientificQuality").toString()));
            }
            if (evaluationData.get("ethicalCompliance") != null) {
                grid.setEthicalCompliance(Integer.valueOf(evaluationData.get("ethicalCompliance").toString()));
            }
            if (evaluationData.get("methodologyClarity") != null) {
                grid.setMethodologyClarity(Integer.valueOf(evaluationData.get("methodologyClarity").toString()));
            }
            if (evaluationData.get("riskBenefitRatio") != null) {
                grid.setRiskBenefitRatio(Integer.valueOf(evaluationData.get("riskBenefitRatio").toString()));
            }
            if (evaluationData.get("informedConsentQuality") != null) {
                grid.setInformedConsentQuality(Integer.valueOf(evaluationData.get("informedConsentQuality").toString()));
            }
            if (evaluationData.get("dataProtection") != null) {
                grid.setDataProtection(Integer.valueOf(evaluationData.get("dataProtection").toString()));
            }
            if (evaluationData.get("participantSafety") != null) {
                grid.setParticipantSafety(Integer.valueOf(evaluationData.get("participantSafety").toString()));
            }
            if (evaluationData.get("feasibility") != null) {
                grid.setFeasibility(Integer.valueOf(evaluationData.get("feasibility").toString()));
            }
            
            grid.setStrengths((String) evaluationData.get("strengths"));
            grid.setWeaknesses((String) evaluationData.get("weaknesses"));
            grid.setRecommendations((String) evaluationData.get("recommendations"));
            grid.setGeneralComments((String) evaluationData.get("generalComments"));
            grid.setDecision((String) evaluationData.get("decision"));
            
            // Soumettre la grille
            grid.setStatus("SUBMITTED");
            grid.setSubmittedAt(LocalDateTime.now());
            grid.setUpdatedAt(LocalDateTime.now());
            
            // Sauvegarder
            MemberEvaluationGrid savedGrid = memberEvaluationGridRepository.save(grid);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Grille d'évaluation soumise avec succès",
                "gridId", savedGrid.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/protocols/{protocolId}/evaluation/{memberId}")
    public ResponseEntity<?> getEvaluation(@PathVariable Long protocolId, @PathVariable Long memberId) {
        try {
            Optional<MemberEvaluationGrid> gridOpt = memberEvaluationGridRepository
                .findByProtocolIdAndMemberId(protocolId, memberId);
            
            if (gridOpt.isPresent()) {
                MemberEvaluationGrid grid = gridOpt.get();
                Map<String, Object> data = new HashMap<>();
                data.put("id", grid.getId());
                data.put("protocolId", grid.getProtocolId());
                data.put("memberId", grid.getMemberId());
                data.put("memberName", grid.getMemberName());
                data.put("scientificQuality", grid.getScientificQuality());
                data.put("ethicalCompliance", grid.getEthicalCompliance());
                data.put("methodologyClarity", grid.getMethodologyClarity());
                data.put("riskBenefitRatio", grid.getRiskBenefitRatio());
                data.put("informedConsentQuality", grid.getInformedConsentQuality());
                data.put("dataProtection", grid.getDataProtection());
                data.put("participantSafety", grid.getParticipantSafety());
                data.put("feasibility", grid.getFeasibility());
                data.put("strengths", grid.getStrengths());
                data.put("weaknesses", grid.getWeaknesses());
                data.put("recommendations", grid.getRecommendations());
                data.put("generalComments", grid.getGeneralComments());
                data.put("decision", grid.getDecision());
                data.put("status", grid.getStatus());
                data.put("submittedAt", grid.getSubmittedAt());
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "evaluation", data
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Aucune évaluation trouvée"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}
