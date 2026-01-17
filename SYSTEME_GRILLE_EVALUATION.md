# Système de Grille d'Évaluation Individuelle

## 📋 Vue d'ensemble

Système permettant à chaque membre du comité d'évaluer individuellement les protocoles qui lui sont assignés via une grille d'évaluation standardisée.

## ✅ Fonctionnalités Implémentées

### 1. **Création Automatique de Grille**
- Une grille d'évaluation est créée automatiquement lors de l'assignation d'un protocole à un membre
- Chaque membre a sa propre grille pour chaque protocole assigné
- Statut initial : `PENDING`

### 2. **Critères d'Évaluation (Échelle 1-5)**

| Critère | Description |
|---------|-------------|
| **Qualité scientifique** | Rigueur et pertinence scientifique |
| **Conformité éthique** | Respect des principes éthiques |
| **Clarté méthodologique** | Clarté de la méthodologie |
| **Rapport risque/bénéfice** | Équilibre risques/bénéfices |
| **Qualité du consentement éclairé** | Qualité du formulaire de consentement |
| **Protection des données** | Mesures de protection des données |
| **Sécurité des participants** | Mesures de sécurité |
| **Faisabilité** | Faisabilité du protocole |

### 3. **Décisions Possibles**
- `APPROVE` : Approuver sans modification
- `MINOR_REVISION` : Révisions mineures requises
- `MAJOR_REVISION` : Révisions majeures requises
- `REJECT` : Rejeter le protocole

## 🚀 Installation

### 1. Créer la table dans PostgreSQL
```bash
psql -h localhost -U postgres -d comite_ethique -f /home/dell/Téléchargements/dev/create_evaluation_grids.sql
```

### 2. Recompiler le backend
```bash
cd /home/dell/Téléchargements/dev/demo
mvn clean compile
mvn spring-boot:run
```

Le système de grille d'évaluation est maintenant prêt ! 🎉
