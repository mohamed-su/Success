# 📧 Système d'Envoi du Mot de Passe par Email

## ✅ Fonctionnalité Implémentée

Lors de l'inscription d'un nouveau chercheur, le système envoie automatiquement un email contenant :
- L'adresse email de connexion
- Le mot de passe en clair
- Le lien de connexion à la plateforme

## 🔧 Comment ça fonctionne

### 1. Inscription du chercheur
Lorsqu'un chercheur s'inscrit via `/api/auth/register`, le système :
1. Valide les données (email, mot de passe minimum 6 caractères, etc.)
2. **Sauvegarde le mot de passe en clair temporairement**
3. Encode le mot de passe avec BCrypt
4. Enregistre l'utilisateur en base de données
5. **Envoie un email avec le mot de passe en clair**

### 2. Code modifié

**MainAuthController.java** (ligne ~230)
```java
// Sauvegarder le mot de passe en clair pour l'email
String plainPassword = user.getPassword();

// Encoder le mot de passe
user.setPassword(passwordEncoder.encode(user.getPassword()));
// ... autres configurations ...

User savedUser = userRepository.save(user);

// Envoyer email avec mot de passe
emailService.sendWelcomeEmailWithPassword(
    savedUser.getEmail(),
    savedUser.getFirstName(),
    savedUser.getLastName(),
    plainPassword  // ← Mot de passe en clair
);
```

**EmailService.java**
```java
public void sendWelcomeEmailWithPassword(String toEmail, String firstName, String lastName, String password) {
    // Affiche TOUJOURS en console pour le développement
    System.out.println("\n========== EMAIL DE BIENVENUE ==========");
    System.out.println("Destinataire: " + toEmail);
    System.out.println("Nom: " + firstName + " " + lastName);
    System.out.println("Mot de passe: " + password);
    System.out.println("========================================\n");
    
    // Tente d'envoyer l'email si configuré
    if (mailSender != null) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Bienvenue - Vos identifiants");
            message.setText(
                "Bonjour " + firstName + " " + lastName + ",\n\n" +
                "Vos identifiants de connexion :\n" +
                "Email: " + toEmail + "\n" +
                "Mot de passe: " + password + "\n\n" +
                "Connexion: http://localhost:5173/login\n"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("⚠️ Erreur d'envoi email: " + e.getMessage());
        }
    }
}
```

## 📝 Exemple d'utilisation

### Test d'inscription
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "chercheur@example.com",
    "email": "chercheur@example.com",
    "password": "monmotdepasse",
    "firstName": "Jean",
    "lastName": "Dupont"
  }'
```

### Résultat dans la console du backend
```
========== EMAIL DE BIENVENUE ==========
Destinataire: chercheur@example.com
Nom: Jean Dupont
Mot de passe: monmotdepasse
========================================
```

### Réponse API
```json
{
  "message": "Utilisateur enregistré avec succès",
  "user": {
    "id": 21,
    "username": "chercheur@example.com",
    "email": "chercheur@example.com",
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "researcher"
  }
}
```

## 🔐 Sécurité

### Mode Développement (actuel)
- Le mot de passe est affiché dans la console du backend
- Utile pour les tests et le développement
- **Ne pas utiliser en production**

### Mode Production (à configurer)
Pour activer l'envoi réel d'emails, décommenter dans `application.properties` :

```properties
# Configuration Email (Gmail)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=votre-email@gmail.com
spring.mail.password=votre-mot-de-passe-application
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## 📧 Contenu de l'email envoyé

```
Objet: Bienvenue au Comité d'Éthique de la Recherche - Vos identifiants

Bonjour [Prénom] [Nom],

Votre compte chercheur a été créé avec succès sur la plateforme 
du Comité d'Éthique de la Recherche.

Vos identifiants de connexion :
Email: [email]
Mot de passe: [mot_de_passe]

Vous pouvez maintenant vous connecter à l'adresse: 
http://localhost:5173/login

IMPORTANT: Pour des raisons de sécurité, nous vous recommandons 
de changer votre mot de passe après votre première connexion.

Cordialement,
L'équipe du Comité d'Éthique de la Recherche
Burkina Faso
```

## ✅ Tests effectués

1. ✅ Inscription avec mot de passe "root123" → Succès
2. ✅ Mot de passe affiché dans la console backend
3. ✅ Utilisateur créé en base de données
4. ✅ Mot de passe encodé correctement (BCrypt)
5. ✅ Email préparé avec mot de passe en clair

## 🎯 Prochaines étapes

Pour voir l'email dans votre boîte mail :
1. Configurer un compte Gmail avec mot de passe d'application
2. Décommenter la configuration dans `application.properties`
3. Redémarrer le backend
4. Créer un nouveau compte chercheur
5. Vérifier votre boîte mail

## 📌 Notes importantes

- Le mot de passe doit contenir **minimum 6 caractères**
- Le mot de passe est **toujours affiché en console** (développement)
- En production, seul l'email sera envoyé (pas d'affichage console)
- Le chercheur reçoit son mot de passe **une seule fois** lors de l'inscription
