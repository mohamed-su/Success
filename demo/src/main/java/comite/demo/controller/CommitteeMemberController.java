package comite.demo.controller;

import comite.demo.entity.ProtocolSubmission;
import comite.demo.entity.SimpleProtocolAssignment;
import comite.demo.entity.User;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.SimpleAssignmentRepository;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/committee")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CommitteeMemberController {

    @Autowired
    private SimpleAssignmentRepository assignmentRepository;

    @Autowired
    private ProtocolSubmissionRepository protocolRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/protocols/assigned")
    public ResponseEntity<?> getAssignedProtocols(@RequestParam Long userId) {
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