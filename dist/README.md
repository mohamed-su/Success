# Comité d'Éthique - Application Complète

## 📦 Contenu du Package

### Backend (Spring Boot)
- `backend/demo-0.0.1-SNAPSHOT.jar` - Application Java
- `backend/application.properties` - Configuration production
- `backend/start-backend.bat` - Script de démarrage

### Frontend (React)
- `frontend/` - Application web construite
- `frontend/index.html` - Point d'entrée
- `frontend/assets/` - Ressources CSS/JS

### Base de Données
- `database/database_setup.sql` - Script de création des tables

### Scripts
- `scripts/deploy.bat` - Guide d'installation

## 🚀 Installation Rapide

### 1. Prérequis
- Java 17+
- PostgreSQL 12+
- Serveur web (optionnel pour frontend)

### 2. Base de Données
```bash
# Créer la base
createdb comite_ethique

# Exécuter le script
psql -d comite_ethique -f database/database_setup.sql
```

### 3. Configuration
Modifier `backend/application.properties`:
- `spring.datasource.password=VOTRE_MOT_DE_PASSE`
- `jwt.secret=VOTRE_CLE_SECRETE`
- `spring.mail.username=VOTRE_EMAIL`
- `spring.mail.password=VOTRE_MOT_DE_PASSE_APP`

### 4. Démarrage
```bash
# Backend
cd backend
start-backend.bat

# Frontend (serveur simple)
cd frontend
python -m http.server 3000
# ou
npx http-server -p 3000
```

## 🌐 Accès Application
- Backend API: http://localhost:8081
- Frontend: http://localhost:3000

## 👥 Comptes par Défaut
- **Président**: president@comite.bf / password123
- **Secrétaire**: secretary@comite.bf / password123  
- **Rapporteur**: rapporteur@comite.bf / password123
- **Chercheur**: researcher@example.com / password123

## 📋 Fonctionnalités
✅ Soumission de protocoles de recherche
✅ Système d'assignation automatique
✅ Évaluation par les rapporteurs
✅ Délibérations et décisions
✅ Génération de PDF
✅ Gestion des utilisateurs
✅ Notifications email

## 🔧 Support
Pour toute assistance, consultez la documentation ou contactez l'équipe de développement.