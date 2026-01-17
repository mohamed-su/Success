package comite.demo.controller;

import comite.demo.service.PersonalizedProtocolService;
import comite.demo.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Contrôleur pour l'accès personnalisé aux protocoles basé sur JWT
 * Garantit que chaque utilisateur accède uniquement à ses protocoles
 */
@RestController
@RequestMapping("/api/personalized")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PersonalizedProtocolController {

    @Autowired
    private PersonalizedProtocolService personalizedService;
    
    @Autowired
    private JwtService jwtService;

    /**
     * Récupère les protocoles personnalisés selon le token JWT
     */
    @GetMapping("/protocols")
    public ResponseEntity<?> getPersonalizedProtocols(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Token d'authentification requis"
                ));
            }

            Map<String, Object> result = personalizedService.getPersonalizedProtocols(token);
            
            if (!(Boolean) result.get("success")) {
                return ResponseEntity.status(403).body(result);
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur serveur: " + e.getMessage()
            ));
        }
    }

    /**
     * Assigne un protocole avec validation JWT stricte
     */
    @PostMapping("/protocols/{protocolId}/assign/{memberId}")
    public ResponseEntity<?> assignProtocol(@PathVariable Long protocolId,
                                          @PathVariable Long memberId,
                                          HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Token d'authentification requis"
                ));
            }

            Map<String, Object> result = personalizedService.assignProtocolWithJwtValidation(
                token, protocolId, memberId
            );
            
            if (!(Boolean) result.get("success")) {
                return ResponseEntity.status(403).body(result);
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de l'assignation: " + e.getMessage()
            ));
        }
    }

    /**
     * Récupère les détails d'un protocole spécifique avec vérification d'accès
     */
    @GetMapping("/protocols/{protocolId}")
    public ResponseEntity<?> getProtocolDetails(@PathVariable Long protocolId,
                                              HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Token d'authentification requis"
                ));
            }

            // Valider le token et vérifier l'accès
            JwtService.TokenValidationResult validation = jwtService.validateToken(token);
            if (!validation.isValid()) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Token invalide ou expiré"
                ));
            }

            // Vérifier que l'utilisateur a accès à ce protocole
            Map<String, Object> protocols = personalizedService.getPersonalizedProtocols(token);
            if (!(Boolean) protocols.get("success")) {
                return ResponseEntity.status(403).body(protocols);
            }

            // Rechercher le protocole dans les protocoles accessibles
            boolean hasAccess = hasAccessToProtocol(protocols, protocolId);
            if (!hasAccess) {
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "error", "Accès non autorisé à ce protocole"
                ));
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Accès autorisé au protocole " + protocolId
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur serveur: " + e.getMessage()
            ));
        }
    }

    /**
     * Récupère les informations utilisateur sécurisées depuis le JWT
     */
    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Token d'authentification requis"
                ));
            }

            JwtService.TokenValidationResult validation = jwtService.validateToken(token);
            if (!validation.isValid()) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Token invalide ou expiré"
                ));
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "username", validation.getClaims().getSubject(),
                "role", validation.getClaims().get("role", String.class),
                "userId", validation.getClaims().get("userId", Long.class),
                "tokenExpiry", validation.getClaims().getExpiration()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur serveur: " + e.getMessage()
            ));
        }
    }

    /**
     * Valide l'accès à une action spécifique
     */
    @PostMapping("/validate-access")
    public ResponseEntity<?> validateAccess(@RequestBody Map<String, Object> requestBody,
                                          HttpServletRequest request) {
        try {
            String token = extractTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Token d'authentification requis"
                ));
            }

            String action = (String) requestBody.get("action");
            Long resourceId = Long.valueOf(requestBody.get("resourceId").toString());

            JwtService.TokenValidationResult validation = jwtService.validateToken(token);
            if (!validation.isValid()) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "error", "Token invalide ou expiré"
                ));
            }

            String role = validation.getClaims().get("role", String.class);
            boolean hasPermission = validateActionPermission(role, action, resourceId);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "hasPermission", hasPermission,
                "action", action,
                "role", role
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur de validation: " + e.getMessage()
            ));
        }
    }

    /**
     * Extrait le token JWT de la requête
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    /**
     * Vérifie si l'utilisateur a accès à un protocole spécifique
     */
    private boolean hasAccessToProtocol(Map<String, Object> userProtocols, Long protocolId) {
        // Vérifier dans tous les types de protocoles selon le rôle
        String[] protocolKeys = {"assignedProtocols", "supervisionProtocols", "pendingProtocols", 
                                "myProtocols", "allProtocols"};
        
        for (String key : protocolKeys) {
            if (userProtocols.containsKey(key)) {
                @SuppressWarnings("unchecked")
                java.util.List<Map<String, Object>> protocols = 
                    (java.util.List<Map<String, Object>>) userProtocols.get(key);
                
                for (Map<String, Object> protocol : protocols) {
                    if (protocolId.equals(protocol.get("id"))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Valide les permissions d'action selon le rôle
     */
    private boolean validateActionPermission(String role, String action, Long resourceId) {
        switch (role.toUpperCase()) {
            case "ADMIN":
                return true; // Admin a tous les droits
            case "PRESIDENT":
                return java.util.Arrays.asList("assign", "approve", "view", "supervise").contains(action);
            case "SECRETARY":
                return java.util.Arrays.asList("validate", "view", "generate_report").contains(action);
            case "COMMITTEE_MEMBER":
            case "RAPPORTEUR":
                return java.util.Arrays.asList("evaluate", "view", "download").contains(action);
            case "RESEARCHER":
                return java.util.Arrays.asList("submit", "edit", "view_own").contains(action);
            default:
                return false;
        }
    }
}