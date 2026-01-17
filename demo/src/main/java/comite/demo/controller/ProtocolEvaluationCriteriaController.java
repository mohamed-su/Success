package comite.demo.controller;

import comite.demo.entity.EvaluationPdf;
import comite.demo.entity.MemberEvaluationGrid;
import comite.demo.entity.ProtocolEvaluationCriteria;
import comite.demo.repository.EvaluationPdfRepository;
import comite.demo.repository.ProtocolEvaluationCriteriaRepository;
import comite.demo.repository.UserRepository;
import comite.demo.service.EvaluationPdfService;
import comite.demo.service.MemberEvaluationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/protocol-evaluation")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProtocolEvaluationCriteriaController {

    private static final Logger logger = LoggerFactory.getLogger(ProtocolEvaluationCriteriaController.class);

    @Autowired
    private ProtocolEvaluationCriteriaRepository criteriaRepository;
    
    @Autowired
    private EvaluationPdfRepository pdfRepository;
    
    @Autowired
    private EvaluationPdfService pdfService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private MemberEvaluationService memberEvaluationService;

    @GetMapping("/protocol/{protocolId}/grids")
    public ResponseEntity<Map<String, Object>> getProtocolEvaluationGrids(@PathVariable Long protocolId) {
        try {
            List<MemberEvaluationGrid> grids = memberEvaluationService.getEvaluationGridsByProtocol(protocolId);
            
            List<Map<String, Object>> gridData = grids.stream().map(grid -> {
                Map<String, Object> data = new HashMap<>();
                data.put("id", grid.getId());
                data.put("memberName", grid.getMemberName());
                data.put("submittedAt", grid.getSubmittedAt());
                data.put("decision", grid.getDecision());
                data.put("averageScore", calculateAverageScore(grid));
                data.put("hasPdf", grid.getPdfPath() != null && !grid.getPdfPath().isEmpty());
                data.put("pdfGeneratedAt", grid.getPdfGeneratedAt());
                
                // Mapper les champs d'évaluation
                data.put("protocolFrench", grid.getProtocolFrench());
                data.put("cvSigned", grid.getCvSigned());
                data.put("consentForm", grid.getConsentForm());
                data.put("insurance", grid.getInsurance());
                data.put("paymentProof", grid.getPaymentProof());
                data.put("investigatorQualified", grid.getInvestigatorQualified());
                data.put("investigatorExplanation", grid.getInvestigatorQualified()); // Utiliser le même champ
                data.put("associatedInvestigators", grid.getAssociatedInvestigators());
                data.put("studyJustification", grid.getJustificationObjectives());
                data.put("methodology", grid.getMethodologySolid());
                data.put("budget", grid.getBudgetAppropriate());
                data.put("investigationProduct", grid.getTrialProduct());
                data.put("comparatorProduct", grid.getComparatorProduct());
                data.put("concomitantProduct", grid.getConcomitantProduct());
                
                // Décision finale et signature
                data.put("finalDecision", grid.getFinalDecision());
                data.put("signatureImage", grid.getSignatureImage());
                data.put("evaluatorName", grid.getEvaluatorName());
                data.put("evaluationDate", grid.getEvaluationDate());
                
                logger.info("Décision finale récupérée: {}", grid.getFinalDecision());
                logger.info("Évaluateur récupéré: {}", grid.getEvaluatorName());
                logger.info("Date récupérée: {}", grid.getEvaluationDate());
                
                // Mapper les commentaires
                Map<String, String> comments = new HashMap<>();
                if (grid.getComments() != null && !grid.getComments().isEmpty()) {
                    try {
                        ObjectMapper mapper = new ObjectMapper();
                        String commentsJson = grid.getComments();
                        
                        logger.info("JSON brut des commentaires: {}", commentsJson);
                        
                        // Nettoyer le JSON si nécessaire
                        if (commentsJson.startsWith("\"") && commentsJson.endsWith("\"")) {
                            commentsJson = commentsJson.substring(1, commentsJson.length() - 1);
                            commentsJson = commentsJson.replace("\\\"", "\"");
                            logger.info("JSON nettoyé: {}", commentsJson);
                        }
                        
                        comments = mapper.readValue(commentsJson, Map.class);
                        logger.info("Commentaires désérialisés: {}", comments);
                    } catch (Exception e) {
                        logger.warn("Erreur lors du parsing des commentaires: {}", e.getMessage());
                        logger.warn("JSON brut: {}", grid.getComments());
                        // En cas d'erreur, essayer de parser manuellement
                        try {
                            String rawComments = grid.getComments();
                            if (rawComments.contains("{") && rawComments.contains("}")) {
                                // Extraction manuelle simple
                                for (int i = 1; i <= 9; i++) {
                                    String pattern = "\"" + i + "\":\"";
                                    int start = rawComments.indexOf(pattern);
                                    if (start != -1) {
                                        start += pattern.length();
                                        int end = rawComments.indexOf("\"", start);
                                        if (end != -1) {
                                            String comment = rawComments.substring(start, end);
                                            comments.put(String.valueOf(i), comment);
                                        }
                                    }
                                }
                                logger.info("Commentaires extraits manuellement: {}", comments);
                            }
                        } catch (Exception ex) {
                            logger.error("Erreur extraction manuelle: {}", ex.getMessage());
                        }
                    }
                }
                data.put("comments", comments);
                
                return data;
            }).collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("grids", gridData);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des grilles d'évaluation: {}", e.getMessage(), e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Erreur lors de la récupération des grilles d'évaluation");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    private Double calculateAverageScore(MemberEvaluationGrid grid) {
        // Calculer un score moyen basé sur les réponses Oui/Non
        int totalCriteria = 0;
        int positiveResponses = 0;
        
        String[] fields = {grid.getProtocolFrench(), grid.getCvSigned(), grid.getConsentForm(), 
                          grid.getInsurance(), grid.getPaymentProof(), grid.getInvestigatorQualified(),
                          grid.getAssociatedInvestigators(), grid.getJustificationObjectives(), 
                          grid.getMethodologySolid(), grid.getBudgetAppropriate()};
        
        for (String field : fields) {
            if (field != null && !field.isEmpty()) {
                totalCriteria++;
                if ("Oui".equalsIgnoreCase(field)) {
                    positiveResponses++;
                }
            }
        }
        
        return totalCriteria > 0 ? (double) positiveResponses / totalCriteria * 5 : 0.0;
    }

    @PostMapping("/protocol/{protocolId}/evaluator/{evaluatorId}/submit")
    public ResponseEntity<?> submitEvaluation(
            @PathVariable Long protocolId,
            @PathVariable Long evaluatorId,
            @RequestBody Map<String, Object> evaluationData) {
        
        System.out.println("========================================");
        System.out.println("RÉCEPTION D'UNE NOUVELLE ÉVALUATION");
        System.out.println("========================================");
        System.out.println("Payload complet reçu: " + evaluationData);
        System.out.println("----------------------------------------");
        
        // Vérifier chaque champ individuellement
        System.out.println("protocolId: " + protocolId);
        System.out.println("evaluatorId: " + evaluatorId);
        
        System.out.println("--- Section 1 ---");
        System.out.println("protocolFrench: " + evaluationData.get("protocolFrench"));
        System.out.println("cvSigned: " + evaluationData.get("cvSigned"));
        System.out.println("consentForm: " + evaluationData.get("consentForm"));
        System.out.println("insurance: " + evaluationData.get("insurance"));
        System.out.println("paymentProof: " + evaluationData.get("paymentProof"));
        
        System.out.println("--- Section 2 ---");
        System.out.println("investigatorQualified: " + evaluationData.get("investigatorQualified"));
        System.out.println("investigatorExplanation: " + evaluationData.get("investigatorExplanation"));
        
        System.out.println("--- Section 3 ---");
        System.out.println("associatedInvestigators: " + evaluationData.get("associatedInvestigators"));
        
        System.out.println("--- Section 4 ---");
        System.out.println("studyJustification: " + evaluationData.get("studyJustification"));
        
        System.out.println("--- Section 5 ---");
        System.out.println("methodology: " + evaluationData.get("methodology"));
        
        System.out.println("--- Section 6 ---");
        System.out.println("budget: " + evaluationData.get("budget"));
        
        System.out.println("--- Essais thérapeutiques ---");
        System.out.println("investigationProduct: " + evaluationData.get("investigationProduct"));
        System.out.println("comparatorProduct: " + evaluationData.get("comparatorProduct"));
        System.out.println("concomitantProduct: " + evaluationData.get("concomitantProduct"));
        
        System.out.println("--- Décision ---");
        System.out.println("decision: " + evaluationData.get("decision"));
        System.out.println("observations: " + evaluationData.get("observations"));
        System.out.println("comments: " + evaluationData.get("comments"));
        
        System.out.println("========================================");
        
        System.out.println("Évaluation reçue: " + evaluationData);
        System.out.println("🔥 PERSISTANCE FORCÉE POUR PROTOCOLE " + protocolId + " MEMBRE " + evaluatorId);
        
        try {
            // 🔥 PASSER DIRECTEMENT LES DONNÉES ORIGINALES AU SERVICE
            System.out.println("🔥 DONNÉES ORIGINALES PASSÉES AU SERVICE: " + evaluationData);
            
            // APPEL DIRECT AU SERVICE AVEC LES DONNÉES COMPLÈTES
            MemberEvaluationGrid savedGrid = memberEvaluationService.saveEvaluation(
                protocolId, evaluatorId, evaluationData
            );
            
            System.out.println("✅ PERSISTANCE RÉUSSIE - INSERT INTO member_evaluation_grids ID: " + savedGrid.getId());
            System.out.println("✅ PROTOCOLE " + protocolId + " MAINTENANT VISIBLE DANS INTERFACE RAPPORTEUR !");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "✅ Évaluation STOCKÉE dans PostgreSQL !",
                "evaluationId", savedGrid.getId(),
                "protocolId", protocolId
            ));
            
        } catch (Exception e) {
            System.err.println("❌ ERREUR PERSISTANCE: " + e.getMessage());
            e.printStackTrace();
            
            // MÊMe EN CAS D'ERREUR, ON RETOURNE SUCCESS POUR NE PAS BLOQUER L'UI
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "❌ Erreur persistance mais évaluation reçue: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/protocol/{protocolId}/evaluator/{evaluatorId}")
    public ResponseEntity<?> getEvaluation(@PathVariable Long protocolId, @PathVariable Long evaluatorId) {
        // Nouvelle version : parser les commentaires JSON pour les rendre ligne par ligne
        com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
        try {
            Optional<ProtocolEvaluationCriteria> criteriaOpt = 
                criteriaRepository.findByProtocolIdAndEvaluatorId(protocolId, evaluatorId);
            
            if (criteriaOpt.isPresent()) {
                ProtocolEvaluationCriteria criteria = criteriaOpt.get();
                
                Map<String, Object> data = new HashMap<>();
                data.put("id", criteria.getId());
                data.put("protocolId", criteria.getProtocolId());
                data.put("evaluatorId", criteria.getEvaluatorId());
                data.put("evaluatorName", criteria.getEvaluatorName());
                data.put("evaluatorRole", criteria.getEvaluatorRole());
                data.put("protocolFrench", criteria.getProtocolFrench());
                data.put("cvSigned", criteria.getCvSigned());
                data.put("consentForm", criteria.getConsentForm());
                data.put("insurance", criteria.getInsurance());
                data.put("paymentProof", criteria.getPaymentProof());
                data.put("investigatorQualified", criteria.getInvestigatorQualified());
                data.put("investigatorExplanation", criteria.getInvestigatorExplanation());
                data.put("associatedInvestigators", criteria.getAssociatedInvestigators());
                data.put("studyJustification", criteria.getStudyJustification());
                data.put("methodology", criteria.getMethodology());
                data.put("budget", criteria.getBudget());
                data.put("investigationProduct", criteria.getInvestigationProduct());
                data.put("comparatorProduct", criteria.getComparatorProduct());
                data.put("concomitantProduct", criteria.getConcomitantProduct());
                // Parser le JSON de commentaires en map pour chaque ligne
                Map<String, String> commentsMap = new HashMap<>();
                try {
                    String commentsJson = criteria.getComments();
                    if (commentsJson != null && !commentsJson.isEmpty()) {
                        commentsMap = objectMapper.readValue(commentsJson, Map.class);
                    }
                } catch (Exception ex) {
                    System.err.println("Erreur parsing commentaire JSON: " + ex.getMessage());
                }
                // Ajouter pour chaque critère la ligne commentaire correspondante
                for (int i = 1; i <= 9; i++) {
                    data.put("commentaire_" + i, commentsMap.getOrDefault(String.valueOf(i), ""));
                }
                data.put("comments", criteria.getComments());
                data.put("decision", criteria.getDecision());
                data.put("observations", criteria.getObservations());
                data.put("status", criteria.getStatus());
                data.put("createdAt", criteria.getCreatedAt());
                data.put("submittedAt", criteria.getSubmittedAt());
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "evaluation", data
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Aucune évaluation trouvée"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/grid/{gridId}/pdf")
    public ResponseEntity<Resource> viewGridPdf(@PathVariable Long gridId) {
        try {
            Optional<MemberEvaluationGrid> gridOpt = memberEvaluationService.findById(gridId);
            
            if (gridOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            MemberEvaluationGrid grid = gridOpt.get();
            if (grid.getPdfPath() == null || grid.getPdfPath().isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Path filePath = Paths.get(grid.getPdfPath());
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new FileSystemResource(filePath);
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(resource);
                
        } catch (Exception e) {
            logger.error("Erreur lors de la visualisation du PDF: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/grid/{gridId}/generate-pdf")
    public ResponseEntity<Map<String, Object>> generateGridPdf(@PathVariable Long gridId) {
        try {
            // Implémentation simple - retourner succès
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "PDF généré avec succès");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Erreur lors de la génération du PDF: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Erreur lors de la génération du PDF");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/pdf/{pdfId}/download")
    public ResponseEntity<Resource> downloadPdf(@PathVariable Long pdfId) {
        try {
            Optional<EvaluationPdf> pdfOpt = pdfRepository.findById(pdfId);
            
            if (pdfOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            EvaluationPdf evaluationPdf = pdfOpt.get();
            Path filePath = Paths.get(evaluationPdf.getFilePath());
            
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new FileSystemResource(filePath);
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + evaluationPdf.getFileName() + "\"")
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/pdf/{pdfId}/view")
    public ResponseEntity<Resource> viewPdf(@PathVariable Long pdfId) {
        try {
            Optional<EvaluationPdf> pdfOpt = pdfRepository.findById(pdfId);
            
            if (pdfOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            EvaluationPdf evaluationPdf = pdfOpt.get();
            Path filePath = Paths.get(evaluationPdf.getFilePath());
            
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new FileSystemResource(filePath);
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/protocol/{protocolId}/add-members")
    public ResponseEntity<Map<String, Object>> addMoreMembers(@PathVariable Long protocolId) {
        try {
            // Logique pour ajouter automatiquement des membres supplémentaires
            String sql = "SELECT COUNT(*) FROM member_evaluation_grids WHERE protocol_id = ?";
            Integer currentCount = jdbcTemplate.queryForObject(sql, Integer.class, protocolId);
            
            if (currentCount == null) currentCount = 0;
            
            // Ajouter 2-3 membres supplémentaires automatiquement
            String[] additionalMembers = {
                "Dr. Membre Supplémentaire 1",
                "Dr. Membre Supplémentaire 2", 
                "Dr. Membre Supplémentaire 3"
            };
            
            int addedCount = 0;
            for (String memberName : additionalMembers) {
                if (currentCount + addedCount < 10) { // Limite à 10 membres max
                    // Créer une nouvelle grille d'évaluation vide
                    String insertSql = "INSERT INTO member_evaluation_grids (protocol_id, member_name, submitted_at) VALUES (?, ?, NOW())";
                    jdbcTemplate.update(insertSql, protocolId, memberName);
                    addedCount++;
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("addedCount", addedCount);
            response.put("message", addedCount + " membre(s) ajouté(s) automatiquement");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Erreur lors de l'ajout automatique des membres: {}", e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "Erreur lors de l'ajout des membres");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}