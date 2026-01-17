@echo off
echo ========================================
echo SOLUTION FINALE CORS
echo ========================================

echo 1. Fermeture de Chrome...
taskkill /f /im chrome.exe 2>nul

echo 2. Creation dossier temporaire...
if not exist "C:\temp\chrome-dev" mkdir "C:\temp\chrome-dev"

echo 3. Attente 3 secondes...
timeout /t 3 /nobreak >nul

echo 4. Lancement Chrome SANS SECURITE...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --user-data-dir="C:/temp/chrome-dev" ^
  --disable-web-security ^
  --disable-features=VizDisplayCompositor ^
  --allow-running-insecure-content ^
  --disable-site-isolation-trials ^
  --disable-same-origin-policy ^
  --allow-cross-origin-auth-prompt ^
  "http://10.53.44.37:5173"

echo.
echo ========================================
echo CHROME LANCE SANS SECURITE !
echo ========================================
echo Vous pouvez maintenant utiliser:
echo - http://10.53.44.37:5173
echo - http://127.0.0.1:5173
echo.
echo CORS est completement desactive dans Chrome.
pause