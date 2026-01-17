#!/bin/bash

echo "=== Test des Endpoints Backend ==="

BASE_URL="http://localhost:8081"

echo "1. Test de santé du backend..."
curl -s "$BASE_URL/api/test/health" | jq '.' || echo "Endpoint non disponible"

echo -e "\n2. Test de la liste des protocoles..."
curl -s "$BASE_URL/api/test/protocols" | jq '.' || echo "Endpoint non disponible"

echo -e "\n3. Test du ResearcherController..."
curl -s "$BASE_URL/api/researcher/test" | jq '.' || echo "Endpoint non disponible"

echo -e "\n4. Test de récupération d'un protocole..."
curl -s "$BASE_URL/api/researcher/protocols/1?userIdentifier=moamoa33944" | jq '.' || echo "Endpoint non disponible"

echo -e "\n5. Test de mise à jour d'un protocole..."
curl -s -X PUT "$BASE_URL/api/researcher/protocols/1/update?userIdentifier=moamoa33944" \
  -H "Content-Type: application/json" \
  -d '{"title":"Titre mis à jour","description":"Description mise à jour"}' | jq '.' || echo "Endpoint non disponible"

echo -e "\n6. Test des protocoles secrétaire..."
curl -s "$BASE_URL/api/secretary/protocols" | jq '.' || echo "Endpoint non disponible"

echo -e "\n=== Tests terminés ==="