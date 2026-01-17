package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sync-assignments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AssignmentSyncController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/sync-all")
    public ResponseEntity<?> syncAllAssignments() {
        try {
            // Récupérer toutes les assignations de protocol_assignments
            String selectSql = """
                SELECT pa.protocol_id, pa.assigned_member_id, u.first_name, u.last_name
                FROM protocol_assignments pa
                JOIN users u ON pa.assigned_member_id = u.id
            """;
            
            List<Map<String, Object>> assignments = jdbcTemplate.queryForList(selectSql);
            
            int synced = 0;
            for (Map<String, Object> assignment : assignments) {
                Long protocolId = (Long) assignment.get("protocol_id");
                Long memberId = (Long) assignment.get("assigned_member_id");
                String firstName = (String) assignment.get("first_name");
                String lastName = (String) assignment.get("last_name");
                String fullName = firstName + " " + lastName;
                
                // Vérifier si l'assignation existe déjà dans protocol_member_assignments
                String checkSql = "SELECT COUNT(*) FROM protocol_member_assignments WHERE protocol_id = ? AND member_id = ?";
                Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, protocolId, memberId);
                
                if (count == 0) {
                    // Créer l'assignation dans protocol_member_assignments
                    String insertSql = """
                        INSERT INTO protocol_member_assignments (protocol_id, member_id, member_name, assigned_by_id, assigned_by_name, assigned_at, status)
                        VALUES (?, ?, ?, 1, 'System Sync', CURRENT_TIMESTAMP, 'ASSIGNED')
                    """;
                    
                    jdbcTemplate.update(insertSql, protocolId, memberId, fullName);
                    synced++;
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", synced + " assignations synchronisées",
                "totalAssignments", assignments.size(),
                "newSynced", synced
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/check-tables")
    public ResponseEntity<?> checkTables() {
        try {
            // Compter les assignations dans chaque table
            Integer protocolAssignments = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM protocol_assignments", Integer.class);
            
            Integer memberAssignments = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM protocol_member_assignments", Integer.class);
            
            // Récupérer quelques exemples
            List<Map<String, Object>> paExamples = jdbcTemplate.queryForList(
                "SELECT protocol_id, assigned_member_id FROM protocol_assignments LIMIT 5");
            
            List<Map<String, Object>> pmaExamples = jdbcTemplate.queryForList(
                "SELECT protocol_id, member_id FROM protocol_member_assignments LIMIT 5");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocol_assignments_count", protocolAssignments,
                "protocol_member_assignments_count", memberAssignments,
                "protocol_assignments_examples", paExamples,
                "protocol_member_assignments_examples", pmaExamples
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}