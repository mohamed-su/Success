@echo off
echo Démarrage du backend sur toutes les interfaces réseau...

:: Détection de l'IP locale
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4" ^| findstr /V "127.0.0.1"') do (
    for /f "tokens=1" %%b in ("%%a") do set LOCAL_IP=%%b
)

echo IP détectée: %LOCAL_IP%
echo Backend accessible sur:
echo - http://localhost:8081
echo - http://127.0.0.1:8081
echo - http://%LOCAL_IP%:8081

java -Dserver.address=0.0.0.0 -Dspring.web.cors.allowed-origins="http://localhost:5173,http://127.0.0.1:5173,http://%LOCAL_IP%:5173" -Dspring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS -Dspring.web.cors.allowed-headers=* -Dspring.web.cors.allow-credentials=true -jar demo-0.0.1-SNAPSHOT.jar

pause