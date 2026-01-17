# Frontend CERS - Guide de Démarrage

## 🚀 Démarrage Rapide

### Option 1: Script Automatique (Recommandé)
```bash
# Double-cliquez sur le fichier ou exécutez dans le terminal
start-frontend.bat
```

### Option 2: Commandes Manuelles
```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev
```

## 📋 Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** (inclus avec Node.js)
- **Backend CERS** en cours d'exécution sur le port 8081

## 🔧 Configuration

### Variables d'Environnement (.env)
```
VITE_API_BASE_URL=http://localhost:8081/api
VITE_APP_NAME=CERS
NODE_ENV=development
```

## 👥 Comptes de Test

### Administrateur
- **Email**: admin@cers.bf
- **Mot de passe**: admin123

### Secrétaire
- **Email**: secretary@cers.bf
- **Mot de passe**: secretary123

### Chercheur
- **Email**: researcher@cers.bf
- **Mot de passe**: researcher123

### Président
- **Email**: president@cers.bf
- **Mot de passe**: president123

### Membres du Comité
- **Email**: membre1@comite-ethique.bf à membre5@comite-ethique.bf
- **Mot de passe**: membre123

### Rapporteurs
- **Email**: rapporteur1@comite-ethique.bf, rapporteur2@comite-ethique.bf
- **Mot de passe**: rapporteur123

## 🌐 URLs d'Accès

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8081/api
- **Documentation API**: http://localhost:8081/swagger-ui.html

## 📱 Fonctionnalités par Rôle

### 🔬 Chercheur
- Soumettre des protocoles de recherche
- Suivre le statut de ses protocoles
- Répondre aux commentaires du comité

### 📋 Secrétaire
- Valider les protocoles soumis
- Générer des rapports
- Gérer les paiements
- Préparer les dossiers pour le comité

### 👥 Membre du Comité
- Examiner les protocoles assignés
- Ajouter des commentaires et évaluations
- Participer aux décisions du comité

### 📊 Rapporteur
- Créer des synthèses de protocoles
- Préparer les rapports pour les sessions

### 👑 Président
- Distribuer les protocoles aux membres
- Superviser le processus d'évaluation
- Valider les décisions finales

### ⚙️ Administrateur
- Gérer les utilisateurs
- Configurer le système
- Consulter les logs d'activité

## 🛠️ Dépannage

### Problème: Le frontend ne se connecte pas au backend
**Solution**: Vérifiez que le backend est démarré sur le port 8081

### Problème: Erreur lors de l'installation des dépendances
**Solution**: 
```bash
# Nettoyer le cache npm
npm cache clean --force

# Supprimer node_modules et réinstaller
rmdir /s node_modules
npm install
```

### Problème: Port 5173 déjà utilisé
**Solution**: Le serveur Vite utilisera automatiquement le port suivant disponible

## 📞 Support

Pour toute question ou problème:
1. Vérifiez que le backend est démarré
2. Consultez la console du navigateur pour les erreurs
3. Vérifiez les logs du terminal

## 🔄 Mise à Jour

Pour mettre à jour les dépendances:
```bash
npm update
```

## 🏗️ Build de Production

```bash
# Créer une version de production
npm run build

# Prévisualiser la version de production
npm run preview
```

---

**Note**: Ce frontend est configuré pour fonctionner avec le backend CERS. Assurez-vous que le backend est démarré avant de lancer le frontend.