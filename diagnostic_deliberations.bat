@echo off
echo ===== DIAGNOSTIC ERREURS DELIBERATIONS =====
echo.

echo 1. Vérification du backend...
curl -s -o nul -w "Backend status: %%{http_code}\n" "http://localhost:8081/api/test/health"

echo 2. Test endpoint president/test...
curl -s -o nul -w "President test: %%{http_code}\n" "http://localhost:8081/api/president/test" -H "X-User-ID: 1" -H "X-User-Role: president"

echo 3. Test endpoint president/deliberations...
curl -s -o nul -w "President deliberations: %%{http_code}\n" "http://localhost:8081/api/president/deliberations" -H "X-User-ID: 1" -H "X-User-Role: president"

echo 4. Vérification de la base de données...
echo Nombre de protocol_evaluations:
curl -s "http://localhost:8081/api/test/protocols" | findstr "count" 2>nul || echo "Impossible de vérifier"

echo.
echo 5. Vérification des fichiers corrigés...
if exist "dist\frontend\fix-urls.js" (
    echo ✓ fix-urls.js existe
    findstr /c "const currentHost" "dist\frontend\fix-urls.js" | find /c "const currentHost" >nul
    if %errorlevel% equ 0 (
        echo ✓ currentHost déclaré une seule fois
    ) else (
        echo ✗ Problème avec currentHost
    )
) else (
    echo ✗ fix-urls.js manquant
)

echo.
echo ===== RÉSUMÉ =====
echo Si tous les tests retournent 200, le problème est résolu.
echo Si 404, vérifiez que le backend est démarré avec les corrections.
echo Si 403, vérifiez l'authentification.
echo.
pause