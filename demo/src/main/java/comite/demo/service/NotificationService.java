package comite.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private JavaMailSender mailSender;

    public void notifyStatusChange(Long protocolId, String oldStatus, String newStatus, String changedBy) {
        try {
            // Enregistrer la notification
            String insertNotificationSql = """
                INSERT INTO protocol_notifications 
                (protocol_id, old_status, new_status, changed_by, changed_at, notification_type)
                VALUES (?, ?, ?, ?, NOW(), 'STATUS_CHANGE')
            """;
            jdbcTemplate.update(insertNotificationSql, protocolId, oldStatus, newStatus, changedBy);

            // Notifier selon le nouveau statut
            switch (newStatus) {
                case "VERIFIED" -> notifyPresident(protocolId, newStatus, changedBy);
                case "ASSIGNED_TO_MEMBER" -> notifyCommitteeMembers(protocolId, changedBy);
                case "COMMITTEE_APPROVED", "COMMITTEE_REJECTED" -> notifySecretary(protocolId, newStatus, changedBy);
                case "PRESIDENT_SIGNED" -> notifySecretary(protocolId, newStatus, changedBy);
                default -> notifySecretary(protocolId, newStatus, changedBy);
            }

            System.out.println("✅ Notification envoyée - Protocole [REDACTED]: " + oldStatus + " → " + newStatus);
        } catch (Exception e) {
            System.err.println("❌ Erreur notification: Erreur système");
        }
    }

    private void notifySecretary(Long protocolId, String newStatus, String changedBy) {
        try {
            // Récupérer les emails des secrétaires
            String getSecretariesSql = "SELECT email FROM users WHERE role = 'SECRETARY' AND active = true";
            List<Map<String, Object>> secretaries = jdbcTemplate.queryForList(getSecretariesSql);

            // Récupérer les infos du protocole
            String getProtocolSql = "SELECT title, submitter_name FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> protocolInfo = jdbcTemplate.queryForList(getProtocolSql, protocolId);

            if (!secretaries.isEmpty() && !protocolInfo.isEmpty()) {
                String protocolTitle = (String) protocolInfo.get(0).get("title");
                String submitterName = (String) protocolInfo.get(0).get("submitter_name");

                String subject = "Changement de statut - Protocole PROT-" + String.format("%04d", protocolId);
                String body = String.format("""
                    Bonjour,
                    
                    Le protocole PROT-%04d a changé de statut :
                    
                    Titre : %s
                    Chercheur : %s
                    Nouveau statut : %s
                    Modifié par : %s
                    Date : %s
                    
                    Veuillez consulter le système pour plus de détails.
                    
                    Cordialement,
                    Système CERS
                    """, protocolId, protocolTitle, submitterName, getStatusLabel(newStatus), changedBy, LocalDateTime.now());

                for (Map<String, Object> secretary : secretaries) {
                    String email = (String) secretary.get("email");
                    sendEmail(email, subject, body);
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur envoi email: Erreur système");
        }
    }

    private String getStatusLabel(String status) {
        return switch (status) {
            case "SUBMITTED" -> "Soumis";
            case "VERIFIED" -> "Vérifié";
            case "ASSIGNED_TO_MEMBER" -> "Assigné aux membres";
            case "COMMITTEE_APPROVED" -> "Approuvé par le comité";
            case "COMMITTEE_REJECTED" -> "Rejeté par le comité";
            case "COMMITTEE_REVISION_REQUESTED" -> "Révision demandée";
            case "PRESIDENT_SIGNED" -> "Signé par le président";
            case "FINALIZED" -> "Finalisé";
            default -> status;
        };
    }

    private void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("arielkabore0@gmail.com");
            mailSender.send(message);
            System.out.println("📧 Email envoyé à: " + to);
        } catch (Exception e) {
            System.err.println("❌ Erreur email à " + to + ": " + e.getMessage());
        }
    }

    private void notifyPresident(Long protocolId, String newStatus, String changedBy) {
        try {
            // Récupérer l'email du président
            String getPresidentSql = "SELECT email FROM users WHERE role = 'PRESIDENT' AND active = true";
            List<Map<String, Object>> presidents = jdbcTemplate.queryForList(getPresidentSql);

            // Récupérer les infos du protocole
            String getProtocolSql = "SELECT title, submitter_name FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> protocolInfo = jdbcTemplate.queryForList(getProtocolSql, protocolId);

            if (!presidents.isEmpty() && !protocolInfo.isEmpty()) {
                String protocolTitle = (String) protocolInfo.get(0).get("title");
                String submitterName = (String) protocolInfo.get(0).get("submitter_name");

                String subject = "Nouveau protocole à assigner - PROT-" + String.format("%04d", protocolId);
                String body = String.format("""
                    Bonjour Monsieur le Président,
                    
                    Un nouveau protocole a été vérifié et attend votre assignation :
                    
                    Protocole : PROT-%04d
                    Titre : %s
                    Chercheur : %s
                    Vérifié par : %s
                    Date : %s
                    
                    Veuillez vous connecter pour assigner ce protocole aux membres du comité.
                    
                    Cordialement,
                    Système CERS
                    """, protocolId, protocolTitle, submitterName, changedBy, LocalDateTime.now());

                for (Map<String, Object> president : presidents) {
                    String email = (String) president.get("email");
                    sendEmail(email, subject, body);
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur notification président: " + e.getMessage());
        }
    }

    private void notifyCommitteeMembers(Long protocolId, String changedBy) {
        try {
            // Récupérer les membres assignés à ce protocole
            String getAssignedMembersSql = """
                SELECT DISTINCT u.email, u.first_name, u.last_name 
                FROM protocol_member_assignments pma
                JOIN users u ON pma.member_id = u.id
                WHERE pma.protocol_id = ? AND u.active = true
            """;
            List<Map<String, Object>> assignedMembers = jdbcTemplate.queryForList(getAssignedMembersSql, protocolId);

            // Récupérer les infos du protocole
            String getProtocolSql = "SELECT title, submitter_name FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> protocolInfo = jdbcTemplate.queryForList(getProtocolSql, protocolId);

            if (!assignedMembers.isEmpty() && !protocolInfo.isEmpty()) {
                String protocolTitle = (String) protocolInfo.get(0).get("title");
                String submitterName = (String) protocolInfo.get(0).get("submitter_name");

                String subject = "Protocole assigné pour évaluation - PROT-" + String.format("%04d", protocolId);
                String body = String.format("""
                    Bonjour,
                    
                    Un protocole vous a été assigné pour évaluation :
                    
                    Protocole : PROT-%04d
                    Titre : %s
                    Chercheur : %s
                    Assigné par : %s
                    Date : %s
                    
                    Veuillez vous connecter pour procéder à l'évaluation.
                    
                    Cordialement,
                    Système CERS
                    """, protocolId, protocolTitle, submitterName, changedBy, LocalDateTime.now());

                for (Map<String, Object> member : assignedMembers) {
                    String email = (String) member.get("email");
                    sendEmail(email, subject, body);
                }
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur notification membres: " + e.getMessage());
        }
    }

    public void createNotificationTable() {
        try {
            String createTableSql = """
                CREATE TABLE IF NOT EXISTS protocol_notifications (
                    id SERIAL PRIMARY KEY,
                    protocol_id BIGINT NOT NULL,
                    old_status VARCHAR(100),
                    new_status VARCHAR(100),
                    changed_by VARCHAR(255),
                    changed_at TIMESTAMP DEFAULT NOW(),
                    notification_type VARCHAR(50),
                    read_by_secretary BOOLEAN DEFAULT FALSE,
                    read_by_president BOOLEAN DEFAULT FALSE,
                    read_by_member BOOLEAN DEFAULT FALSE,
                    target_role VARCHAR(50),
                    target_user_id BIGINT,
                    created_at TIMESTAMP DEFAULT NOW()
                )
            """;
            jdbcTemplate.execute(createTableSql);
            System.out.println("✅ Table protocol_notifications créée");
        } catch (Exception e) {
            System.err.println("❌ Erreur création table: " + e.getMessage());
        }
    }
}