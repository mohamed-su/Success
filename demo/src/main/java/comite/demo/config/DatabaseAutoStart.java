package comite.demo.config;

import org.springframework.boot.context.event.ApplicationStartingEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
public class DatabaseAutoStart implements ApplicationListener<ApplicationStartingEvent> {

    @Override
    public void onApplicationEvent(ApplicationStartingEvent event) {
        try {
            // Vérifier si PostgreSQL est en cours d'exécution
            Process checkProcess = Runtime.getRuntime().exec("pgrep -f postgres");
            checkProcess.waitFor();
            
            if (checkProcess.exitValue() != 0) {
                System.out.println("PostgreSQL n'est pas en cours d'exécution. Démarrage...");
                
                // Démarrer PostgreSQL
                Process startProcess = Runtime.getRuntime().exec("sudo systemctl start postgresql");
                startProcess.waitFor();
                
                if (startProcess.exitValue() == 0) {
                    System.out.println("PostgreSQL démarré avec succès.");
                    Thread.sleep(2000); // Attendre que PostgreSQL soit prêt
                } else {
                    System.err.println("Erreur lors du démarrage de PostgreSQL.");
                }
            } else {
                System.out.println("PostgreSQL est déjà en cours d'exécution.");
            }
        } catch (IOException | InterruptedException e) {
            System.err.println("Erreur lors de la vérification/démarrage de PostgreSQL: " + e.getMessage());
        }
    }
}