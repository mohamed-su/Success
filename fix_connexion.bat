@echo off
echo ===== CORRECTION CONNEXION =====
echo.

echo 1. Probleme identifie:
echo    - ApiService utilise https://e-agrement.minsante.bf/api
echo    - Au lieu de http://localhost:8081/api
echo.

echo 2. Corrections appliquees:
echo    - .env.development: port 8081
echo    - api.js: URL forcee en local
echo    - apiService.ts: URL forcee en local
echo.

echo 3. Test backend local...
curl -s -o nul -w "Backend status: %%{http_code}\n" "http://localhost:8081/api/test/health"

echo.
echo 4. ACTIONS REQUISES:
echo    - Arretez le serveur frontend (Ctrl+C)
echo    - Redemarrez avec: npm run dev
echo    - Ou rechargez la page (Ctrl+F5)
echo.

echo 5. Si le probleme persiste:
echo    - Verifiez que NODE_ENV n'est pas en production
echo    - Supprimez le cache du navigateur
echo    - Redemarrez completement le frontend
echo.
pause