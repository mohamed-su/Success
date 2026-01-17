@echo off
echo D\u00e9marrage du backend avec CORS dynamique...

:: D\u00e9tection de l'IP locale
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do set LOCAL_IP=%%b
)

echo IP d\u00e9tect\u00e9e: %LOCAL_IP%
echo Autorisation CORS pour:
echo - http://localhost:5173
echo - http://127.0.0.1:5173  
echo - http://%LOCAL_IP%:5173

java -Dspring.web.cors.allowed-origins="http://localhost:5173,http://127.0.0.1:5173,http://%LOCAL_IP%:5173" -Dspring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS -Dspring.web.cors.allowed-headers=* -Dspring.web.cors.allow-credentials=true -jar demo-0.0.1-SNAPSHOT.jar

pause