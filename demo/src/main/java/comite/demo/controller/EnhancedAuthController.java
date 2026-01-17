package comite.demo.controller;

import comite.demo.service.JwtService;
import comite.demo.service.UserService;
import comite.demo.entity.User;
import comite.demo.dto.LoginRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Contrôleur d'authentification amélioré avec JWT personnalisé
 * Génère des tokens avec informations complètes pour l'accès aux protocoles
 */
@RestController
@RequestMapping("/api/enhanced-auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class EnhancedAuthController {

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Connexion avec génération de token JWT personnalisé
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        try {
            // Valider les données d'entrée
            if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Nom d'utilisateur et mot de passe requis"
                ));
            }

            // Rechercher l'utilisateur
            User user = userService.findByUsername(loginRequest.getUsername());
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Identifiants invalides"
                ));
            }

            // Vérifier le mot de passe
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Identifiants invalides"
                ));
            }

            // Vérifier que l'utilisateur est actif
            if (!user.isActive()) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Compte désactivé"
                ));
            }

            // Générer le token JWT amélioré avec informations complètes
            Map<String, Object> additionalClaims = new HashMap<>();
            additionalClaims.put("firstName", user.getFirstName());
            additionalClaims.put("lastName", user.getLastName());
            additionalClaims.put("email", user.getEmail());
            
            String accessToken = jwtService.generateEnhancedAccessToken(
                user.getUsername(),
                user.getRole().name(),
                user.getId(),
                user.getUserIdentifier(),
                additionalClaims
            );

            String refreshToken = jwtService.generateRefreshToken(user.getUsername());

            // Préparer la réponse avec informations personnalisées
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Connexion réussie");
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);
            
            // Informations utilisateur sécurisées
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("username", user.getUsername());
            userInfo.put("firstName", user.getFirstName());
            userInfo.put("lastName", user.getLastName());
            userInfo.put("email", user.getEmail());
            userInfo.put("role", user.getRole().name());
            userInfo.put("userIdentifier", user.getUserIdentifier());
            
            response.put("user", userInfo);
            
            // Informations d'accès personnalisé
            response.put("accessLevel", determineAccessLevel(user.getRole().name()));
            response.put("dashboardType", getDashboardType(user.getRole().name()));
            response.put("permissions", getPermissions(user.getRole().name()));
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur serveur: " + e.getMessage()
            ));
        }
    }

    /**
     * Rafraîchissement du token
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Token de rafraîchissement requis"
                ));
            }

            // Valider le refresh token
            JwtService.TokenValidationResult validation = jwtService.validateToken(refreshToken);
            if (!validation.isValid()) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Token de rafraîchissement invalide"
                ));
            }

            String username = validation.getClaims().getSubject();
            User user = userService.findByUsername(username);
            
            if (user == null || !user.isActive()) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Utilisateur non trouvé ou inactif"
                ));
            }

            // Générer un nouveau token d'accès
            Map<String, Object> additionalClaims = new HashMap<>();
            additionalClaims.put("firstName", user.getFirstName());
            additionalClaims.put("lastName", user.getLastName());
            additionalClaims.put("email", user.getEmail());
            
            String newAccessToken = jwtService.generateEnhancedAccessToken(
                user.getUsername(),
                user.getRole().name(),
                user.getId(),
                user.getUserIdentifier(),
                additionalClaims
            );

            return ResponseEntity.ok(Map.of(
                "success", true,
                "accessToken", newAccessToken,
                "message", "Token rafraîchi avec succès"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors du rafraîchissement: " + e.getMessage()
            ));
        }
    }

    /**
     * Validation du token actuel
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            if (token == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Token requis"
                ));
            }

            JwtService.TokenValidationResult validation = jwtService.validateToken(token);
            
            if (validation.isValid()) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "valid", true,
                    "username", validation.getClaims().getSubject(),
                    "role", validation.getClaims().get("role", String.class),
                    "userId", validation.getClaims().get("userId", Long.class),
                    "expiration", validation.getClaims().getExpiration()
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "valid", false,
                    "message", validation.getMessage()
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur de validation: " + e.getMessage()
            ));
        }
    }

    /**
     * Déconnexion (côté client principalement)
     */
    @PostMapping("/enhanced-logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Déconnexion réussie"
        ));
    }

    // Méthodes utilitaires
    private String determineAccessLevel(String role) {
        switch (role.toUpperCase()) {
            case "ADMIN":
                return "FULL_ACCESS";
            case "PRESIDENT":
                return "SUPERVISION_ACCESS";
            case "SECRETARY":
                return "VALIDATION_ACCESS";
            case "COMMITTEE_MEMBER":
            case "RAPPORTEUR":
                return "EVALUATION_ACCESS";
            case "RESEARCHER":
                return "SUBMISSION_ACCESS";
            default:
                return "LIMITED_ACCESS";
        }
    }

    private String getDashboardType(String role) {
        switch (role.toUpperCase()) {
            case "ADMIN":
                return "admin";
            case "PRESIDENT":
                return "president";
            case "SECRETARY":
                return "secretary";
            case "COMMITTEE_MEMBER":
            case "RAPPORTEUR":
                return "member";
            case "RESEARCHER":
                return "researcher";
            default:
                return "basic";
        }
    }

    private String[] getPermissions(String role) {
        switch (role.toUpperCase()) {
            case "ADMIN":
                return new String[]{"manage_users", "assign_protocols", "view_all", "generate_reports", "system_settings"};
            case "PRESIDENT":
                return new String[]{"assign_protocols", "supervise_protocols", "approve_protocols", "view_assigned"};
            case "SECRETARY":
                return new String[]{"validate_protocols", "generate_reports", "manage_sessions", "view_pending"};
            case "COMMITTEE_MEMBER":
            case "RAPPORTEUR":
                return new String[]{"evaluate_protocols", "download_files", "view_assigned"};
            case "RESEARCHER":
                return new String[]{"submit_protocols", "edit_own", "view_own", "upload_files"};
            default:
                return new String[]{"view_basic"};
        }
    }
}