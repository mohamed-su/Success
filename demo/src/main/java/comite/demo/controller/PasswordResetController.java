package comite.demo.controller;

import comite.demo.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "L'adresse email est requise"
            ));
        }

        boolean success = passwordResetService.initiatePasswordReset(email);
        
        if (success) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Un email de réinitialisation a été envoyé à votre adresse email"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Aucun compte trouvé avec cette adresse email"
            ));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");
        
        if (token == null || newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Token et mot de passe (minimum 6 caractères) sont requis"
            ));
        }

        boolean success = passwordResetService.resetPassword(token, newPassword);
        
        if (success) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Votre mot de passe a été réinitialisé avec succès"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Token invalide ou expiré"
            ));
        }
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.isValidToken(token);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "valid", isValid
        ));
    }
}