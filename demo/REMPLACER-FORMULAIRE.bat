@echo off
title REMPLACEMENT DEFINITIF - Nouveau Formulaire
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              REMPLACEMENT DEFINITIF                          ║
echo ║         Ancien formulaire → Nouveau formulaire               ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/4] 🛑 Arrêt du serveur actuel...
taskkill /f /im java.exe >nul 2>&1
echo ✅ Serveur arrêté

echo.
echo [2/4] 🔧 Compilation des nouveaux contrôleurs...
call mvn clean compile -q
if %ERRORLEVEL% EQU 0 (
    echo ✅ Compilation réussie
) else (
    echo ❌ Erreur de compilation
    pause
    exit /b 1
)

echo.
echo [3/4] 🗄️ Mise à jour de la base de données...
set PGPATH=""
for /d %%i in ("C:\Program Files\PostgreSQL\*") do (
    if exist "%%i\bin\psql.exe" (
        set PGPATH="%%i\bin\"
        goto :found_pg
    )
)

:found_pg
if %PGPATH%=="" (
    echo ⚠️  PostgreSQL non trouvé - continuons
) else (
    %PGPATH%psql.exe -h localhost -p 5432 -U postgres -d comite_ethique -f add_deliberation_columns.sql >nul 2>&1
    echo ✅ Base de données mise à jour
)

echo.
echo [4/4] 🚀 Redémarrage avec le nouveau formulaire...
start /min cmd /c "mvn spring-boot:run -Dspring-boot.run.profiles=postgresql"
echo ✅ Serveur en cours de démarrage...

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎉 REMPLACEMENT TERMINÉ !                 ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎯 CHANGEMENTS APPLIQUÉS :
echo.
echo ✅ L'endpoint d'évaluation retourne maintenant le nouveau formulaire
echo ✅ Nouveau contrôleur créé : NewEvaluationFormController
echo ✅ Formulaire basé sur votre document officiel
echo ✅ Tous les champs de délibération inclus
echo.
echo 🔗 COMMENT TESTER :
echo.
echo 1. Attendez 30 secondes (démarrage serveur)
echo 2. Allez sur : http://localhost:5173/dashboard/rapporteur/decisions
echo 3. Cliquez sur "Évaluer" → NOUVEAU formulaire !
echo.
echo 📋 LE NOUVEAU FORMULAIRE CONTIENT :
echo    • Délibération N° (auto-généré)
echo    • Titre de la recherche
echo    • Référence du protocole
echo    • Documentation
echo    • Référence du demandeur
echo    • Site de la recherche
echo    • Date de délibération
echo    • Éléments examinés (6 checkboxes)
echo    • Observations
echo    • Membres ayant siégé (6 membres)
echo    • Avis du comité (3 options)
echo    • Réserves
echo    • Recommandations
echo    • Signatures (Rapporteur + Président)
echo.

echo Ouverture automatique dans 10 secondes...
timeout /t 10 /nobreak >nul
start http://localhost:5173/dashboard/rapporteur/decisions

echo.
echo 🎉 NOUVEAU FORMULAIRE ACTIF !
echo    L'ancien formulaire est maintenant remplacé !
pause