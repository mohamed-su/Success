package comite.demo.service;

import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private EmailService emailService;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public User createUserWithGeneratedPassword(User user) {
        // Générer un mot de passe aléatoire
        String generatedPassword = generateRandomPassword();
        
        // Encoder le mot de passe
        user.setPassword(passwordEncoder.encode(generatedPassword));
        
        // Sauvegarder l'utilisateur
        User savedUser = userRepository.save(user);
        
        // Envoyer le mot de passe par email
        try {
            emailService.sendWelcomeEmailWithPassword(
                user.getEmail(),
                user.getFirstName() + " " + user.getLastName(),
                user.getUsername(),
                generatedPassword
            );
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
        
        return savedUser;
    }
    
    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < 12; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }
    
    public User deactivateUser(Long userId, String reason) {
        User user = findById(userId);
        if (user != null) {
            user.setActive(false);
            return saveUser(user);
        }
        return null;
    }
    
    public User reactivateUser(Long userId) {
        User user = findById(userId);
        if (user != null) {
            user.setActive(true);
            return saveUser(user);
        }
        return null;
    }
    
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }
    
    public List<User> getCommitteeMembers() {
        return userRepository.findCommitteeMembers();
    }
}