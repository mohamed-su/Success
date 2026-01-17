V@echo off
echo ========================================
echo Test des endpoints Rapporteur
echo ========================================

echo.
echo 1. Test avec COMMITTEE_MEMBER (ID: 10)
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 10" -H "X-User-Role: COMMITTEE_MEMBER"

echo.
echo.
echo 2. Test avec RAPPORTEUR (ID: 11)
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 11" -H "X-User-Role: RAPPORTEUR"

echo.
echo.
echo 3. Test avec rapporteur en minuscules (ID: 11)
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 11" -H "X-User-Role: rapporteur"

echo.
echo.
echo 4. Test d'accès non autorisé (sans headers)
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json"

echo.
echo.
echo 5. Vérification de toutes les assignations
curl -X GET "http://localhost:8081/api/rapporteur-debug/all-assignments" -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo Tests terminés
echo ========================================