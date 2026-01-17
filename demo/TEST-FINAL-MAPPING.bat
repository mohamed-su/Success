@echo off
echo ========================================
echo ✅ TEST FINAL - MAPPING ÉVALUATION
echo ========================================
echo.

echo 🎯 Test avec données complètes...
echo.

curl -X POST http://localhost:8081/api/evaluation/save ^
  -H "Content-Type: application/json" ^
  -d "{\"protocolId\":8,\"memberId\":11,\"protocolFrench\":\"FINAL_OUI\",\"cvSigned\":\"FINAL_OUI\",\"consentForm\":\"FINAL_OUI\",\"insurance\":\"FINAL_OUI\",\"paymentProof\":\"FINAL_OUI\",\"investigatorQualified\":\"FINAL_INVESTIGATEUR_QUALIFIE\",\"associatedInvestigators\":\"FINAL_EQUIPE_ASSOCIEE\",\"studyJustification\":\"FINAL_JUSTIFICATION_SOLIDE\",\"methodology\":\"FINAL_METHODOLOGIE_RIGOUREUSE\",\"budget\":\"FINAL_BUDGET_APPROPRIE\",\"investigationProduct\":\"FINAL_PRODUIT_ESSAI\",\"comparatorProduct\":\"FINAL_PRODUIT_COMPARATEUR\",\"concomitantProduct\":\"FINAL_PRODUIT_CONCOMITANT\",\"decision\":\"Favorable\",\"observations\":\"FINAL_OBSERVATIONS_COMPLETES\",\"evaluatorName\":\"Dr. Test Final\"}"

echo.
echo.
echo ✅ RÉSULTAT ATTENDU:
echo.
echo Dans les logs du backend, vous devriez voir:
echo   🔥 MAPPING DIRECT:
echo   protocolFrench: FINAL_OUI
echo   cvSigned: FINAL_OUI
echo   investigatorQualified: FINAL_INVESTIGATEUR_QUALIFIE
echo   ...
echo   🔥 VÉRIFICATION FINALE:
echo   grid.getProtocolFrench() = FINAL_OUI
echo   grid.getCvSigned() = FINAL_OUI
echo   grid.getInvestigatorQualified() = FINAL_INVESTIGATEUR_QUALIFIE
echo.
echo ❌ Si vous voyez encore "null", redémarrez le backend !
echo.

echo 📋 PROCHAINES ÉTAPES:
echo 1. Redémarrez le backend Spring Boot
echo 2. Testez le formulaire d'évaluation complet
echo 3. Vérifiez la grille rapporteur
echo 4. Plus de "undefined" !
echo.

pause