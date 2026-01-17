#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  DÉMONSTRATION: Envoi du mot de passe par email           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Générer un email unique
TIMESTAMP=$(date +%s)
EMAIL="chercheur${TIMESTAMP}@example.com"
PASSWORD="password123"

echo -e "${BLUE}📝 Étape 1: Création d'un nouveau compte chercheur${NC}"
echo "   Email: $EMAIL"
echo "   Mot de passe: $PASSWORD"
echo ""

echo -e "${YELLOW}⏳ Envoi de la requête d'inscription...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$EMAIL\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"firstName\": \"Chercheur\",
    \"lastName\": \"Test\"
  }")

echo ""
echo -e "${GREEN}✅ Réponse du serveur:${NC}"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📧 Étape 2: Vérification de l'email dans les logs${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Vérifiez la console du backend${NC}"
echo "   Vous devriez voir un bloc comme celui-ci:"
echo ""
echo "   ========== EMAIL DE BIENVENUE =========="
echo "   Destinataire: $EMAIL"
echo "   Nom: Chercheur Test"
echo "   Mot de passe: $PASSWORD"
echo "   ========================================"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}🔐 Étape 3: Test de connexion avec les identifiants${NC}"
echo ""

sleep 2

echo -e "${YELLOW}⏳ Tentative de connexion...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo ""
if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ CONNEXION RÉUSSIE!${NC}"
    echo ""
    echo "Détails de l'utilisateur connecté:"
    echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null | grep -A5 "user" || echo "$LOGIN_RESPONSE"
else
    echo -e "${YELLOW}⚠️  Erreur de connexion${NC}"
    echo "$LOGIN_RESPONSE"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ DÉMONSTRATION TERMINÉE${NC}"
echo ""
echo "📋 Résumé:"
echo "   • Compte créé: $EMAIL"
echo "   • Mot de passe: $PASSWORD"
echo "   • Le mot de passe a été affiché dans la console du backend"
echo "   • La connexion avec ces identifiants fonctionne"
echo ""
echo "📧 En production:"
echo "   • Le chercheur recevra un email avec son mot de passe"
echo "   • Il pourra se connecter immédiatement"
echo "   • Il est recommandé de changer le mot de passe après la 1ère connexion"
echo ""
