@echo off
echo ===== TEST DES ENDPOINTS PRESIDENT =====
echo.

echo 1. Test de l'endpoint de test...
curl -X GET "http://localhost:8081/api/president/test" -H "Content-Type: application/json" -H "X-User-ID: 1" -H "X-User-Role: president"
echo.
echo.

echo 2. Test de l'endpoint deliberations...
curl -X GET "http://localhost:8081/api/president/deliberations" -H "Content-Type: application/json" -H "X-User-ID: 1" -H "X-User-Role: president"
echo.
echo.

echo 3. Test de l'endpoint assigned-protocols...
curl -X GET "http://localhost:8081/api/president/assigned-protocols" -H "Content-Type: application/json" -H "X-User-ID: 1" -H "X-User-Role: president"
echo.
echo.

echo ===== FIN DES TESTS =====
pause