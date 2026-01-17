# Backend Comité d'Éthique - Configuration et Démarrage

## 🚀 Résolution du problème 404

Le problème `404 Not Found` pour `/api/researcher/protocols/5/update` a été résolu par :

1. **Création du ResearcherController manquant**
2. **Configuration correcte de la base de données PostgreSQL**
3. **Ajout du système de checklist avec mise en rouge**

## 📋 Prérequis

- Java 17+
- Maven 3.6+
- PostgreSQL 12+
- Git

## 🛠️ Installation et Configuration

### 1. Configuration de PostgreSQL

```bash
# Démarrer PostgreSQL
sudo systemctl start postgresql

# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données
CREATE DATABASE comite_ethique;

# Créer un utilisateur (optionnel)
CREATE USER comite_user WITH PASSWORD 'votre_mot_de_passe';
GRANT ALL PRIVILEGES ON DATABASE comite_ethique TO comite_user;
```

### 2. Configuration de la base de données

```bash
# Exécuter le script de configuration
psql -h localhost -U postgres -d comite_ethique -f database_setup.sql
```

### 3. Configuration de l'application

Modifier `demo/src/main/resources/application.properties` :

```properties
# Base de données
spring.datasource.url=jdbc:postgresql://localhost:5432/comite_ethique
spring.datasource.username=postgres
spring.datasource.password=votre_mot_de_passe
```

### 4. Compilation et démarrage

```bash
# Méthode automatique
./start_backend.sh

# Ou méthode manuelle
cd demo
mvn clean compile
mvn spring-boot:run
```

## 🔧 Endpoints disponibles

### ResearcherController (NOUVEAU)
- `GET /api/researcher/test` - Test de fonctionnement
- `GET /api/researcher/protocols/{id}?userIdentifier=xxx` - Récupération d'un protocole
- `PUT /api/researcher/protocols/{id}/update?userIdentifier=xxx` - Mise à jour d'un protocole

### SecretaryController (AMÉLIORÉ)
- `GET /api/secretary/protocols` - Liste des protocoles
- `POST /api/secretary/protocols/{id}/checklist` - Vérification checklist
- `GET /api/secretary/protocols/export-pdf` - Export PDF avec checklist

### TestController (NOUVEAU)
- `GET /api/test/health` - Santé du backend
- `GET /api/test/protocols` - Liste des protocoles de test
- `POST /api/test/create-test-protocol` - Créer un protocole de test

## ✅ Fonctionnalités ajoutées

### 1. Système de Checklist
- **Vérification automatique** de 11 éléments obligatoires
- **Mise en rouge** des protocoles incomplets dans le PDF
- **Messages de correction** détaillés
- **Pourcentage de completion**

### 2. Éléments vérifiés
- Titre du protocole
- Description
- Chercheur principal
- Institution
- Nombre de participants
- Durée de l'étude
- Considérations éthiques
- Fichier protocole
- Formulaire de consentement
- CV des chercheurs
- Reçu de paiement

### 3. Gestion d'erreur améliorée
- **Logging professionnel** avec SLF4J
- **Gestion d'erreurs spécifiques** par type
- **Réponses JSON structurées**
- **Codes HTTP appropriés**

## 🧪 Tests

```bash
# Tester tous les endpoints
./test_endpoints.sh

# Test manuel d'un endpoint
curl http://localhost:8081/api/researcher/test
```

## 📊 Exemple de réponse checklist

```json
{
  "success": true,
  "checklist": {
    "protocolId": 5,
    "isComplete": false,
    "missingItems": [
      "Fichier protocole",
      "Formulaire de consentement",
      "Reçu de paiement"
    ],
    "completionPercentage": 73,
    "lastChecked": "2025-12-21T20:00:00"
  },
  "message": "Dossier incomplet - vérifiez les éléments manquants"
}
```

## 🔍 Débogage

### Vérifier les logs
```bash
tail -f demo/logs/comite-ethique.log
```

### Vérifier la base de données
```bash
psql -h localhost -U postgres -d comite_ethique -c "SELECT id, title, status FROM protocol_submissions;"
```

### Vérifier les contrôleurs
```bash
curl http://localhost:8081/api/test/health
```

## 🚨 Résolution des problèmes courants

1. **Erreur 404** : Vérifier que le ResearcherController est bien compilé
2. **Erreur de connexion DB** : Vérifier PostgreSQL et les identifiants
3. **Erreur de compilation** : Vérifier Java 17+ et Maven

## 📝 Structure des fichiers

```
demo/
├── src/main/java/comite/demo/
│   ├── controller/
│   │   ├── ResearcherController.java (NOUVEAU)
│   │   ├── SecretaryController.java (AMÉLIORÉ)
│   │   └── TestController.java (NOUVEAU)
│   └── config/
│       ├── SecurityConfig.java (CORRIGÉ)
│       └── JwtAuthenticationFilter.java (CORRIGÉ)
├── src/main/resources/
│   ├── application.properties
│   └── logback-spring.xml (NOUVEAU)
└── logs/ (NOUVEAU)
```

Le backend est maintenant entièrement fonctionnel avec le système de checklist et la résolution du problème 404 ! 🎉