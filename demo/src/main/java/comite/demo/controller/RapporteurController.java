package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/rapporteur")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RapporteurController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/protocols")
    public ResponseEntity<?> getAssignedProtocols(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        // Accepter plusieurs formats de rôles
        if (userId == null || (!"RAPPORTEUR".equalsIgnoreCase(userRole) && 
                              !"COMMITTEE_MEMBER".equalsIgnoreCase(userRole) &&
                              !"rapporteur".equalsIgnoreCase(userRole) &&
                              !"member".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé aux rapporteurs et membres du comité. Rôle reçu: " + userRole
            ));
        }
        
        try {
            // D'abord récupérer le nom de l'utilisateur
            String userSql = "SELECT CONCAT(first_name, ' ', last_name) as full_name FROM users WHERE id = ?";
            String userName;
            try {
                userName = jdbcTemplate.queryForObject(userSql, String.class, Long.parseLong(userId));
            } catch (Exception e) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Utilisateur non trouvé avec ID: " + userId
                ));
            }
            
            // Chercher les protocoles assignés par nom d'utilisateur
            String assignedProtocolsSql = """
                SELECT ps.id, ps.title, ps.submitter_name as principalInvestigator, 
                       ps.institution, ps.participants, ps.duration, ps.status,
                       true as isAssigned,
                       'Vous' as assignedMembers,
                       CASE WHEN pe.id IS NOT NULL THEN true ELSE false END as hasDeliberation,
                       CASE WHEN pe.id IS NOT NULL THEN 'COMPLETED' ELSE 'PENDING' END as deliberationStatus
                FROM protocol_submissions ps 
                JOIN protocol_member_assignments pma ON ps.id = pma.protocol_id
                LEFT JOIN protocol_evaluations pe ON ps.id = pe.protocol_id AND pe.evaluator_id = ?
                WHERE pma.member_id = ?
                ORDER BY ps.id DESC
            """;
            
            List<Map<String, Object>> protocols = jdbcTemplate.queryForList(assignedProtocolsSql, 
                Long.parseLong(userId), Long.parseLong(userId));
            
            // Ajouter des informations sur le statut de délibération
            for (Map<String, Object> protocol : protocols) {
                Boolean hasDeliberation = (Boolean) protocol.get("hasDeliberation");
                if (hasDeliberation == null) hasDeliberation = false;
                
                protocol.put("canEdit", !hasDeliberation);
                protocol.put("deliberationSubmitted", hasDeliberation);
                
                if (hasDeliberation) {
                    protocol.put("statusLabel", "Délibération soumise");
                    protocol.put("canEvaluate", false);
                } else {
                    protocol.put("statusLabel", "En attente d'évaluation");
                    protocol.put("canEvaluate", true);
                }
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "members", new ArrayList<>(),
                "debug", Map.of(
                    "userId", userId,
                    "userRole", userRole,
                    "userName", userName,
                    "protocolCount", protocols.size()
                )
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{id}/review")
    public ResponseEntity<?> submitReview(@PathVariable Long id, @RequestBody Map<String, Object> request, HttpServletRequest httpRequest) {
        String userId = httpRequest.getHeader("X-User-ID");
        String userRole = httpRequest.getHeader("X-User-Role");
        
        if (userId == null || (!"RAPPORTEUR".equalsIgnoreCase(userRole) && 
                              !"COMMITTEE_MEMBER".equalsIgnoreCase(userRole) &&
                              !"rapporteur".equalsIgnoreCase(userRole) &&
                              !"member".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé aux rapporteurs et membres du comité"
            ));
        }
        
        try {
            String recommendation = (String) request.get("recommendation");
            String comments = (String) request.get("comments");
            
            if (recommendation == null || (!recommendation.equals("APPROVE") && !recommendation.equals("REJECT") && !recommendation.equals("MODIFY"))) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Recommandation invalide (APPROVE, REJECT ou MODIFY)"
                ));
            }
            
            // Vérifier que le protocole est assigné à ce membre
            String checkSql = "SELECT COUNT(*) FROM protocol_member_assignments WHERE protocol_id = ? AND member_id = ?";
            Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, id, Long.parseLong(userId));
            
            if (count == 0) {
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "error", "Protocole non assigné à ce membre"
                ));
            }
            
            // Enregistrer la recommandation dans protocol_member_assignments
            String updateSql = """
                UPDATE protocol_member_assignments 
                SET status = ?, assigned_at = CURRENT_TIMESTAMP 
                WHERE protocol_id = ? AND member_id = ?
            """;
            
            int updated = jdbcTemplate.update(updateSql, recommendation, id, Long.parseLong(userId));
            
            if (updated == 0) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Assignation non trouvée"
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Recommandation enregistrée avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de l'enregistrement: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{id}/submit-deliberation")
    public ResponseEntity<?> submitDeliberation(@PathVariable Long id, @RequestBody Map<String, Object> request, HttpServletRequest httpRequest) {
        String userId = httpRequest.getHeader("X-User-ID");
        String userRole = httpRequest.getHeader("X-User-Role");
        
        if (userId == null || (!"RAPPORTEUR".equalsIgnoreCase(userRole) && 
                              !"COMMITTEE_MEMBER".equalsIgnoreCase(userRole) &&
                              !"rapporteur".equalsIgnoreCase(userRole) &&
                              !"member".equalsIgnoreCase(userRole))) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé aux rapporteurs et membres du comité"
            ));
        }
        
        try {
            // Récupérer les informations du protocole et du rapporteur
            String protocolSql = """
                SELECT ps.title, ps.submitter_name, ps.institution,
                       CONCAT(u.first_name, ' ', u.last_name) as rapporteur_name
                FROM protocol_submissions ps
                JOIN protocol_member_assignments pma ON ps.id = pma.protocol_id
                JOIN users u ON pma.member_id = u.id
                WHERE ps.id = ? AND pma.member_id = ?
            """;
            
            Map<String, Object> protocolInfo = jdbcTemplate.queryForMap(protocolSql, id, Long.parseLong(userId));
            
            // Vérifier si une délibération existe déjà
            String checkSql = "SELECT COUNT(*) FROM protocol_evaluations WHERE protocol_id = ? AND member_id = ?";
            Integer existingCount = jdbcTemplate.queryForObject(checkSql, Integer.class, id, Long.parseLong(userId));
            
            if (existingCount > 0) {
                // Mettre à jour la délibération existante
                String updateSql = """
                    UPDATE protocol_evaluations SET
                        observations = ?, recommendations = ?, decision = ?,
                        deliberation_date = CURRENT_DATE, status = 'COMPLETED',
                        updated_at = CURRENT_TIMESTAMP
                    WHERE protocol_id = ? AND member_id = ?
                """;
                
                jdbcTemplate.update(updateSql, 
                    request.get("observations"),
                    request.get("recommendations"),
                    request.get("decision"),
                    id,
                    Long.parseLong(userId)
                );
            } else {
                // Créer une nouvelle délibération
                String insertSql = """
                    INSERT INTO protocol_evaluations (
                        protocol_id, member_id, member_name, deliberation_number, research_title,
                        principal_investigator, research_site, deliberation_date,
                        observations, recommendations, decision, evaluator_name,
                        evaluation_date, status, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, ?, ?, ?, ?, CURRENT_DATE, 'COMPLETED', CURRENT_TIMESTAMP)
                """;
                
                jdbcTemplate.update(insertSql,
                    id,
                    Long.parseLong(userId),
                    protocolInfo.get("rapporteur_name"),
                    "DEL-" + String.format("%04d", id),
                    protocolInfo.get("title"),
                    protocolInfo.get("submitter_name"),
                    protocolInfo.get("institution"),
                    request.get("observations"),
                    request.get("recommendations"),
                    request.get("decision"),
                    protocolInfo.get("rapporteur_name")
                );
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Délibération soumise avec succès"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la soumission: " + e.getMessage()
            ));
        }
    }
}