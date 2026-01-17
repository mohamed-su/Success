@echo off
echo Testing evaluation endpoints...

echo.
echo 1. Testing debug endpoint:
curl -X GET "http://localhost:8081/api/evaluation/debug/all-data" -H "Content-Type: application/json"

echo.
echo.
echo 2. Testing grids count for protocol 1:
curl -X GET "http://localhost:8081/api/evaluation/protocol/1/grids/count" -H "Content-Type: application/json"

echo.
echo.
echo 3. Testing grids for protocol 1:
curl -X GET "http://localhost:8081/api/evaluation/protocol/1/grids" -H "Content-Type: application/json"

echo.
echo.
echo Done.
pause