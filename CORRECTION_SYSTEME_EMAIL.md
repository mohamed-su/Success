# Diagnostic et Correction du Système d'Email

## Problème identifié

Les emails de confirmation de soumission de protocole n'étaient plus envoyés aux chercheurs après soumission.

## Cause du problème

La méthode `sendProtocolSubmissionConfirmation` dans `EmailService.java` était incomplète - elle ne faisait qu'afficher un message dans la console au lieu d'envoyer réellement l'email.

## Solution appliquée

### 1. Correction du service EmailService

**Fichier modifié :** `src/main/java/comite/demo/service/EmailService.java`

**Avant :**
```java
public void sendProtocolSubmissionConfirmation(String toEmail, String name, String protocolTitle, Long protocolId) {
    System.out.println("Email de confirmation de soumission pour: " + toEmail);
}
```

**Après :**
```java
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
```

### 2. Correction du contrôleur

**Fichier modifié :** `src/main/java/comite/demo/controller/SimpleSubmissionController.java`

- Suppression de la référence à `ethicsConsiderations` qui n'existe plus dans le frontend
- Ajout d'un endpoint de test `/test-email` pour diagnostiquer les problèmes d'email

### 3. Configuration email vérifiée

La configuration dans `application.properties` est correcte :
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=ouedraogomohamedamine98@gmail.com
spring.mail.password=whqgkacpcnipovxy
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.trust=smtp.gmail.com
```

## Test de la solution

### 1. Test manuel via API

```bash
# Test de l'endpoint d'email
curl -X POST http://localhost:8081/api/researcher/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "votre-email@example.com"}'
```

### 2. Test via soumission de protocole

1. Connectez-vous en tant que chercheur
2. Soumettez un nouveau protocole
3. Vérifiez votre boîte email pour la confirmation

## Points de vérification

Si les emails ne sont toujours pas reçus, vérifiez :

1. **Logs du backend** : Recherchez les messages d'erreur dans la console
2. **Configuration Gmail** : 
   - Authentification à 2 facteurs activée
   - Mot de passe d'application correct
   - Paramètres de sécurité appropriés
3. **Boîte spam** : Les emails peuvent être filtrés
4. **Service EmailService** : Vérifiez que `mailSender` n'est pas null

## Résultat attendu

Après correction, les chercheurs devraient recevoir un email de confirmation contenant :
- Titre du protocole soumis
- Numéro de référence (PROT-XXX)
- Prochaines étapes du processus d'évaluation
- Instructions pour suivre l'état de la soumission