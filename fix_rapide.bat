@echo off
echo ===== CORRECTION RAPIDE DELIBERATIONS =====
echo.

echo Le backend fonctionne et retourne les donnees.
echo Le probleme est dans le frontend.
echo.

echo 1. Verification du fichier fix-urls.js...
if exist "dist\frontend\fix-urls.js" (
    echo ✓ Fichier existe
) else (
    echo ✗ Fichier manquant - creation...
    mkdir "dist\frontend" 2>nul
    echo const currentHost = window.location.hostname; > "dist\frontend\fix-urls.js"
    echo const backendPort = '8081'; >> "dist\frontend\fix-urls.js"
    echo window.BASE_URL = `http://${currentHost}:${backendPort}`; >> "dist\frontend\fix-urls.js"
    echo ✓ Fichier cree
)

echo.
echo 2. Test direct de l'endpoint...
curl -s "http://localhost:8081/api/president/deliberations" -H "X-User-ID: 1" -H "X-User-Role: president" | findstr "success"

echo.
echo 3. SOLUTION: Rechargez la page du navigateur (F5)
echo    Les deliberations sont disponibles dans le backend.
echo.
echo 4. Si ca ne marche toujours pas:
echo    - Ouvrez F12 (console developpeur)
echo    - Allez dans l'onglet Network
echo    - Rechargez la page
echo    - Cherchez la requete vers /api/president/deliberations
echo    - Verifiez le statut de la reponse
echo.
pause