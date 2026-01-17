package comite.demo.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Service de validation des mots de passe conforme OWASP/NIST
 * - Longueur minimale : 12 caractères
 * - Complexité : majuscules, minuscules, chiffres, caractères spéciaux
 * - Historique des 5 derniers mots de passe
 */
@Service
public class PasswordValidationService {
    
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    
    // Patterns de validation OWASP
    private static final Pattern UPPERCASE = Pattern.compile("[A-Z]");
    private static final Pattern LOWERCASE = Pattern.compile("[a-z]");
    private static final Pattern DIGIT = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL = Pattern.compile("[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]");
    private static final int MIN_LENGTH = 12;
    private static final int PASSWORD_HISTORY_SIZE = 5;
    
    public PasswordValidationService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = new ObjectMapper();
    }
    
    public ValidationResult validatePassword(String password, String previousPasswordsJson) {
        List<String> errors = new ArrayList<>();
        
        // Longueur minimale
        if (password.length() < MIN_LENGTH) {
            errors.add("Le mot de passe doit contenir au moins " + MIN_LENGTH + " caractères");
        }
        
        // Complexité
        if (!UPPERCASE.matcher(password).find()) {
            errors.add("Le mot de passe doit contenir au moins une majuscule");
        }
        if (!LOWERCASE.matcher(password).find()) {
            errors.add("Le mot de passe doit contenir au moins une minuscule");
        }
        if (!DIGIT.matcher(password).find()) {
            errors.add("Le mot de passe doit contenir au moins un chiffre");
        }
        if (!SPECIAL.matcher(password).find()) {
            errors.add("Le mot de passe doit contenir au moins un caractère spécial");
        }
        
        // Vérification de l'historique
        if (isPasswordInHistory(password, previousPasswordsJson)) {
            errors.add("Ce mot de passe a déjà été utilisé récemment");
        }
        
        return new ValidationResult(errors.isEmpty(), errors);
    }
    
    private boolean isPasswordInHistory(String newPassword, String previousPasswordsJson) {
        if (previousPasswordsJson == null || previousPasswordsJson.isEmpty()) {
            return false;
        }
        
        try {
            List<String> previousPasswords = objectMapper.readValue(
                previousPasswordsJson, 
                new TypeReference<List<String>>() {}
            );
            
            return previousPasswords.stream()
                .anyMatch(oldPassword -> passwordEncoder.matches(newPassword, oldPassword));
        } catch (Exception e) {
            return false;
        }
    }
    
    public String updatePasswordHistory(String newPasswordHash, String previousPasswordsJson) {
        List<String> passwordHistory = new ArrayList<>();
        
        if (previousPasswordsJson != null && !previousPasswordsJson.isEmpty()) {
            try {
                passwordHistory = objectMapper.readValue(
                    previousPasswordsJson, 
                    new TypeReference<List<String>>() {}
                );
            } catch (Exception e) {
                // Ignore et continue avec une liste vide
            }
        }
        
        passwordHistory.add(0, newPasswordHash);
        
        // Garder seulement les 5 derniers
        if (passwordHistory.size() > PASSWORD_HISTORY_SIZE) {
            passwordHistory = passwordHistory.subList(0, PASSWORD_HISTORY_SIZE);
        }
        
        try {
            return objectMapper.writeValueAsString(passwordHistory);
        } catch (Exception e) {
            return "[]";
        }
    }
    
    public static class ValidationResult {
        private final boolean valid;
        private final List<String> errors;
        
        public ValidationResult(boolean valid, List<String> errors) {
            this.valid = valid;
            this.errors = errors;
        }
        
        public boolean isValid() { return valid; }
        public List<String> getErrors() { return errors; }
    }
}