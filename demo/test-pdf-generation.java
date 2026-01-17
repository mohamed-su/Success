import comite.demo.entity.MemberEvaluationGrid;
import comite.demo.service.EvaluationPdfService;
import java.time.LocalDateTime;

public class TestPdfGeneration {
    public static void main(String[] args) {
        try {
            // Créer une grille d'évaluation de test
            MemberEvaluationGrid testGrid = new MemberEvaluationGrid(1L, 1L, "Dr. Test Evaluateur");
            testGrid.setScientificQuality(4);
            testGrid.setEthicalCompliance(5);
            testGrid.setMethodologyClarity(3);
            testGrid.setRiskBenefitRatio(4);
            testGrid.setInformedConsentQuality(4);
            testGrid.setDataProtection(3);
            testGrid.setParticipantSafety(5);
            testGrid.setFeasibility(4);
            testGrid.setStrengths("Protocole bien structuré avec une méthodologie claire.");
            testGrid.setWeaknesses("Quelques aspects de sécurité pourraient être renforcés.");
            testGrid.setRecommendations("Réviser les procédures de sécurité avant approbation finale.");
            testGrid.setGeneralComments("Protocole prometteur avec un bon potentiel scientifique.");
            testGrid.setDecision("APPROVE");
            testGrid.setSubmittedAt(LocalDateTime.now());
            
            // Tester la génération PDF
            EvaluationPdfService pdfService = new EvaluationPdfService();
            String pdfPath = pdfService.generateEvaluationPdf(testGrid, "Étude sur l'efficacité du traitement XYZ");
            
            System.out.println("✅ PDF généré avec succès: " + pdfPath);
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors du test: " + e.getMessage());
            e.printStackTrace();
        }
    }
}