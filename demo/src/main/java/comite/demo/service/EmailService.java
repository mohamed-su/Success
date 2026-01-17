package comite.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@comite-ethique.bf}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail, String firstName, String lastName, String username) {
        if (mailSender == null) {
            System.out.println("Email non configuré - Email de bienvenue pour: " + toEmail);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Bienvenue au Comité d'Éthique de la Recherche");
            message.setText(
                "Bonjour " + firstName + " " + lastName + ",\n\n" +
                "Votre compte a été créé avec succès sur la plateforme du Comité d'Éthique de la Recherche.\n\n" +
                "Nom d'utilisateur: " + username + "\n\n" +
                "Vous pouvez maintenant vous connecter à l'adresse: http://localhost:5173/login\n\n" +
                "Cordialement,\n" +
                "L'équipe du Comité d'Éthique de la Recherche\n" +
                "Burkina Faso"
            );

            mailSender.send(message);
            System.out.println("Email de bienvenue envoyé à: " + toEmail);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email: " + e.getMessage());
        }
    }

    public void sendWelcomeEmailWithPassword(String toEmail, String firstName, String lastName, String password) {
        // Toujours afficher en console pour le développement
        System.out.println("\n========== EMAIL DE BIENVENUE ==========" );
        System.out.println("Destinataire: " + toEmail);
        System.out.println("Nom: " + firstName + " " + lastName);
        System.out.println("Mot de passe: " + password);
        System.out.println("========================================\n");
        
        if (mailSender == null) {
            System.out.println("⚠️  Service email non configuré - mot de passe affiché ci-dessus");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Bienvenue au Comité d'Éthique de la Recherche - Vos identifiants");
            message.setText(
                "Bonjour " + firstName + " " + lastName + ",\n\n" +
                "Votre compte chercheur a été créé avec succès sur la plateforme du Comité d'Éthique de la Recherche.\n\n" +
                "Vos identifiants de connexion :\n" +
                "Email: " + toEmail + "\n" +
                "Mot de passe: " + password + "\n\n" +
                "Vous pouvez maintenant vous connecter à l'adresse: http://localhost:5173/login\n\n" +
                "IMPORTANT: Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe après votre première connexion.\n\n" +
                "Cordialement,\n" +
                "L'équipe du Comité d'Éthique de la Recherche\n" +
                "Burkina Faso"
            );

            mailSender.send(message);
            System.out.println("✅ Email avec mot de passe envoyé à: " + toEmail);
        } catch (Exception e) {
            System.err.println("⚠️  Erreur d'envoi email (mot de passe affiché ci-dessus): " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String toEmail, String name, String resetToken) {
        System.out.println("Email de réinitialisation pour: " + toEmail);
    }

    public void sendProtocolSubmissionConfirmation(String toEmail, String name, String protocolTitle, Long protocolId) {
        if (mailSender == null) {
            System.out.println("Email non configuré - Confirmation de soumission pour: " + toEmail);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Confirmation de soumission - Protocole de recherche");
            message.setText(
                "Bonjour " + name + ",\n\n" +
                "Votre protocole de recherche a été soumis avec succès au Comité d'Éthique de la Recherche.\n\n" +
                "Détails de la soumission :\n" +
                "Titre du protocole: " + protocolTitle + "\n" +
                "Numéro de référence: PROT-" + protocolId + "\n\n" +
                "Prochaines étapes :\n" +
                "1. Vérification par le secrétariat\n" +
                "2. Attribution à un rapporteur\n" +
                "3. Évaluation du protocole\n" +
                "4. Décision du comité CERS\n\n" +
                "Vous recevrez une notification dès qu'il y aura une mise à jour concernant votre protocole.\n\n" +
                "Vous pouvez suivre l'état de votre soumission en vous connectant à votre espace chercheur.\n\n" +
                "Cordialement,\n" +
                "L'équipe du Comité d'Éthique de la Recherche\n" +
                "Burkina Faso"
            );

            mailSender.send(message);
            System.out.println("Email de confirmation de soumission envoyé à: " + toEmail);
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email de confirmation: " + e.getMessage());
        }
    }

    public void sendProtocolApprovalNotification(String toEmail, String name, String protocolTitle, Long protocolId) {
        System.out.println("Email d'approbation pour: " + toEmail);
    }

    public void sendProtocolAssignmentNotification(String toEmail, String name, String protocolTitle, Long protocolId, String role) {
        System.out.println("Email d'assignation pour: " + toEmail);
    }

    public void sendProtocolRejectionNotification(String toEmail, String name, String protocolTitle, Long protocolId, String reason) {
        System.out.println("Email de rejet pour: " + toEmail);
    }
}
