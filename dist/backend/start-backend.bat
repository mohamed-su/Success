@echo off
echo ========================================
echo Démarrage Backend Comité d'Éthique
echo ========================================

echo Vérification de Java...
java -version
if %errorlevel% neq 0 (
    echo ERREUR: Java 17+ requis
    pause
    exit /b 1
)

echo.
echo Création du dossier uploads...
if not exist "uploads" mkdir uploads

echo.
echo Création du dossier logs...
if not exist "logs" mkdir logs

echo.
echo Démarrage du serveur backend avec CORS FORCE désactivé...
java -Dspring.profiles.active=dev -Djava.awt.headless=true -Dspring.web.cors.allowed-origins=* -Dspring.web.cors.allowed-methods=* -Dspring.web.cors.allowed-headers=* -Dspring.security.cors.configurationSource=null -Dcors.disable=true -Dspring.security.enabled=false -jar demo-0.0.1-SNAPSHOT.jar --spring.config.location=application.properties --server.servlet.context-path=/ --management.security.enabled=false

pause