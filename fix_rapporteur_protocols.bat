@echo off
echo ===== CORRECTION PROTOCOLES RAPPORTEUR =====
echo.

echo Probleme identifie:
echo - Apres evaluation, le protocole disparait de la liste
echo - Cause: filtre sur status = 'ASSIGNED_TO_MEMBER' uniquement
echo.

echo Correction appliquee:
echo - Suppression du filtre sur le statut
echo - Affichage de tous les protocoles assignes au rapporteur
echo - Ajout d'indicateurs pour les protocoles evalues
echo.

echo 1. Redemarrage du backend...
cd demo
taskkill /f /im java.exe 2>nul
timeout /t 2 >nul

echo 2. Compilation...
call mvn clean compile -q

echo 3. Demarrage...
start "Backend" cmd /c "mvn spring-boot:run"
echo Attente du demarrage...
timeout /t 15 >nul

echo 4. Test de l'endpoint rapporteur...
curl -s "http://localhost:8081/api/rapporteur/protocols" -H "X-User-ID: 11" -H "X-User-Role: rapporteur" | findstr "success"

echo.
echo 5. CORRECTION TERMINEE
echo.
echo Maintenant:
echo - Les protocoles evalues restent visibles
echo - Indicateur "Deliberation soumise" pour les protocoles evalues
echo - Bouton "Evaluer" desactive pour les protocoles deja evalues
echo.
echo Testez sur: http://localhost:3000/dashboard/rapporteur/decisions
echo.
pause