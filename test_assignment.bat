@echo off
echo ========================================
echo Test d'assignation de protocoles
echo ========================================

echo.
echo Test d'assignation en bulk (President)
curl -X POST "http://localhost:8081/api/president/auto-assignment/bulk-assign" ^
-H "Content-Type: application/json" ^
-H "X-User-ID: 1" ^
-H "X-User-Role: president" ^
-d "{\"protocolIds\": [1, 2], \"memberIds\": [10, 11]}"

echo.
echo.
echo Verification des protocoles assignes aux rapporteurs
curl -X GET "http://localhost:8081/api/rapporteur/protocols" ^
-H "Content-Type: application/json" ^
-H "X-User-ID: 10" ^
-H "X-User-Role: COMMITTEE_MEMBER"

echo.
echo.
echo ========================================
echo Test termine
echo ========================================