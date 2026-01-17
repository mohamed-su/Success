package comite.demo.controller;

import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import comite.demo.service.JwtService;
import comite.demo.service.AutoAuthService;
import comite.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.time.LocalDateTime;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MainAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AutoAuthService autoAuthService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/test")
    public ResponseEntity<?> testConnection() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Backend CERS connecté");
        response.put("timestamp", LocalDateTime.now());
        response.put("version", "1.0.0");
        response.put("userCount", userRepository.count());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth(org.springframework.security.core.Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        if (authentication != null) {
            response.put("authenticated", true);
            response.put("username", authentication.getName());
            response.put("authorities", authentication.getAuthorities());
        } else {
            response.put("authenticated", false);
            response.put("message", "Aucune authentification trouvée");
        }
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/debug/token")
    public ResponseEntity<?> debugToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.put("error", "No valid Authorization header");
            return ResponseEntity.badRequest().body(response);
        }
        
        String token = authHeader.substring(7);
        response.put("tokenLength", token.length());
        response.put("tokenPrefix", token.substring(0, Math.min(20, token.length())) + "...");
        
        JwtService.TokenValidationResult result = jwtService.validateToken(token);
        response.put("valid", result.isValid());
        response.put("status", result.getStatus());
        response.put("message", result.getMessage());
        
        if (result.isValid()) {
            response.put("username", result.getClaims().getSubject());
            response.put("expiration", result.getClaims().getExpiration());
            response.put("role", result.getClaims().get("role"));
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/debug/users")
    public ResponseEntity<?> debugUsers() {
        try {
            var users = userRepository.findAll();
            Map<String, Object> response = new HashMap<>();
            response.put("count", users.size());
            response.put("users", users.stream().map(u -> {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("username", u.getUsername());
                userInfo.put("email", u.getEmail());
                userInfo.put("role", u.getRole());
                userInfo.put("active", u.isActive());
                return userInfo;
            }).toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        // Validation des entrées
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }
        
        try {
            // Chercher par username ou email
            Optional<User> userOpt = userRepository.findByUsername(username.trim());
            if (!userOpt.isPresent()) {
                userOpt = userRepository.findByEmail(username.trim());
            }
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();

                // Compte toujours accessible (pas de verrouillage)

                // Vérifier si le compte est actif
                if (!user.isActive()) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "error", "ACCOUNT_DISABLED",
                        "message", "Votre compte a été désactivé. Veuillez contacter l'administrateur."
                    ));
                }

                if (passwordEncoder.matches(password, user.getPassword())) {
                    // Connexion réussie
                    userRepository.save(user);

                    Map<String, Object> response = new HashMap<>();
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("id", user.getId());
                    userInfo.put("username", user.getUsername());
                    userInfo.put("email", user.getEmail());
                    userInfo.put("firstName", user.getFirstName());
                    userInfo.put("lastName", user.getLastName());
                    userInfo.put("role", user.getRole().toString().toLowerCase());

                    // Générer les tokens JWT
                    Map<String, Object> claims = new HashMap<>();
                    claims.put("userId", user.getId());
                    claims.put("email", user.getEmail());

                    String accessToken = jwtService.generateAccessToken(user.getUsername(), user.getRole().toString(), claims);
                    String refreshToken = jwtService.generateRefreshToken(user.getUsername());

                    response.put("user", userInfo);
                    response.put("token", accessToken);
                    response.put("refreshToken", refreshToken);

                    return ResponseEntity.ok(response);
                } else {
                    // Mot de passe incorrect
                    return ResponseEntity.badRequest().body(Map.of(
                        "error", "INVALID_CREDENTIALS",
                        "message", "Identifiant ou mot de passe incorrect, veuillez réessayer"
                    ));
                }
            }

            return ResponseEntity.badRequest().body(Map.of(
                "error", "INVALID_CREDENTIALS",
                "message", "Identifiant ou mot de passe incorrect, veuillez réessayer"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "INTERNAL_ERROR",
                "message", "Erreur interne: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        return registerUser(user);
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerAlternative(@RequestBody User user) {
        return registerUser(user);
    }
    
    private ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Validation des champs requis
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "USERNAME_REQUIRED", "message", "Le nom d'utilisateur est requis"));
            }
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "EMAIL_REQUIRED", "message", "L'adresse email est requise"));
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "PASSWORD_REQUIRED", "message", "Le mot de passe est requis"));
            }
            if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "FIRSTNAME_REQUIRED", "message", "Le prénom est requis"));
            }
            if (user.getLastName() == null || user.getLastName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "LASTNAME_REQUIRED", "message", "Le nom est requis"));
            }

            // Validation complète du mot de passe
            String passwordValidation = validatePassword(user.getPassword());
            if (passwordValidation != null) {
                return ResponseEntity.badRequest().body(Map.of("error", "INVALID_PASSWORD", "message", passwordValidation));
            }

            // Vérifier l'unicité
            if (userRepository.findByUsername(user.getUsername().trim()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "USERNAME_EXISTS", "message", "Ce nom d'utilisateur existe déjà"));
            }

            if (userRepository.findByEmail(user.getEmail().trim()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "EMAIL_EXISTS", "message", "Cette adresse email existe déjà"));
            }

            // Sauvegarder le mot de passe en clair pour l'email
            String plainPassword = user.getPassword();
            
            // Encoder le mot de passe et définir les valeurs par défaut
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setUsername(user.getUsername().trim());
            user.setEmail(user.getEmail().trim());
            user.setFirstName(user.getFirstName().trim());
            user.setLastName(user.getLastName().trim());
            user.setRole(User.Role.RESEARCHER);
            user.setActive(true);
            user.setCreatedAt(LocalDateTime.now());

            User savedUser = userRepository.save(user);

            // Envoyer email avec mot de passe
            try {
                emailService.sendWelcomeEmailWithPassword(
                    savedUser.getEmail(),
                    savedUser.getFirstName(),
                    savedUser.getLastName(),
                    plainPassword
                );
            } catch (Exception e) {
                System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Utilisateur enregistré avec succès");
            response.put("user", Map.of(
                "id", savedUser.getId(),
                "username", savedUser.getUsername(),
                "email", savedUser.getEmail(),
                "firstName", savedUser.getFirstName(),
                "lastName", savedUser.getLastName(),
                "role", savedUser.getRole().toString().toLowerCase()
            ));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "error", "REGISTRATION_ERROR",
                "message", "Erreur lors de l'enregistrement: " + e.getMessage(),
                "details", e.getClass().getSimpleName()
            ));
        }
    }

    private String validatePassword(String password) {
        if (password.length() < 6) {
            return "Le mot de passe doit contenir au moins 6 caractères";
        }

        return null; // Mot de passe valide
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Déconnexion réussie"
        ));
    }

    private void sendWelcomeEmail(User user) {
        try {
            emailService.sendWelcomeEmail(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername()
            );
        } catch (Exception e) {
            System.err.println("Erreur envoi email bienvenue: " + e.getMessage());
        }
    }
}