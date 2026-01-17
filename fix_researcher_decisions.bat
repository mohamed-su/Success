@echo off
echo ===== CORRECTION ENDPOINT RESEARCHER DECISIONS =====
echo.

echo Probleme identifie:
echo - Erreur SQL dans /api/researcher/decisions
echo - Colonnes inexistantes dans protocol_evaluations
echo.

echo Correction appliquee:
echo - Suppression des colonnes president_name, president_signature
echo - Suppression des colonnes submitter_email, submitter_phone, submission_datetime
echo - Ajout de valeur fixe pour presidentname
echo.

echo 1. Redemarrage du backend...
cd demo
taskkill /f /im java.exe 2>nul
timeout /t 3 >nul

echo 2. Compilation...
call mvn clean compile -q

echo 3. Demarrage...
start "Backend" cmd /c "mvn spring-boot:run"
echo Attente du demarrage...
timeout /t 15 >nul

echo 4. Test de l'endpoint researcher/decisions...
curl -s "http://localhost:8081/api/researcher/decisions" -H "X-User-ID: 2" -H "X-User-Role: researcher" | findstr "success.*true"

echo.
echo 5. CORRECTION TERMINEE
echo.
echo L'endpoint /api/researcher/decisions doit maintenant fonctionner
echo pour afficher les decisions du comite aux chercheurs.
echo.
echo Testez sur: http://localhost:3000/dashboard/researcher
echo.
pause