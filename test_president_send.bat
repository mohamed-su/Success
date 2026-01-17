@echo off
echo ========================================
echo Test du bouton Envoyer President
echo ========================================

echo.
echo 1. Test envoi deliberation ID 7
curl -X POST "http://localhost:8081/api/president/send-deliberation/7" -H "Content-Type: application/json" -H "X-User-ID: 1" -H "X-User-Role: president"

echo.
echo.
echo 2. Verification des deliberations chercheur
curl -X GET "http://localhost:8081/api/researcher/decisions" -H "Content-Type: application/json" -H "X-User-ID: 1" -H "X-User-Role: researcher"

echo.
echo ========================================
echo Tests termines
echo ========================================