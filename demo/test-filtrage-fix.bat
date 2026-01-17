@echo off
echo ========================================
echo TEST CORRECTION FILTRAGE GRILLES
echo ========================================

echo.
echo 1. Test endpoint grids-with-pdf pour protocole 8...
curl -X GET "http://localhost:8081/api/evaluation/protocol/8/grids-with-pdf" -H "Content-Type: application/json"

echo.
echo.
echo 2. Test endpoint grids pour protocole 8...
curl -X GET "http://localhost:8081/api/evaluation/protocol/8/grids" -H "Content-Type: application/json"

echo.
echo.
echo 3. Test endpoint count pour protocole 8...
curl -X GET "http://localhost:8081/api/evaluation/protocol/8/grids/count" -H "Content-Type: application/json"

echo.
echo.
echo 4. Debug toutes les donnees...
curl -X GET "http://localhost:8081/api/evaluation/debug/all-data" -H "Content-Type: application/json"

echo.
echo ========================================
echo TEST TERMINE - Les grilles devraient maintenant etre visibles !
echo ========================================
pause