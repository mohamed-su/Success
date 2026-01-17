package comite.demo.controller;

import comite.demo.entity.ProtocolSubmission;
import comite.demo.entity.SimpleProtocolAssignment;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.SimpleAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/member")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MemberProtocolsController {

    @Autowired
    private SimpleAssignmentRepository assignmentRepository;
    
    @Autowired
    private ProtocolSubmissionRepository protocolRepository;

    @GetMapping("/assigned-protocols")
    public ResponseEntity<?> getAssignedProtocols(@RequestParam Long userId) {
        try {
            // Récupérer SEULEMENT les assignations pour cet utilisateur
            List<SimpleProtocolAssignment> assignments = assignmentRepository.findByAssignedMemberId(userId);
            
            List<Map<String, Object>> protocols = assignments.stream()
                .map(assignment -> {
                    ProtocolSubmission protocol = protocolRepository.findById(assignment.getProtocolId()).orElse(null);
                    if (protocol != null) {
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
                        protocolInfo.put("assignedAt", assignment.getAssignedAt());
                        protocolInfo.put("canEdit", assignment.getCanEdit());
                        protocolInfo.put("downloaded", assignment.getDownloaded());
                        protocolInfo.put("protocolCode", "PROT-" + protocol.getId());
                        protocolInfo.put("ethicalConsiderations", protocol.getEthicalConsiderations());
                        return protocolInfo;
                    }
                    return null;
                })
                .filter(p -> p != null)
                .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}