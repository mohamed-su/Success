@echo off
echo ===== CORRECTION DIST FRONTEND =====
echo.

echo 1. Correction api-proxy.js...
echo    - Force toutes les URLs vers localhost
echo    - Remplace e-agrement.minsante.bf par localhost:8081
echo.

echo 2. Test de l'URL...
curl -s -o nul -w "Backend status: %%{http_code}\n" "http://localhost:8081/api/test/health"

echo.
echo 3. ACTIONS:
echo    - Rechargez la page (Ctrl+F5)
echo    - Verifiez la console: doit afficher "URL forcee vers localhost"
echo    - La connexion doit maintenant fonctionner
echo.

echo 4. Si ca ne marche pas:
echo    - Videz le cache du navigateur
echo    - Redemarrez le navigateur
echo    - Verifiez que le backend est sur le port 8081
echo.
pause