package comite.demo.controller;

import comite.demo.entity.MemberEvaluationGrid;
import comite.demo.service.MemberEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/force-persist")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ForcePersistController {

    @Autowired
    private MemberEvaluationService memberEvaluationService;

    @PostMapping("/evaluation")
    @Transactional
    public ResponseEntity<?> forcePersistEvaluation(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("🔥 FORCE PERSISTANCE DÉMARRÉE");
            System.out.println("Données reçues: " + request);

            // Extraire les données obligatoires
            Long protocolId = Long.valueOf(request.get("protocolId").toString());
            Long memberId = Long.valueOf(request.get("memberId").toString());
            String decision = (String) request.get("decision");

            System.out.println("ProtocolId: " + protocolId + ", MemberId: " + memberId + ", Decision: " + decision);

            // Validation stricte
            if (decision == null || decision.trim().isEmpty()) {
                System.err.println("❌ DÉCISION MANQUANTE - ARRÊT");
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Décision obligatoire manquante"
                ));
            }

            // Préparer les données
            Map<String, Object> evaluationData = new HashMap<>();
            evaluationData.put("decision", decision);
            evaluationData.put("recommendations", request.get("recommendations"));
            evaluationData.put("generalComments", request.get("generalComments"));
            evaluationData.put("scientificQuality", 4);
            evaluationData.put("ethicalCompliance", 5);

            System.out.println("🔥 APPEL SERVICE AVEC DONNÉES: " + evaluationData);

            // FORCER LA PERSISTANCE
            MemberEvaluationGrid savedGrid = memberEvaluationService.saveEvaluation(
                protocolId, memberId, evaluationData
            );

            System.out.println("✅ PERSISTANCE RÉUSSIE !");
            System.out.println("✅ INSERT INTO member_evaluation_grids ID: " + savedGrid.getId());
            System.out.println("✅ Status: " + savedGrid.getStatus());
            System.out.println("✅ Decision: " + savedGrid.getDecision());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "✅ PERSISTANCE FORCÉE RÉUSSIE !",
                "evaluationId", savedGrid.getId(),
                "protocolId", protocolId,
                "memberId", memberId,
                "decision", savedGrid.getDecision(),
                "status", savedGrid.getStatus()
            ));

        } catch (Exception e) {
            System.err.println("❌ ERREUR FORCE PERSISTANCE: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur force persistance: " + e.getMessage(),
                "stackTrace", e.getStackTrace()
            ));
        }
    }

    @GetMapping("/test-protocol/{protocolId}")
    public ResponseEntity<?> testProtocolPersistence(@PathVariable Long protocolId) {
        try {
            System.out.println("🧪 TEST PERSISTANCE PROTOCOLE " + protocolId);

            // Créer une évaluation de test
            Map<String, Object> testData = new HashMap<>();
            testData.put("decision", "APPROVE");
            testData.put("recommendations", "Test de persistance automatique");
            testData.put("generalComments", "Évaluation générée pour test");
            testData.put("scientificQuality", 4);
            testData.put("ethicalCompliance", 5);

            // Forcer la persistance avec un membre de test
            Long testMemberId = 999L;
            MemberEvaluationGrid savedGrid = memberEvaluationService.saveEvaluation(
                protocolId, testMemberId, testData
            );

            System.out.println("✅ TEST RÉUSSI - ID: " + savedGrid.getId());

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Test persistance réussi",
                "testEvaluationId", savedGrid.getId(),
                "protocolId", protocolId
            ));

        } catch (Exception e) {
            System.err.println("❌ ERREUR TEST: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}