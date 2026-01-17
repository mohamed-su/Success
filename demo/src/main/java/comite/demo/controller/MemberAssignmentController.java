package comite.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/member")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MemberAssignmentController {


    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/protocols/assigned")
    public ResponseEntity<?> getAssignedProtocols(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        // if (userId == null || (!userRole.equalsIgnoreCase("committee") && !userRole.equalsIgnoreCase("committee_member") && !userRole.equalsIgnoreCase("rapporteur") && !userRole.equalsIgnoreCase("president"))) {
        //     return ResponseEntity.status(403).body(Map.of(
        //         "success", false,
        //         "error", "Accès non autorisé - Rôle membre du comité requis"
        //     ));
        // }
        
        try {
            Long memberId = Long.parseLong(userId);
            
            // Récupérer les détails des protocoles assignés
            String sql = "SELECT ps.id, ps.title, ps.submitter_name, ps.institution, ps.participants, ps.duration, pma.assigned_at, pma.status FROM protocol_submissions ps JOIN protocol_member_assignments pma ON ps.id = pma.protocol_id WHERE pma.member_id = ? AND pma.status = 'ASSIGNED' ORDER BY pma.assigned_at DESC";
            
            List<Map<String, Object>> dbProtocols = jdbcTemplate.queryForList(sql, memberId);
            
            // Formater les protocoles pour correspondre au format attendu par le frontend
            List<Map<String, Object>> protocols = new ArrayList<>();
            for (Map<String, Object> protocol : dbProtocols) {
                Map<String, Object> formatted = new HashMap<>();
                formatted.put("id", protocol.get("id"));
                formatted.put("title", protocol.get("title"));
                formatted.put("principalInvestigator", protocol.get("submitter_name"));
                formatted.put("institution", protocol.get("institution"));
                formatted.put("participants", protocol.get("participants"));
                formatted.put("duration", protocol.get("duration"));
                formatted.put("assignedAt", protocol.get("assigned_at"));
                formatted.put("status", protocol.get("status"));
                protocols.add(formatted);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{protocolId}/review")
    public ResponseEntity<?> submitReview(@PathVariable Long protocolId, 
                                         @RequestBody Map<String, String> request,
                                         HttpServletRequest httpRequest) {
        String userId = httpRequest.getHeader("X-User-ID");
        String userRole = httpRequest.getHeader("X-User-Role");
        
        // if (userId == null || (!userRole.equalsIgnoreCase("committee") && !userRole.equalsIgnoreCase("committee_member") && !userRole.equalsIgnoreCase("rapporteur") && !userRole.equalsIgnoreCase("president"))) {
        //     return ResponseEntity.status(403).body(Map.of(
        //         "success", false,
        //         "error", "Accès non autorisé"
        //     ));
        // }
        
        try {
            Long memberId = Long.parseLong(userId);
            String comments = request.get("comments");
            
            // Mettre à jour l'assignation avec les commentaires
            String updateSql = "UPDATE protocol_member_assignments SET comments = ?, status = 'REVIEWED', reviewed_at = NOW() WHERE protocol_id = ? AND member_id = ? AND status = 'ASSIGNED'";
            int updated = jdbcTemplate.update(updateSql, comments, protocolId, memberId);
            
            if (updated == 0) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Assignation non trouvée"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Révision soumise avec succès"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}