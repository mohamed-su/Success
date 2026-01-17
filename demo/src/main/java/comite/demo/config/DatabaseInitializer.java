package comite.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
@Profile("!default") // Désactiver par défaut
public class DatabaseInitializer implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        // Désactivé - la base de données est gérée par Spring Boot
        System.out.println("DatabaseInitializer désactivé - utilisation de la configuration Spring Boot");
    }

    private void initializeDatabase() {
        // Méthode désactivée
    }
}