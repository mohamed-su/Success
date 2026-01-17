package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rapporteur-debug")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RapporteurDebugController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/check-user/{userId}")
    public ResponseEntity<?> checkUser(@PathVariable String userId) {
        try {
            // Vérifier l'utilisateur
            String userSql = "SELECT id, username, first_name, last_name, role FROM users WHERE id = ?";
            List<Map<String, Object>> user = jdbcTemplate.queryForList(userSql, Long.parseLong(userId));
            
            // Vérifier les assignations
            String assignmentsSql = "SELECT * FROM protocol_member_assignments WHERE member_id = ?";
            List<Map<String, Object>> assignments = jdbcTemplate.queryForList(assignmentsSql, Long.parseLong(userId));
            
            // Vérifier tous les protocoles
            String protocolsSql = "SELECT id, title, status FROM protocol_submissions ORDER BY id";
            List<Map<String, Object>> protocols = jdbcTemplate.queryForList(protocolsSql);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "user", user,
                "assignments", assignments,
                "allProtocols", protocols
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/all-assignments")
    public ResponseEntity<?> getAllAssignments() {
        try {
            String sql = """
                SELECT pma.*, u.username, u.first_name, u.last_name, u.role,
                       ps.title, ps.status as protocol_status
                FROM protocol_member_assignments pma
                LEFT JOIN users u ON pma.member_id = u.id
                LEFT JOIN protocol_submissions ps ON pma.protocol_id = ps.id
                ORDER BY pma.id
            """;
            
            List<Map<String, Object>> assignments = jdbcTemplate.queryForList(sql);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "assignments", assignments
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/create-test-assignment")
    public ResponseEntity<?> createTestAssignment(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            Long protocolId = Long.parseLong(request.get("protocolId").toString());
            
            // Vérifier si l'utilisateur existe
            String userCheckSql = "SELECT CONCAT(first_name, ' ', last_name) as full_name FROM users WHERE id = ?";
            String userName = jdbcTemplate.queryForObject(userCheckSql, String.class, userId);
            
            // Créer l'assignation
            String insertSql = """
                INSERT INTO protocol_member_assignments (protocol_id, member_id, member_name, assigned_by_id, assigned_by_name, assigned_at, status)
                VALUES (?, ?, ?, 1, 'Admin Test', CURRENT_TIMESTAMP, 'ASSIGNED')
            """;
            
            jdbcTemplate.update(insertSql, protocolId, userId, userName);
            
            // Mettre à jour le statut du protocole
            String updateProtocolSql = "UPDATE protocol_submissions SET status = 'ASSIGNED_TO_MEMBER' WHERE id = ?";
            jdbcTemplate.update(updateProtocolSql, protocolId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Assignation de test créée avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}