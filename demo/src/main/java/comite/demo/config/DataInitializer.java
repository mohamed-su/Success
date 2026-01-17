package comite.demo.config;

import comite.demo.entity.User;
import comite.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("test")
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            createDefaultUsers();
        }
    }

    private void createDefaultUsers() {
        String defaultPassword = passwordEncoder.encode("password123");

        // Admin
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(defaultPassword);
        admin.setEmail("admin@comite.com");
        admin.setFirstName("Admin");
        admin.setLastName("System");
        admin.setRole(User.Role.ADMIN);
        admin.setActive(true);
        userRepository.save(admin);

        // Secrétaire
        User secretary = new User();
        secretary.setUsername("secretaire");
        secretary.setPassword(defaultPassword);
        secretary.setEmail("secretaire@comite.com");
        secretary.setFirstName("Marie");
        secretary.setLastName("Dupont");
        secretary.setRole(User.Role.SECRETARY);
        secretary.setActive(true);
        userRepository.save(secretary);

        // Président
        User president = new User();
        president.setUsername("president@cers.bf");
        president.setPassword(defaultPassword);
        president.setEmail("president@cers.bf");
        president.setFirstName("Prof. Aminata");
        president.setLastName("OUEDRAOGO");
        president.setRole(User.Role.PRESIDENT);
        president.setActive(true);
        userRepository.save(president);

        // Rapporteur
        User rapporteur = new User();
        rapporteur.setUsername("rapporteur");
        rapporteur.setPassword(defaultPassword);
        rapporteur.setEmail("rapporteur@comite.com");
        rapporteur.setFirstName("Pierre");
        rapporteur.setLastName("Durand");
        rapporteur.setRole(User.Role.RAPPORTEUR);
        rapporteur.setActive(true);
        userRepository.save(rapporteur);

        // Membres du comité
        User member1 = new User();
        member1.setUsername("membre1");
        member1.setPassword(defaultPassword);
        member1.setEmail("membre1@comite.com");
        member1.setFirstName("Sophie");
        member1.setLastName("Bernard");
        member1.setRole(User.Role.COMMITTEE_MEMBER);
        member1.setActive(true);
        userRepository.save(member1);

        User member2 = new User();
        member2.setUsername("membre2");
        member2.setPassword(defaultPassword);
        member2.setEmail("membre2@comite.com");
        member2.setFirstName("Paul");
        member2.setLastName("Moreau");
        member2.setRole(User.Role.COMMITTEE_MEMBER);
        member2.setActive(true);
        userRepository.save(member2);

        // Nouveaux membres du comité
        User member3 = new User();
        member3.setUsername("membre3");
        member3.setPassword(defaultPassword);
        member3.setEmail("membre3@comite.com");
        member3.setFirstName("Claire");
        member3.setLastName("Dubois");
        member3.setRole(User.Role.COMMITTEE_MEMBER);
        member3.setActive(true);
        userRepository.save(member3);

        User member4 = new User();
        member4.setUsername("membre4");
        member4.setPassword(defaultPassword);
        member4.setEmail("membre4@comite.com");
        member4.setFirstName("Michel");
        member4.setLastName("Lefebvre");
        member4.setRole(User.Role.COMMITTEE_MEMBER);
        member4.setActive(true);
        userRepository.save(member4);

        User member5 = new User();
        member5.setUsername("membre5");
        member5.setPassword(defaultPassword);
        member5.setEmail("membre5@comite.com");
        member5.setFirstName("Anne");
        member5.setLastName("Girard");
        member5.setRole(User.Role.COMMITTEE_MEMBER);
        member5.setActive(true);
        userRepository.save(member5);

        User member6 = new User();
        member6.setUsername("membre6");
        member6.setPassword(defaultPassword);
        member6.setEmail("membre6@comite.com");
        member6.setFirstName("Thomas");
        member6.setLastName("Roux");
        member6.setRole(User.Role.COMMITTEE_MEMBER);
        member6.setActive(true);
        userRepository.save(member6);

        User member7 = new User();
        member7.setUsername("membre7");
        member7.setPassword(defaultPassword);
        member7.setEmail("membre7@comite.com");
        member7.setFirstName("Isabelle");
        member7.setLastName("Blanc");
        member7.setRole(User.Role.COMMITTEE_MEMBER);
        member7.setActive(true);
        userRepository.save(member7);

        System.out.println("Default users created successfully!");
    }
}