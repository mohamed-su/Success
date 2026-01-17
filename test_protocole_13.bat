@echo off
echo ========================================
echo Test protocole 13 - Grilles evaluation
echo ========================================

echo.
echo 1. Verification protocoles assignes au membre 11
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 11" -H "X-User-Role: RAPPORTEUR"

echo.
echo.
echo 2. Verification grilles evaluation protocole 13
curl -X GET "http://localhost:8081/api/protocol-evaluation/protocol/13/grids" -H "Content-Type: application/json"

echo.
echo.
echo 3. Verification assignations dans protocol_member_assignments
curl -X GET "http://localhost:8081/api/rapporteur-debug/all-assignments" -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo Test termine
echo ========================================