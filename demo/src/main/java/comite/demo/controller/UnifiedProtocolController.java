package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/unified")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UnifiedProtocolController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/my-protocols")
    public ResponseEntity<?> getMyProtocols(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || userRole == null) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Informations utilisateur manquantes"
            ));
        }
        
        try {
            Long memberId = Long.parseLong(userId);
            List<Map<String, Object>> protocols = new ArrayList<>();
            
            // Une seule requête SQL pour tous les rôles
            String sql = """
                SELECT DISTINCT ps.id, ps.title, ps.description, ps.submitter_name as principalInvestigator, 
                       ps.institution, ps.participants, ps.duration, ps.status, ps.submitted_at,
                       pma.assigned_at, pma.status as assignment_status,
                       CONCAT('PROT-', LPAD(ps.id::text, 4, '0')) as protocolCode,
                       ps.ethical_considerations as ethicalConsiderations
                FROM protocol_submissions ps 
                LEFT JOIN protocol_member_assignments pma ON ps.id = pma.protocol_id 
                WHERE (pma.member_id = ? OR ? IN (1, 2)) 
                ORDER BY COALESCE(pma.assigned_at, ps.submitted_at) DESC
            """;
            
            List<Map<String, Object>> dbProtocols = jdbcTemplate.queryForList(sql, memberId, memberId);
            protocols = formatProtocols(dbProtocols);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size(),
                "userRole", userRole,
                "userId", userId
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/assign-protocol")
    public ResponseEntity<?> assignProtocol(@RequestBody Map<String, Object> requestBody,
                                          HttpServletRequest request) {
        String assignerId = request.getHeader("X-User-ID");
        String assignerRole = request.getHeader("X-User-Role");
        
        try {
            Integer protocolId = (Integer) requestBody.get("protocolId");
            @SuppressWarnings("unchecked")
            List<Integer> memberIds = (List<Integer>) requestBody.get("memberIds");
            
            if (protocolId == null || memberIds == null || memberIds.isEmpty()) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Protocole et membres requis"
                ));
            }
            
            List<String> assignedMembers = new ArrayList<>();
            
            for (Integer memberId : memberIds) {
                try {
                    // Vérifier si le membre existe
                    String checkMemberSql = "SELECT first_name, last_name FROM users WHERE id = ?";
                    List<Map<String, Object>> memberInfo = jdbcTemplate.queryForList(checkMemberSql, memberId);
                    
                    if (!memberInfo.isEmpty()) {
                        String memberName = memberInfo.get(0).get("first_name") + " " + memberInfo.get(0).get("last_name");
                        
                        // Vérifier si déjà assigné
                        String checkAssignmentSql = "SELECT COUNT(*) FROM protocol_member_assignments WHERE protocol_id = ? AND member_id = ?";
                        Integer exists = jdbcTemplate.queryForObject(checkAssignmentSql, Integer.class, protocolId, memberId);
                        
                        if (exists == 0) {
                            // Créer l'assignation
                            String insertSql = """
                                INSERT INTO protocol_member_assignments 
                                (protocol_id, member_id, member_name, assigned_by_id, assigned_by_name, assigned_at, status) 
                                VALUES (?, ?, ?, ?, 'System', NOW(), 'ASSIGNED')
                            """;
                            
                            jdbcTemplate.update(insertSql, protocolId, memberId, memberName, 
                                              assignerId != null ? Long.parseLong(assignerId) : 1L);
                            
                            assignedMembers.add(memberName);
                        } else {
                            assignedMembers.add(memberName + " (déjà assigné)");
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Erreur assignation membre " + memberId + ": " + e.getMessage());
                }
            }
            
            // Mettre à jour le statut du protocole
            String updateProtocolSql = "UPDATE protocol_submissions SET status = 'ASSIGNED_TO_MEMBER' WHERE id = ?";
            jdbcTemplate.update(updateProtocolSql, protocolId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Protocole " + protocolId + " assigné à " + assignedMembers.size() + " membre(s)",
                "assignedMembers", assignedMembers
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de l'assignation: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/check-protocol/{protocolId}")
    public ResponseEntity<?> checkProtocol(@PathVariable Integer protocolId) {
        try {
            // Vérifier le protocole
            String protocolSql = "SELECT * FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> protocol = jdbcTemplate.queryForList(protocolSql, protocolId);
            
            // Vérifier les assignations
            String assignmentSql = """
                SELECT pma.*, u.first_name, u.last_name, u.role 
                FROM protocol_member_assignments pma 
                JOIN users u ON pma.member_id = u.id 
                WHERE pma.protocol_id = ?
            """;
            List<Map<String, Object>> assignments = jdbcTemplate.queryForList(assignmentSql, protocolId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocol", protocol.isEmpty() ? null : protocol.get(0),
                "assignments", assignments,
                "assignmentCount", assignments.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    private List<Map<String, Object>> formatProtocols(List<Map<String, Object>> dbProtocols) {
        List<Map<String, Object>> protocols = new ArrayList<>();
        for (Map<String, Object> protocol : dbProtocols) {
            Map<String, Object> formatted = new HashMap<>();
            formatted.put("id", protocol.get("id"));
            formatted.put("title", protocol.get("title"));
            formatted.put("description", protocol.get("description"));
            formatted.put("principalInvestigator", protocol.get("principalinvestigator"));
            formatted.put("institution", protocol.get("institution"));
            formatted.put("participants", protocol.get("participants"));
            formatted.put("duration", protocol.get("duration"));
            formatted.put("status", protocol.get("status"));
            formatted.put("submittedAt", protocol.get("submitted_at"));
            formatted.put("assignedAt", protocol.get("assigned_at"));
            formatted.put("protocolCode", protocol.get("protocolcode"));
            formatted.put("ethicalConsiderations", protocol.get("ethicalconsiderations"));
            formatted.put("canEdit", true);
            formatted.put("downloaded", false);
            protocols.add(formatted);
        }
        return protocols;
    }
}