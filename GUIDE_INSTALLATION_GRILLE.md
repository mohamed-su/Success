# 🎯 Guide d'Installation - Système de Grille d'Évaluation

## ✅ Fichiers Créés

### Backend
1. `EvaluationGrid.java` - Entité
2. `EvaluationGridRepository.java` - Repository
3. `EvaluationGridController.java` - API Controller
4. `WorkingPresidentController.java` - Modifié (création auto de grille)

### Frontend
1. `EvaluationGrid.tsx` - Page d'évaluation

### Base de données
1. `create_evaluation_grids.sql` - Script de création de table

## 🚀 Installation Étape par Étape

### 1. Base de Données
```bash
psql -h localhost -U postgres -d comite_ethique -f /home/dell/Téléchargements/dev/create_evaluation_grids.sql
```

### 2. Backend
```bash
cd /home/dell/Téléchargements/dev/demo
mvn clean compile
mvn spring-boot:run
```

### 3. Frontend - Ajouter la route
Modifier `front/src/AppRouter.tsx` ou le fichier de routes :

```typescript
import EvaluationGrid from './pages/member/EvaluationGrid';

// Ajouter cette route
<Route path="/dashboard/member/evaluate/:protocolId" element={<EvaluationGrid />} />
```

## 📊 Workflow Complet

```
1. Président assigne protocole → Grille créée automatiquement
2. Membre accède à /dashboard/member/evaluate/{protocolId}
3. Membre remplit les 8 critères (1-5)
4. Membre ajoute commentaires
5. Membre choisit décision
6. Membre sauvegarde (PENDING) ou soumet (COMPLETED)
7. Président/Secrétaire consulte via /api/evaluation/protocol/{id}/summary
```

## 🔌 Endpoints API Disponibles

```
POST   /api/evaluation/create
GET    /api/evaluation/protocol/{protocolId}/member/{memberId}
GET    /api/evaluation/protocol/{protocolId}
GET    /api/evaluation/member/{memberId}
PUT    /api/evaluation/{id}
GET    /api/evaluation/protocol/{protocolId}/summary
```

## ✅ Test Rapide

```bash
# Créer une grille
curl -X POST http://localhost:8081/api/evaluation/create \
  -H "Content-Type: application/json" \
  -d '{"protocolId": 5, "memberId": 1, "memberName": "Dr. Dupont"}'

# Récupérer la grille
curl http://localhost:8081/api/evaluation/protocol/5/member/1
```

Le système est maintenant opérationnel ! 🎉
