@echo off
echo Testing email system...

curl -X POST http://localhost:8081/api/researcher/test-email ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"ouedraogomohamedamine98@gmail.com\"}"

echo.
echo Test completed. Check the backend console for logs.
pause