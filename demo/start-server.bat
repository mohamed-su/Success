@echo off
echo Démarrage du serveur backend...
start /B mvn spring-boot:run > server.log 2>&1
echo Serveur démarré en arrière-plan. Consultez server.log pour les logs.
timeout /t 10 /nobreak > nul
echo Serveur prêt sur http://localhost:8081