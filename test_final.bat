@echo off
echo ===== TEST FINAL DELIBERATIONS =====
echo.

echo 1. Backend test...
curl -s "http://localhost:8081/api/president/deliberations" -H "X-User-ID: 1" -H "X-User-Role: president" | findstr "success.*true" >nul
if %errorlevel% equ 0 (
    echo ✓ Backend OK - Deliberations disponibles
) else (
    echo ✗ Backend KO
    exit /b 1
)

echo.
echo 2. Nombre de deliberations...
for /f %%i in ('curl -s "http://localhost:8081/api/president/deliberations" -H "X-User-ID: 1" -H "X-User-Role: president" ^| findstr /c "protocolid" ^| find /c "protocolid"') do set count=%%i
echo Nombre de deliberations: %count%

echo.
echo 3. SOLUTION APPLIQUEE:
echo - URL directe dans FinalReports.tsx
echo - Suppression des variables complexes
echo - Headers simplifies
echo.
echo 4. ACTIONS:
echo - Rechargez la page du navigateur (Ctrl+F5)
echo - Les deliberations doivent maintenant apparaitre
echo - Si probleme persiste, verifiez la console F12
echo.
echo ===== CORRECTION TERMINEE =====
pause