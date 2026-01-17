@echo off
echo ========================================
echo Test des grilles d'evaluation
echo ========================================

echo.
echo 1. Verification des grilles pour protocole 11
curl -X GET "http://localhost:8081/api/protocol-evaluation/protocol/11/grids" -H "Content-Type: application/json"

echo.
echo.
echo 2. Verification des grilles pour protocole 8  
curl -X GET "http://localhost:8081/api/protocol-evaluation/protocol/8/grids" -H "Content-Type: application/json"

echo.
echo.
echo 3. Verification des grilles pour protocole 5
curl -X GET "http://localhost:8081/api/protocol-evaluation/protocol/5/grids" -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo Test termine
echo ========================================