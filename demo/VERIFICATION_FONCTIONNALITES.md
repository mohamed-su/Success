## VÉRIFICATION DES NOUVELLES FONCTIONNALITÉS

### 1. Bouton "+" pour ajout automatique des membres
**Localisation**: Section "MEMBRES AYANT SIÉGÉ" dans DeliberationForm.tsx
**Fonctionnalité**: 
- Bouton bleu avec icône "+" et texte "Ajouter Membres"
- Positionné à droite du titre "MEMBRES AYANT SIÉGÉ"
- Au clic: affiche une alerte explicative

### 2. Bouton d'upload de signature du rapporteur
**Localisation**: Section "SIGNATURES" dans DeliberationForm.tsx, colonne "Le Rapporteur"
**Fonctionnalité**:
- Zone d'upload avec bouton "📁 Upload Signature"
- Accepte PNG/JPG jusqu'à 2MB
- Prévisualisation de l'image uploadée
- Bouton "✕ Supprimer" pour retirer la signature

### 3. Endpoints backend créés
- `/api/protocol-evaluation/protocol/{protocolId}/add-members` (POST)
- `/api/rapporteur/upload-signature` (POST)
- `/api/rapporteur/signature/{rapporteurId}` (GET)

### 4. Tables SQL créées
- `rapporteur_signatures` pour stocker les signatures
- Colonnes ajoutées à `member_evaluation_grids`

### COMMENT TESTER:
1. Ouvrir l'interface rapporteur
2. Cliquer sur "Évaluer" pour un protocole
3. Vérifier la présence du bouton "+" dans "MEMBRES AYANT SIÉGÉ"
4. Vérifier la présence du bouton "Upload Signature" dans "SIGNATURES"

### FICHIERS MODIFIÉS:
- ✅ DeliberationForm.tsx (boutons ajoutés)
- ✅ ProtocolEvaluationCriteriaController.java (endpoint ajout membres)
- ✅ RapporteurSignatureController.java (gestion signatures)
- ✅ Scripts SQL créés