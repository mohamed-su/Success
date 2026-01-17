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
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AssignedProtocolsController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/assigned-protocols")
    public ResponseEntity<?> getAssignedProtocols(HttpServletRequest request) {
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
            
            // Récupérer les protocoles selon le rôle
            String role = userRole.toLowerCase();
            if (role.contains("president") || role.contains("rapporteur") || role.contains("committee")) {
                protocols = getProtocolsForMember(memberId);
            } else if (role.contains("secretary")) {
                protocols = getProtocolsForSecretary();
            } else if (role.contains("admin")) {
                protocols = getAllProtocols();
            } else {
                protocols = getProtocolsForMember(memberId);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size(),
                "userRole", userRole
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    private List<Map<String, Object>> getProtocolsForMember(Long userId) {
        String sql = """
            SELECT DISTINCT ps.id, ps.title, ps.description, ps.submitter_name as principalInvestigator, 
                   ps.institution, ps.participants, ps.duration, ps.status, ps.submitted_at,
                   pa.assigned_at, pa.can_edit, pa.downloaded,
                   ps.ethical_considerations as ethicalConsiderations,
                   CASE WHEN pe.id IS NOT NULL THEN true ELSE false END as hasDeliberation,
                   CASE WHEN pe.id IS NOT NULL THEN 'COMPLETED' ELSE 'PENDING' END as deliberationStatus
            FROM protocol_submissions ps 
            JOIN protocol_assignments pa ON ps.id = pa.protocol_id
            LEFT JOIN protocol_evaluations pe ON ps.id = pe.protocol_id AND pe.evaluator_id = ?
            WHERE pa.assigned_member_id = ? 
              AND (ps.status = 'ASSIGNED_TO_MEMBER' OR pe.id IS NOT NULL)
            ORDER BY pa.assigned_at DESC
        """;
        
        List<Map<String, Object>> dbProtocols = jdbcTemplate.queryForList(sql, userId, userId);
        return formatProtocols(dbProtocols);
    }

    private List<Map<String, Object>> getProtocolsForSecretary() {
        String sql = """
            SELECT ps.id, ps.title, ps.description, ps.submitter_name as principalInvestigator, 
                   ps.institution, ps.participants, ps.duration, ps.status, ps.submitted_at,
                   ps.ethical_considerations as ethicalConsiderations
            FROM protocol_submissions ps 
            WHERE ps.status IN ('SUBMITTED', 'VERIFIED', 'ASSIGNED_TO_MEMBER')
            ORDER BY ps.submitted_at DESC
        """;
        
        List<Map<String, Object>> dbProtocols = jdbcTemplate.queryForList(sql);
        return formatProtocols(dbProtocols);
    }

    private List<Map<String, Object>> getAllProtocols() {
        String sql = """
            SELECT ps.id, ps.title, ps.description, ps.submitter_name as principalInvestigator, 
                   ps.institution, ps.participants, ps.duration, ps.status, ps.submitted_at,
                   ps.ethical_considerations as ethicalConsiderations
            FROM protocol_submissions ps 
            ORDER BY ps.submitted_at DESC
        """;
        
        List<Map<String, Object>> dbProtocols = jdbcTemplate.queryForList(sql);
        return formatProtocols(dbProtocols);
    }

    private List<Map<String, Object>> formatProtocols(List<Map<String, Object>> dbProtocols) {
        List<Map<String, Object>> protocols = new ArrayList<>();
        for (Map<String, Object> protocol : dbProtocols) {
            Map<String, Object> formatted = new HashMap<>();
            Long id = ((Number) protocol.get("id")).longValue();
            formatted.put("id", id);
            formatted.put("title", protocol.get("title"));
            formatted.put("description", protocol.get("description"));
            formatted.put("principalInvestigator", protocol.get("principalinvestigator"));
            formatted.put("institution", protocol.get("institution"));
            formatted.put("participants", protocol.get("participants"));
            formatted.put("duration", protocol.get("duration"));
            formatted.put("status", protocol.get("status"));
            formatted.put("submittedAt", protocol.get("submitted_at"));
            formatted.put("assignedAt", protocol.get("assigned_at"));
            formatted.put("protocolCode", "PROT-" + String.format("%04d", id));
            formatted.put("ethicalConsiderations", protocol.get("ethicalconsiderations"));
            formatted.put("canEdit", protocol.get("can_edit") != null ? protocol.get("can_edit") : true);
            formatted.put("downloaded", protocol.get("downloaded") != null ? protocol.get("downloaded") : false);
            
            // Nouveaux champs pour l'état de l'évaluation
            formatted.put("hasDeliberation", protocol.get("hasdeliberation") != null ? protocol.get("hasdeliberation") : false);
            formatted.put("deliberationStatus", protocol.get("deliberationstatus") != null ? protocol.get("deliberationstatus") : "PENDING");
            
            protocols.add(formatted);
        }
        return protocols;
    }
}
