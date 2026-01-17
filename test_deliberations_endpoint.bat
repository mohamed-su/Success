@echo off
echo ========================================
echo Test de l'endpoint /deliberations ameliore
echo ========================================

echo.
echo 1. Test de l'endpoint /deliberations avec toutes les informations
curl -X GET "http://localhost:8081/api/president/deliberations" -H "Content-Type: application/json" -H "X-User-ID: 1" -H "X-User-Role: president"

echo.
echo.
echo ========================================
echo Test termine
echo ========================================
pause