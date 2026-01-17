package comite.demo.controller;

import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import comite.demo.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

// @RestController
// @RequestMapping("/api")
// @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SimpleAuthenticationController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "API Simple fonctionne");
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username et password requis"));
        }
        
        try {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                userOpt = userRepository.findByEmail(username);
            }
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                
                if (passwordEncoder.matches(password, user.getPassword())) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Connexion réussie");
                    response.put("user", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName(),
                        "role", user.getRole().toString()
                    ));
                    
                    // Générer token JWT
                    String token = jwtService.generateAccessToken(
                        user.getUsername(), 
                        user.getRole().toString(), 
                        Map.of("userId", user.getId())
                    );
                    response.put("token", token);
                    
                    return ResponseEntity.ok(response);
                }
            }
            
            return ResponseEntity.badRequest().body(Map.of("error", "Identifiants incorrects"));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur serveur: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
        try {
            String username = userData.get("username");
            String email = userData.get("email");
            String password = userData.get("password");
            String firstName = userData.get("firstName");
            String lastName = userData.get("lastName");
            
            if (username == null || email == null || password == null || firstName == null || lastName == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tous les champs sont requis"));
            }
            
            // Vérifier unicité
            if (userRepository.findByUsername(username).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username déjà utilisé"));
            }
            
            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email déjà utilisé"));
            }
            
            // Créer utilisateur
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole(User.Role.RESEARCHER);
            user.setActive(true);
            
            User savedUser = userRepository.save(user);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Utilisateur créé avec succès",
                "user", Map.of(
                    "id", savedUser.getId(),
                    "username", savedUser.getUsername(),
                    "email", savedUser.getEmail(),
                    "firstName", savedUser.getFirstName(),
                    "lastName", savedUser.getLastName(),
                    "role", savedUser.getRole().toString()
                )
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Erreur serveur: " + e.getMessage()));
        }
    }
}