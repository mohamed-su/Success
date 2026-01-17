@echo off
echo ========================================
echo Lancement Chrome avec CORS desactive
echo ========================================

echo Creation du dossier temporaire...
if not exist "C:\temp\chrome" mkdir "C:\temp\chrome"

echo Fermeture de Chrome existant...
taskkill /f /im chrome.exe 2>nul

echo Attente de 2 secondes...
timeout /t 2 /nobreak >nul

echo Lancement de Chrome avec CORS desactive...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --user-data-dir="C:/temp/chrome" --disable-web-security --disable-features=VizDisplayCompositor --disable-site-isolation-trials --disable-web-security --allow-running-insecure-content

echo.
echo Chrome lance avec CORS desactive !
echo Vous pouvez maintenant utiliser:
echo - http://127.0.0.1:5173
echo - http://10.53.44.37:5173
echo.
pause