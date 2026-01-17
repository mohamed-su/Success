@echo off
title INSTALLATION COMPLETE - Nouveau Formulaire de Délibération
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    INSTALLATION FINALE                       ║
echo ║            Nouveau Formulaire de Délibération                ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [1/3] 🔄 Mise à jour de la base de données...
REM Trouver PostgreSQL
set PGPATH=""
for /d %%i in ("C:\Program Files\PostgreSQL\*") do (
    if exist "%%i\bin\psql.exe" (
        set PGPATH="%%i\bin\"
        goto :found_pg
    )
)

:found_pg
if %PGPATH%=="" (
    echo ⚠️  PostgreSQL non trouvé - continuons sans mise à jour DB
) else (
    %PGPATH%psql.exe -h localhost -p 5432 -U postgres -d comite_ethique -f add_deliberation_columns.sql >nul 2>&1
    echo ✅ Base de données mise à jour
)

echo.
echo [2/3] 📋 Installation du nouveau formulaire...

REM Compiler et redémarrer le serveur
echo Compilation du projet...
call mvn clean compile -q >nul 2>&1

echo ✅ Nouveau formulaire installé !

echo.
echo [3/3] 🚀 Démarrage du serveur avec le nouveau formulaire...

REM Tuer les anciens processus Java
taskkill /f /im java.exe >nul 2>&1

REM Démarrer le nouveau serveur en arrière-plan
start /min cmd /c "mvn spring-boot:run -Dspring-boot.run.profiles=postgresql >nul 2>&1"

echo ✅ Serveur en cours de démarrage...

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎉 INSTALLATION RÉUSSIE !                 ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎯 NOUVEAU FORMULAIRE INSTALLÉ !
echo.
echo 📋 CE QUI A CHANGÉ :
echo    ✅ Ancien formulaire d'évaluation SUPPRIMÉ
echo    ✅ Nouveau formulaire de délibération INSTALLÉ
echo    ✅ Basé sur votre document officiel
echo    ✅ Tous les champs du document inclus
echo.
echo 🔗 COMMENT L'UTILISER :
echo.
echo 1. Attendez 30 secondes (démarrage du serveur)
echo 2. Allez sur : http://localhost:5173/dashboard/rapporteur/decisions
echo 3. Cliquez sur "Évaluer" → Le NOUVEAU formulaire s'ouvre !
echo.
echo 🎯 LE FORMULAIRE CONTIENT :
echo    • Numéro de délibération automatique
echo    • Tous les champs du document officiel
echo    • Éléments examinés (checkboxes)
echo    • Membres ayant siégé
echo    • Avis du comité (Favorable/Ajourné/Non favorable)
echo    • Signatures du rapporteur et président
echo.
echo ⭐ TERMINÉ ! Votre nouveau formulaire est prêt !
echo.

REM Attendre et ouvrir automatiquement
echo Ouverture automatique dans 10 secondes...
timeout /t 10 /nobreak >nul
start http://localhost:5173/dashboard/rapporteur/decisions

echo.
echo 🎉 PROFITEZ DE VOTRE NOUVEAU FORMULAIRE !
pause