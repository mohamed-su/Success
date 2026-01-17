@echo off
echo ========================================
echo   INSTALLATION DU NOUVEAU FORMULAIRE
echo   DE DELIBERATION - COMITE D'ETHIQUE
echo ========================================
echo.

REM 1. Mise à jour de la base de données
echo 1. Mise à jour de la base de données...
call update-database.bat
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Échec de la mise à jour de la base de données
    pause
    exit /b 1
)

REM 2. Copier le fichier JavaScript vers l'interface frontend
echo.
echo 2. Recherche de l'interface rapporteur...

REM Chercher les dossiers possibles du frontend
set FRONTEND_FOUND=0

if exist "..\frontend\public\js\" (
    copy "replace-evaluation-form.js" "..\frontend\public\js\"
    echo ✓ Fichier copié vers ..\frontend\public\js\
    set FRONTEND_FOUND=1
)

if exist "..\rapporteur\src\assets\js\" (
    copy "replace-evaluation-form.js" "..\rapporteur\src\assets\js\"
    echo ✓ Fichier copié vers ..\rapporteur\src\assets\js\
    set FRONTEND_FOUND=1
)

if exist "src\main\resources\static\js\" (
    if not exist "src\main\resources\static\js\" mkdir "src\main\resources\static\js\"
    copy "replace-evaluation-form.js" "src\main\resources\static\js\"
    echo ✓ Fichier copié vers src\main\resources\static\js\
    set FRONTEND_FOUND=1
)

if %FRONTEND_FOUND%==0 (
    echo.
    echo ⚠️  Dossier frontend non trouvé automatiquement.
    echo    Copiez manuellement le fichier replace-evaluation-form.js
    echo    dans votre dossier JavaScript de l'interface rapporteur.
)

REM 3. Instructions finales
echo.
echo ========================================
echo   INSTALLATION TERMINÉE
echo ========================================
echo.
echo 📋 ÉTAPES SUIVANTES :
echo.
echo 1. Ajoutez cette ligne dans votre page rapporteur :
echo    ^<script src="replace-evaluation-form.js"^>^</script^>
echo.
echo 2. Redémarrez votre serveur backend :
echo    mvn spring-boot:run
echo.
echo 3. Actualisez votre interface rapporteur
echo.
echo 4. Les boutons "Évaluer" sont maintenant remplacés
echo    par des boutons "Délibérer" avec le nouveau formulaire !
echo.
echo ✅ Le formulaire est basé sur le document officiel
echo    de délibération du Comité d'Éthique.
echo.

pause