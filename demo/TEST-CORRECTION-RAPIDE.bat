@echo off
echo ========================================
echo 🔧 TEST CORRECTION MAPPING ÉVALUATION
echo ========================================
echo.

echo 📋 Test avec les données exactes du log...
echo.

curl -X POST http://localhost:8081/api/evaluation/save ^
  -H "Content-Type: application/json" ^
  -d "{\"protocolId\":8,\"memberId\":11,\"protocolFrench\":\"Oui\",\"cvSigned\":\"Oui\",\"consentForm\":\"Oui\",\"insurance\":\"Oui\",\"paymentProof\":\"Oui\",\"investigatorQualified\":\"Investigateur qualifié\",\"investigatorExplanation\":\"Test\",\"associatedInvestigators\":\"Équipe qualifiée\",\"studyJustification\":\"Justification solide\",\"methodology\":\"Méthodologie rigoureuse\",\"budget\":\"Budget approprié\",\"investigationProduct\":\"Produit conforme\",\"comparatorProduct\":\"Comparateur approprié\",\"concomitantProduct\":\"Produits autorisés\",\"decision\":\"Favorable\",\"observations\":\"Test mapping\",\"evaluatorName\":\"Dr. Test\",\"submit\":true}"

echo.
echo.
echo 🔍 VÉRIFIEZ LES LOGS DU BACKEND:
echo.
echo ✅ Vous devriez voir:
echo    "Grille après mapping - protocolFrench: Oui"
echo    "Grille après mapping - investigatorQualified: Investigateur qualifié"
echo.
echo ❌ Au lieu de:
echo    "Grille après mapping - protocolFrench: null"
echo    "Grille après mapping - investigatorQualified: null"
echo.

pause