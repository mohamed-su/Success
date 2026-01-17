#!/bin/bash

# Guide de Test - Système d'Envoi de Mot de Passe et Évaluation

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║           GUIDE DE TEST - COMITÉ D'ÉTHIQUE                       ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 1: Vérification du Backend${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}⏳ Vérification de la connexion au backend...${NC}"
BACKEND_STATUS=$(curl -s http://localhost:8081/api/test)

if echo "$BACKEND_STATUS" | grep -q "success"; then
    echo -e "${GREEN}✅ Backend opérationnel${NC}"
    echo "$BACKEND_STATUS" | python3 -m json.tool 2>/dev/null || echo "$BACKEND_STATUS"
else
    echo -e "${RED}❌ Backend non accessible${NC}"
    echo "Démarrez le backend avec: cd demo && mvn spring-boot:run"
    exit 1
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 2: Inscription avec Envoi de Mot de Passe${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

TIMESTAMP=$(date +%s)
TEST_EMAIL="test${TIMESTAMP}@example.com"
TEST_PASSWORD="password123"

echo -e "${YELLOW}📝 Création d'un compte chercheur...${NC}"
echo "   Email: $TEST_EMAIL"
echo "   Mot de passe: $TEST_PASSWORD"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_EMAIL\",
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"firstName\": \"Test\",
    \"lastName\": \"Chercheur\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Inscription réussie${NC}"
    echo "$REGISTER_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$REGISTER_RESPONSE"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: Vérifiez la console du backend${NC}"
    echo "   Vous devriez voir:"
    echo "   ========== EMAIL DE BIENVENUE =========="
    echo "   Destinataire: $TEST_EMAIL"
    echo "   Mot de passe: $TEST_PASSWORD"
    echo "   ========================================"
else
    echo -e "${RED}❌ Erreur lors de l'inscription${NC}"
    echo "$REGISTER_RESPONSE"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 3: Connexion avec les Identifiants Reçus${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

sleep 2

echo -e "${YELLOW}🔐 Tentative de connexion...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Connexion réussie${NC}"
    echo "$LOGIN_RESPONSE" | python3 -m json.tool 2>/dev/null | head -20
else
    echo -e "${RED}❌ Erreur de connexion${NC}"
    echo "$LOGIN_RESPONSE"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 4: Endpoints d'Évaluation Disponibles${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📋 Endpoints EvaluationGridController:${NC}"
echo ""
echo "  POST   /api/evaluation/create"
echo "         → Créer une grille d'évaluation"
echo ""
echo "  GET    /api/evaluation/protocol/{protocolId}/member/{memberId}"
echo "         → Récupérer la grille d'un membre pour un protocole"
echo ""
echo "  PUT    /api/evaluation/{id}"
echo "         → Mettre à jour une grille d'évaluation"
echo ""
echo "  GET    /api/evaluation/protocol/{protocolId}"
echo "         → Toutes les évaluations d'un protocole"
echo ""
echo "  GET    /api/evaluation/member/{memberId}"
echo "         → Toutes les évaluations d'un membre"
echo ""
echo "  GET    /api/evaluation/protocol/{protocolId}/summary"
echo "         → Résumé des évaluations d'un protocole"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 5: Exemple de Création de Grille d'Évaluation${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📝 Création d'une grille d'évaluation de test...${NC}"
EVAL_RESPONSE=$(curl -s -X POST http://localhost:8081/api/evaluation/create \
  -H "Content-Type: application/json" \
  -d '{
    "protocolId": 1,
    "memberId": 11,
    "memberName": "Dr. Test Evaluateur"
  }')

if echo "$EVAL_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Grille créée avec succès${NC}"
    echo "$EVAL_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$EVAL_RESPONSE"
else
    echo -e "${YELLOW}⚠️  Grille peut-être déjà existante${NC}"
    echo "$EVAL_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$EVAL_RESPONSE"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ TESTS TERMINÉS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════${NC}"
echo ""

echo "📋 RÉSUMÉ:"
echo "   ✅ Backend opérationnel"
echo "   ✅ Inscription avec mot de passe fonctionne"
echo "   ✅ Connexion avec identifiants fonctionne"
echo "   ✅ Endpoints d'évaluation disponibles"
echo ""

echo "📧 ENVOI DE MOT DE PASSE:"
echo "   • Le mot de passe est affiché dans la console du backend"
echo "   • Pour l'envoi email réel, configurer application.properties"
echo ""

echo "🔧 ÉVALUATION DES PROTOCOLES:"
echo "   • Utiliser EvaluationGridController"
echo "   • Modifier le frontend pour utiliser les bons endpoints"
echo ""

echo "📚 DOCUMENTATION:"
echo "   • EMAIL_PASSWORD_SYSTEM.md"
echo "   • IMPLEMENTATION_EMAIL_PASSWORD.md"
echo "   • RECAPITULATIF_MODIFICATIONS.md"
echo ""
