package comite.demo.controller;

import comite.demo.entity.SimpleProtocolAssignment;
import comite.demo.repository.SimpleAssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/president")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PresidentController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SimpleAssignmentRepository assignmentRepository;

    @PostMapping("/auto-assignment/bulk-assign")
    public ResponseEntity<?> bulkAssignProtocols(@RequestBody Map<String, Object> request, HttpServletRequest httpRequest) {
        String userId = httpRequest.getHeader("X-User-ID");
        String userRole = httpRequest.getHeader("X-User-Role");
        
        if (userId == null || (!"president".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au président"
            ));
        }
        
        try {
            @SuppressWarnings("unchecked")
            List<Integer> protocolIds = (List<Integer>) request.get("protocolIds");
            @SuppressWarnings("unchecked")
            List<Integer> memberIds = (List<Integer>) request.get("memberIds");
            
            if (protocolIds == null || memberIds == null || protocolIds.isEmpty() || memberIds.isEmpty()) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Protocoles et membres requis"
                ));
            }
            
            int assignedCount = 0;
            int existingCount = 0;
            for (Integer protocolId : protocolIds) {
                String updateProtocolSql = "UPDATE protocol_submissions SET status = 'ASSIGNED_TO_MEMBER' WHERE id = ?";
                jdbcTemplate.update(updateProtocolSql, protocolId);
                
                for (Integer memberId : memberIds) {
                    if (!assignmentRepository.existsByProtocolIdAndAssignedMemberId(protocolId.longValue(), memberId.longValue())) {
                        SimpleProtocolAssignment assignment = new SimpleProtocolAssignment(
                            protocolId.longValue(), 
                            memberId.longValue()
                        );
                        assignmentRepository.save(assignment);
                        
                        // SYNCHRONISATION: Ajouter aussi dans protocol_member_assignments
                        String getUserSql = "SELECT CONCAT(first_name, ' ', last_name) as full_name FROM users WHERE id = ?";
                        String fullName = jdbcTemplate.queryForObject(getUserSql, String.class, memberId.longValue());
                        
                        // Vérifier si l'assignation existe déjà dans protocol_member_assignments
                        String checkMemberSql = "SELECT COUNT(*) FROM protocol_member_assignments WHERE protocol_id = ? AND member_id = ?";
                        Integer memberCount = jdbcTemplate.queryForObject(checkMemberSql, Integer.class, protocolId.longValue(), memberId.longValue());
                        
                        if (memberCount == 0) {
                            String syncSql = "INSERT INTO protocol_member_assignments (protocol_id, member_id, member_name, assigned_by_id, assigned_by_name, assigned_at, status) VALUES (?, ?, ?, ?, 'Président', CURRENT_TIMESTAMP, 'ASSIGNED')";
                            jdbcTemplate.update(syncSql, protocolId.longValue(), memberId.longValue(), fullName, Long.parseLong(userId));
                        }
                        
                        assignedCount++;
                    } else {
                        existingCount++;
                    }
                }
            }
            
            String message = assignedCount > 0 ? 
                assignedCount + " nouvelle(s) assignation(s) créée(s)" : 
                "Assignations déjà existantes (" + existingCount + " trouvée(s))";
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", message,
                "newAssignments", assignedCount,
                "existingAssignments", existingCount
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/auto-assignment/protocols-with-status")
    public ResponseEntity<?> getProtocolsWithStatus(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || (!"president".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au président"
            ));
        }
        
        try {
            String protocolsSql = """
                SELECT ps.id, ps.title, ps.submitter_name as principalInvestigator, 
                       ps.institution, ps.participants, ps.duration, ps.status,
                       CASE WHEN ps.status = 'ASSIGNED_TO_MEMBER' THEN true ELSE false END as isAssigned,
                       COALESCE(STRING_AGG(DISTINCT CONCAT(u.first_name, ' ', u.last_name), ', '), 'Aucun membre assigné') as assignedMembers
                FROM protocol_submissions ps 
                LEFT JOIN protocol_assignments pa ON ps.id = pa.protocol_id
                LEFT JOIN users u ON pa.assigned_member_id = u.id
                WHERE ps.status IN ('VERIFIED', 'ASSIGNED_TO_MEMBER')
                GROUP BY ps.id, ps.title, ps.submitter_name, ps.institution, ps.participants, ps.duration, ps.status
                ORDER BY ps.id DESC
            """;
            
            List<Map<String, Object>> protocols = jdbcTemplate.queryForList(protocolsSql);
            
            String membersSql = """
                SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name, 
                       u.role, u.username
                FROM users u 
                WHERE u.role IN ('COMMITTEE_MEMBER', 'RAPPORTEUR', 'PRESIDENT', 'president') 
                ORDER BY u.first_name, u.last_name
            """;
            
            List<Map<String, Object>> members = jdbcTemplate.queryForList(membersSql);
            
            for (Map<String, Object> member : members) {
                member.put("active", true);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "members", members
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/assigned-protocols")
    public ResponseEntity<?> getAssignedProtocols(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || (!"president".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au président"
            ));
        }
        
        try {
            String sql = """
                SELECT ps.id, ps.title, ps.submitter_name as principalInvestigator,
                       ps.institution, ps.status,
                       STRING_AGG(CONCAT(u.first_name, ' ', u.last_name), ', ') as assignedMembers
                FROM protocol_submissions ps
                JOIN protocol_assignments pa ON ps.id = pa.protocol_id
                JOIN users u ON pa.assigned_member_id = u.id
                WHERE ps.status = 'ASSIGNED_TO_MEMBER'
                GROUP BY ps.id, ps.title, ps.submitter_name, ps.institution, ps.status
                ORDER BY ps.id DESC
            """;
            
            List<Map<String, Object>> protocols = jdbcTemplate.queryForList(sql);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{id}/decision")
    public ResponseEntity<?> makeDecision(@PathVariable Long id, @RequestBody Map<String, Object> request, HttpServletRequest httpRequest) {
        String userId = httpRequest.getHeader("X-User-ID");
        String userRole = httpRequest.getHeader("X-User-Role");
        
        if (userId == null || (!"president".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au président"
            ));
        }
        
        try {
            String decision = (String) request.get("decision");
            String comments = (String) request.get("comments");
            
            if (decision == null || (!"APPROVED".equals(decision) && !"REJECTED".equals(decision))) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Décision invalide (APPROVED ou REJECTED requis)"
                ));
            }
            
            String sql = "UPDATE protocol_submissions SET status = ?, decision_comments = ? WHERE id = ?";
            int updated = jdbcTemplate.update(sql, decision, comments, id);
            
            if (updated == 0) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Protocole non trouvé"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Décision enregistrée avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de l'enregistrement: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/deliberations")
    public ResponseEntity<?> getDeliberations(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || (!"president".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au président"
            ));
        }
        
        try {
            String sql = """
                SELECT pe.id, 
                       pe.protocol_id as protocolid,
                       CONCAT('PROT-', LPAD(pe.protocol_id::text, 4, '0')) as protocolcode,
                       pe.deliberation_number as deliberationnumber,
                       pe.research_title as researchtitle,
                       pe.principal_investigator as principalinvestigator,
                       pe.research_site as researchsite,
                       pe.deliberation_date as deliberationdate,
                       pe.observations,
                       pe.recommendations,
                       pe.recommandation_finale as decision,
                       pe.nom_evaluateur as rapporteur,
                       pe.evaluation_date as evaluationdate,
                       'SUBMITTED' as status,
                       null as presidentsignaturedate,
                       'Pr Fla KOUETA' as presidentname,
                       ps.institution,
                       ps.participants,
                       ps.duration,
                       ps.description,
                       ps.study_type as studytype,
                       ps.ethical_considerations,
                       ps.protocol_file_name,
                       ps.consent_form_file_name,
                       ps.cv_files_names,
                       ps.payment_receipt_file_name,
                       ps.payment_status,
                       TO_CHAR(pe.deliberation_date, 'YYYY-MM-DD') as deliberationdate_formatted
                FROM protocol_evaluations pe
                JOIN protocol_submissions ps ON pe.protocol_id = ps.id
                WHERE pe.is_final = true
                ORDER BY pe.id DESC
            """;
            
            List<Map<String, Object>> deliberations = jdbcTemplate.queryForList(sql);
            
            // Formatage des fichiers pour chaque délibération
            for (Map<String, Object> deliberation : deliberations) {
                // Utiliser la date formatée
                deliberation.put("deliberationdate", deliberation.get("deliberationdate_formatted"));
                
                // Formatage des fichiers pour affichage
                Map<String, Object> files = new HashMap<>();
                files.put("protocolFile", deliberation.get("protocol_file_name"));
                files.put("consentForm", deliberation.get("consent_form_file_name"));
                files.put("cvFiles", deliberation.get("cv_files_names"));
                files.put("paymentReceipt", deliberation.get("payment_receipt_file_name"));
                deliberation.put("files", files);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "deliberations", deliberations
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération des délibérations: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{id}/submit-deliberation")
    public ResponseEntity<?> submitDeliberation(@PathVariable Long id, @RequestBody Map<String, Object> request, HttpServletRequest httpRequest) {
        String userId = httpRequest.getHeader("X-User-ID");
        String userRole = httpRequest.getHeader("X-User-Role");
        
        if (userId == null || (!"president".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au président"
            ));
        }
        
        try {
            String sql = "UPDATE protocol_evaluations SET president_signature_date = CURRENT_TIMESTAMP WHERE protocol_id = ?";
            int updated = jdbcTemplate.update(sql, id);
            
            if (updated == 0) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Délibération non trouvée"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Délibération envoyée avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de l'envoi: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/send-deliberation/{id}")
    public ResponseEntity<?> sendDeliberation(@PathVariable Long id, HttpServletRequest httpRequest) {
        String userId = httpRequest.getHeader("X-User-ID");
        String userRole = httpRequest.getHeader("X-User-Role");
        
        if (userId == null || (!"president".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au président"
            ));
        }
        
        try {
            // Marquer comme envoyé au chercheur avec signature
            String sql = "UPDATE protocol_evaluations SET president_signature_date = CURRENT_TIMESTAMP, status = 'SENT_TO_RESEARCHER' WHERE protocol_id = ?";
            int updated = jdbcTemplate.update(sql, id);
            
            if (updated == 0) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Délibération non trouvée"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Délibération envoyée au chercheur avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de l'envoi: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || (!"president".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au président"
            ));
        }
        
        try {
            Map<String, Object> stats = new HashMap<>();
            
            String protocolStats = """
                SELECT status, COUNT(*) as count
                FROM protocol_submissions
                GROUP BY status
            """;
            
            List<Map<String, Object>> statusCounts = jdbcTemplate.queryForList(protocolStats);
            stats.put("protocolsByStatus", statusCounts);
            
            Integer totalProtocols = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM protocol_submissions", Integer.class);
            stats.put("totalProtocols", totalProtocols);
            
            Integer pendingAssignment = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM protocol_submissions WHERE status = 'VERIFIED'", Integer.class);
            stats.put("pendingAssignment", pendingAssignment);
            
            Integer assigned = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM protocol_submissions WHERE status = 'ASSIGNED_TO_MEMBER'", Integer.class);
            stats.put("assignedProtocols", assigned);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "stats", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération des statistiques: " + e.getMessage()
            ));
        }
    }
}