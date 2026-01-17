@echo off
echo ========================================
echo   CERS - Demarrage du Backend
echo ========================================

REM Arreter tous les processus Java existants sur le port 9999
echo Arret des processus existants...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :9999') do (
    echo Arret du processus %%a
    taskkill /PID %%a /F >nul 2>&1
)

REM Attendre un peu
timeout /t 2 /nobreak >nul

REM Demarrer le backend avec PostgreSQL
echo Demarrage du backend CERS...
echo Port: 9999
echo Base de donnees: PostgreSQL
echo Profil: postgresql
echo.

mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx256m -Xms128m -XX:MaxMetaspaceSize=128m" -Dspring-boot.run.profiles=postgresql

pause