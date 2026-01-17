@echo off
echo ========================================
echo 🚀 TEST DU SYSTÈME D'ÉVALUATION CORRIGÉ
echo ========================================
echo.

echo 📋 ÉTAPES DU TEST:
echo 1. Vérification que le backend est démarré
echo 2. Test de l'endpoint /api/evaluation/submit
echo 3. Vérification du mapping des données
echo 4. Ouverture du formulaire de test
echo.

echo ⏳ Test de connexion au backend...
curl -s http://localhost:8081/api/evaluation/test > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERREUR: Le backend n'est pas démarré sur le port 8081
    echo.
    echo 💡 SOLUTION:
    echo    1. Ouvrez un terminal dans le dossier demo/
    echo    2. Exécutez: mvn spring-boot:run
    echo    3. Attendez que le serveur démarre
    echo    4. Relancez ce script
    echo.
    pause
    exit /b 1
)

echo ✅ Backend connecté !
echo.

echo 🧪 Test de l'endpoint /submit avec données d'exemple...
curl -X POST http://localhost:8081/api/evaluation/submit ^
  -H "Content-Type: application/json" ^
  -d "{\"protocolId\":8,\"memberId\":11,\"protocoleEnFrancaisFourni\":true,\"cvInvestigateursFournis\":true,\"noteInformationFournie\":true,\"certificatAssuranceFourni\":true,\"piecesJustificativesFournies\":true,\"investigateurQualifieOui\":true,\"justificationInvestigateur\":\"Test investigateur\",\"investigateursAssociesPerinentsOui\":true,\"justificationPertinenteOui\":true,\"methodologieSolideOui\":true,\"budgetAproprieOui\":true,\"produitEssaiPerinenceOui\":true,\"committeeOpinion\":\"FAVORABLE\",\"resumeObservations\":\"Test mapping\"}"

echo.
echo.

echo 📊 VÉRIFICATION DES LOGS:
echo Consultez la console du backend pour voir:
echo - "=== DÉBUT MAPPING DES DONNÉES ==="
echo - "Mapping protocolFrench: Oui" (et non "null")
echo - "VÉRIFICATION APRÈS MAPPING:"
echo - "grid.getProtocolFrench() = Oui"
echo.

echo 🌐 Ouverture du formulaire de test interactif...
start test-evaluation-mapping.html

echo.
echo 📋 CHECKLIST DE VÉRIFICATION:
echo.
echo ☐ 1. Le backend affiche "Mapping protocolFrench: Oui" (pas null)
echo ☐ 2. Le backend affiche "grid.getProtocolFrench() = Oui" 
echo ☐ 3. L'évaluation est sauvegardée avec un ID
echo ☐ 4. Le formulaire HTML fonctionne sans erreur
echo ☐ 5. Les données s'affichent correctement dans la grille rapporteur
echo.

echo 🎯 PROCHAINES ÉTAPES:
echo 1. Testez avec le formulaire HTML ouvert
echo 2. Vérifiez les logs du backend
echo 3. Allez dans Rapporteur > Grille pour voir les données
echo 4. Vérifiez qu'il n'y a plus de "undefined"
echo.

echo ✅ Test terminé ! Consultez les logs pour les détails.
pause