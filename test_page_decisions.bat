@echo off
echo ========================================
echo Test page decisions rapporteur
echo ========================================

echo.
echo 1. Protocoles assignes au membre 11 (Dr. Salimata OUATTARA)
curl -X GET "http://localhost:8081/api/rapporteur/protocols" -H "Content-Type: application/json" -H "X-User-ID: 11" -H "X-User-Role: RAPPORTEUR"

echo.
echo.
echo 2. Grilles evaluation protocole 13 (doit avoir une grille)
curl -X GET "http://localhost:8081/api/protocol-evaluation/protocol/13/grids" -H "Content-Type: application/json"

echo.
echo.
echo 3. Grilles evaluation protocole 12 (peut etre vide)
curl -X GET "http://localhost:8081/api/protocol-evaluation/protocol/12/grids" -H "Content-Type: application/json"

echo.
echo.
echo ========================================
echo RESULTAT: La page http://localhost:5173/dashboard/rapporteur/decisions
echo devrait maintenant afficher 4 protocoles reels au lieu des 2 de test
echo ========================================