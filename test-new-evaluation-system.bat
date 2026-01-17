@echo off
echo ========================================
echo TEST DU SYSTEME D'EVALUATION CORRIGE
echo ========================================

echo.
echo 1. Test de soumission d'evaluation avec la nouvelle API...
curl -X POST "http://localhost:8081/api/protocol-evaluation/protocol/8/evaluator/4/submit" ^
  -H "Content-Type: application/json" ^
  -d "{\"protocolFrench\":\"Oui\",\"cvSigned\":\"Oui\",\"consentForm\":\"Oui\",\"insurance\":\"Oui\",\"paymentProof\":\"Oui\",\"investigatorQualified\":\"Oui\",\"investigatorExplanation\":\"Investigateur qualifie avec experience\",\"associatedInvestigators\":\"Oui\",\"studyJustification\":\"Oui\",\"methodology\":\"Oui\",\"budget\":\"Oui\",\"decision\":\"Favorable\",\"observations\":\"Protocole bien concu et conforme\",\"comments\":\"{\\\"1\\\":\\\"Documents complets\\\",\\\"2\\\":\\\"Investigateur experimente\\\"}\",\"submit\":true}"

echo.
echo.
echo 2. Test de recuperation des grilles avec la nouvelle API...
curl -X GET "http://localhost:8081/api/protocol-evaluation/protocol/8/grids"

echo.
echo.
echo 3. Test de debug pour verifier les donnees...
curl -X GET "http://localhost:8081/api/protocol-evaluation/debug/protocol/8"

echo.
echo.
echo ========================================
echo TESTS TERMINES
echo ========================================
echo.
echo Si vous voyez des donnees JSON, le systeme fonctionne !
echo Vous pouvez maintenant tester dans l'interface web.
echo.
pause