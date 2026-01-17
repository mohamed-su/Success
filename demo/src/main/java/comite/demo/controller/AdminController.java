package comite.demo.controller;

import comite.demo.entity.User;
import comite.demo.entity.ProtocolSubmission;
import comite.demo.repository.UserRepository;
import comite.demo.repository.ProtocolSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProtocolSubmissionRepository protocolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Obtenir tous les utilisateurs avec filtrage optionnel par rôle
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) String role) {
        try {
            System.out.println("AdminController: Récupération des utilisateurs" + (role != null ? " avec rôle: " + role : ""));
            
            List<User> users;
            if (role != null && !role.isEmpty()) {
                try {
                    User.Role userRole = User.Role.valueOf(role.toUpperCase());
                    users = userRepository.findByRole(userRole);
                    System.out.println("AdminController: Nombre d'utilisateurs trouvés pour le rôle " + role + ": " + users.size());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Rôle invalide: " + role
                    ));
                }
            } else {
                users = userRepository.findAll();
                System.out.println("AdminController: Nombre total d'utilisateurs trouvés: " + users.size());
            }
            
            List<Map<String, Object>> userList = users.stream().map(user -> {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId());
                userInfo.put("userIdentifier", user.getUserIdentifier());
                userInfo.put("username", user.getUsername());
                userInfo.put("email", user.getEmail());
                userInfo.put("firstName", user.getFirstName());
                userInfo.put("lastName", user.getLastName());
                userInfo.put("role", user.getRole().toString());
                userInfo.put("active", user.isActive());
                userInfo.put("createdAt", user.getCreatedAt());
                userInfo.put("lastLoginDate", null);
                userInfo.put("failedLoginAttempts", 0);
                userInfo.put("accountLocked", false);
                return userInfo;
            }).toList();

            return ResponseEntity.ok(Map.of(
                "success", true,
                "users", userList,
                "total", users.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération des utilisateurs: " + e.getMessage()
            ));
        }
    }

    // Créer un nouvel utilisateur (seulement certains rôles)
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> userData) {
        try {
            System.out.println("AdminController: Tentative de création d'utilisateur avec données: " + userData);
            
            String username = userData.get("username");
            String email = userData.get("email");
            String password = userData.get("password");
            String firstName = userData.get("firstName");
            String lastName = userData.get("lastName");
            String roleStr = userData.get("role");
            
            System.out.println("AdminController: Données extraites - username: " + username + ", email: " + email + ", role: " + roleStr);

            // Validation des champs
            if (username == null || email == null || password == null || 
                firstName == null || lastName == null || roleStr == null) {
                System.out.println("AdminController: Validation échouée - champs manquants");
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Tous les champs sont requis",
                    "details", Map.of(
                        "username", username != null,
                        "email", email != null,
                        "password", password != null,
                        "firstName", firstName != null,
                        "lastName", lastName != null,
                        "role", roleStr != null
                    )
                ));
            }

            // Vérifier que le rôle est autorisé pour la création par admin
            User.Role role;
            try {
                // Correction pour accepter COMMITTEE comme alias de COMMITTEE_MEMBER
                String normalizedRole = roleStr.toUpperCase();
                if ("COMMITTEE".equals(normalizedRole)) {
                    normalizedRole = "COMMITTEE_MEMBER";
                }
                
                role = User.Role.valueOf(normalizedRole);
                System.out.println("AdminController: Rôle normalisé: " + role);
                
                if (role == User.Role.RESEARCHER) {
                    return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Les chercheurs doivent s'inscrire eux-mêmes"
                    ));
                }
            } catch (IllegalArgumentException e) {
                System.out.println("AdminController: Rôle invalide: " + roleStr);
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Rôle invalide: " + roleStr + ". Rôles acceptés: ADMIN, SECRETARY, PRESIDENT, COMMITTEE_MEMBER, RAPPORTEUR"
                ));
            }

            // Vérifier l'unicité
            if (userRepository.findByUsername(username).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Ce nom d'utilisateur existe déjà"
                ));
            }

            if (userRepository.findByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Cette adresse email existe déjà"
                ));
            }

            // Créer l'utilisateur
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole(role);
            user.setActive(true);
            user.setCreatedAt(LocalDateTime.now());


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
            System.out.println("AdminController: Exception lors de la création d'utilisateur: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la création de l'utilisateur: " + e.getMessage(),
                "type", e.getClass().getSimpleName()
            ));
        }
    }

    // Bloquer/débloquer un utilisateur avec suspension automatique
    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (!userOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();
            boolean wasActive = user.isActive();
            user.setActive(!user.isActive());
            
            // Si on réactive, aucune action supplémentaire nécessaire
            if (!wasActive && user.isActive()) {
                // Utilisateur réactivé
            }
            
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", user.isActive() ? "Utilisateur activé" : "Utilisateur désactivé",
                "active", user.isActive()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la modification du statut: " + e.getMessage()
            ));
        }
    }

    // Réinitialiser le mot de passe d'un utilisateur
    @PutMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetUserPassword(@PathVariable Long id, @RequestBody Map<String, String> data) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (!userOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            String newPassword = data.get("newPassword");
            if (newPassword == null || newPassword.length() < 8) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Le mot de passe doit contenir au moins 8 caractères"
                ));
            }

            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            // Mot de passe réinitialisé
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Mot de passe réinitialisé avec succès"
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la réinitialisation: " + e.getMessage()
            ));
        }
    }

    // Vérifier le paiement d'un protocole
    @PutMapping("/protocols/{id}/verify-payment")
    public ResponseEntity<?> verifyPayment(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        try {
            Optional<ProtocolSubmission> protocolOpt = protocolRepository.findById(id);
            if (!protocolOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            ProtocolSubmission protocol = protocolOpt.get();
            String action = (String) data.get("action"); // "verify" ou "reject"
            String comments = (String) data.get("comments");
            Long adminId = ((Number) data.get("adminId")).longValue();

            if ("verify".equals(action)) {
                protocol.setPaymentStatus("VERIFIED");
                protocol.setPaymentVerifiedAt(LocalDateTime.now());
                protocol.setPaymentVerifiedBy(adminId);
                protocol.setPaymentComments(comments);
            } else if ("reject".equals(action)) {
                protocol.setPaymentStatus("REJECTED");
                protocol.setPaymentComments(comments);
            }

            protocolRepository.save(protocol);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "verify".equals(action) ? "Paiement vérifié" : "Paiement rejeté",
                "paymentStatus", protocol.getPaymentStatus()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la vérification du paiement: " + e.getMessage()
            ));
        }
    }

    // Obtenir les protocoles en attente de vérification de paiement
    @GetMapping("/protocols/pending-payment")
    public ResponseEntity<?> getPendingPaymentProtocols() {
        try {
            List<ProtocolSubmission> protocols = protocolRepository.findByPaymentStatus("PAID");
            
            List<Map<String, Object>> protocolList = protocols.stream().map(protocol -> {
                Map<String, Object> protocolInfo = new HashMap<>();
                protocolInfo.put("id", protocol.getId());
                protocolInfo.put("title", protocol.getTitle());
                protocolInfo.put("principalInvestigator", protocol.getPrincipalInvestigator());
                protocolInfo.put("institution", protocol.getInstitution());
                protocolInfo.put("submittedAt", protocol.getSubmittedAt());
                protocolInfo.put("paymentStatus", protocol.getPaymentStatus());
                protocolInfo.put("status", protocol.getStatus());
                return protocolInfo;
            }).toList();

            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocolList,
                "total", protocols.size()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération des protocoles: " + e.getMessage()
            ));
        }
    }

    // Obtenir la liste des rôles disponibles
    @GetMapping("/roles")
    public ResponseEntity<?> getAvailableRoles() {
        try {
            List<Map<String, Object>> roles = new java.util.ArrayList<>();
            
            for (User.Role role : User.Role.values()) {
                long count = userRepository.countByRole(role);
                Map<String, Object> roleInfo = new HashMap<>();
                roleInfo.put("name", role.toString());
                roleInfo.put("displayName", getRoleDisplayName(role));
                roleInfo.put("count", count);
                roles.add(roleInfo);
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "roles", roles
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération des rôles: " + e.getMessage()
            ));
        }
    }
    
    private String getRoleDisplayName(User.Role role) {
        switch (role) {
            case ADMIN: return "Administrateur";
            case SECRETARY: return "Secrétaire";
            case PRESIDENT: return "Président";
            case COMMITTEE_MEMBER: return "Membre du comité";
            case RAPPORTEUR: return "Rapporteur";
            case RESEARCHER: return "Chercheur";
            default: return role.toString();
        }
    }
    
    // Statistiques générales pour l'admin
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            long totalUsers = userRepository.count();
            long activeUsers = userRepository.countByActive(true);
            long totalProtocols = protocolRepository.count();
            long pendingPayments = protocolRepository.countByPaymentStatus("PAID");
            
            Map<String, Long> usersByRole = new HashMap<>();
            for (User.Role role : User.Role.values()) {
                usersByRole.put(role.toString().toLowerCase(), userRepository.countByRole(role));
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "stats", Map.of(
                    "totalUsers", totalUsers,
                    "activeUsers", activeUsers,
                    "totalProtocols", totalProtocols,
                    "pendingPayments", pendingPayments,
                    "usersByRole", usersByRole
                )
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération des statistiques: " + e.getMessage()
            ));
        }
    }

    // Modifier un utilisateur
}
