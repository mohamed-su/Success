package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

@RestController
@RequestMapping("/api/test-users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TestUserController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create-rapporteur")
    public ResponseEntity<?> createTestRapporteur() {
        try {
            String password = "password123";
            String encodedPassword = passwordEncoder.encode(password);
            
            // Supprimer l'utilisateur s'il existe déjà
            jdbcTemplate.update("DELETE FROM users WHERE username = ?", "test.rapporteur@comite.bf");
            
            // Créer le nouvel utilisateur
            String sql = """
                INSERT INTO users (username, email, password, first_name, last_name, role, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """;
            
            jdbcTemplate.update(sql, 
                "test.rapporteur@comite.bf",
                "test.rapporteur@comite.bf", 
                encodedPassword,
                "Test",
                "Rapporteur",
                "RAPPORTEUR",
                true
            );
            
            // Récupérer l'ID du nouvel utilisateur
            Long userId = jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE username = ?", 
                Long.class, 
                "test.rapporteur@comite.bf"
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Utilisateur rapporteur de test créé",
                "credentials", Map.of(
                    "username", "test.rapporteur@comite.bf",
                    "password", password,
                    "userId", userId
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/create-committee-member")
    public ResponseEntity<?> createTestCommitteeMember() {
        try {
            String password = "password123";
            String encodedPassword = passwordEncoder.encode(password);
            
            // Supprimer l'utilisateur s'il existe déjà
            jdbcTemplate.update("DELETE FROM users WHERE username = ?", "test.member@comite.bf");
            
            // Créer le nouvel utilisateur
            String sql = """
                INSERT INTO users (username, email, password, first_name, last_name, role, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """;
            
            jdbcTemplate.update(sql, 
                "test.member@comite.bf",
                "test.member@comite.bf", 
                encodedPassword,
                "Test",
                "Member",
                "COMMITTEE_MEMBER",
                true
            );
            
            // Récupérer l'ID du nouvel utilisateur
            Long userId = jdbcTemplate.queryForObject(
                "SELECT id FROM users WHERE username = ?", 
                Long.class, 
                "test.member@comite.bf"
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Utilisateur membre de test créé",
                "credentials", Map.of(
                    "username", "test.member@comite.bf",
                    "password", password,
                    "userId", userId
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/assign-protocol")
    public ResponseEntity<?> assignProtocolToTestUser(@RequestBody Map<String, Object> request) {
        try {
            String username = (String) request.get("username");
            Long protocolId = Long.parseLong(request.get("protocolId").toString());
            
            // Récupérer l'utilisateur
            String userSql = "SELECT id, CONCAT(first_name, ' ', last_name) as full_name FROM users WHERE username = ?";
            Map<String, Object> user = jdbcTemplate.queryForMap(userSql, username);
            
            Long userId = (Long) user.get("id");
            String fullName = (String) user.get("full_name");
            
            // Créer l'assignation
            String insertSql = """
                INSERT INTO protocol_member_assignments (protocol_id, member_id, member_name, assigned_by_id, assigned_by_name, assigned_at, status)
                VALUES (?, ?, ?, 1, 'Admin Test', CURRENT_TIMESTAMP, 'ASSIGNED')
                ON CONFLICT (protocol_id, member_id) DO NOTHING
            """;
            
            jdbcTemplate.update(insertSql, protocolId, userId, fullName);
            
            // Mettre à jour le statut du protocole
            jdbcTemplate.update("UPDATE protocol_submissions SET status = 'ASSIGNED_TO_MEMBER' WHERE id = ?", protocolId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Protocole assigné avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}