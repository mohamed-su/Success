@echo off
echo ========================================
echo Solution CORS Definitive
echo ========================================

echo 1. Arret du backend existant...
taskkill /f /im java.exe 2>nul

echo 2. Demarrage backend avec CORS force desactive...
start "Backend-No-CORS" cmd /k "cd backend && java -Dspring.web.cors.allowed-origins=* -Dspring.security.web.cors.disable=true -Dcors.disable=true -jar demo-0.0.1-SNAPSHOT.jar"

echo 3. Attente 10 secondes...
timeout /t 10 /nobreak

echo 4. Lancement Chrome sans securite...
if not exist "C:\temp\chrome" mkdir "C:\temp\chrome"
taskkill /f /im chrome.exe 2>nul
timeout /t 2 /nobreak
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:/temp/chrome" --disable-web-security --disable-features=VizDisplayCompositor --allow-running-insecure-content --disable-site-isolation-trials

echo 5. Demarrage frontend...
start "Frontend" cmd /k "cd frontend && npx http-server . -p 5173"

echo.
echo ========================================
echo SOLUTION COMPLETE ACTIVEE !
echo ========================================
echo Backend: http://localhost:8081 (CORS desactive)
echo Frontend: http://127.0.0.1:5173 ou http://10.53.44.37:5173
echo Chrome: Securite desactivee
echo.
pause