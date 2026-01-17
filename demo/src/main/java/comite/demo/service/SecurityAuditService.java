package comite.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service d'audit de sécurité
 * Conforme aux exigences ISO 27001 pour la traçabilité et l'audit
 */
@Service
@Transactional
public class SecurityAuditService {
    
    private static final Logger logger = LoggerFactory.getLogger(SecurityAuditService.class);
    
    private final JdbcTemplate jdbcTemplate;
    
    public SecurityAuditService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public void logLoginAttempt(String username, String ipAddress, String userAgent, 
                               boolean success, String failureReason, String sessionId) {
        try {
            // Log uniquement dans les logs pour l'instant
            if (success) {
                logger.info("Connexion réussie - Utilisateur: {}, IP: {}", username, ipAddress);
            } else {
                logger.warn("Échec de connexion - Utilisateur: {}, IP: {}, Raison: {}", 
                           username, ipAddress, failureReason);
            }
            
        } catch (Exception e) {
            logger.error("Erreur lors de l'enregistrement de l'audit de connexion", e);
        }
    }
    
    public void logPasswordReset(String email, String ipAddress, boolean success) {
        String action = success ? "Réinitialisation de mot de passe réussie" : "Tentative de réinitialisation échouée";
        logger.info("Audit sécurité - Action: {}, Email: {}, IP: {}", action, email, ipAddress);
    }
    
    public void log2FAEvent(String username, String action, boolean success) {
        String status = success ? "réussie" : "échouée";
        logger.info("Audit 2FA - Action: {} {}, Utilisateur: {}", action, status, username);
    }
    
    public void logSecurityViolation(String username, String ipAddress, String violation, String details) {
        logger.warn("VIOLATION DE SÉCURITÉ - Utilisateur: {}, IP: {}, Type: {}, Détails: {}", 
                   username, ipAddress, violation, details);
    }
    
    public void logAccountLockout(String username, String ipAddress, int failedAttempts) {
        logger.warn("VERROUILLAGE DE COMPTE - Utilisateur: {}, IP: {}, Tentatives échouées: {}", 
                   username, ipAddress, failedAttempts);
    }
    
    public void logRateLimitExceeded(String identifier, String type, String ipAddress) {
        logger.warn("RATE LIMIT DÉPASSÉ - Type: {}, Identifiant: {}, IP: {}", type, identifier, ipAddress);
    }
    
    public void revokeToken(String tokenHash, String username, LocalDateTime expiresAt) {
        try {
            // Log uniquement pour l'instant
            logger.info("Token révoqué pour l'utilisateur: {}", username);
            
        } catch (Exception e) {
            logger.error("Erreur lors de la révocation du token", e);
        }
    }
    
    public boolean isTokenRevoked(String tokenHash) {
        try {
            // Retourner false pour l'instant (pas de révocation en DB)
            return false;
            
        } catch (Exception e) {
            logger.error("Erreur lors de la vérification du token révoqué", e);
            return false;
        }
    }
    
    public void cleanupExpiredTokens() {
        try {
            // Pas de nettoyage en DB pour l'instant
            logger.debug("Nettoyage des tokens expirés (pas de DB pour l'instant)");
            
        } catch (Exception e) {
            logger.error("Erreur lors du nettoyage des tokens expirés", e);
        }
    }
    
    public void cleanupOldAuditLogs(int retentionDays) {
        try {
            // Pas de nettoyage en DB pour l'instant
            logger.debug("Nettoyage des logs d'audit (pas de DB pour l'instant)");
            
        } catch (Exception e) {
            logger.error("Erreur lors du nettoyage des logs d'audit", e);
        }
    }
}