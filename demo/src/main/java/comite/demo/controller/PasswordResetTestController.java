package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

@RestController
@RequestMapping("/api/reset-password")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PasswordResetTestController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> resetUserPassword(@PathVariable Long userId) {
        try {
            String newPassword = "password123";
            String encodedPassword = passwordEncoder.encode(newPassword);
            
            // Mettre à jour le mot de passe
            String sql = "UPDATE users SET password = ? WHERE id = ?";
            int updated = jdbcTemplate.update(sql, encodedPassword, userId);
            
            if (updated == 0) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Utilisateur non trouvé"
                ));
            }
            
            // Récupérer les infos de l'utilisateur
            String userSql = "SELECT username, first_name, last_name, role FROM users WHERE id = ?";
            Map<String, Object> user = jdbcTemplate.queryForMap(userSql, userId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Mot de passe réinitialisé",
                "user", user,
                "newPassword", newPassword
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}