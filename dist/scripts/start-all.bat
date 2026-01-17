@echo off
echo ========================================
echo Démarrage Complet - Comité d'Éthique
echo ========================================

echo.
echo 1. Démarrage du Backend...
start "Backend" cmd /k "cd backend && start-backend.bat"

echo.
echo 2. Attente de 10 secondes pour le backend...
timeout /t 10 /nobreak

echo.
echo 3. Démarrage du Frontend...
start "Frontend" cmd /k "start-frontend.bat"

echo.
echo ========================================
echo Application démarrée !
echo ========================================
echo Backend: http://localhost:8081
echo Frontend: http://localhost:3000
echo.
echo Appuyez sur une touche pour fermer cette fenêtre...
pause >nul