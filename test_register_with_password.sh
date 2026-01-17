#!/bin/bash

echo "=========================================="
echo "Test d'inscription avec envoi de mot de passe"
echo "=========================================="
echo ""

# Créer un utilisateur de test
echo "1. Création d'un nouveau chercheur..."
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test.chercheur@example.com",
    "email": "test.chercheur@example.com",
    "password": "root",
    "firstName": "Test",
    "lastName": "Chercheur"
  }' | jq .

echo ""
echo "=========================================="
echo "Vérifiez les logs du backend pour voir l'email avec le mot de passe"
echo "=========================================="
