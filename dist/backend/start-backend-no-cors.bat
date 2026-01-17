@echo off
echo ========================================
echo Backend avec CORS FORCE DESACTIVE
echo ========================================

echo Arret des processus Java existants...
taskkill /f /im java.exe 2>nul

echo Demarrage avec parametres CORS maximum...
java -Dspring.profiles.active=dev ^
     -Dspring.web.cors.allowed-origins=* ^
     -Dspring.web.cors.allowed-methods=* ^
     -Dspring.web.cors.allowed-headers=* ^
     -Dspring.web.cors.allow-credentials=true ^
     -Dspring.security.cors.disable=true ^
     -Dspring.mvc.cors.disable=false ^
     -Dcors.enabled=false ^
     -Dserver.servlet.context-path=/ ^
     -jar demo-0.0.1-SNAPSHOT.jar ^
     --spring.web.cors.allowed-origins=* ^
     --spring.web.cors.allowed-methods=* ^
     --spring.web.cors.allowed-headers=* ^
     --cors.disable=true

pause