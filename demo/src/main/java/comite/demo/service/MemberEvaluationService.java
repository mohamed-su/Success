package comite.demo.service;

import comite.demo.entity.MemberEvaluationGrid;
import comite.demo.repository.MemberEvaluationGridRepository;
import comite.demo.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class MemberEvaluationService {

    @Autowired
    private MemberEvaluationGridRepository memberEvaluationGridRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EvaluationPdfService pdfService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<MemberEvaluationGrid> getEvaluationGridsByProtocol(Long protocolId) {
        return memberEvaluationGridRepository.findByProtocolId(protocolId);
    }
    
    public Optional<MemberEvaluationGrid> findById(Long id) {
        return memberEvaluationGridRepository.findById(id);
    }

    @Transactional
    public MemberEvaluationGrid saveEvaluation(Long protocolId, Long memberId, Map<String, Object> evaluationData) {
        System.out.println("=== DÉBUT SAUVEGARDE ÉVALUATION AVEC VALIDATION ===");
        System.out.println("ProtocolId: " + protocolId + ", MemberId: " + memberId);
        System.out.println("🔥 DONNÉES REÇUES PAR LE SERVICE: " + evaluationData);

        // Validation des champs obligatoires
        if (protocolId == null || memberId == null) {
            throw new IllegalArgumentException("ProtocolId et MemberId sont obligatoires");
        }

        // Récupérer le nom du membre
        String memberName = userRepository.findById(memberId)
            .map(user -> user.getFirstName() + " " + user.getLastName())
            .orElse("Membre inconnu");

        // Chercher une grille existante ou en créer une nouvelle
        MemberEvaluationGrid grid = memberEvaluationGridRepository
            .findByProtocolIdAndMemberId(protocolId, memberId)
            .orElse(new MemberEvaluationGrid(protocolId, memberId, memberName));

        // 🔥 MAPPING DIRECT DES DONNÉES ORIGINALES
        updateGridFromOriginalData(grid, evaluationData);
        
        // Soumettre la grille (change le statut à COMPLETED)
        grid.submit();
        
        // Sauvegarder EXPLICITEMENT
        System.out.println("Appel de memberEvaluationGridRepository.save()...");
        MemberEvaluationGrid savedGrid = memberEvaluationGridRepository.save(grid);
        
        // Forcer le flush pour s'assurer que l'INSERT est exécuté
        memberEvaluationGridRepository.flush();
        
        System.out.println("✅ Grille sauvegardée avec ID: " + savedGrid.getId());
        
        // GÉNÉRATION AUTOMATIQUE DU PDF
        try {
            String protocolTitle = getProtocolTitle(protocolId);
            String pdfPath = pdfService.generateEvaluationPdf(savedGrid, protocolTitle);
            
            // Mettre à jour le chemin du PDF
            savedGrid.setPdfPath(pdfPath);
            savedGrid.setPdfGeneratedAt(LocalDateTime.now());
            memberEvaluationGridRepository.save(savedGrid);
            
            System.out.println("✅ PDF généré: " + pdfPath);
        } catch (Exception e) {
            System.err.println("⚠️ Erreur génération PDF: " + e.getMessage());
            // Ne pas faire échouer la sauvegarde pour un problème de PDF
        }
        
        System.out.println("=== FIN SAUVEGARDE ÉVALUATION ===");
        
        return savedGrid;
    }
    
    private void updateGridFromOriginalData(MemberEvaluationGrid grid, Map<String, Object> data) {
        System.out.println("=== DÉBUT MAPPING DES DONNÉES ORIGINALES ===");
        
        // 🔥 MAPPING DIRECT DES CHAMPS ORIGINAUX
        String protocolFrench = (String) data.get("protocolFrench");
        String cvSigned = (String) data.get("cvSigned");
        String consentForm = (String) data.get("consentForm");
        String insurance = (String) data.get("insurance");
        String paymentProof = (String) data.get("paymentProof");
        String investigatorQualified = (String) data.get("investigatorQualified");
        String associatedInvestigators = (String) data.get("associatedInvestigators");
        String studyJustification = (String) data.get("studyJustification");
        String methodology = (String) data.get("methodology");
        String budget = (String) data.get("budget");
        String investigationProduct = (String) data.get("investigationProduct");
        String comparatorProduct = (String) data.get("comparatorProduct");
        String concomitantProduct = (String) data.get("concomitantProduct");
        String decision = (String) data.get("decision");
        String observations = (String) data.get("observations");
        
        // MAPPING DEPUIS LES DONNÉES DU FRONTEND
        if (protocolFrench == null) protocolFrench = "Évalué";
        if (cvSigned == null) cvSigned = "Évalué";
        if (consentForm == null) consentForm = "Évalué";
        if (insurance == null) insurance = "Évalué";
        if (paymentProof == null) paymentProof = "Évalué";
        if (investigatorQualified == null) investigatorQualified = "Évalué";
        if (associatedInvestigators == null) associatedInvestigators = "Évalué";
        if (studyJustification == null) studyJustification = "Évalué";
        if (methodology == null) methodology = "Évalué";
        if (budget == null) budget = "Évalué";
        if (investigationProduct == null) investigationProduct = "Évalué";
        if (comparatorProduct == null) comparatorProduct = "Évalué";
        if (concomitantProduct == null) concomitantProduct = "Évalué";
        if (observations == null) observations = (String) data.get("generalComments");
        
        System.out.println("🔥 MAPPING DIRECT:");
        System.out.println("protocolFrench: " + protocolFrench);
        System.out.println("cvSigned: " + cvSigned);
        System.out.println("consentForm: " + consentForm);
        System.out.println("insurance: " + insurance);
        System.out.println("paymentProof: " + paymentProof);
        System.out.println("investigatorQualified: " + investigatorQualified);
        System.out.println("associatedInvestigators: " + associatedInvestigators);
        System.out.println("studyJustification: " + studyJustification);
        System.out.println("methodology: " + methodology);
        System.out.println("budget: " + budget);
        System.out.println("investigationProduct: " + investigationProduct);
        System.out.println("comparatorProduct: " + comparatorProduct);
        System.out.println("concomitantProduct: " + concomitantProduct);
        System.out.println("decision: " + decision);
        
        // ASSIGNER LES VALEURS
        grid.setProtocolFrench(protocolFrench);
        grid.setCvSigned(cvSigned);
        grid.setConsentForm(consentForm);
        grid.setInsurance(insurance);
        grid.setPaymentProof(paymentProof);
        grid.setInvestigatorQualified(investigatorQualified);
        grid.setAssociatedInvestigators(associatedInvestigators);
        grid.setJustificationObjectives(studyJustification);
        grid.setMethodologySolid(methodology);
        grid.setBudgetAppropriate(budget);
        grid.setTrialProduct(investigationProduct);
        grid.setComparatorProduct(comparatorProduct);
        grid.setConcomitantProduct(concomitantProduct);
        
        // Mapper la décision
        if ("APPROVE".equals(decision)) {
            grid.setDecision("APPROVE");
        } else if ("REJECT".equals(decision)) {
            grid.setDecision("REJECT");
        } else if ("MAJOR_REVISION".equals(decision)) {
            grid.setDecision("MAJOR_REVISION");
        } else if ("MINOR_REVISION".equals(decision)) {
            grid.setDecision("MINOR_REVISION");
        } else {
            grid.setDecision("APPROVE"); // Valeur par défaut
        }
        
        // Commentaires
        grid.setGeneralComments(observations != null ? observations : (String) data.get("generalComments"));
        
        // CORRECTION: Mapper les recommandations depuis observations si pas fourni directement
        String recommendations = (String) data.get("recommendations");
        if (recommendations == null || recommendations.trim().isEmpty()) {
            recommendations = observations; // Utiliser observations comme recommandations
        }
        if (recommendations == null || recommendations.trim().isEmpty()) {
            recommendations = "Évaluation complétée"; // Valeur par défaut
        }
        grid.setRecommendations(recommendations);
        
        System.out.println("🔥 RECOMMANDATIONS FINALES: " + recommendations);
        
        grid.setStrengths((String) data.get("strengths"));
        grid.setWeaknesses((String) data.get("weaknesses"));
        
        // Décision finale et informations évaluateur
        grid.setFinalDecision(decision);
        if (data.get("evaluatorName") != null) {
            grid.setEvaluatorName((String) data.get("evaluatorName"));
        } else {
            // Utiliser le nom du membre si pas fourni
            grid.setEvaluatorName(grid.getMemberName());
        }
        
        // CORRECTION: Mapper la signature avec debug détaillé
        String signatureImage = (String) data.get("signatureImage");
        System.out.println("🔥 SIGNATURE REÇUE: " + (signatureImage != null ? "[PRÉSENTE - " + signatureImage.length() + " caractères]" : "[NULL]"));
        if (signatureImage != null) {
            System.out.println("🔥 DÉBUT SIGNATURE: " + signatureImage.substring(0, Math.min(50, signatureImage.length())));
        }
        grid.setSignatureImage(signatureImage);
        System.out.println("🔥 SIGNATURE STOCKÉE DANS GRID: " + (grid.getSignatureImage() != null ? "[PRÉSENTE]" : "[NULL]"));
        
        grid.setEvaluationDate(java.time.LocalDate.now());
        
        System.out.println("🔥 DÉCISION FINALE STOCKÉE: " + decision);
        System.out.println("🔥 ÉVALUATEUR: " + grid.getEvaluatorName());
        System.out.println("🔥 DATE: " + grid.getEvaluationDate());
        
        // Stocker les commentaires JSON
        if (data.get("comments") != null) {
            try {
                Object commentsObj = data.get("comments");
                String commentsJson;
                
                if (commentsObj instanceof String) {
                    // Déjà une chaîne JSON
                    commentsJson = (String) commentsObj;
                } else {
                    // Objet à sérialiser
                    ObjectMapper mapper = new ObjectMapper();
                    commentsJson = mapper.writeValueAsString(commentsObj);
                }
                
                grid.setComments(commentsJson);
                System.out.println("🔥 COMMENTAIRES JSON STOCKÉS: " + commentsJson);
            } catch (Exception e) {
                System.err.println("Erreur sérialisation commentaires: " + e.getMessage());
            }
        }
        
        // Scores obligatoires - utiliser les valeurs du frontend
        Integer scientificQuality = (Integer) data.get("scientificQuality");
        Integer ethicalCompliance = (Integer) data.get("ethicalCompliance");
        Integer methodologyClarity = (Integer) data.get("methodologyClarity");
        Integer riskBenefitRatio = (Integer) data.get("riskBenefitRatio");
        Integer informedConsentQuality = (Integer) data.get("informedConsentQuality");
        
        grid.setScientificQuality(scientificQuality != null && scientificQuality > 0 ? scientificQuality : 4);
        grid.setEthicalCompliance(ethicalCompliance != null && ethicalCompliance > 0 ? ethicalCompliance : 4);
        grid.setMethodologyClarity(methodologyClarity != null && methodologyClarity > 0 ? methodologyClarity : 4);
        grid.setRiskBenefitRatio(riskBenefitRatio != null && riskBenefitRatio > 0 ? riskBenefitRatio : 4);
        grid.setInformedConsentQuality(informedConsentQuality != null && informedConsentQuality > 0 ? informedConsentQuality : 4);
        
        grid.setUpdatedAt(LocalDateTime.now());
        
        System.out.println("=== FIN MAPPING DES DONNÉES ORIGINALES ===");
        System.out.println("🔥 VÉRIFICATION FINALE:");
        System.out.println("grid.getProtocolFrench() = " + grid.getProtocolFrench());
        System.out.println("grid.getCvSigned() = " + grid.getCvSigned());
        System.out.println("grid.getInvestigatorQualified() = " + grid.getInvestigatorQualified());
        System.out.println("grid.getDecision() = " + grid.getDecision());
        System.out.println("grid.getRecommendations() = " + grid.getRecommendations());
    }
    
    private String getProtocolTitle(Long protocolId) {
        try {
            return jdbcTemplate.queryForObject(
                "SELECT title FROM protocol_submissions WHERE id = ?", 
                String.class, 
                protocolId
            );
        } catch (Exception e) {
            return "Protocole " + protocolId;
        }
    }



    @Transactional(readOnly = true)
    public Optional<MemberEvaluationGrid> findEvaluation(Long protocolId, Long memberId) {
        return memberEvaluationGridRepository.findByProtocolIdAndMemberId(protocolId, memberId);
    }
    
    @Transactional(readOnly = true)
    public List<MemberEvaluationGrid> findCompletedEvaluations(Long protocolId) {
        return memberEvaluationGridRepository.findByProtocolIdAndStatus(protocolId, "COMPLETED");
    }
}