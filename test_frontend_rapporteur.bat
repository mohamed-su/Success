@echo off
echo ========================================
echo Test de connexion et protocoles rapporteur
echo ========================================

echo.
echo 1. Test de connexion rapporteur
curl -X POST "http://localhost:8081/api/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"rapporteur1@comite-ethique.bf\", \"password\": \"password123\"}"

echo.
echo.
echo 2. Test direct endpoint rapporteur avec ID 11
curl -X GET "http://localhost:8081/api/rapporteur/protocols" ^
  -H "Content-Type: application/json" ^
  -H "X-User-ID: 11" ^
  -H "X-User-Role: RAPPORTEUR"

echo.
echo.
echo 3. Test avec membre du comité ID 10
curl -X GET "http://localhost:8081/api/rapporteur/protocols" ^
  -H "Content-Type: application/json" ^
  -H "X-User-ID: 10" ^
  -H "X-User-Role: COMMITTEE_MEMBER"

echo.
echo.
echo ========================================
echo Tests terminés
echo ========================================