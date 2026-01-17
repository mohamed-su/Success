@echo off
echo ========================================
echo TEST CORRECTION GRILLE D'EVALUATION
echo ========================================

echo.
echo 1. Verification des donnees existantes...
curl -X GET "http://localhost:8081/api/evaluation/check-data" -H "Content-Type: application/json"

echo.
echo.
echo 2. Test soumission nouvelle evaluation...
curl -X POST "http://localhost:8081/api/evaluation/save" ^
-H "Content-Type: application/json" ^
-d "{\"protocolId\": 8, \"memberId\": 11, \"scientificQuality\": 5, \"ethicalCompliance\": 4, \"methodologyClarity\": 5, \"riskBenefitRatio\": 4, \"informedConsentQuality\": 5, \"decision\": \"APPROVE\", \"recommendations\": \"Protocole excellent\", \"generalComments\": \"Tres bon travail\"}"

echo.
echo.
echo 3. Verification apres soumission...
curl -X GET "http://localhost:8081/api/evaluation/protocol/8/grids" -H "Content-Type: application/json"

echo.
echo.
echo 4. Test endpoint rapporteur...
curl -X GET "http://localhost:8081/api/evaluation/protocol/8/grids-with-pdf" -H "Content-Type: application/json"

echo.
echo ========================================
echo TEST TERMINE
echo ========================================
pause