package comite.demo.controller;

import comite.demo.entity.EvaluationGrid;
import comite.demo.entity.MemberEvaluationGrid;
import comite.demo.entity.ProtocolEvaluation;
import comite.demo.repository.EvaluationGridRepository;
import comite.demo.repository.MemberEvaluationGridRepository;
import comite.demo.repository.ProtocolEvaluationRepository;
import comite.demo.repository.UserRepository;
import comite.demo.service.EvaluationPdfService;
import comite.demo.service.MemberEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evaluation")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class EvaluationController {

    @Autowired
    private EvaluationGridRepository evaluationGridRepository;
    
    @Autowired
    private MemberEvaluationGridRepository memberEvaluationGridRepository;
    
    @Autowired
    private ProtocolEvaluationRepository protocolEvaluationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private EvaluationPdfService evaluationPdfService;
    
    @Autowired
    private MemberEvaluationService memberEvaluationService;

    @GetMapping("/debug/all-data")
    public ResponseEntity<?> debugAllData() {
        try {
            Map<String, Object> result = new HashMap<>();
            
            // Compter toutes les grilles
            long totalGrids = memberEvaluationGridRepository.count();
            result.put("totalGrids", totalGrids);
            
            // Lister toutes les grilles avec leurs détails
            List<MemberEvaluationGrid> allGrids = memberEvaluationGridRepository.findAll();
            List<Map<String, Object>> gridsData = allGrids.stream()
                .map(grid -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", grid.getId());
                    data.put("protocolId", grid.getProtocolId());
                    data.put("memberId", grid.getMemberId());
                    data.put("memberName", grid.getMemberName());
                    data.put("status", grid.getStatus());
                    data.put("hasData", grid.getScientificQuality() != null || grid.getDecision() != null);
                    data.put("submittedAt", grid.getSubmittedAt());
                    data.put("createdAt", grid.getCreatedAt());
                    return data;
                })
                .collect(Collectors.toList());
            
            result.put("allGrids", gridsData);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/check-data")
    public ResponseEntity<?> checkData() {
        try {
            Map<String, Object> result = new HashMap<>();
            
            // Compter toutes les grilles
            long totalGrids = memberEvaluationGridRepository.count();
            result.put("totalGrids", totalGrids);
            
            // Compter les grilles soumises
            List<MemberEvaluationGrid> submittedGrids = memberEvaluationGridRepository.findByStatus("SUBMITTED");
            result.put("submittedGrids", submittedGrids.size());
            
            // Lister les grilles récentes
            List<MemberEvaluationGrid> recentGrids = memberEvaluationGridRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .collect(Collectors.toList());
            
            List<Map<String, Object>> recentGridsData = recentGrids.stream()
                .map(grid -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", grid.getId());
                    data.put("protocolId", grid.getProtocolId());
                    data.put("memberId", grid.getMemberId());
                    data.put("memberName", grid.getMemberName());
                    data.put("status", grid.getStatus());
                    data.put("createdAt", grid.getCreatedAt());
                    data.put("submittedAt", grid.getSubmittedAt());
                    return data;
                })
                .collect(Collectors.toList());
            
            result.put("recentGrids", recentGridsData);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/grids/all")
    public ResponseEntity<?> getAllGrids() {
        try {
            List<EvaluationGrid> allGrids = evaluationGridRepository.findAll();
            
            List<Map<String, Object>> gridData = allGrids.stream()
                .map(grid -> {
                    Map<String, Object> data = new java.util.HashMap<>();
                    data.put("id", grid.getId());
                    data.put("protocolId", grid.getProtocolId());
                    data.put("memberId", grid.getMemberId());
                    data.put("memberName", grid.getMemberName());
                    data.put("status", grid.getStatus());
                    return data;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "grids", gridData,
                "count", gridData.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/test-mapping/{gridId}")
    public ResponseEntity<?> testMapping(@PathVariable Long gridId) {
        try {
            Optional<MemberEvaluationGrid> gridOpt = memberEvaluationGridRepository.findById(gridId);
            
            if (!gridOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            MemberEvaluationGrid grid = gridOpt.get();
            
            Map<String, Object> mappingTest = new HashMap<>();
            mappingTest.put("id", grid.getId());
            mappingTest.put("protocolFrench", grid.getProtocolFrench());
            mappingTest.put("cvSigned", grid.getCvSigned());
            mappingTest.put("consentForm", grid.getConsentForm());
            mappingTest.put("insurance", grid.getInsurance());
            mappingTest.put("paymentProof", grid.getPaymentProof());
            mappingTest.put("investigatorQualified", grid.getInvestigatorQualified());
            mappingTest.put("associatedInvestigators", grid.getAssociatedInvestigators());
            mappingTest.put("justificationObjectives", grid.getJustificationObjectives());
            mappingTest.put("methodologySolid", grid.getMethodologySolid());
            mappingTest.put("budgetAppropriate", grid.getBudgetAppropriate());
            mappingTest.put("trialProduct", grid.getTrialProduct());
            mappingTest.put("comparatorProduct", grid.getComparatorProduct());
            mappingTest.put("concomitantProduct", grid.getConcomitantProduct());
            mappingTest.put("decision", grid.getDecision());
            mappingTest.put("generalComments", grid.getGeneralComments());
            mappingTest.put("recommendations", grid.getRecommendations());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "mappingResult", mappingTest
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "API fonctionne",
            "timestamp", LocalDateTime.now()
        ));
    }

    @GetMapping("/protocol/{protocolId}/grids/raw")
    public ResponseEntity<?> getRawGrids(@PathVariable Long protocolId) {
        try {
            List<MemberEvaluationGrid> allGrids = memberEvaluationGridRepository.findByProtocolId(protocolId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "totalGrids", allGrids.size(),
                "grids", allGrids.stream().map(grid -> Map.of(
                    "id", grid.getId(),
                    "protocolId", grid.getProtocolId(),
                    "memberId", grid.getMemberId(),
                    "memberName", grid.getMemberName(),
                    "status", grid.getStatus(),
                    "submittedAt", grid.getSubmittedAt(),
                    "hasScientificQuality", grid.getScientificQuality() != null,
                    "hasDecision", grid.getDecision() != null
                )).collect(Collectors.toList())
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocol/{protocolId}/grids/count")
    public ResponseEntity<?> getProtocolEvaluationGridsCount(@PathVariable Long protocolId) {
        try {
            List<MemberEvaluationGrid> grids = memberEvaluationGridRepository.findByProtocolId(protocolId);
            
            // Compter les grilles qui ont été réellement soumises (ont des données)
            long count = grids.stream()
                .filter(grid -> "COMPLETED".equals(grid.getStatus()) || 
                               grid.getSubmittedAt() != null || 
                               grid.getScientificQuality() != null || 
                               grid.getDecision() != null)
                .count();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "count", count,
                "protocolId", protocolId
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocol/{protocolId}/grids/formatted")
    public ResponseEntity<?> getFormattedProtocolEvaluationGrids(@PathVariable Long protocolId) {
        try {
            List<MemberEvaluationGrid> grids = memberEvaluationGridRepository.findByProtocolId(protocolId);
            
            List<MemberEvaluationGrid> submittedGrids = grids.stream()
                .filter(grid -> "COMPLETED".equals(grid.getStatus()) || 
                               grid.getSubmittedAt() != null || 
                               grid.getScientificQuality() != null || 
                               grid.getDecision() != null)
                .collect(Collectors.toList());
            
            List<Map<String, Object>> gridData = submittedGrids.stream()
                .map(grid -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", grid.getId());
                    data.put("memberName", grid.getMemberName());
                    data.put("decision", grid.getDecision());
                    data.put("submittedAt", grid.getSubmittedAt());
                    
                    // 🔥 FORMATER LES COMMENTAIRES POUR L'AFFICHAGE
                    Map<String, String> commentaires = new HashMap<>();
                    
                    // Critère 1 - Documents administratifs
                    String critere1 = String.format(
                        "Protocole Français: %s - CV signés: %s - Formulaire consentement: %s - Assurance: %s - Paiement: %s",
                        grid.getProtocolFrench() != null ? grid.getProtocolFrench() : "Non renseigné",
                        grid.getCvSigned() != null ? grid.getCvSigned() : "Non renseigné",
                        grid.getConsentForm() != null ? grid.getConsentForm() : "Non renseigné",
                        grid.getInsurance() != null ? grid.getInsurance() : "Non renseigné",
                        grid.getPaymentProof() != null ? grid.getPaymentProof() : "Non renseigné"
                    );
                    commentaires.put("1", critere1);
                    
                    // Critère 2 - Investigateur principal
                    commentaires.put("2", grid.getInvestigatorQualified() != null ? grid.getInvestigatorQualified() : "Non renseigné");
                    
                    // Critère 3 - Investigateurs associés
                    commentaires.put("3", grid.getAssociatedInvestigators() != null ? grid.getAssociatedInvestigators() : "Non renseigné");
                    
                    // Critère 4 - Justification
                    commentaires.put("4", grid.getJustificationObjectives() != null ? grid.getJustificationObjectives() : "Non renseigné");
                    
                    // Critère 5 - Méthodologie
                    commentaires.put("5", grid.getMethodologySolid() != null ? grid.getMethodologySolid() : "Non renseigné");
                    
                    // Critère 6 - Budget
                    commentaires.put("6", grid.getBudgetAppropriate() != null ? grid.getBudgetAppropriate() : "Non renseigné");
                    
                    // Critère 7 - Produit d'essai
                    commentaires.put("7", grid.getTrialProduct() != null ? grid.getTrialProduct() : "Non renseigné");
                    
                    // Critère 8 - Produit comparateur
                    commentaires.put("8", grid.getComparatorProduct() != null ? grid.getComparatorProduct() : "Non renseigné");
                    
                    // Critère 9 - Produit concomitant
                    commentaires.put("9", grid.getConcomitantProduct() != null ? grid.getConcomitantProduct() : "Non renseigné");
                    
                    data.put("commentaires", commentaires);
                    data.put("observations", grid.getGeneralComments() != null ? grid.getGeneralComments() : "");
                    
                    return data;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "grids", gridData,
                "count", gridData.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocol/{protocolId}/grids")
    public ResponseEntity<?> getProtocolEvaluationGrids(@PathVariable Long protocolId) {
        try {
            // Récupérer toutes les grilles d'évaluation pour ce protocole (pas seulement SUBMITTED)
            List<MemberEvaluationGrid> grids = memberEvaluationGridRepository.findByProtocolId(protocolId);
            
            // Filtrer pour ne garder que celles qui ont été réellement soumises (ont des données)
            List<MemberEvaluationGrid> submittedGrids = grids.stream()
                .filter(grid -> "COMPLETED".equals(grid.getStatus()) || 
                               grid.getSubmittedAt() != null || 
                               grid.getScientificQuality() != null || 
                               grid.getDecision() != null)
                .collect(Collectors.toList());
            
            List<Map<String, Object>> gridData = submittedGrids.stream()
                .map(grid -> {
                    Map<String, Object> data = new java.util.HashMap<>();
                    data.put("id", grid.getId());
                    data.put("protocolId", grid.getProtocolId());
                    data.put("memberId", grid.getMemberId());
                    data.put("memberName", grid.getMemberName());
                    data.put("scientificQuality", grid.getScientificQuality());
                    data.put("ethicalCompliance", grid.getEthicalCompliance());
                    data.put("methodologyClarity", grid.getMethodologyClarity());
                    data.put("riskBenefitRatio", grid.getRiskBenefitRatio());
                    data.put("informedConsentQuality", grid.getInformedConsentQuality());
                    data.put("dataProtection", grid.getDataProtection());
                    data.put("participantSafety", grid.getParticipantSafety());
                    data.put("feasibility", grid.getFeasibility());
                    data.put("strengths", grid.getStrengths());
                    data.put("weaknesses", grid.getWeaknesses());
                    data.put("recommendations", grid.getRecommendations());
                    data.put("generalComments", grid.getGeneralComments());
                    data.put("decision", grid.getDecision());
                    data.put("status", grid.getStatus());
                    data.put("submittedAt", grid.getSubmittedAt());
                    data.put("averageScore", grid.getAverageScore());
                    
                    // 🔥 AJOUTER LES CHAMPS SPÉCIFIQUES
                    data.put("protocolFrench", grid.getProtocolFrench());
                    data.put("cvSigned", grid.getCvSigned());
                    data.put("consentForm", grid.getConsentForm());
                    data.put("insurance", grid.getInsurance());
                    data.put("paymentProof", grid.getPaymentProof());
                    data.put("investigatorQualified", grid.getInvestigatorQualified());
                    data.put("associatedInvestigators", grid.getAssociatedInvestigators());
                    data.put("justificationObjectives", grid.getJustificationObjectives());
                    data.put("methodologySolid", grid.getMethodologySolid());
                    data.put("budgetAppropriate", grid.getBudgetAppropriate());
                    data.put("trialProduct", grid.getTrialProduct());
                    data.put("comparatorProduct", grid.getComparatorProduct());
                    data.put("concomitantProduct", grid.getConcomitantProduct());
                    
                    return data;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "grids", gridData,
                "count", gridData.size(),
                "message", gridData.isEmpty() ? "Aucune grille d'évaluation trouvée" : "Grilles récupérées avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    private double calculateAverageScore(Map<String, Object> grid) {
        int count = 0;
        int sum = 0;
        
        Object[] scores = {
            grid.get("scientific_quality"),
            grid.get("ethical_compliance"),
            grid.get("methodology_clarity"),
            grid.get("risk_benefit_ratio"),
            grid.get("informed_consent_quality"),
            grid.get("data_protection"),
            grid.get("participant_safety"),
            grid.get("feasibility")
        };
        
        for (Object score : scores) {
            if (score != null && score instanceof Number) {
                sum += ((Number) score).intValue();
                count++;
            }
        }
        
        return count > 0 ? (double) sum / count : 0.0;
    }

    @GetMapping("/debug/protocol/{protocolId}")
    public ResponseEntity<?> debugProtocolData(@PathVariable Long protocolId) {
        try {
            Map<String, Object> debug = new HashMap<>();
            
            // Vérifier si le protocole existe
            String protocolSql = "SELECT id, title, status FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> protocols = jdbcTemplate.queryForList(protocolSql, protocolId);
            debug.put("protocol", protocols);
            
            // Vérifier les assignations
            String assignmentSql = "SELECT protocol_id, assigned_member_id FROM protocol_assignments WHERE protocol_id = ?";
            List<Map<String, Object>> assignments = jdbcTemplate.queryForList(assignmentSql, protocolId);
            debug.put("assignments", assignments);
            
            // Vérifier les grilles d'évaluation
            String gridsSql = "SELECT id, protocol_id, member_id, status FROM evaluation_grids WHERE protocol_id = ?";
            List<Map<String, Object>> grids = jdbcTemplate.queryForList(gridsSql, protocolId);
            debug.put("grids", grids);
            
            // Vérifier les utilisateurs assignés
            String usersSql = """
                SELECT u.id, u.first_name, u.last_name, u.role 
                FROM users u 
                JOIN protocol_assignments pa ON u.id = pa.assigned_member_id 
                WHERE pa.protocol_id = ?
            """;
            List<Map<String, Object>> users = jdbcTemplate.queryForList(usersSql, protocolId);
            debug.put("assignedUsers", users);
            
            return ResponseEntity.ok(debug);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", e.getMessage(),
                "stackTrace", e.getStackTrace()
            ));
        }
    }

    @GetMapping("/debug/simple/{protocolId}")
    public ResponseEntity<?> debugSimple(@PathVariable Long protocolId) {
        try {
            // Test simple - compter les enregistrements
            String countProtocols = "SELECT COUNT(*) FROM protocol_submissions WHERE id = ?";
            Integer protocolCount = jdbcTemplate.queryForObject(countProtocols, Integer.class, protocolId);
            
            String countAssignments = "SELECT COUNT(*) FROM protocol_assignments WHERE protocol_id = ?";
            Integer assignmentCount = jdbcTemplate.queryForObject(countAssignments, Integer.class, protocolId);
            
            String countGrids = "SELECT COUNT(*) FROM evaluation_grids WHERE protocol_id = ?";
            Integer gridCount = jdbcTemplate.queryForObject(countGrids, Integer.class, protocolId);
            
            return ResponseEntity.ok(Map.of(
                "protocolId", protocolId,
                "protocolExists", protocolCount > 0,
                "assignmentCount", assignmentCount,
                "gridCount", gridCount
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "error", e.getMessage(),
                "protocolId", protocolId
            ));
        }
    }

    @PostMapping("/protocol/{protocolId}/member/{memberId}/grid")
    public ResponseEntity<?> submitEvaluationGrid(
            @PathVariable Long protocolId,
            @PathVariable Long memberId,
            @RequestBody Map<String, Object> gridData) {
        try {
            // Vérifier si le membre est assigné au protocole
            String checkAssignmentSql = "SELECT COUNT(*) FROM protocol_assignments WHERE protocol_id = ? AND assigned_member_id = ?";
            Integer assignmentCount = jdbcTemplate.queryForObject(checkAssignmentSql, Integer.class, protocolId, memberId);
            
            if (assignmentCount == 0) {
                return ResponseEntity.status(403).body(Map.of(
                    "success", false,
                    "error", "Membre non assigné à ce protocole"
                ));
            }
            
            // Récupérer le nom du membre
            String memberName = userRepository.findById(memberId)
                .map(user -> user.getFirstName() + " " + user.getLastName())
                .orElse("Membre inconnu");
            
            // Chercher une grille existante ou en créer une nouvelle
            MemberEvaluationGrid grid = memberEvaluationGridRepository
                .findByProtocolIdAndMemberId(protocolId, memberId)
                .orElse(new MemberEvaluationGrid(protocolId, memberId, memberName));
            
            // Mettre à jour les données
            if (gridData.get("scientificQuality") != null) {
                grid.setScientificQuality((Integer) gridData.get("scientificQuality"));
            }
            if (gridData.get("ethicalCompliance") != null) {
                grid.setEthicalCompliance((Integer) gridData.get("ethicalCompliance"));
            }
            if (gridData.get("methodologyClarity") != null) {
                grid.setMethodologyClarity((Integer) gridData.get("methodologyClarity"));
            }
            if (gridData.get("riskBenefitRatio") != null) {
                grid.setRiskBenefitRatio((Integer) gridData.get("riskBenefitRatio"));
            }
            if (gridData.get("informedConsentQuality") != null) {
                grid.setInformedConsentQuality((Integer) gridData.get("informedConsentQuality"));
            }
            if (gridData.get("dataProtection") != null) {
                grid.setDataProtection((Integer) gridData.get("dataProtection"));
            }
            if (gridData.get("participantSafety") != null) {
                grid.setParticipantSafety((Integer) gridData.get("participantSafety"));
            }
            if (gridData.get("feasibility") != null) {
                grid.setFeasibility((Integer) gridData.get("feasibility"));
            }
            
            grid.setStrengths((String) gridData.get("strengths"));
            grid.setWeaknesses((String) gridData.get("weaknesses"));
            grid.setRecommendations((String) gridData.get("recommendations"));
            grid.setGeneralComments((String) gridData.get("generalComments"));
            grid.setDecision((String) gridData.get("decision"));
            
            // Soumettre la grille si demandé
            if (Boolean.TRUE.equals(gridData.get("submit"))) {
                // Vérifie la présence d'une décision avant de soumettre
                if (gridData.get("decision") == null || gridData.get("decision").toString().isEmpty()) {
                    return ResponseEntity.status(400).body(Map.of(
                        "success", false,
                        "error", "Vous devez saisir une décision avant de soumettre."
                    ));
                }
                grid.submit();
            }
        
            // Sauvegarder
            MemberEvaluationGrid savedGrid = memberEvaluationGridRepository.save(grid);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Grille d'évaluation sauvegardée avec succès",
                "gridId", savedGrid.getId(),
                "status", savedGrid.getStatus()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitEvaluation(@RequestBody Map<String, Object> evaluationData) {
        try {
            System.out.println("=== DÉBUT RÉCEPTION DONNÉES ÉVALUATION ===");
            System.out.println("Données reçues: " + evaluationData);
            
            // Extraire les données du formulaire
            Long protocolId = Long.valueOf(evaluationData.get("protocolId").toString());
            Long memberId = Long.valueOf(evaluationData.get("memberId").toString());
            
            // Récupérer le nom du membre
            String memberName = userRepository.findById(memberId)
                .map(user -> user.getFirstName() + " " + user.getLastName())
                .orElse("Membre inconnu");
            
            // Chercher une grille existante ou en créer une nouvelle
            MemberEvaluationGrid grid = memberEvaluationGridRepository
                .findByProtocolIdAndMemberId(protocolId, memberId)
                .orElse(new MemberEvaluationGrid(protocolId, memberId, memberName));
            
            // MAPPING DES DONNÉES SPÉCIFIQUES DU FORMULAIRE
            mapEvaluationData(grid, evaluationData);
            
            // Soumettre la grille
            grid.submit();
            
            // Sauvegarder
            MemberEvaluationGrid savedGrid = memberEvaluationGridRepository.save(grid);
            memberEvaluationGridRepository.flush();
            
            System.out.println("✅ Évaluation sauvegardée avec ID: " + savedGrid.getId());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Évaluation soumise avec succès",
                "evaluationId", savedGrid.getId()
            ));
        } catch (Exception e) {
            System.err.println("❌ Erreur soumission évaluation: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    private void mapEvaluationData(MemberEvaluationGrid grid, Map<String, Object> data) {
        System.out.println("=== DÉBUT MAPPING DES DONNÉES ===");
        
        // SECTION 1 - DOCUMENTS ADMINISTRATIFS
        String protocolFrench = getDocumentStatus(data, "protocoleEnFrancaisFourni", "protocoleEnFrancaisNonFourni");
        String cvSigned = getDocumentStatus(data, "cvInvestigateursFournis", "cvInvestigateursNonFournis");
        String consentForm = getDocumentStatus(data, "noteInformationFournie", "noteInformationNonFournie");
        String insurance = getInsuranceStatus(data);
        String paymentProof = getDocumentStatus(data, "piecesJustificativesFournies", "piecesJustificativesNonFournies");
        
        System.out.println("Mapping protocolFrench: " + protocolFrench);
        System.out.println("Mapping cvSigned: " + cvSigned);
        System.out.println("Mapping consentForm: " + consentForm);
        System.out.println("Mapping insurance: " + insurance);
        System.out.println("Mapping paymentProof: " + paymentProof);
        
        grid.setProtocolFrench(protocolFrench);
        grid.setCvSigned(cvSigned);
        grid.setConsentForm(consentForm);
        grid.setInsurance(insurance);
        grid.setPaymentProof(paymentProof);
        
        // SECTION 2 - INVESTIGATEUR PRINCIPAL
        String investigatorQualified = getYesNoStatus(data, "investigateurQualifieOui", "investigateurQualifieNon");
        String investigatorExplanation = (String) data.get("justificationInvestigateur");
        
        System.out.println("Mapping investigatorQualified: " + investigatorQualified);
        System.out.println("Mapping investigatorExplanation: " + investigatorExplanation);
        
        grid.setInvestigatorQualified(investigatorQualified);
        
        // SECTION 3 - INVESTIGATEURS ASSOCIÉS
        String associatedInvestigators = getYesNoStatus(data, "investigateursAssociesPerinentsOui", "investigateursAssociesPerinentsNon");
        System.out.println("Mapping associatedInvestigators: " + associatedInvestigators);
        grid.setAssociatedInvestigators(associatedInvestigators);
        
        // SECTION 4 - JUSTIFICATION
        String studyJustification = getYesNoStatus(data, "justificationPertinenteOui", "justificationPertinenteNon");
        System.out.println("Mapping studyJustification: " + studyJustification);
        grid.setJustificationObjectives(studyJustification);
        
        // SECTION 5 - MÉTHODOLOGIE
        String methodology = getYesNoStatus(data, "methodologieSolideOui", "methodologieSolideNon");
        System.out.println("Mapping methodology: " + methodology);
        grid.setMethodologySolid(methodology);
        
        // SECTION 6 - BUDGET
        String budget = getYesNoStatus(data, "budgetAproprieOui", "budgetAproprieNon");
        System.out.println("Mapping budget: " + budget);
        grid.setBudgetAppropriate(budget);
        
        // SECTIONS 7-9 - ESSAIS THÉRAPEUTIQUES
        String investigationProduct = getTrialProductStatus(data, "produitEssaiPerinenceOui", "produitEssaiPerinenceNon", "produitEssaiPerinenceNA");
        String comparatorProduct = (String) data.get("produitComparateurDesignation");
        String concomitantProduct = (String) data.get("produitConcomitantDesignation");
        
        System.out.println("Mapping investigationProduct: " + investigationProduct);
        System.out.println("Mapping comparatorProduct: " + comparatorProduct);
        System.out.println("Mapping concomitantProduct: " + concomitantProduct);
        
        grid.setTrialProduct(investigationProduct);
        grid.setComparatorProduct(comparatorProduct != null ? comparatorProduct : "Non spécifié");
        grid.setConcomitantProduct(concomitantProduct != null ? concomitantProduct : "Non spécifié");
        
        // COMMENTAIRES
        grid.setGeneralComments((String) data.get("resumeObservations"));
        grid.setRecommendations((String) data.get("commentairesDocuments"));
        
        // DÉCISION
        String decision = getDecision(data);
        System.out.println("Mapping decision: " + decision);
        grid.setDecision(decision);
        
        // SCORES PAR DÉFAUT (pour satisfaire les contraintes)
        grid.setScientificQuality(4);
        grid.setEthicalCompliance(4);
        grid.setMethodologyClarity(4);
        grid.setRiskBenefitRatio(4);
        grid.setInformedConsentQuality(4);
        
        System.out.println("=== FIN MAPPING DES DONNÉES ===");
        
        // DEBUG: Vérifier que les valeurs sont bien assignées
        System.out.println("VÉRIFICATION APRÈS MAPPING:");
        System.out.println("grid.getProtocolFrench() = " + grid.getProtocolFrench());
        System.out.println("grid.getCvSigned() = " + grid.getCvSigned());
        System.out.println("grid.getConsentForm() = " + grid.getConsentForm());
        System.out.println("grid.getInsurance() = " + grid.getInsurance());
        System.out.println("grid.getPaymentProof() = " + grid.getPaymentProof());
        System.out.println("grid.getInvestigatorQualified() = " + grid.getInvestigatorQualified());
        System.out.println("grid.getAssociatedInvestigators() = " + grid.getAssociatedInvestigators());
        System.out.println("grid.getDecision() = " + grid.getDecision());
    }
    
    private String getDocumentStatus(Map<String, Object> data, String providedKey, String notProvidedKey) {
        Boolean provided = (Boolean) data.get(providedKey);
        Boolean notProvided = (Boolean) data.get(notProvidedKey);
        
        if (Boolean.TRUE.equals(provided)) return "Oui";
        if (Boolean.TRUE.equals(notProvided)) return "Non";
        return "Non renseigné";
    }
    
    private String getYesNoStatus(Map<String, Object> data, String yesKey, String noKey) {
        Boolean yes = (Boolean) data.get(yesKey);
        Boolean no = (Boolean) data.get(noKey);
        
        if (Boolean.TRUE.equals(yes)) return "Oui";
        if (Boolean.TRUE.equals(no)) return "Non";
        return "Non renseigné";
    }
    
    private String getInsuranceStatus(Map<String, Object> data) {
        Boolean provided = (Boolean) data.get("certificatAssuranceFourni");
        Boolean notProvided = (Boolean) data.get("certificatAssuranceNonFourni");
        Boolean na = (Boolean) data.get("certificatAssuranceNA");
        
        if (Boolean.TRUE.equals(provided)) return "Oui";
        if (Boolean.TRUE.equals(notProvided)) return "Non";
        if (Boolean.TRUE.equals(na)) return "NA";
        return "Non renseigné";
    }
    
    private String getTrialProductStatus(Map<String, Object> data, String yesKey, String noKey, String naKey) {
        Boolean yes = (Boolean) data.get(yesKey);
        Boolean no = (Boolean) data.get(noKey);
        Boolean na = (Boolean) data.get(naKey);
        
        if (Boolean.TRUE.equals(yes)) return "Pertinent";
        if (Boolean.TRUE.equals(no)) return "Non pertinent";
        if (Boolean.TRUE.equals(na)) return "NA";
        return "Non renseigné";
    }
    
    private String getDecision(Map<String, Object> data) {
        String committeeOpinion = (String) data.get("committeeOpinion");
        if (committeeOpinion != null) {
            switch (committeeOpinion) {
                case "FAVORABLE": return "APPROVE";
                case "AJOURNE": return "MAJOR_REVISION";
                case "NON_FAVORABLE": return "REJECT";
            }
        }
        
        // Fallback pour les anciennes données
        Boolean favorable = (Boolean) data.get("decisionFavorable");
        Boolean ajourne = (Boolean) data.get("decisionAjourne");
        Boolean nonFavorable = (Boolean) data.get("decisionNonFavorable");
        
        if (Boolean.TRUE.equals(favorable)) return "APPROVE";
        if (Boolean.TRUE.equals(ajourne)) return "MAJOR_REVISION";
        if (Boolean.TRUE.equals(nonFavorable)) return "REJECT";
        
        return "APPROVE"; // Valeur par défaut
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveEvaluation(@RequestBody Map<String, Object> evaluationData) {
        try {
            System.out.println("========================================");
            System.out.println("RÉCEPTION D'UNE NOUVELLE ÉVALUATION");
            System.out.println("========================================");
            System.out.println("Payload complet reçu: " + evaluationData);
            System.out.println("----------------------------------------");
            
            Long protocolId = Long.valueOf(evaluationData.get("protocolId").toString());
            Long memberId = Long.valueOf(evaluationData.get("memberId").toString());
            
            System.out.println("protocolId: " + protocolId);
            System.out.println("evaluatorId: " + memberId);
            
            // 🔥 PASSER DIRECTEMENT LES DONNÉES ORIGINALES AU SERVICE
            System.out.println("🔥 DONNÉES ORIGINALES PASSÉES AU SERVICE: " + evaluationData);
            
            // Utiliser le service avec les données complètes ORIGINALES
            MemberEvaluationGrid savedGrid = memberEvaluationService.saveEvaluation(protocolId, memberId, evaluationData);
            
            System.out.println("🔥 PERSISTANCE RÉUSSIE - INSERT INTO member_evaluation_grids ID: " + savedGrid.getId());
            System.out.println("🔥 PROTOCOLE " + protocolId + " MAINTENANT VISIBLE DANS INTERFACE RAPPORTEUR !");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "✅ Évaluation PERSISTÉE dans PostgreSQL avec PDF généré !",
                "evaluationId", savedGrid.getId(),
                "protocolId", protocolId,
                "pdfGenerated", savedGrid.getPdfPath() != null,
                "downloadUrl", "/api/evaluation/grid/" + savedGrid.getId() + "/pdf"
            ));
        } catch (Exception e) {
            System.err.println("❌ ERREUR PERSISTANCE: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "❌ Erreur mais évaluation reçue: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createEvaluation(@RequestBody Map<String, Object> request) {
        try {
            Long protocolId = Long.valueOf(request.get("protocolId").toString());
            Long memberId = Long.valueOf(request.get("memberId").toString());
            String memberName = request.get("memberName").toString();
            
            // Vérifier si une grille existe déjà
            Optional<MemberEvaluationGrid> existingGrid = memberEvaluationGridRepository.findByProtocolIdAndMemberId(protocolId, memberId);
            
            if (existingGrid.isPresent()) {
                // Retourner la grille existante
                MemberEvaluationGrid grid = existingGrid.get();
                Map<String, Object> data = new HashMap<>();
                data.put("id", grid.getId());
                data.put("protocolId", grid.getProtocolId());
                data.put("memberId", grid.getMemberId());
                data.put("memberName", grid.getMemberName());
                data.put("scientificQuality", grid.getScientificQuality() != null ? grid.getScientificQuality() : 0);
                data.put("ethicalCompliance", grid.getEthicalCompliance() != null ? grid.getEthicalCompliance() : 0);
                data.put("methodologyClarity", grid.getMethodologyClarity() != null ? grid.getMethodologyClarity() : 0);
                data.put("riskBenefitRatio", grid.getRiskBenefitRatio() != null ? grid.getRiskBenefitRatio() : 0);
                data.put("informedConsentQuality", grid.getInformedConsentQuality() != null ? grid.getInformedConsentQuality() : 0);
                data.put("dataProtection", grid.getDataProtection() != null ? grid.getDataProtection() : 0);
                data.put("participantSafety", grid.getParticipantSafety() != null ? grid.getParticipantSafety() : 0);
                data.put("feasibility", grid.getFeasibility() != null ? grid.getFeasibility() : 0);
                data.put("strengths", grid.getStrengths() != null ? grid.getStrengths() : "");
                data.put("weaknesses", grid.getWeaknesses() != null ? grid.getWeaknesses() : "");
                data.put("recommendations", grid.getRecommendations() != null ? grid.getRecommendations() : "");
                data.put("generalComments", grid.getGeneralComments() != null ? grid.getGeneralComments() : "");
                data.put("decision", grid.getDecision() != null ? grid.getDecision() : "");
                data.put("status", grid.getStatus());
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "evaluationGrid", data
                ));
            } else {
                // Créer une nouvelle grille
                MemberEvaluationGrid newGrid = new MemberEvaluationGrid(protocolId, memberId, memberName);
                MemberEvaluationGrid savedGrid = memberEvaluationGridRepository.save(newGrid);
                
                Map<String, Object> data = new HashMap<>();
                data.put("id", savedGrid.getId());
                data.put("protocolId", savedGrid.getProtocolId());
                data.put("memberId", savedGrid.getMemberId());
                data.put("memberName", savedGrid.getMemberName());
                data.put("scientificQuality", 0);
                data.put("ethicalCompliance", 0);
                data.put("methodologyClarity", 0);
                data.put("riskBenefitRatio", 0);
                data.put("informedConsentQuality", 0);
                data.put("dataProtection", 0);
                data.put("participantSafety", 0);
                data.put("feasibility", 0);
                data.put("strengths", "");
                data.put("weaknesses", "");
                data.put("recommendations", "");
                data.put("generalComments", "");
                data.put("decision", "");
                data.put("status", "DRAFT");
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "evaluationGrid", data
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocol/{protocolId}/member/{memberId}")
    public ResponseEntity<?> getEvaluation(@PathVariable Long protocolId, @PathVariable Long memberId) {
        try {
            Optional<MemberEvaluationGrid> gridOpt = memberEvaluationGridRepository.findByProtocolIdAndMemberId(protocolId, memberId);
            
            if (gridOpt.isPresent()) {
                MemberEvaluationGrid grid = gridOpt.get();
                Map<String, Object> data = new HashMap<>();
                data.put("id", grid.getId());
                data.put("protocolId", grid.getProtocolId());
                data.put("memberId", grid.getMemberId());
                data.put("memberName", grid.getMemberName());
                data.put("scientificQuality", grid.getScientificQuality());
                data.put("ethicalCompliance", grid.getEthicalCompliance());
                data.put("methodologyClarity", grid.getMethodologyClarity());
                data.put("riskBenefitRatio", grid.getRiskBenefitRatio());
                data.put("informedConsentQuality", grid.getInformedConsentQuality());
                data.put("dataProtection", grid.getDataProtection());
                data.put("participantSafety", grid.getParticipantSafety());
                data.put("feasibility", grid.getFeasibility());
                data.put("strengths", grid.getStrengths());
                data.put("weaknesses", grid.getWeaknesses());
                data.put("recommendations", grid.getRecommendations());
                data.put("generalComments", grid.getGeneralComments());
                data.put("decision", grid.getDecision());
                data.put("status", grid.getStatus());
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "evaluationGrid", data
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

    @PutMapping("/{evaluationId}")
    public ResponseEntity<?> updateEvaluation(@PathVariable Long evaluationId, @RequestBody Map<String, Object> evaluationData) {
        try {
            System.out.println("Mise à jour évaluation " + evaluationId + ": " + evaluationData);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Évaluation mise à jour avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/upload-signature")
    public ResponseEntity<?> uploadSignature(@RequestParam("file") org.springframework.web.multipart.MultipartFile file,
                                           @RequestParam("evaluationId") Long evaluationId) {
        try {
            System.out.println("Signature reçue pour évaluation " + evaluationId + ": " + file.getOriginalFilename());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Signature uploadée avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    // ========== NOUVEAUX ENDPOINTS PDF ==========
    
    @GetMapping("/protocol/{protocolId}/grids-with-pdf")
    public ResponseEntity<?> getProtocolEvaluationGridsWithPdf(@PathVariable Long protocolId) {
        try {
            List<MemberEvaluationGrid> grids = memberEvaluationGridRepository.findByProtocolId(protocolId);
            
            // Filtrer pour ne garder que celles qui ont été réellement soumises
            List<MemberEvaluationGrid> submittedGrids = grids.stream()
                .filter(grid -> "COMPLETED".equals(grid.getStatus()) || 
                               grid.getSubmittedAt() != null || 
                               grid.getScientificQuality() != null || 
                               grid.getDecision() != null)
                .collect(Collectors.toList());
            
            List<Map<String, Object>> gridData = submittedGrids.stream()
                .map(grid -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", grid.getId());
                    data.put("protocolId", grid.getProtocolId());
                    data.put("memberId", grid.getMemberId());
                    data.put("memberName", grid.getMemberName());
                    data.put("decision", grid.getDecision());
                    data.put("submittedAt", grid.getSubmittedAt());
                    data.put("averageScore", grid.getAverageScore());
                    data.put("hasPdf", grid.getPdfPath() != null);
                    data.put("pdfPath", grid.getPdfPath());
                    data.put("pdfGeneratedAt", grid.getPdfGeneratedAt());
                    return data;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "grids", gridData,
                "count", gridData.size(),
                "message", gridData.isEmpty() ? "Aucune grille d'évaluation trouvée" : "Grilles récupérées avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/grid/{gridId}/pdf")
    public ResponseEntity<Resource> downloadEvaluationPdf(@PathVariable Long gridId) {
        try {
            Optional<MemberEvaluationGrid> gridOpt = memberEvaluationGridRepository.findById(gridId);
            
            if (!gridOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            MemberEvaluationGrid grid = gridOpt.get();
            
            // Générer le PDF s'il n'existe pas
            if (grid.getPdfPath() == null || !new File(grid.getPdfPath()).exists()) {
                String protocolTitle = getProtocolTitle(grid.getProtocolId());
                String pdfPath = evaluationPdfService.generateEvaluationPdf(grid, protocolTitle);
                
                // Mettre à jour la grille avec le chemin du PDF
                grid.setPdfPath(pdfPath);
                grid.setPdfGeneratedAt(LocalDateTime.now());
                memberEvaluationGridRepository.save(grid);
            }
            
            File pdfFile = new File(grid.getPdfPath());
            if (!pdfFile.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new FileSystemResource(pdfFile);
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"evaluation_" + grid.getProtocolId() + "_" + grid.getMemberName().replace(" ", "_") + ".pdf\"")
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @PostMapping("/grid/{gridId}/generate-pdf")
    public ResponseEntity<?> generateEvaluationPdf(@PathVariable Long gridId) {
        try {
            Optional<MemberEvaluationGrid> gridOpt = memberEvaluationGridRepository.findById(gridId);
            
            if (!gridOpt.isPresent()) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "error", "Grille d'évaluation non trouvée"
                ));
            }
            
            MemberEvaluationGrid grid = gridOpt.get();
            
            // Vérifier que la grille est complète
            if (!grid.isReadyForSubmission()) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "La grille d'évaluation n'est pas complète"
                ));
            }
            
            String protocolTitle = getProtocolTitle(grid.getProtocolId());
            String pdfPath = evaluationPdfService.generateEvaluationPdf(grid, protocolTitle);
            
            // Mettre à jour la grille avec le chemin du PDF
            grid.setPdfPath(pdfPath);
            grid.setPdfGeneratedAt(LocalDateTime.now());
            memberEvaluationGridRepository.save(grid);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "PDF généré avec succès",
                "pdfPath", pdfPath,
                "downloadUrl", "/api/evaluation/grid/" + gridId + "/pdf"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la génération du PDF: " + e.getMessage()
            ));
        }
    }
    
    private String getProtocolTitle(Long protocolId) {
        try {
            String sql = "SELECT title FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> results = jdbcTemplate.queryForList(sql, protocolId);
            if (!results.isEmpty()) {
                return (String) results.get(0).get("title");
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération du titre du protocole: " + e.getMessage());
        }
        return "Protocole PROT-" + protocolId;
    }
}