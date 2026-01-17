@echo off
echo ===== CORRECTION DES ERREURS DELIBERATIONS =====
echo.

echo 1. Arrêt du backend existant...
taskkill /f /im java.exe 2>nul
timeout /t 3 >nul

echo 2. Compilation du backend...
cd demo
call mvn clean compile -q
if %errorlevel% neq 0 (
    echo ERREUR: Compilation échouée
    pause
    exit /b 1
)

echo 3. Démarrage du backend...
start "Backend" cmd /c "mvn spring-boot:run"
echo Attente du démarrage du backend...
timeout /t 15 >nul

echo 4. Test des endpoints...
echo.
echo Test endpoint de test:
curl -s -X GET "http://localhost:8081/api/president/test" -H "Content-Type: application/json" -H "X-User-ID: 1" -H "X-User-Role: president"
echo.
echo.

echo Test endpoint deliberations:
curl -s -X GET "http://localhost:8081/api/president/deliberations" -H "Content-Type: application/json" -H "X-User-ID: 1" -H "X-User-Role: president"
echo.
echo.

echo ===== CORRECTIONS APPLIQUÉES =====
echo 1. Erreur currentHost dans fix-urls.js corrigée
echo 2. Endpoint de test ajouté au PresidentController
echo 3. URLs dans FinalReports.tsx corrigées
echo 4. Construction d'URL améliorée
echo.
echo Vérifiez maintenant le frontend pour voir si les délibérations se chargent.
echo.
pause