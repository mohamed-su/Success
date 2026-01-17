package comite.demo.service;

import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Stockage temporaire des tokens (en production, utiliser Redis ou base de données)
    private final Map<String, PasswordResetToken> resetTokens = new HashMap<>();

    public boolean initiatePasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        String token = generateResetToken();
        
        // Stocker le token avec expiration (24h)
        resetTokens.put(token, new PasswordResetToken(user.getId(), LocalDateTime.now().plusHours(24)));
        
        // Envoyer l'email
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName() + " " + user.getLastName(), token);
        
        return true;
    }

    public boolean resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = resetTokens.get(token);
        
        if (resetToken == null || resetToken.isExpired()) {
            resetTokens.remove(token); // Nettoyer le token expiré
            return false;
        }

        Optional<User> userOpt = userRepository.findById(resetToken.getUserId());
        if (userOpt.isEmpty()) {
            resetTokens.remove(token);
            return false;
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Supprimer le token utilisé
        resetTokens.remove(token);
        
        return true;
    }

    public boolean isValidToken(String token) {
        PasswordResetToken resetToken = resetTokens.get(token);
        return resetToken != null && !resetToken.isExpired();
    }

    private String generateResetToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static class PasswordResetToken {
        private final Long userId;
        private final LocalDateTime expiryTime;

        public PasswordResetToken(Long userId, LocalDateTime expiryTime) {
            this.userId = userId;
            this.expiryTime = expiryTime;
        }

        public Long getUserId() {
            return userId;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiryTime);
        }
    }
}