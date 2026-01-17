package comite.demo.controller;

import comite.demo.entity.EvaluationGrid;
import comite.demo.repository.EvaluationGridRepository;
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

// @RestController
// @RequestMapping("/api/president")
// @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class WorkingPresidentController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private EvaluationGridRepository evaluationGridRepository;

    @GetMapping("/protocols/verified")
    public ResponseEntity<?> getVerifiedProtocols(HttpServletRequest request) {
        try {
            // Récupérer les protocoles validés par la secrétaire (statut VERIFIED)
            String protocolSql = "SELECT id, title, submitter_name, institution, participants, duration, status FROM protocol_submissions WHERE status = 'VERIFIED' ORDER BY id";
            List<Map<String, Object>> dbProtocols = jdbcTemplate.queryForList(protocolSql);
            
            List<Map<String, Object>> protocols = new ArrayList<>();
            for (Map<String, Object> protocol : dbProtocols) {
                Map<String, Object> formatted = new HashMap<>();
                formatted.put("id", protocol.get("id"));
                formatted.put("title", protocol.get("title"));
                formatted.put("principalInvestigator", protocol.get("submitter_name"));
                formatted.put("institution", protocol.get("institution"));
                formatted.put("participants", protocol.get("participants"));
                formatted.put("duration", protocol.get("duration"));
                formatted.put("status", protocol.get("status"));
                protocols.add(formatted);
            }
            
            // Récupérer 8 membres du comité + le président = 9 total
            String memberSql = "SELECT id, first_name, last_name, username, role FROM users WHERE role IN ('COMMITTEE_MEMBER', 'RAPPORTEUR', 'PRESIDENT') AND active = true ORDER BY role, last_name LIMIT 9";
            List<Map<String, Object>> dbMembers = jdbcTemplate.queryForList(memberSql);
            
            List<Map<String, Object>> members = new ArrayList<>();
            for (Map<String, Object> member : dbMembers) {
                Map<String, Object> formatted = new HashMap<>();
                formatted.put("id", member.get("id").toString());
                
                // Afficher le nom complet du président
                String role = member.get("role").toString();
                if (role.equals("PRESIDENT")) {
                    formatted.put("name", "Prof. Aminata Traoré");
                } else {
                    formatted.put("name", member.get("first_name") + " " + member.get("last_name"));
                }
                
                formatted.put("username", member.get("username"));
                String displayRole = "Membre du Comité";
                if (role.equals("RAPPORTEUR")) displayRole = "Rapporteur";
                else if (role.equals("PRESIDENT")) displayRole = "Président";
                formatted.put("role", displayRole);
                members.add(formatted);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size(),
                "members", members
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{id}/assign")
    public ResponseEntity<?> assignProtocolToMember(@PathVariable Long id, 
                                                   @RequestBody Map<String, String> request, 
                                                   HttpServletRequest httpRequest) {
        try {
            String memberName = request.get("memberName");
            String memberId = request.get("memberId");
            String userId = httpRequest.getHeader("X-User-ID");
            String username = httpRequest.getHeader("X-User-Username");
            
            // Sauvegarder l'assignation
            String assignSql = "INSERT INTO protocol_member_assignments (protocol_id, member_id, member_name, assigned_by_id, assigned_by_name, assigned_at, status) VALUES (?, ?, ?, ?, ?, NOW(), 'ASSIGNED')";
            
            jdbcTemplate.update(assignSql, 
                id, 
                Long.parseLong(memberId), 
                memberName, 
                userId != null ? Long.parseLong(userId) : 3L,
                username != null ? username : "Président"
            );
            
            // Créer automatiquement la grille d'évaluation
            try {
                var existingGrid = evaluationGridRepository.findByProtocolIdAndMemberId(id, Long.parseLong(memberId));
                if (existingGrid.isEmpty()) {
                    EvaluationGrid grid = new EvaluationGrid();
                    grid.setProtocolId(id);
                    grid.setMemberId(Long.parseLong(memberId));
                    grid.setMemberName(memberName);
                    grid.setStatus("PENDING");
                    grid.setAssignedAt(LocalDateTime.now());
                    evaluationGridRepository.save(grid);
                }
            } catch (Exception e) {
                // Log mais ne pas bloquer l'assignation
                System.err.println("Erreur création grille: " + e.getMessage());
            }
            
            // Mettre à jour le statut du protocole à ASSIGNED_TO_MEMBER
            String updateProtocolSql = "UPDATE protocol_submissions SET status = 'ASSIGNED_TO_MEMBER' WHERE id = ?";
            jdbcTemplate.update(updateProtocolSql, id);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Protocole PROT-" + id + " assigné à " + memberName,
                "assignedTo", memberName
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de l'assignation: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/assignments")
    public ResponseEntity<?> getProtocolAssignments(HttpServletRequest request) {
        try {
            // Récupérer tous les membres
            String memberSql = "SELECT id, first_name || ' ' || last_name as full_name FROM users WHERE role IN ('COMMITTEE_MEMBER', 'RAPPORTEUR', 'PRESIDENT') AND active = true LIMIT 9";
            List<Map<String, Object>> allMembers = jdbcTemplate.queryForList(memberSql);
            
            // Statistiques d'assignation par membre
            String assignSql = "SELECT member_name, COUNT(*) as count FROM protocol_member_assignments GROUP BY member_name";
            List<Map<String, Object>> assignments = jdbcTemplate.queryForList(assignSql);
            
            Map<String, Integer> assignmentsByMember = new HashMap<>();
            for (Map<String, Object> member : allMembers) {
                assignmentsByMember.put((String) member.get("full_name"), 0);
            }
            
            for (Map<String, Object> assignment : assignments) {
                String memberName = (String) assignment.get("member_name");
                Integer count = ((Number) assignment.get("count")).intValue();
                assignmentsByMember.put(memberName, count);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "assignments", assignments,
                "assignmentsByMember", assignmentsByMember
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/protocols/status")
    public ResponseEntity<?> getProtocolsStatus(HttpServletRequest request) {
        try {
            // Protocoles en attente d'assignation (VERIFIED)
            String pendingSql = "SELECT COUNT(*) as count FROM protocol_submissions WHERE status = 'VERIFIED'";
            Integer pendingCount = jdbcTemplate.queryForObject(pendingSql, Integer.class);
            
            // Protocoles assignés (ASSIGNED_TO_MEMBER)
            String assignedSql = "SELECT COUNT(*) as count FROM protocol_submissions WHERE status = 'ASSIGNED_TO_MEMBER'";
            Integer assignedCount = jdbcTemplate.queryForObject(assignedSql, Integer.class);
            
            // Détail des protocoles assignés
            String detailSql = "SELECT ps.id, ps.title, ps.submitter_name, pma.member_name, pma.assigned_at FROM protocol_submissions ps JOIN protocol_member_assignments pma ON ps.id = pma.protocol_id WHERE ps.status = 'ASSIGNED_TO_MEMBER' ORDER BY pma.assigned_at DESC";
            List<Map<String, Object>> assignedProtocols = jdbcTemplate.queryForList(detailSql);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "pending", pendingCount,
                "assigned", assignedCount,
                "assignedProtocols", assignedProtocols
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