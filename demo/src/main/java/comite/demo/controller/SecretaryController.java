package comite.demo.controller;

import comite.demo.entity.ProtocolSubmission;
import comite.demo.repository.ProtocolSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/secretary")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SecretaryController {

    @Autowired
    private ProtocolSubmissionRepository repository;

    @GetMapping("/protocols")
    public ResponseEntity<?> getProtocolsForSecretary(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || (!"secretary".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au secrétaire"
            ));
        }
        
        try {
            List<ProtocolSubmission> allProtocols = repository.findAllByOrderByIdAsc();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("protocols", allProtocols);
            response.put("count", allProtocols.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/pending")
    public ResponseEntity<?> getPendingProtocols(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || (!"secretary".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au secrétaire"
            ));
        }
        
        try {
            List<ProtocolSubmission> protocols = repository.findByStatusOrderByIdAsc("SUBMITTED");
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("protocols", protocols);
            response.put("count", protocols.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/{id}")
    public ResponseEntity<?> getProtocolDetails(@PathVariable Long id, HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || (!"secretary".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au secrétaire"
            ));
        }
        
        try {
            var protocol = repository.findById(id);
            if (protocol.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Protocole non trouvé"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocol", protocol.get()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{id}/verify")
    public ResponseEntity<?> verifyProtocol(@PathVariable Long id, @RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String userId = httpRequest.getHeader("X-User-ID");
        String userRole = httpRequest.getHeader("X-User-Role");
        
        if (userId == null || (!"secretary".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au secrétaire"
            ));
        }
        
        try {
            var protocol = repository.findById(id);
            if (protocol.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ProtocolSubmission p = protocol.get();
            String action = request.get("action");
            String comments = request.get("comments");

            if ("confirm".equals(action)) {
                p.setStatus("VERIFIED");
                p.setVerifiedAt(LocalDateTime.now());
                p.setVerificationComments(comments);
            } else if ("reject".equals(action)) {
                p.setStatus("VERIFICATION_REJECTED");
                p.setVerifiedAt(LocalDateTime.now());
                p.setVerificationComments(comments);
            }

            repository.save(p);

            String message = "confirm".equals(action) 
                ? "Protocole marqué comme CONFORME. Le chercheur sera notifié."
                : "Protocole marqué comme NON CONFORME. Le chercheur devra reprendre son dossier.";

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", message,
                "status", p.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/verified")
    public ResponseEntity<?> getVerifiedProtocols(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || (!"secretary".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au secrétaire"
            ));
        }
        
        try {
            List<ProtocolSubmission> protocols = repository.findByStatusOrderByIdAsc("VERIFIED");
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("protocols", protocols);
            response.put("count", protocols.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/all")
    public ResponseEntity<?> getAllProtocols(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || (!"secretary".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au secrétaire"
            ));
        }
        
        try {
            List<ProtocolSubmission> protocols = repository.findAllByOrderByIdAsc();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("protocols", protocols);
            response.put("count", protocols.size());
            
            // Statistiques détaillées
            Map<String, Object> stats = new HashMap<>();
            stats.put("total", protocols.size());
            stats.put("submitted", protocols.stream().filter(p -> "SUBMITTED".equals(p.getStatus())).count());
            stats.put("verified", protocols.stream().filter(p -> "VERIFIED".equals(p.getStatus())).count());
            stats.put("rejected", protocols.stream().filter(p -> "VERIFICATION_REJECTED".equals(p.getStatus())).count());
            stats.put("assignedToMember", protocols.stream().filter(p -> "ASSIGNED_TO_MEMBER".equals(p.getStatus())).count());
            stats.put("committeeApproved", protocols.stream().filter(p -> "COMMITTEE_APPROVED".equals(p.getStatus())).count());
            stats.put("committeeRejected", protocols.stream().filter(p -> "COMMITTEE_REJECTED".equals(p.getStatus())).count());
            
            response.put("statistics", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}