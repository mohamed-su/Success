package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/protocol-data")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProtocolDataController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/{id}")
    public ResponseEntity<?> getProtocolById(@PathVariable Long id) {
        try {
            String sql = "SELECT * FROM protocol_submissions WHERE id = ?";
            var results = jdbcTemplate.queryForList(sql, id);
            
            if (results.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Protocole non trouvé"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocol", results.get(0)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/list")
    public ResponseEntity<?> listAllProtocols() {
        try {
            String sql = "SELECT id, title, submitter_name FROM protocol_submissions ORDER BY id";
            var protocols = jdbcTemplate.queryForList(sql);
            
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
}