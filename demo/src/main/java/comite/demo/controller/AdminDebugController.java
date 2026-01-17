package comite.demo.controller;

import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/debug")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminDebugController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/test-create")
    public ResponseEntity<?> testCreateUser(@RequestBody Map<String, Object> userData) {
        System.out.println("DEBUG: Données reçues: " + userData);
        System.out.println("DEBUG: Type de données: " + userData.getClass());
        
        for (Map.Entry<String, Object> entry : userData.entrySet()) {
            System.out.println("DEBUG: " + entry.getKey() + " = " + entry.getValue() + " (type: " + 
                (entry.getValue() != null ? entry.getValue().getClass().getSimpleName() : "null") + ")");
        }
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Test réussi",
            "receivedData", userData
        ));
    }
    
    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        System.out.println("DEBUG: Authorization header: " + authHeader);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "hasAuth", authHeader != null,
            "authHeader", authHeader != null ? authHeader.substring(0, Math.min(20, authHeader.length())) + "..." : null
        ));
    }
    
    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;
    
    @GetMapping("/list-users")
    public ResponseEntity<?> listUsers() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "count", userRepository.count(),
            "users", userRepository.findAll().stream()
                .map(u -> Map.of(
                    "id", u.getId(),
                    "username", u.getUsername(),
                    "email", u.getEmail(),
                    "role", u.getRole().toString()
                ))
                .toList()
        ));
    }
    
    @GetMapping("/list-assignments")
    public ResponseEntity<?> listAssignments() {
        try {
            String sql = "SELECT * FROM protocol_member_assignments";
            List<Map<String, Object>> assignments = jdbcTemplate.queryForList(sql);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "count", assignments.size(),
                "assignments", assignments
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/reset-users")
    public ResponseEntity<?> resetUsers() {
        try {
            userRepository.deleteAll();
            createUser("admin@cers.bf", "admin123", "Admin", "CERS", User.Role.ADMIN);
            createUser("secretary@cers.bf", "secretary123", "Secrétaire", "CERS", User.Role.SECRETARY);
            createUser("researcher@cers.bf", "researcher123", "Dr. Marie", "Ouédraogo", User.Role.RESEARCHER);
            createUser("president@cers.bf", "president123", "Prof. Aminata", "Traoré", User.Role.PRESIDENT);
            createUser("committee@cers.bf", "committee123", "Dr. Fatou", "Zongo", User.Role.COMMITTEE_MEMBER);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Utilisateurs réinitialisés",
                "count", userRepository.count()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/init-users")
    public ResponseEntity<?> initUsers() {
        try {
            if (userRepository.count() > 0) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Utilisateurs déjà créés",
                    "count", userRepository.count()
                ));
            }
            
            createUser("admin@cers.bf", "admin123", "Admin", "CERS", User.Role.ADMIN);
            createUser("secretary@cers.bf", "secretary123", "Secrétaire", "CERS", User.Role.SECRETARY);
            createUser("researcher@cers.bf", "researcher123", "Dr. Marie", "Ouédraogo", User.Role.RESEARCHER);
            createUser("president@cers.bf", "president123", "Prof. Aminata", "Traoré", User.Role.PRESIDENT);
            createUser("committee@cers.bf", "committee123", "Dr. Fatou", "Zongo", User.Role.COMMITTEE_MEMBER);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Utilisateurs créés avec succès",
                "count", userRepository.count()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    private void createUser(String username, String password, String firstName, String lastName, User.Role role) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setActive(true);
        userRepository.save(user);
    }
}