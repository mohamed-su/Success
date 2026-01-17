package comite.demo.controller;

import comite.demo.entity.MemberEvaluationGrid;
import comite.demo.repository.MemberEvaluationGridRepository;
import comite.demo.service.MemberEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class EvaluationTestController {

    @Autowired
    private MemberEvaluationService memberEvaluationService;

    @Autowired
    private MemberEvaluationGridRepository memberEvaluationGridRepository;

    @PostMapping("/evaluation/simple")
    public ResponseEntity<?> testSimpleEvaluation() {
        try {
            System.out.println("=== TEST SIMPLE D'ÉVALUATION ===");
            
            // Créer des données de test
            Map<String, Object> testData = new HashMap<>();
            testData.put("decision", "APPROVE");
            testData.put("scientificQuality", 4);
            testData.put("ethicalCompliance", 5);
            testData.put("recommendations", "Test de persistance");
            testData.put("generalComments", "Évaluation de test");

            // Sauvegarder avec le service
            MemberEvaluationGrid savedGrid = memberEvaluationService.saveEvaluation(8L, 4L, testData);
            
            System.out.println("✅ Grille sauvegardée avec ID: " + savedGrid.getId());
            
            // Vérifier immédiatement en base
            long count = memberEvaluationGridRepository.count();
            System.out.println("✅ Nombre total de grilles en base: " + count);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Test réussi - Évaluation persistée",
                "evaluationId", savedGrid.getId(),
                "totalGridsInDB", count
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Erreur test: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/evaluation/count")
    public ResponseEntity<?> getEvaluationCount() {
        try {
            long total = memberEvaluationGridRepository.count();
            long submitted = memberEvaluationGridRepository.findByStatus("SUBMITTED").size();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "totalGrids", total,
                "submittedGrids", submitted
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}