package comite.demo.controller;

import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MemberCreationController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create-all")
    public ResponseEntity<?> createAllMembers() {
        try {
            int created = 0;
            
            // Mot de passe encodé pour "password"
            String encodedPassword = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";
            
            // Créer les membres du comité
            created += createMember("membre1", "membre1@comite-ethique.bf", encodedPassword, "Dr. Amadou", "OUEDRAOGO", User.Role.COMMITTEE_MEMBER, "CM001234");
            created += createMember("membre2", "membre2@comite-ethique.bf", encodedPassword, "Dr. Fatimata", "KONE", User.Role.COMMITTEE_MEMBER, "CM002345");
            created += createMember("membre3", "membre3@comite-ethique.bf", encodedPassword, "Prof. Jean", "SAWADOGO", User.Role.COMMITTEE_MEMBER, "CM003456");
            created += createMember("membre4", "membre4@comite-ethique.bf", encodedPassword, "Dr. Marie", "TRAORE", User.Role.COMMITTEE_MEMBER, "CM004567");
            created += createMember("membre5", "membre5@comite-ethique.bf", encodedPassword, "Prof. Ibrahim", "ZONGO", User.Role.COMMITTEE_MEMBER, "CM005678");

            // Créer les rapporteurs
            created += createMember("rapporteur1", "rapporteur1@comite-ethique.bf", encodedPassword, "Dr. Salimata", "OUATTARA", User.Role.RAPPORTEUR, "RP001234");
            created += createMember("rapporteur2", "rapporteur2@comite-ethique.bf", encodedPassword, "Prof. Boukary", "DIALLO", User.Role.RAPPORTEUR, "RP002345");
            created += createMember("rapporteur3", "rapporteur3@comite-ethique.bf", encodedPassword, "Dr. Aminata", "COMPAORE", User.Role.RAPPORTEUR, "RP003456");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Membres créés avec succès");
            response.put("created", created);
            response.put("defaultPassword", "password");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    private int createMember(String username, String email, String password, String firstName, String lastName, User.Role role, String userIdentifier) {
        try {
            // Vérifier si l'utilisateur existe déjà
            if (userRepository.findByUsername(username).isPresent()) {
                return 0; // Utilisateur existe déjà
            }

            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setRole(role);
            user.setActive(true);
            user.setUserIdentifier(userIdentifier);
            user.setCreatedAt(LocalDateTime.now());

            userRepository.save(user);
            return 1; // Utilisateur créé
        } catch (Exception e) {
            System.err.println("Erreur lors de la création de " + username + ": " + e.getMessage());
            return 0;
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> listMembers() {
        try {
            var committeeMembers = userRepository.findByRole(User.Role.COMMITTEE_MEMBER);
            var rapporteurs = userRepository.findByRole(User.Role.RAPPORTEUR);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("committeeMembers", committeeMembers);
            response.put("rapporteurs", rapporteurs);
            response.put("totalCommitteeMembers", committeeMembers.size());
            response.put("totalRapporteurs", rapporteurs.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}