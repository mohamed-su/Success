@echo off
echo ========================================
echo Demarrage Complet avec CORS desactive
echo ========================================

echo.
echo 1. Demarrage du Backend...
start "Backend" cmd /k "cd backend && start-backend.bat"

echo.
echo 2. Attente de 10 secondes pour le backend...
timeout /t 10 /nobreak

echo.
echo 3. Demarrage du Frontend...
start "Frontend" cmd /k "cd frontend && npx http-server . -p 5173"

echo.
echo 4. Attente de 5 secondes pour le frontend...
timeout /t 5 /nobreak

echo.
echo 5. Lancement de Chrome avec CORS desactive...
call launch-chrome-no-cors.bat

echo.
echo ========================================
echo Application demarree completement !
echo ========================================
echo Backend: http://localhost:8081
echo Frontend: http://127.0.0.1:5173 ou http://10.53.44.37:5173
echo Chrome: CORS desactive
echo.
pause