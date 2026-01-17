@echo off
echo ========================================
echo TEST DU SYSTEME D'EVALUATION CORRIGE
echo ========================================

echo.
echo 1. Test de creation d'evaluation...
curl -X POST http://localhost:8081/api/protocol-evaluation/protocol/8/evaluator/1/submit ^
  -H "Content-Type: application/json" ^
  -d "{\"protocolFrench\":\"Oui\",\"cvSigned\":\"Oui\",\"consentForm\":\"Oui\",\"insurance\":\"Oui\",\"paymentProof\":\"Oui\",\"investigatorQualified\":\"Oui\",\"investigatorExplanation\":\"Investigateur qualifie\",\"associatedInvestigators\":\"Oui\",\"studyJustification\":\"Oui\",\"methodology\":\"Oui\",\"budget\":\"Oui\",\"decision\":\"Favorable\",\"observations\":\"Evaluation positive\",\"comments\":\"{\\\"1\\\":\\\"Tous les documents sont conformes\\\"}\",\"submit\":true}"

echo.
echo.
echo 2. Test de recuperation des grilles...
curl -X GET http://localhost:8081/api/protocol-evaluation/protocol/8/grids

echo.
echo.
echo 3. Test de debug...
curl -X GET http://localhost:8081/api/protocol-evaluation/debug/protocol/8

echo.
echo.
echo 4. Verification des tables...
echo Connectez-vous a PostgreSQL et executez:
echo SELECT COUNT(*) FROM protocol_evaluation_criteria;
echo SELECT COUNT(*) FROM evaluation_pdfs;

echo.
echo ========================================
echo TESTS TERMINES
echo ========================================
pause