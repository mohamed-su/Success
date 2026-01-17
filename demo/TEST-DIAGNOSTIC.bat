@echo off
echo ========================================
echo 🔍 DIAGNOSTIC MAPPING ÉVALUATION
echo ========================================
echo.

echo 📋 Envoi de données de test...
echo.

curl -X POST http://localhost:8081/api/evaluation/save ^
  -H "Content-Type: application/json" ^
  -d "{\"protocolId\":8,\"memberId\":11,\"protocolFrench\":\"TEST_OUI\",\"cvSigned\":\"TEST_OUI\",\"consentForm\":\"TEST_OUI\",\"insurance\":\"TEST_OUI\",\"paymentProof\":\"TEST_OUI\",\"investigatorQualified\":\"TEST_INVESTIGATEUR\",\"associatedInvestigators\":\"TEST_ASSOCIES\",\"studyJustification\":\"TEST_JUSTIFICATION\",\"methodology\":\"TEST_METHODOLOGIE\",\"budget\":\"TEST_BUDGET\",\"investigationProduct\":\"TEST_PRODUIT\",\"comparatorProduct\":\"TEST_COMPARATEUR\",\"concomitantProduct\":\"TEST_CONCOMITANT\",\"decision\":\"Favorable\",\"observations\":\"TEST_OBSERVATIONS\",\"evaluatorName\":\"Dr. Test\"}"

echo.
echo.
echo 🔍 INSTRUCTIONS:
echo 1. Regardez les logs du backend Spring Boot
echo 2. Cherchez les lignes qui commencent par "Grille après mapping"
echo 3. Vérifiez si vous voyez "TEST_OUI" au lieu de "null"
echo.
echo Si vous voyez encore "null", le problème persiste.
echo Si vous voyez "TEST_OUI", le mapping fonctionne !
echo.

pause