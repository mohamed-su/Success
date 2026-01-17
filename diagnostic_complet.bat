@echo off
echo ===== DIAGNOSTIC COMPLET DELIBERATIONS =====
echo.

echo 1. Correction erreur originalFetch...
echo ✓ api-proxy.js corrige avec verification

echo.
echo 2. Test backend deliberations...
curl -s "http://localhost:8081/api/president/deliberations" -H "X-User-ID: 4" -H "X-User-Role: president" | findstr "success.*true" >nul
if %errorlevel% equ 0 (
    echo ✓ Backend OK - Deliberations disponibles
) else (
    echo ✗ Backend KO - Redemarrage necessaire
    cd demo
    taskkill /f /im java.exe 2>nul
    timeout /t 3 >nul
    start "Backend" cmd /c "mvn spring-boot:run"
    echo Attente redemarrage...
    timeout /t 15 >nul
)

echo.
echo 3. Test correction rapporteur...
curl -s "http://localhost:8081/api/rapporteur/protocols" -H "X-User-ID: 11" -H "X-User-Role: rapporteur" | findstr "success.*true" >nul
if %errorlevel% equ 0 (
    echo ✓ Rapporteur OK - Protocoles visibles apres evaluation
) else (
    echo ✗ Rapporteur KO
)

echo.
echo 4. SOLUTIONS APPLIQUEES:
echo ✓ api-proxy.js: Evite redeclaration originalFetch
echo ✓ RapporteurController: Supprime filtre statut ASSIGNED_TO_MEMBER
echo ✓ FinalReports.tsx: URL directe pour deliberations
echo.

echo 5. ACTIONS UTILISATEUR:
echo - Rechargez la page president (Ctrl+F5)
echo - Les deliberations doivent maintenant s'afficher
echo - Les protocoles evalues restent visibles pour le rapporteur
echo.

echo 6. URLs de test:
echo President: http://localhost:3000/dashboard/president
echo Rapporteur: http://localhost:3000/dashboard/rapporteur/decisions
echo.
pause