@echo off
echo ===== CONFIGURATION PROXY POUR URL HARDCODEE =====
echo.

echo 1. Demarrage du serveur proxy...
start "Proxy Server" node simple-proxy.js

echo 2. Attente du demarrage...
timeout /t 3 >nul

echo 3. Modification du fichier hosts...
echo.
echo ATTENTION: Vous devez executer cette commande en tant qu'ADMINISTRATEUR
echo pour modifier le fichier hosts.
echo.

echo Ajout de la ligne dans hosts:
echo 127.0.0.1 e-agrement.minsante.bf
echo.

echo %SystemRoot%\System32\drivers\etc\hosts | findstr "e-agrement.minsante.bf" >nul
if %errorlevel% neq 0 (
    echo 127.0.0.1 e-agrement.minsante.bf >> %SystemRoot%\System32\drivers\etc\hosts
    echo ✓ Ligne ajoutee au fichier hosts
) else (
    echo ✓ Ligne deja presente dans hosts
)

echo.
echo 4. Test du proxy...
curl -s -o nul -w "Proxy status: %%{http_code}\n" "http://e-agrement.minsante.bf:8082/api/test/health"

echo.
echo 5. CONFIGURATION TERMINEE
echo.
echo Maintenant:
echo - Le proxy redirige e-agrement.minsante.bf vers localhost:8081
echo - L'URL hardcodee va fonctionner
echo - Rechargez votre page web
echo.
pause