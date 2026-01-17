@echo off
echo ========================================
echo TEST CORRECTIONS FRONTEND
echo ========================================

echo.
echo 1. Test backend - Rapporteur ID 11 avec role RAPPORTEUR
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 11" -H "X-User-Role: RAPPORTEUR"

echo.
echo.
echo 2. Test backend - Membre ID 10 avec role COMMITTEE_MEMBER  
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 10" -H "X-User-Role: COMMITTEE_MEMBER"

echo.
echo.
echo 3. Verification des assignations existantes
curl -X GET "http://localhost:8081/api/rapporteur-debug/all-assignments" -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo INSTRUCTIONS POUR TESTER LE FRONTEND:
echo ========================================
echo.
echo 1. Ouvrez la console du navigateur (F12)
echo 2. Connectez-vous avec: rapporteur1@comite-ethique.bf
echo 3. Verifiez les logs dans la console:
echo    - "Endpoint choisi: /rapporteur/protocols"
echo    - "Headers envoyes: X-User-ID: 11, X-User-Role: RAPPORTEUR"
echo    - "Reponse du serveur: {success: true, protocols: [...]}"
echo    - "Protocoles recus: 2"
echo.
echo Si vous voyez ces logs, le frontend fonctionne !
echo.
echo ========================================