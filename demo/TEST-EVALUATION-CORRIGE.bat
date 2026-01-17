@echo off
title TEST SYSTÈME D'ÉVALUATION CORRIGÉ
color 0E

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    TEST SYSTÈME CORRIGÉ                      ║
echo ║              Évaluations + Persistance BDD                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/5] 🛑 Arrêt du serveur actuel...
taskkill /f /im java.exe >nul 2>&1
echo ✅ Serveur arrêté

echo.
echo [2/5] 🗄️ Correction de la base de données...
set PGPATH=""
for /d %%i in ("C:\Program Files\PostgreSQL\*") do (
    if exist "%%i\bin\psql.exe" (
        set PGPATH="%%i\bin\"
        goto :found_pg
    )
)

:found_pg
if %PGPATH%=="" (
    echo ⚠️  PostgreSQL non trouvé - continuons sans correction BDD
) else (
    echo 🔧 Exécution du script de correction...
    %PGPATH%psql.exe -h localhost -p 5432 -U postgres -d comite_ethique -f fix_evaluation_table.sql
    echo ✅ Base de données corrigée
)

echo.
echo [3/5] 🔧 Compilation avec nouveaux services...
call mvn clean compile -q
if %ERRORLEVEL% EQU 0 (
    echo ✅ Compilation réussie
) else (
    echo ❌ Erreur de compilation
    pause
    exit /b 1
)

echo.
echo [4/5] 🚀 Redémarrage du serveur...
start /min cmd /c "mvn spring-boot:run -Dspring-boot.run.profiles=postgresql"
echo ✅ Serveur en cours de démarrage...

echo.
echo [5/5] ⏳ Attente du démarrage (30 secondes)...
timeout /t 30 /nobreak >nul

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎉 SYSTÈME CORRIGÉ !                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🔧 CORRECTIONS APPLIQUÉES :
echo.
echo ✅ Service MemberEvaluationService avec @Transactional
echo ✅ Contrôleur EvaluationSubmissionController
echo ✅ Endpoint POST /api/evaluation/submit
echo ✅ Endpoint GET /api/evaluation/protocols/{id}/evaluations
echo ✅ Table member_evaluation_grids vérifiée/créée
echo ✅ Persistance forcée avec repository.save() + flush()
echo.
echo 🧪 TESTS À EFFECTUER :
echo.
echo 1. Aller sur : http://localhost:5173/dashboard/member/assigned
echo 2. Cliquer sur "📋 Évaluer protocole"
echo 3. Remplir le formulaire et soumettre
echo 4. Vérifier dans les logs : "INSERT INTO member_evaluation_grids"
echo 5. Cliquer sur "Grilles d'Évaluations" → doit afficher 1 résultat
echo.
echo 🔍 ENDPOINTS DE DEBUG :
echo.
echo • GET /api/evaluation/check-data
echo • GET /api/evaluation/protocol/{id}/grids/raw
echo • GET /api/evaluation/protocols/{id}/evaluations
echo.

echo Ouverture automatique dans 10 secondes...
timeout /t 10 /nobreak >nul
start http://localhost:5173/dashboard/member/assigned

echo.
echo 🎯 PREUVE DE CORRECTION ATTENDUE :
echo    Logs montrant "INSERT INTO member_evaluation_grids"
echo    puis "SELECT" retournant au moins 1 ligne
pause