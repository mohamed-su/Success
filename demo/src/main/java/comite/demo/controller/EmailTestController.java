package comite.demo.controller;

import comite.demo.service.EmailService;
import comite.demo.service.ProtocolSubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProtocolSubmissionService protocolSubmissionService;

    @PostMapping("/send-test-email")
    public ResponseEntity<?> sendTestEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String type = request.get("type");
            
            if (email == null || type == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email et type sont requis"
                ));
            }

            switch (type) {
                case "password-reset":
                    emailService.sendPasswordResetEmail(email, "Test User", "test-token-123");
                    break;
                case "submission-confirmation":
                    emailService.sendProtocolSubmissionConfirmation(email, "Test User", "Protocole de Test", 1L);
                    break;
                case "protocol-approval":
                    emailService.sendProtocolApprovalNotification(email, "Test User", "Protocole de Test", 1L);
                    break;
                case "protocol-assignment":
                    emailService.sendProtocolAssignmentNotification(email, "Secrétaire Test", "Protocole de Test", 1L, "Chercheur Test");
                    break;
                case "protocol-rejection":
                    emailService.sendProtocolRejectionNotification(email, "Test User", "Protocole de Test", 1L, "Motif de test");
                    break;
                default:
                    return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Type d'email non reconnu"
                    ));
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email de test envoyé avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Erreur lors de l'envoi: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/update-protocol-status")
    public ResponseEntity<?> updateProtocolStatus(@RequestBody Map<String, Object> request) {
        try {
            Long protocolId = Long.valueOf(request.get("protocolId").toString());
            String status = request.get("status").toString();
            String comments = request.get("comments") != null ? request.get("comments").toString() : null;

            protocolSubmissionService.updateProtocolStatus(protocolId, status, comments);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Statut du protocole mis à jour et email envoyé"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Erreur lors de la mise à jour: " + e.getMessage()
            ));
        }
    }
}