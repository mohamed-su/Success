package comite.demo.controller;

import comite.demo.entity.ProtocolSubmission;
import comite.demo.entity.User;
import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.repository.UserRepository;
import comite.demo.repository.SimpleAssignmentRepository;
import comite.demo.entity.SimpleProtocolAssignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auto-assignment")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AutoAssignmentController {

    @Autowired
    private ProtocolSubmissionRepository protocolRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SimpleAssignmentRepository assignmentRepository;

    @GetMapping("/protocols-with-status")
    public ResponseEntity<?> getProtocolsWithStatus() {
        try {
            List<ProtocolSubmission> allProtocols = protocolRepository.findByStatus("VERIFIED");
            List<User> members = userRepository.findCommitteeMembers();
            
            List<Map<String, Object>> protocolsWithStatus = allProtocols.stream()
                .map(protocol -> {
                    boolean isAssigned = assignmentRepository.existsByProtocolId(protocol.getId());
                    String assignedTo = null;
                    String assignedAt = null;
                    
                    if (isAssigned) {
                        var assignments = assignmentRepository.findByProtocolId(protocol.getId());
                        if (!assignments.isEmpty()) {
                            List<String> assignedNames = assignments.stream()
                                .map(assignment -> {
                                    var user = userRepository.findById(assignment.getAssignedMemberId());
                                    return user.map(u -> u.getFirstName() + " " + u.getLastName()).orElse("Inconnu");
                                })
                                .collect(Collectors.toList());
                            
                            assignedTo = String.join(", ", assignedNames);
                            assignedAt = assignments.get(0).getAssignedAt().toString();
                        }
                    }
                    
                    Map<String, Object> protocolMap = new java.util.HashMap<>();
                    protocolMap.put("id", protocol.getId());
                    protocolMap.put("title", protocol.getTitle());
                    protocolMap.put("principalInvestigator", protocol.getPrincipalInvestigator());
                    protocolMap.put("institution", protocol.getInstitution());
                    protocolMap.put("participants", protocol.getParticipants());
                    protocolMap.put("duration", protocol.getDuration());
                    protocolMap.put("status", protocol.getStatus());
                    protocolMap.put("isAssigned", isAssigned);
                    protocolMap.put("assignedTo", assignedTo != null ? assignedTo : "");
                    protocolMap.put("assignedAt", assignedAt != null ? assignedAt : "");
                    return protocolMap;
                })
                .collect(Collectors.toList());
            
            List<Map<String, Object>> membersData = members.stream()
                .map(member -> {
                    Map<String, Object> memberMap = new java.util.HashMap<>();
                    memberMap.put("id", member.getId());
                    memberMap.put("name", member.getFirstName() + " " + member.getLastName());
                    memberMap.put("role", member.getRole().toString());
                    memberMap.put("username", member.getUsername());
                    memberMap.put("active", true);
                    return memberMap;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocolsWithStatus,
                "members", membersData
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/bulk-assign")
    public ResponseEntity<?> bulkAssign(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            List<Integer> protocolIds = (List<Integer>) request.get("protocolIds");
            @SuppressWarnings("unchecked")
            List<Integer> memberIds = (List<Integer>) request.get("memberIds");
            
            if (protocolIds == null || memberIds == null || protocolIds.isEmpty() || memberIds.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Protocoles et membres requis"
                ));
            }
            
            int assignmentCount = 0;
            
            for (Integer protocolId : protocolIds) {
                for (Integer memberId : memberIds) {
                    // Vérifier si l'assignation existe déjà
                    if (!assignmentRepository.existsByProtocolIdAndAssignedMemberId(protocolId.longValue(), memberId.longValue())) {
                        SimpleProtocolAssignment assignment = new SimpleProtocolAssignment();
                        assignment.setProtocolId(protocolId.longValue());
                        assignment.setAssignedMemberId(memberId.longValue());
                        assignment.setAssignedAt(LocalDateTime.now());
                        assignment.setCanEdit(true);
                        assignment.setDownloaded(false);
                        
                        assignmentRepository.save(assignment);
                        assignmentCount++;
                    }
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", assignmentCount + " assignation(s) créée(s) avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}