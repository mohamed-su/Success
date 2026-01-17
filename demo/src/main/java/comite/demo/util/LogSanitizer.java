package comite.demo.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Utilitaire pour nettoyer les entrées de logs et prévenir les injections
 */
public class LogSanitizer {
    
    private static final Logger logger = LoggerFactory.getLogger(LogSanitizer.class);
    
    /**
     * Nettoie une chaîne pour l'utilisation sécurisée dans les logs
     * @param input La chaîne à nettoyer
     * @return La chaîne nettoyée
     */
    public static String sanitize(String input) {
        if (input == null) {
            return "[NULL]";
        }
        
        // Remplacer les caractères de contrôle et de nouvelle ligne
        return input.replaceAll("[\r\n\t]", "_")
                   .replaceAll("[\\p{Cntrl}]", "_")
                   .substring(0, Math.min(input.length(), 200)); // Limiter la longueur
    }
    
    /**
     * Masque les données sensibles pour les logs
     * @param sensitiveData Les données sensibles
     * @return Une version masquée
     */
    public static String mask(String sensitiveData) {
        if (sensitiveData == null || sensitiveData.isEmpty()) {
            return "[EMPTY]";
        }
        
        if (sensitiveData.length() <= 4) {
            return "[MASKED]";
        }
        
        return sensitiveData.substring(0, 2) + "***" + sensitiveData.substring(sensitiveData.length() - 2);
    }
    
    /**
     * Log sécurisé pour les erreurs
     */
    public static void logError(Logger logger, String message, Object... params) {
        Object[] sanitizedParams = new Object[params.length];
        for (int i = 0; i < params.length; i++) {
            if (params[i] instanceof String) {
                sanitizedParams[i] = sanitize((String) params[i]);
            } else {
                sanitizedParams[i] = params[i];
            }
        }
        logger.error(message, sanitizedParams);
    }
    
    /**
     * Log sécurisé pour les informations
     */
    public static void logInfo(Logger logger, String message, Object... params) {
        Object[] sanitizedParams = new Object[params.length];
        for (int i = 0; i < params.length; i++) {
            if (params[i] instanceof String) {
                sanitizedParams[i] = sanitize((String) params[i]);
            } else {
                sanitizedParams[i] = params[i];
            }
        }
        logger.info(message, sanitizedParams);
    }
}