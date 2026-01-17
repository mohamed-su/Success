package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class NotificationController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/my-notifications")
    public ResponseEntity<?> getMyNotifications(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || userRole == null) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Informations utilisateur manquantes"
            ));
        }

        try {
            String sql;
            List<Map<String, Object>> notifications;
            
            if ("secretary".equalsIgnoreCase(userRole)) {
                // Notifications pour la secrétaire (tous les changements)
                sql = """
                    SELECT pn.*, ps.title, ps.submitter_name 
                    FROM protocol_notifications pn
                    JOIN protocol_submissions ps ON pn.protocol_id = ps.id
                    ORDER BY pn.changed_at DESC
                    LIMIT 50
                """;
                notifications = jdbcTemplate.queryForList(sql);
            } else if ("president".equalsIgnoreCase(userRole)) {
                // Notifications pour le président (protocoles vérifiés)
                sql = """
                    SELECT pn.*, ps.title, ps.submitter_name 
                    FROM protocol_notifications pn
                    JOIN protocol_submissions ps ON pn.protocol_id = ps.id
                    WHERE pn.new_status = 'VERIFIED'
                    ORDER BY pn.changed_at DESC
                    LIMIT 50
                """;
                notifications = jdbcTemplate.queryForList(sql);
            } else {
                // Notifications pour les membres du comité (protocoles assignés)
                sql = """
                    SELECT DISTINCT pn.*, ps.title, ps.submitter_name 
                    FROM protocol_notifications pn
                    JOIN protocol_submissions ps ON pn.protocol_id = ps.id
                    JOIN protocol_member_assignments pma ON pn.protocol_id = pma.protocol_id
                    WHERE pma.member_id = ? AND pn.new_status = 'ASSIGNED_TO_MEMBER'
                    ORDER BY pn.changed_at DESC
                    LIMIT 50
                """;
                notifications = jdbcTemplate.queryForList(sql, Long.parseLong(userId));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "notifications", notifications,
                "count", notifications.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/secretary")
    public ResponseEntity<?> getSecretaryNotifications(HttpServletRequest request) {
        return getMyNotifications(request);
    }

    @PostMapping("/{notificationId}/mark-read")
    public ResponseEntity<?> markAsRead(@PathVariable Long notificationId,
                                       HttpServletRequest request) {
        String userRole = request.getHeader("X-User-Role");
        
        if (!"secretary".equalsIgnoreCase(userRole)) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé aux secrétaires"
            ));
        }

        try {
            String sql = "UPDATE protocol_notifications SET read_by_secretary = true WHERE id = ?";
            jdbcTemplate.update(sql, notificationId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Notification marquée comme lue"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || userRole == null) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "count", 0
            ));
        }

        try {
            String sql;
            Integer count = 0;
            
            if ("secretary".equalsIgnoreCase(userRole)) {
                sql = "SELECT COUNT(*) FROM protocol_notifications WHERE read_by_secretary = false";
                count = jdbcTemplate.queryForObject(sql, Integer.class);
            } else if ("president".equalsIgnoreCase(userRole)) {
                sql = "SELECT COUNT(*) FROM protocol_notifications WHERE new_status = 'VERIFIED' AND read_by_president = false";
                count = jdbcTemplate.queryForObject(sql, Integer.class);
            } else {
                sql = """
                    SELECT COUNT(DISTINCT pn.id) 
                    FROM protocol_notifications pn
                    JOIN protocol_member_assignments pma ON pn.protocol_id = pma.protocol_id
                    WHERE pma.member_id = ? AND pn.new_status = 'ASSIGNED_TO_MEMBER' AND pn.read_by_member = false
                """;
                count = jdbcTemplate.queryForObject(sql, Integer.class, Long.parseLong(userId));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "count", count != null ? count : 0
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "count", 0
            ));
        }
    }
}