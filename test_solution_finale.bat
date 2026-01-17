@echo off
echo ========================================
echo SOLUTION FINALE - TEST RAPPORTEUR
echo ========================================

echo.
echo 1. Verification backend - Rapporteur ID 11
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 11" -H "X-User-Role: RAPPORTEUR"

echo.
echo.
echo ========================================
echo INSTRUCTIONS FINALES:
echo ========================================
echo.
echo 1. DEMARREZ LE FRONTEND:
echo    cd front
echo    npm run dev
echo.
echo 2. OUVREZ LE NAVIGATEUR:
echo    http://localhost:5173
echo.
echo 3. ALLEZ SUR LA PAGE DE DIAGNOSTIC:
echo    http://localhost:5173/rapporteur-diagnostic
echo.
echo 4. CONNECTEZ-VOUS AVEC:
echo    Email: rapporteur1@comite-ethique.bf
echo    Password: [mot de passe existant]
echo.
echo 5. VERIFIEZ LES RESULTATS:
echo    - currentUser.id = 11
echo    - currentUser.role = RAPPORTEUR
echo    - API Test success = true
echo    - protocolCount = 2
echo.
echo 6. ALLEZ SUR L'INTERFACE RAPPORTEUR:
echo    http://localhost:5173/dashboard/member/assigned
echo.
echo Si le diagnostic montre des erreurs, le probleme est:
echo - Soit l'authentification (mauvais utilisateur/mot de passe)
echo - Soit les headers ne sont pas envoyes correctement
echo.
echo ========================================