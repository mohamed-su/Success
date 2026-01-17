@echo off
echo ========================================
echo TEST SYSTEME GENERATION PDF EVALUATIONS
echo ========================================

echo.
echo 1. Test de l'endpoint de test...
curl -X GET "http://localhost:8080/api/evaluation/test" -H "Content-Type: application/json"

echo.
echo.
echo 2. Test de soumission d'evaluation avec generation PDF...
curl -X POST "http://localhost:8080/api/evaluation/save" ^
  -H "Content-Type: application/json" ^
  -d "{\"protocolId\": 1, \"memberId\": 1, \"evaluatorName\": \"Dr. Test PDF\", \"decision\": \"Favorable\", \"observations\": \"Test de generation PDF automatique\"}"

echo.
echo.
echo 3. Verification des grilles avec PDF pour protocole 1...
curl -X GET "http://localhost:8080/api/evaluation/protocol/1/grids-with-pdf" -H "Content-Type: application/json"

echo.
echo.
echo 4. Test de generation manuelle de PDF pour grille ID 1...
curl -X POST "http://localhost:8080/api/evaluation/grid/1/generate-pdf" -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo TESTS TERMINES
echo ========================================
echo.
echo Verifiez le dossier uploads/evaluation-grids/ pour les PDFs generes
echo.
pause