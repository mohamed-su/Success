# Modifications apportées au système de soumission de protocoles

## Résumé des changements

### 1. Ajout de l'option "Étude quantitative" dans les types d'étude

**Fichier modifié :** `front/src/pages/researcher/SubmitProtocol.tsx`
- Ajout de l'option "Étude quantitative" dans la liste déroulante des types d'étude
- Cette option est maintenant disponible aux côtés des autres types existants

### 2. Nouveaux documents requis pour la soumission

Les documents suivants ont été ajoutés comme obligatoires dans l'onglet "Soumettre protocole" :

1. **Lettre adressée au Président du Comité** (PDF)
2. **Notice d'information** (PDF)
3. **Consentement éclairé** (PDF)
4. **Chronogramme** (PDF)
5. **Budget détaillé en Franc CFA** (PDF)
6. **Rapport d'évaluation (décision finale)** (PDF)

### 3. Modifications techniques

#### Backend (Java Spring Boot)

**Fichiers modifiés :**
- `entity/ProtocolSubmission.java` : Ajout des nouveaux champs pour les fichiers
- `controller/SimpleSubmissionController.java` : Mise à jour des endpoints pour gérer les nouveaux fichiers

**Nouveaux champs ajoutés à l'entité :**
```java
private String presidentLetterFileName;
private String informationNoticeFileName;
private String informedConsentFileName;
private String chronogramFileName;
private String detailedBudgetFileName;
private String evaluationReportFileName;
```

#### Frontend (React TypeScript)

**Fichier modifié :** `pages/researcher/SubmitProtocol.tsx`

**Modifications apportées :**
- Ajout des nouveaux champs dans l'état du formulaire
- Ajout de l'option "Étude quantitative" dans le sélecteur de type d'étude
- Ajout des nouveaux champs de téléversement dans l'étape 2 "Documents Requis"
- Mise à jour de la validation pour inclure les nouveaux fichiers obligatoires
- Mise à jour de la fonction de soumission pour envoyer les nouveaux fichiers

#### Base de données

**Script SQL créé :** `add_evaluation_report_field.sql`
- Ajout de la colonne `evaluation_report_file_name` à la table `protocol_submissions`

### 4. Interface utilisateur

L'étape 2 "Documents Requis" a été enrichie avec une nouvelle section "Documents supplémentaires requis" qui contient tous les nouveaux champs de téléversement.

Chaque nouveau champ de téléversement :
- Accepte uniquement les fichiers PDF
- A une taille maximale de 10MB
- Est marqué comme obligatoire (*)
- Inclut une description claire du document attendu

### 5. Validation

La validation a été mise à jour pour s'assurer que tous les nouveaux documents sont téléchargés avant de permettre la soumission du protocole.

## Instructions de déploiement

1. **Base de données :** Exécuter le script `add_evaluation_report_field.sql` sur la base de données PostgreSQL
2. **Backend :** Redémarrer l'application Spring Boot pour prendre en compte les modifications
3. **Frontend :** Aucune action supplémentaire requise, les modifications sont incluses dans le code

## Impact utilisateur

Les chercheurs devront maintenant fournir 6 documents supplémentaires lors de la soumission de leurs protocoles, ce qui garantit une documentation plus complète et conforme aux exigences du comité d'éthique.