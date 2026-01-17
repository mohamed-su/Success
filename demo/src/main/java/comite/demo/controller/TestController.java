package comite.demo.controller;

import comite.demo.repository.ProtocolSubmissionRepository;
import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TestController {

    @Autowired
    private ProtocolSubmissionRepository repository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        try {
            // Test de la base de données
            String dbVersion = jdbcTemplate.queryForObject("SELECT version()", String.class);
            long protocolCount = repository.count();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Backend fonctionnel",
                "timestamp", LocalDateTime.now(),
                "database", Map.of(
                    "connected", true,
                    "version", dbVersion.substring(0, Math.min(50, dbVersion.length())),
                    "protocolCount", protocolCount
                ),
                "endpoints", Map.of(
                    "researcher", "/api/researcher/protocols/{id}",
                    "researcherUpdate", "/api/researcher/protocols/{id}/update",
                    "secretary", "/api/secretary/protocols",
                    "test", "/api/test/health"
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage(),
                "timestamp", LocalDateTime.now()
            ));
        }
    }

    @GetMapping("/protocols")
    public ResponseEntity<?> listProtocols() {
        try {
            List<Map<String, Object>> protocols = jdbcTemplate.queryForList(
                "SELECT id, title, status, submitter_identifier, created_at FROM protocol_submissions ORDER BY id"
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/create-president")
    public ResponseEntity<?> createPresident() {
        try {
            // Vérifier si l'utilisateur existe déjà
            if (userRepository.findByUsername("president").isPresent()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Utilisateur président existe déjà",
                    "credentials", Map.of(
                        "username", "president",
                        "password", "password"
                    )
                ));
            }
            
            User president = new User();
            president.setUsername("president");
            president.setPassword(passwordEncoder.encode("password"));
            president.setEmail("president@cers.bf");
            president.setFirstName("Président");
            president.setLastName("CERS");
            president.setRole(User.Role.PRESIDENT);
            president.setUserIdentifier("PRES001");
            president.setActive(true);
            
            User saved = userRepository.save(president);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Utilisateur président créé",
                "userId", saved.getId(),
                "credentials", Map.of(
                    "username", "president",
                    "password", "password"
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/create-test-protocol")
    public ResponseEntity<?> createTestProtocol() {
        try {
            String sql = """
                INSERT INTO protocol_submissions (
                    title, description, principal_investigator, institution, 
                    duration, participants, submitter_identifier, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
            """;
            
            Long id = jdbcTemplate.queryForObject(sql, Long.class,
                "Test Protocol " + System.currentTimeMillis(),
                "Description de test",
                "Dr. Test",
                "Institution Test",
                6,
                50,
                "moamoa33944",
                "DRAFT"
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Protocole de test créé",
                "protocolId", id
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}