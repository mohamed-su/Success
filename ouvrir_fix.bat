@echo off
echo ===== SOLUTION RADICALE =====
echo.

echo 1. Nouveau fichier HTML cree: index-fix.html
echo    - Evite le cache du navigateur
echo    - Override fetch plus agressif
echo    - Logs detailles
echo.

echo 2. Test backend...
curl -s -o nul -w "Backend: %%{http_code}\n" "http://localhost:8081/api/test/health"

echo.
echo 3. OUVRIR CETTE URL DANS LE NAVIGATEUR:
echo    http://localhost:8080/index-fix.html
echo.
echo 4. Ou copier-coller cette commande:
echo    start http://localhost:8080/index-fix.html
echo.

echo 5. Dans la console, vous devez voir:
echo    - "=== DEBUT OVERRIDE FETCH ==="
echo    - "FETCH INTERCEPTE: https://e-agrement..."
echo    - "URL CHANGEE VERS: http://localhost:8081..."
echo.

start http://localhost:8080/index-fix.html

pause