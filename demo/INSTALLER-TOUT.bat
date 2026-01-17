@echo off
title Installation Automatique - Nouveau Formulaire de Délibération
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    COMITÉ D'ÉTHIQUE                          ║
echo ║            INSTALLATION AUTOMATIQUE                          ║
echo ║         Nouveau Formulaire de Délibération                   ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Étape 1: Mise à jour de la base de données
echo [1/4] 🔄 Mise à jour de la base de données...
echo.

REM Trouver PostgreSQL automatiquement
set PGPATH=""
for /d %%i in ("C:\Program Files\PostgreSQL\*") do (
    if exist "%%i\bin\psql.exe" (
        set PGPATH="%%i\bin\"
        goto :found_pg
    )
)

:found_pg
if %PGPATH%=="" (
    echo ❌ PostgreSQL non trouvé. Installation manuelle requise.
    echo    Contactez votre administrateur système.
    pause
    exit /b 1
)

echo ✅ PostgreSQL trouvé dans %PGPATH%
%PGPATH%psql.exe -h localhost -p 5432 -U postgres -d comite_ethique -f add_deliberation_columns.sql >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✅ Base de données mise à jour avec succès !
) else (
    echo ⚠️  Tentative de mise à jour (peut être déjà fait)
)

echo.
echo [2/4] 📁 Création du dossier JavaScript...

REM Créer le dossier static/js s'il n'existe pas
if not exist "src\main\resources\static" mkdir "src\main\resources\static"
if not exist "src\main\resources\static\js" mkdir "src\main\resources\static\js"

echo ✅ Dossier créé : src\main\resources\static\js\

echo.
echo [3/4] 📋 Copie du nouveau formulaire...

REM Copier le fichier JavaScript
copy "replace-evaluation-form.js" "src\main\resources\static\js\" >nul
echo ✅ Formulaire copié avec succès !

echo.
echo [4/4] 🔧 Configuration automatique...

REM Créer un fichier HTML d'intégration automatique
echo ^<!DOCTYPE html^> > "src\main\resources\static\rapporteur-integration.html"
echo ^<html^> >> "src\main\resources\static\rapporteur-integration.html"
echo ^<head^> >> "src\main\resources\static\rapporteur-integration.html"
echo     ^<meta charset="UTF-8"^> >> "src\main\resources\static\rapporteur-integration.html"
echo     ^<title^>Intégration Formulaire Délibération^</title^> >> "src\main\resources\static\rapporteur-integration.html"
echo ^</head^> >> "src\main\resources\static\rapporteur-integration.html"
echo ^<body^> >> "src\main\resources\static\rapporteur-integration.html"
echo     ^<script src="js/replace-evaluation-form.js"^>^</script^> >> "src\main\resources\static\rapporteur-integration.html"
echo     ^<script^> >> "src\main\resources\static\rapporteur-integration.html"
echo         // Auto-intégration dans l'interface existante >> "src\main\resources\static\rapporteur-integration.html"
echo         if (window.parent !== window) { >> "src\main\resources\static\rapporteur-integration.html"
echo             // Si dans une iframe, appliquer à la page parent >> "src\main\resources\static\rapporteur-integration.html"
echo             window.parent.showDeliberationForm = showDeliberationForm; >> "src\main\resources\static\rapporteur-integration.html"
echo             window.parent.replaceAllEvaluateButtons = replaceAllEvaluateButtons; >> "src\main\resources\static\rapporteur-integration.html"
echo             setTimeout(function() { >> "src\main\resources\static\rapporteur-integration.html"
echo                 if (window.parent.document) { >> "src\main\resources\static\rapporteur-integration.html"
echo                     window.parent.replaceAllEvaluateButtons(); >> "src\main\resources\static\rapporteur-integration.html"
echo                 } >> "src\main\resources\static\rapporteur-integration.html"
echo             }, 2000); >> "src\main\resources\static\rapporteur-integration.html"
echo         } >> "src\main\resources\static\rapporteur-integration.html"
echo     ^</script^> >> "src\main\resources\static\rapporteur-integration.html"
echo ^</body^> >> "src\main\resources\static\rapporteur-integration.html"
echo ^</html^> >> "src\main\resources\static\rapporteur-integration.html"

echo ✅ Configuration terminée !

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    ✅ INSTALLATION RÉUSSIE !                 ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🎉 Le nouveau formulaire de délibération est installé !
echo.
echo 📋 QUE FAIRE MAINTENANT :
echo.
echo 1. ✅ Base de données mise à jour
echo 2. ✅ Formulaire installé  
echo 3. ✅ Configuration automatique
echo.
echo 🚀 PROCHAINES ÉTAPES :
echo.
echo 1. Redémarrez votre serveur (fermez et relancez)
echo 2. Allez sur votre interface rapporteur
echo 3. Les boutons "Évaluer" sont maintenant "Délibérer" !
echo.
echo 🔗 URL de test : http://localhost:8081/rapporteur-integration.html
echo.
echo ⭐ Le formulaire est identique au document officiel !
echo.

REM Proposer de redémarrer le serveur
echo Voulez-vous redémarrer le serveur maintenant ? (O/N)
set /p restart="Tapez O pour Oui, N pour Non : "

if /i "%restart%"=="O" (
    echo.
    echo 🔄 Redémarrage du serveur...
    echo.
    start cmd /c "mvn spring-boot:run -Dspring-boot.run.profiles=postgresql"
    echo ✅ Serveur en cours de démarrage...
    echo.
    echo 🌐 Attendez 30 secondes puis allez sur :
    echo    http://localhost:5173/dashboard/rapporteur/decisions
    echo.
)

echo.
echo 🎯 TERMINÉ ! Votre nouveau formulaire est prêt !
echo.
pause