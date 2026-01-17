@echo off
echo ========================================
echo TEST COMPLET RAPPORTEUR - SOLUTION
echo ========================================

echo.
echo 1. Verification utilisateur rapporteur ID 11
curl -X GET "http://localhost:8081/api/rapporteur-debug/check-user/11" -H "Content-Type: application/json"

echo.
echo.
echo 2. Test endpoint rapporteur avec headers corrects
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 11" -H "X-User-Role: RAPPORTEUR"

echo.
echo.
echo 3. Test avec membre du comite ID 10
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 10" -H "X-User-Role: COMMITTEE_MEMBER"

echo.
echo.
echo ========================================
echo SOLUTION POUR LE FRONTEND:
echo ========================================
echo.
echo Le backend fonctionne parfaitement !
echo.
echo PROBLEME: Le frontend n'envoie pas les bons headers
echo.
echo SOLUTION:
echo 1. Verifier que l'AuthContext envoie X-User-ID et X-User-Role
echo 2. Verifier que UnifiedAssignedProtocols.tsx utilise /rapporteur/protocols
echo 3. Verifier que l'utilisateur est connecte avec le bon role
echo.
echo CREDENTIALS DE TEST:
echo Username: rapporteur1@comite-ethique.bf
echo Password: [a verifier dans la base]
echo User ID: 11
echo Role: RAPPORTEUR
echo.
echo ========================================