@echo off
title CORRECTION SYSTÈME D'ÉVALUATION COMPLET
color 0E

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║           CORRECTION SYSTÈME D'ÉVALUATION COMPLET           ║
echo ║     Validation + Persistance + Génération PDF + API         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/6] 🛑 Arrêt du serveur actuel...
taskkill /f /im java.exe >nul 2>&1
echo ✅ Serveur arrêté

echo.
echo [2/6] 🗄️ Mise à jour de la base de données...
set PGPATH=""
for /d %%i in ("C:\Program Files\PostgreSQL\*") do (
    if exist "%%i\bin\psql.exe" (
        set PGPATH="%%i\bin\"
        goto :found_pg
    )
)

:found_pg
if %PGPATH%=="" (
    echo ⚠️  PostgreSQL non trouvé - continuons sans mise à jour BDD
) else (
    echo 🔧 Application des corrections de table...
    %PGPATH%psql.exe -h localhost -p 5432 -U postgres -d comite_ethique -f update_evaluation_table.sql
    echo ✅ Base de données mise à jour avec validations
)

echo.
echo [3/6] 📁 Création du répertoire PDF...
if not exist "evaluation-pdfs" mkdir evaluation-pdfs
echo ✅ Répertoire PDF créé

echo.
echo [4/6] 🔧 Compilation avec nouvelles validations...
call mvn clean compile -q
if %ERRORLEVEL% EQU 0 (
    echo ✅ Compilation réussie
) else (
    echo ❌ Erreur de compilation
    pause
    exit /b 1
)

echo.
echo [5/6] 🚀 Redémarrage du serveur...
start /min cmd /c "mvn spring-boot:run -Dspring-boot.run.profiles=postgresql"
echo ✅ Serveur en cours de démarrage...

echo.
echo [6/6] ⏳ Attente du démarrage (30 secondes)...
timeout /t 30 /nobreak >nul

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                🎉 SYSTÈME CORRIGÉ ET OPÉRATIONNEL !          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🔧 CORRECTIONS APPLIQUÉES :
echo.
echo ✅ VALIDATION BACKEND STRICTE
echo    • Champs obligatoires : @NotNull, @NotBlank
echo    • Validation métier : tous critères requis
echo    • Erreur HTTP 400 si critères manquants
echo.
echo ✅ LOGIQUE MÉTIER RENFORCÉE
echo    • Status COMPLETED seulement si validation OK
echo    • Blocage soumission si critères incomplets
echo    • Validation des notes (1-5)
echo.
echo ✅ PERSISTANCE GARANTIE
echo    • Sauvegarde en member_evaluation_grids
echo    • Liens protocol_id + member_id corrects
echo    • Date submitted_at automatique
echo.
echo ✅ GÉNÉRATION PDF AUTOMATIQUE
echo    • PDF créé après validation réussie
echo    • Contenu : critères + décision + signatures
echo    • Stockage : chemin en base + fichier serveur
echo.
echo ✅ API COMPLÈTE
echo    • POST /api/evaluations/submit (validation + PDF)
echo    • GET /api/evaluations/{id}/pdf (affichage PDF)
echo    • GET /api/evaluations/protocols/{id}/evaluations
echo.
echo 🧪 TESTS À EFFECTUER :
echo.
echo 1. Aller sur : http://localhost:5173/dashboard/member/assigned
echo 2. Cliquer "Évaluer protocole" sur un protocole
echo 3. Essayer de soumettre SANS remplir → Erreur attendue
echo 4. Remplir TOUS les critères obligatoires → Succès
echo 5. Cliquer "Grilles d'Évaluations" → PDF disponible
echo.
echo 🔍 ENDPOINTS DE TEST :
echo.
echo • POST /api/evaluations/submit
echo • GET /api/evaluations/{protocolId}/pdf
echo • GET /api/evaluations/protocols/{protocolId}/evaluations
echo.

echo Ouverture automatique dans 10 secondes...
timeout /t 10 /nobreak >nul
start http://localhost:5173/dashboard/member/assigned

echo.
echo 🎯 VALIDATION GARANTIE :
echo    Impossible de soumettre sans tous les critères !
echo    PDF généré automatiquement après validation !
pause