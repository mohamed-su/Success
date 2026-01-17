@echo off
echo ========================================
echo INSTALLATION SYSTEME EVALUATION CORRIGE
echo ========================================

echo.
echo 1. Arret du serveur backend...
taskkill /F /IM java.exe 2>nul

echo.
echo 2. Compilation du backend avec nouvelles dependances...
cd demo
call mvn clean compile -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de la compilation
    pause
    exit /b 1
)

echo.
echo 3. Execution des migrations de base de donnees...
call mvn flyway:migrate
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec des migrations
    pause
    exit /b 1
)

echo.
echo 4. Creation des repertoires pour les PDFs...
if not exist "uploads\evaluations" mkdir uploads\evaluations

echo.
echo 5. Demarrage du backend...
start "Backend CERS" cmd /k "mvn spring-boot:run"

echo.
echo 6. Attente du demarrage du backend...
timeout /t 10

echo.
echo 7. Compilation du frontend...
cd ..\front
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de l'installation des dependances frontend
    pause
    exit /b 1
)

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Echec de la compilation frontend
    pause
    exit /b 1
)

echo.
echo 8. Demarrage du frontend...
start "Frontend CERS" cmd /k "npm run dev"

echo.
echo ========================================
echo INSTALLATION TERMINEE AVEC SUCCES!
echo ========================================
echo.
echo Backend: http://localhost:8081
echo Frontend: http://localhost:5173
echo.
echo Le systeme d'evaluation est maintenant operationnel:
echo - Les criteres d'evaluation sont sauvegardes en base
echo - Les PDFs sont generes automatiquement
echo - Les grilles d'evaluation sont consultables
echo.
echo Testez avec le protocole PROT-0008!
echo.
pause