@echo off
echo ========================================
echo Installation Comité d'Éthique
echo ========================================

echo.
echo 1. Configuration de la base de données PostgreSQL
echo Assurez-vous que PostgreSQL est installé et démarré
echo.
echo Exécutez cette commande dans psql:
echo CREATE DATABASE comite_ethique;
echo.
echo Puis exécutez le script: psql -d comite_ethique -f database\database_setup.sql
echo.

echo 2. Configuration du backend
echo Modifiez backend\application.properties avec vos paramètres:
echo - Mot de passe base de données
echo - Clé JWT secrète  
echo - Configuration email
echo.

echo 3. Démarrage
echo Exécutez: backend\start-backend.bat
echo.

echo 4. Frontend
echo Déployez le contenu de frontend\ sur votre serveur web
echo ou utilisez un serveur local comme http-server
echo.

pause