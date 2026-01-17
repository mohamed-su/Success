#!/bin/bash

echo "=== DIAGNOSTIC EMAIL SYSTEM ==="
echo ""

# Test de l'API backend
echo "1. Test de l'API backend..."
curl -X GET http://localhost:8081/api/researcher/test
echo ""
echo ""

# Test d'envoi d'email
echo "2. Test d'envoi d'email..."
curl -X POST http://localhost:8081/api/researcher/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
echo ""
echo ""

# Vérifier les logs du backend
echo "3. Vérification des logs récents..."
echo "Regardez les logs du backend pour voir si l'email a été traité."
echo ""

echo "=== POINTS À VÉRIFIER ==="
echo "1. Configuration SMTP dans application.properties"
echo "2. Service EmailService correctement injecté"
echo "3. Méthode sendProtocolSubmissionConfirmation implémentée"
echo "4. Logs d'erreur dans la console du backend"
echo ""

echo "=== CONFIGURATION EMAIL ACTUELLE ==="
echo "Host: smtp.gmail.com"
echo "Port: 587"
echo "Username: ouedraogomohamedamine98@gmail.com"
echo "Password: [MASQUÉ]"
echo ""

echo "Si les emails ne sont toujours pas envoyés, vérifiez :"
echo "- Que le mot de passe d'application Gmail est correct"
echo "- Que l'authentification à 2 facteurs est activée sur Gmail"
echo "- Que les paramètres de sécurité Gmail autorisent les applications moins sécurisées"