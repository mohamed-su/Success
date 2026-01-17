@echo off
echo ===== CORRECTION IMMEDIATE =====
echo.

echo 1. Script ajoute directement dans index.html
echo    - Override fetch AVANT le chargement du JS principal
echo    - Force toutes les URLs e-agrement vers localhost
echo.

echo 2. Test backend...
curl -s -o nul -w "Backend: %%{http_code}\n" "http://localhost:8081/api/test/health"

echo.
echo 3. ACTIONS IMMEDIATES:
echo    - Rechargez la page (Ctrl+F5)
echo    - Verifiez la console: doit afficher "FETCH OVERRIDE ACTIVE"
echo    - Puis "URL FORCEE: http://localhost:8081/api/auth/login"
echo.

echo 4. Si ca marche pas:
echo    - Videz TOUT le cache (Ctrl+Shift+Del)
echo    - Redemarrez le navigateur
echo.
pause