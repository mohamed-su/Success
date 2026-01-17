@echo off
echo ===== SERVEUR HTTP POUR DIST =====
echo.

cd /d "C:\Users\HP\Downloads\DEV6\Finalisation-main\dist\frontend"

echo Dossier actuel: %CD%
echo.

echo Tentative 1: Python HTTP Server...
python -m http.server 8080 2>nul
if %errorlevel% neq 0 (
    echo Python non trouve, tentative avec Node.js...
    
    echo Tentative 2: Node.js HTTP Server...
    npx http-server -p 8080 -c-1 2>nul
    if %errorlevel% neq 0 (
        echo Node.js non trouve, tentative avec PHP...
        
        echo Tentative 3: PHP Built-in Server...
        php -S localhost:8080 2>nul
        if %errorlevel% neq 0 (
            echo.
            echo AUCUN SERVEUR DISPONIBLE !
            echo.
            echo Solutions:
            echo 1. Installez Python: python -m http.server 8080
            echo 2. Installez Node.js: npx http-server -p 8080
            echo 3. Ou ouvrez directement index-fix.html dans le navigateur
            echo.
            pause
        )
    )
)