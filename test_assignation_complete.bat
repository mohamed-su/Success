@echo off
echo ========================================
echo TEST ASSIGNATION PRESIDENT -> RAPPORTEUR
echo ========================================

echo.
echo 1. Etat initial - Protocoles du rapporteur ID 11
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 11" -H "X-User-Role: RAPPORTEUR"

echo.
echo.
echo 2. Simulation assignation par le president (Protocole 5 -> Rapporteur 11)
curl -X POST "http://localhost:8081/api/president/auto-assignment/bulk-assign" ^
  -H "Content-Type: application/json" ^
  -H "X-User-ID: 3" ^
  -H "X-User-Role: president" ^
  -d "{\"protocolIds\": [5], \"memberIds\": [11]}"

echo.
echo.
echo 3. Verification - Protocoles du rapporteur ID 11 apres assignation
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 11" -H "X-User-Role: RAPPORTEUR"

echo.
echo.
echo 4. Verification des assignations dans les deux tables
curl -X GET "http://localhost:8081/api/rapporteur-debug/all-assignments" -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo TEST TERMINE
echo ========================================