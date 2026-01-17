# Ajout des Nouveaux Champs Obligatoires

## 📋 Nouveaux Fichiers Obligatoires Ajoutés

Les fichiers suivants ont été ajoutés au système de soumission de protocoles :

1. **Lettre adressée au Président du Comité** (`presidentLetterFileName`)
2. **Notice d'information** (`informationNoticeFileName`)
3. **Consentement éclairé** (`informedConsentFileName`)
4. **Chronogramme** (`chronogramFileName`)
5. **Budget détaillé en Franc CFA** (`detailedBudgetFileName`)

## ✅ Modifications Appliquées

### 1. Base de Données (PostgreSQL)

**Fichier:** `/home/dell/Téléchargements/dev/add_new_fields.sql`

Nouvelles colonnes ajoutées à la table `protocol_submissions` :
```sql
- president_letter_file_name VARCHAR(255)
- information_notice_file_name VARCHAR(255)
- informed_consent_file_name VARCHAR(255)
- chronogram_file_name VARCHAR(255)
- detailed_budget_file_name VARCHAR(255)
```

**Pour appliquer :**
```bash
psql -h localhost -U postgres -d comite_ethique -f /home/dell/Téléchargements/dev/add_new_fields.sql
```

### 2. Backend - Entité ProtocolSubmission

**Fichier:** `demo/src/main/java/comite/demo/entity/ProtocolSubmission.java`

**Ajouts :**
- 5 nouveaux champs privés
- 10 nouveaux getters/setters (get + set pour chaque champ)

### 3. Backend - SecretaryController

**Fichier:** `demo/src/main/java/comite/demo/controller/SecretaryController.java`

**Modifications :**

#### checkProtocolCompleteness()
- Ajout de 5 vérifications pour les nouveaux fichiers
- Total : 16 éléments obligatoires (au lieu de 11)

#### getMissingItems()
- Ajout de 5 contrôles pour identifier les fichiers manquants
- Messages explicites pour chaque fichier

#### getCompletionPercentage()
- Mise à jour : `totalItems = 16` (au lieu de 11)
- Calcul du pourcentage basé sur 16 éléments

## 📊 Checklist Complète (16 éléments)

### Informations de base (7)
1. ✅ Titre du protocole
2. ✅ Description du protocole
3. ✅ Chercheur principal
4. ✅ Institution
5. ✅ Nombre de participants
6. ✅ Durée de l'étude
7. ✅ Considérations éthiques

### Fichiers obligatoires (9)
8. ✅ Fichier protocole
9. ✅ Formulaire de consentement
10. ✅ CV des chercheurs
11. ✅ Reçu de paiement
12. ✅ **Lettre adressée au Président du Comité** (NOUVEAU)
13. ✅ **Notice d'information** (NOUVEAU)
14. ✅ **Consentement éclairé** (NOUVEAU)
15. ✅ **Chronogramme** (NOUVEAU)
16. ✅ **Budget détaillé en Franc CFA** (NOUVEAU)

## 🚀 Prochaines Étapes

### 1. Appliquer les modifications à la base de données
```bash
cd /home/dell/Téléchargements/dev
psql -h localhost -U postgres -d comite_ethique -f add_new_fields.sql
```

### 2. Recompiler le backend
```bash
cd demo
mvn clean compile
mvn spring-boot:run
```

### 3. Mettre à jour le frontend

Le frontend devra être mis à jour pour :
- Ajouter 5 nouveaux champs de téléchargement dans le formulaire de soumission
- Afficher les 5 nouveaux fichiers dans la page de validation
- Mettre à jour la checklist pour inclure les 16 éléments

**Fichiers frontend à modifier :**
- `front/src/pages/researcher/SubmitProtocol.tsx` (formulaire de soumission)
- `front/src/pages/secretary/ValidateProtocols.tsx` (validation)
- `front/src/pages/researcher/MyProtocols.tsx` (affichage)

## 📝 Exemple de Réponse API

Avec les nouveaux champs, la réponse de checklist sera :

```json
{
  "success": true,
  "checklist": {
    "protocolId": 5,
    "isComplete": false,
    "missingItems": [
      "Lettre adressée au Président du Comité",
      "Notice d'information",
      "Consentement éclairé",
      "Chronogramme",
      "Budget détaillé en Franc CFA"
    ],
    "completionPercentage": 68,
    "lastChecked": "2025-12-22T12:00:00"
  },
  "message": "Dossier incomplet - vérifiez les éléments manquants"
}
```

## ⚠️ Important

- Les protocoles existants auront ces champs à `NULL`
- Ils seront marqués comme "incomplets" jusqu'à ce que les fichiers soient ajoutés
- Le pourcentage de complétion sera recalculé sur 16 éléments
- Les nouveaux protocoles devront obligatoirement fournir ces 5 fichiers

## 🔧 Compatibilité

- ✅ Backend : Prêt (modifications appliquées)
- ⏳ Base de données : À appliquer (script SQL fourni)
- ⏳ Frontend : À mettre à jour (formulaires et affichage)

Les modifications backend sont maintenant complètes et prêtes à être utilisées ! 🎉
