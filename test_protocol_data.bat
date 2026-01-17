@echo off
echo ========================================
echo Test des donnees protocole
echo ========================================

echo.
echo 1. Test endpoint chercheur decisions
curl -X GET "http://localhost:8081/api/researcher/decisions" -H "Content-Type: application/json" -H "X-User-ID: 1" -H "X-User-Role: researcher"

echo.
echo.
echo 2. Test deliberations president
curl -X GET "http://localhost:8081/api/president/deliberations" -H "Content-Type: application/json" -H "X-User-ID: 1" -H "X-User-Role: president"

echo.
echo ========================================
echo Tests termines
echo ========================================