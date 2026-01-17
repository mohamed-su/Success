package comite.demo.config;

import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SimpleDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SimpleDataInitializer.class);

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            createTestUsers();
        }
    }

    private void createTestUsers() {
        try {
            // Admin
            createUser("admin@cers.bf", "admin123", "Admin", "CERS", User.Role.ADMIN);
            
            // Secretary
            createUser("secretary@cers.bf", "secretary123", "Secrétaire", "CERS", User.Role.SECRETARY);
            
            // Researcher
            createUser("researcher@cers.bf", "researcher123", "Dr. Marie", "Ouédraogo", User.Role.RESEARCHER);
            
            // President (avec accès membre du comité)
            createUser("president@cers.bf", "president123", "Prof. Aminata", "Traoré", User.Role.PRESIDENT);
            
            // 6 Membres du comité
            createUser("membre1@comite-ethique.bf", "membre123", "Dr. Amadou", "OUEDRAOGO", User.Role.COMMITTEE_MEMBER);
            createUser("membre2@comite-ethique.bf", "membre123", "Dr. Fatimata", "KONE", User.Role.COMMITTEE_MEMBER);
            createUser("membre3@comite-ethique.bf", "membre123", "Prof. Jean", "SAWADOGO", User.Role.COMMITTEE_MEMBER);
            createUser("membre4@comite-ethique.bf", "membre123", "Dr. Marie", "TRAORE", User.Role.COMMITTEE_MEMBER);
            createUser("membre5@comite-ethique.bf", "membre123", "Prof. Ibrahim", "ZONGO", User.Role.COMMITTEE_MEMBER);
            createUser("committee@cers.bf", "committee123", "Dr. Fatou", "Zongo", User.Role.COMMITTEE_MEMBER);
            
            // 2 Rapporteurs (avec accès membre du comité)
            createUser("rapporteur1@comite-ethique.bf", "rapporteur123", "Dr. Salimata", "OUATTARA", User.Role.RAPPORTEUR);
            createUser("rapporteur2@comite-ethique.bf", "rapporteur123", "Prof. Boukary", "DIALLO", User.Role.RAPPORTEUR);

            logger.info("✅ 9 comptes du comité créés avec succès!");
            logger.info("📧 Comptes disponibles:");
            logger.info("   - president@cers.bf / president123 (Prof. Aminata Traoré - PRESIDENT + accès membre)");
            logger.info("   - membre1-5@comite-ethique.bf / membre123 (6 membres du comité)");
            logger.info("   - committee@cers.bf / committee123 (Dr. Fatou Zongo)");
            logger.info("   - rapporteur1-2@comite-ethique.bf / rapporteur123 (RAPPORTEUR + accès membre)");
            logger.info("👥 Total: {} utilisateurs créés", userRepository.count());
            
        } catch (Exception e) {
            logger.error("Erreur lors de la création des utilisateurs de test", e);
        }
    }
    
    private void createUser(String username, String password, String firstName, String lastName, User.Role role) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setActive(true);
        userRepository.save(user);
    }
}