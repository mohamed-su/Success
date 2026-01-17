package comite.demo.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

/**
 * Utilitaire pour la gestion sécurisée des erreurs
 */
public class SecureErrorHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(SecureErrorHandler.class);
    
    /**
     * Gère une erreur de manière sécurisée
     * @param e L'exception
     * @param userMessage Message à afficher à l'utilisateur
     * @param logContext Contexte pour les logs
     * @return ResponseEntity avec erreur sécurisée
     */
    public static ResponseEntity<?> handleError(Exception e, String userMessage, String logContext) {
        // Log détaillé pour les développeurs (sans données sensibles)
        logger.error("Erreur dans {}: {}", 
            LogSanitizer.sanitize(logContext), 
            LogSanitizer.sanitize(e.getMessage()), 
            e);
        
        // Réponse générique pour l'utilisateur
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Map.of(
                "success", false,
                "error", userMessage,
                "timestamp", java.time.LocalDateTime.now()
            ));
    }
    
    /**
     * Gère une erreur de validation
     */
    public static ResponseEntity<?> handleValidationError(String message) {
        return ResponseEntity.badRequest()
            .body(Map.of(
                "success", false,
                "error", LogSanitizer.sanitize(message),
                "type", "validation_error"
            ));
    }
    
    /**
     * Gère une erreur d'autorisation
     */
    public static ResponseEntity<?> handleAuthorizationError(String message) {
        logger.warn("Tentative d'accès non autorisé: {}", LogSanitizer.sanitize(message));
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(Map.of(
                "success", false,
                "error", "Accès non autorisé",
                "type", "authorization_error"
            ));
    }
    
    /**
     * Gère une erreur de ressource non trouvée
     */
    public static ResponseEntity<?> handleNotFoundError(String resource) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(Map.of(
                "success", false,
                "error", LogSanitizer.sanitize(resource) + " non trouvé",
                "type", "not_found_error"
            ));
    }
}