# Configuration des URLs - Guide

## Configuration centralisée

Toutes les URLs de l'API sont maintenant centralisées dans :
- `src/config/api.js` - Configuration principale
- `.env` - Variables d'environnement

## Utilisation dans les composants

### Import requis :
```javascript
import { API_CONFIG } from '../config/api';
const BASE_URL = API_CONFIG.BASE_URL;
```

### Remplacement des URLs :
```javascript
// AVANT (hardcodé)
fetch('http://localhost:8081/api/endpoint')

// APRÈS (configuré)
fetch(`${BASE_URL}/endpoint`)
```

## Configuration par environnement

### Développement (.env) :
```
VITE_API_BASE_URL=http://localhost:8081/api
```

### Production (.env.production) :
```
VITE_API_BASE_URL=https://votre-domaine.com/api
```

## Fichiers corrigés

✅ `src/services/apiService.ts`
✅ `src/pages/member/EvaluationGrid.tsx`
✅ `src/components/evaluation/NewEvaluationGridsModal.jsx`
✅ `src/config/api.js` (créé)

## Fichiers à vérifier

Exécuter le script `find-hardcoded-urls.bat` pour trouver d'autres occurrences.

## Avantages

1. **Flexibilité** : Changement d'URL en un seul endroit
2. **Environnements** : Configuration différente par environnement
3. **Maintenance** : Plus facile à maintenir
4. **Déploiement** : Pas de modification de code pour changer d'URL