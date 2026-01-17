@echo off
echo ========================================
echo Démarrage Frontend Comité d'Éthique
echo ========================================

echo Vérification de Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERREUR: Node.js requis
    echo Téléchargez depuis: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo Installation de http-server si nécessaire...
npm list -g http-server >nul 2>&1
if %errorlevel% neq 0 (
    echo Installation de http-server...
    npm install -g http-server
)

echo.
echo Démarrage du serveur frontend sur port 3000...
echo URL: http://localhost:3000
echo.
cd frontend
http-server -p 3000 -o

pause