package comite.demo.controller;

import comite.demo.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/rapporteur")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RapporteurDecisionController {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/protocols/verified")
    public ResponseEntity<?> getVerifiedProtocols(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || !userRole.equalsIgnoreCase("rapporteur")) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé aux rapporteurs"
            ));
        }
        
        try {
            String sql = """
                SELECT DISTINCT ps.id, ps.title, ps.description, ps.submitter_name as principalInvestigator, 
                       ps.institution, ps.participants, ps.duration, ps.status, ps.submitted_at,
                       ps.verified_at, ps.ethical_considerations,
                       CONCAT('PROT-', LPAD(ps.id::text, 4, '0')) as protocolCode,
                       CASE WHEN pe.id IS NOT NULL THEN true ELSE false END as hasDeliberation,
                       CASE WHEN pe.id IS NOT NULL THEN 'COMPLETED' ELSE 'PENDING' END as deliberationStatus
                FROM protocol_submissions ps 
                LEFT JOIN protocol_member_assignments pma ON ps.id = pma.protocol_id
                LEFT JOIN protocol_evaluations pe ON ps.id = pe.protocol_id AND pe.evaluator_id = ?
                WHERE (pma.member_id = ? AND ps.status = 'ASSIGNED_TO_MEMBER') 
                   OR (pe.evaluator_id = ? AND pe.id IS NOT NULL)
                ORDER BY ps.verified_at DESC, ps.submitted_at DESC
            """;
            
            List<Map<String, Object>> dbProtocols = jdbcTemplate.queryForList(sql, 
                Long.parseLong(userId), Long.parseLong(userId), Long.parseLong(userId));
            List<Map<String, Object>> protocols = formatProtocols(dbProtocols);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "protocols", protocols,
                "count", protocols.size()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/{protocolId}/evaluate")
    public ResponseEntity<?> redirectToDeliberationForm(@PathVariable Long protocolId) {
        // Rediriger vers le nouveau formulaire de délibération
        return ResponseEntity.ok(Map.of(
            "success", true,
            "redirectUrl", "/api/rapporteur/evaluation-form/" + protocolId,
            "formType", "deliberation",
            "message", "Redirection vers le formulaire de délibération"
        ));
    }

    @PostMapping("/protocols/{protocolId}/decision")
    public ResponseEntity<?> submitDecision(@PathVariable Long protocolId,
                                          @RequestBody Map<String, Object> requestBody,
                                          HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || !userRole.equalsIgnoreCase("rapporteur")) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé aux rapporteurs"
            ));
        }
        
        // ===== LOGS DE DÉBOGAGE AJOUTÉS =====
        System.out.println("========================================");
        System.out.println("DONNÉES REÇUES DU FRONTEND :");
        System.out.println("requestBody complet : " + requestBody);
        System.out.println("========================================");
        System.out.println("TOUTES LES CLÉS DU REQUESTBODY : " + requestBody.keySet());
        System.out.println("========================================");
        
        try {
            // Validation des champs obligatoires du nouveau formulaire
            String deliberationNumber = (String) requestBody.get("deliberationNumber");
            String researchTitle = (String) requestBody.get("researchTitle");
            String protocolReference = (String) requestBody.get("protocolReference");
            String principalInvestigator = (String) requestBody.get("principalInvestigator");
            String requesterReference = (String) requestBody.get("requesterReference");
            String researchSite = (String) requestBody.get("researchSite");
            String deliberationDate = (String) requestBody.get("deliberationDate");
            String documentation = (String) requestBody.get("documentation");
            String committeeOpinion = (String) requestBody.get("committeeOpinion"); // FAVORABLE, AJOURNE, NON_FAVORABLE
            String observations = (String) requestBody.get("observations");
            String reserves = (String) requestBody.get("reserves");
            String recommendations = (String) requestBody.get("recommendations");
            
            // ===== LOGS POUR LES CHAMPS CRITIQUES =====
            System.out.println("principalInvestigator extraite : [" + principalInvestigator + "]");
            System.out.println("requesterReference extraite : [" + requesterReference + "]");
            
            // Membres ayant siégé (liste des noms)
            @SuppressWarnings("unchecked")
            List<String> membersPresent = (List<String>) requestBody.get("membersPresent");
            System.out.println("membersPresent extraite : " + membersPresent);
            
            // Si membersPresent est null, essayer d'autres noms de champs
            if (membersPresent == null) {
                System.out.println("membersPresent est null, essai d'autres champs...");
                
                // Essayer de récupérer les membres individuellement
                List<String> membersList = new ArrayList<>();
                for (int i = 1; i <= 6; i++) {
                    String member = (String) requestBody.get("member" + i);
                    System.out.println("member" + i + " : [" + member + "]");
                    if (member != null && !member.trim().isEmpty()) {
                        membersList.add(member.trim());
                    }
                }
                
                if (!membersList.isEmpty()) {
                    membersPresent = membersList;
                    System.out.println("Membres récupérés individuellement : " + membersPresent);
                }
            }
            
            System.out.println("========================================");
            
            // S'assurer que les valeurs ne sont pas null ou vides - mais ne pas forcer les valeurs par défaut
            if (principalInvestigator == null || principalInvestigator.trim().isEmpty()) {
                // Essayer de récupérer depuis la base de données
                try {
                    String sql = "SELECT submitter_name FROM protocol_submissions WHERE id = ?";
                    List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, protocolId);
                    if (!result.isEmpty() && result.get(0).get("submitter_name") != null) {
                        principalInvestigator = (String) result.get(0).get("submitter_name");
                    } else {
                        principalInvestigator = "Investigateur non spécifié";
                    }
                } catch (Exception e) {
                    principalInvestigator = "Investigateur non spécifié";
                }
            }
            if (requesterReference == null || requesterReference.trim().isEmpty()) {
                requesterReference = "Demandeur non spécifié";
            }
            
            // Éléments examinés (checkboxes)
            Boolean scientificConception = (Boolean) requestBody.get("scientificConception");
            Boolean participantProtection = (Boolean) requestBody.get("participantProtection");
            Boolean dataConfidentiality = (Boolean) requestBody.get("dataConfidentiality");
            Boolean consentProcess = (Boolean) requestBody.get("consentProcess");
            Boolean researchBudget = (Boolean) requestBody.get("researchBudget");
            Boolean cvDocuments = (Boolean) requestBody.get("cvDocuments");
            
            // ===== LOGS APRÈS TRAITEMENT =====
            System.out.println("VALEURS FINALES AVANT SAUVEGARDE :");
            System.out.println("principalInvestigator final : [" + principalInvestigator + "]");
            System.out.println("requesterReference final : [" + requesterReference + "]");
            System.out.println("membersPresent final : " + membersPresent);
            
            String membersJson = "[]";
            if (membersPresent != null && !membersPresent.isEmpty()) {
                membersJson = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(membersPresent);
            }
            
            System.out.println("membersJson final : [" + membersJson + "]");
            System.out.println("========================================");
            
            if (committeeOpinion == null || (!committeeOpinion.equals("FAVORABLE") && 
                !committeeOpinion.equals("AJOURNE") && !committeeOpinion.equals("NON_FAVORABLE"))) {
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "error", "Avis du comité requis (FAVORABLE, AJOURNE ou NON_FAVORABLE)"
                ));
            }
            
            String getUserSql = "SELECT first_name, last_name FROM users WHERE id = ?";
            List<Map<String, Object>> userInfo = jdbcTemplate.queryForList(getUserSql, Long.parseLong(userId));
            String rapporteurName = userInfo.isEmpty() ? "Rapporteur" : 
                userInfo.get(0).get("first_name") + " " + userInfo.get(0).get("last_name");
            
            String checkEvaluationSql = "SELECT COUNT(*) FROM protocol_evaluations WHERE protocol_id = ? AND evaluator_id = ?";
            Integer evaluationExists = jdbcTemplate.queryForObject(checkEvaluationSql, Integer.class, protocolId, Long.parseLong(userId));
            
            if (evaluationExists > 0) {
                String updateSql = """
                    UPDATE protocol_evaluations 
                    SET recommandation_finale = ?, evaluation_form_data = CAST(? AS jsonb), 
                        evaluation_date = NOW(), is_final = true,
                        deliberation_number = ?, research_title = ?, protocol_reference = ?,
                        principal_investigator = ?, requester_reference = ?, research_site = ?, 
                        deliberation_date = ?, documentation = ?,
                        scientific_conception = ?, participant_protection = ?, data_confidentiality = ?,
                        consent_process = ?, research_budget = ?, cv_documents = ?,
                        observations = ?, reserves = ?, recommendations = ?, 
                        members_present = CAST(? AS jsonb)
                    WHERE protocol_id = ? AND evaluator_id = ?
                """;
                String jsonData = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(requestBody);
                
                // ===== LOGS AVANT UPDATE =====
                System.out.println("PARAMÈTRES POUR L'UPDATE SQL :");
                System.out.println("Position 7 - requesterReference : [" + requesterReference + "]");
                System.out.println("Position 20 - membersJson : [" + membersJson + "]");
                System.out.println("========================================");
                
                jdbcTemplate.update(updateSql, committeeOpinion, jsonData, deliberationNumber, 
                    researchTitle, protocolReference, principalInvestigator, requesterReference, researchSite, 
                    java.sql.Date.valueOf(deliberationDate), documentation,
                    scientificConception, participantProtection, dataConfidentiality,
                    consentProcess, researchBudget, cvDocuments,
                    observations, reserves, recommendations, membersJson, 
                    protocolId, Long.parseLong(userId));
            } else {
                String insertSql = """
                    INSERT INTO protocol_evaluations 
                    (protocol_id, evaluator_id, nom_evaluateur, recommandation_finale, 
                     evaluation_form_data, evaluation_date, is_final, created_at,
                     deliberation_number, research_title, protocol_reference,
                     principal_investigator, requester_reference, research_site, deliberation_date,
                     documentation, scientific_conception, participant_protection, data_confidentiality,
                     consent_process, research_budget, cv_documents,
                     observations, reserves, recommendations, members_present)
                    VALUES (?, ?, ?, ?, CAST(? AS jsonb), NOW(), true, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CAST(? AS jsonb))
                """;
                String jsonData = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(requestBody);
                
                // ===== LOGS AVANT INSERT =====
                System.out.println("PARAMÈTRES POUR L'INSERT SQL :");
                System.out.println("Position requesterReference : [" + requesterReference + "]");
                System.out.println("Position membersJson : [" + membersJson + "]");
                System.out.println("========================================");
                
                jdbcTemplate.update(insertSql, protocolId, Long.parseLong(userId), rapporteurName, 
                    committeeOpinion, jsonData, deliberationNumber, researchTitle, protocolReference,
                    principalInvestigator, requesterReference, researchSite, java.sql.Date.valueOf(deliberationDate), 
                    documentation, scientificConception, participantProtection, dataConfidentiality,
                    consentProcess, researchBudget, cvDocuments,
                    observations, reserves, recommendations, membersJson);
            }
            
            // Récupérer l'ancien statut
            String getOldStatusSql = "SELECT status FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> oldStatusResult = jdbcTemplate.queryForList(getOldStatusSql, protocolId);
            String oldStatus = oldStatusResult.isEmpty() ? "UNKNOWN" : (String) oldStatusResult.get(0).get("status");
            
            String newStatus;
            switch (committeeOpinion) {
                case "FAVORABLE":
                    newStatus = "COMMITTEE_APPROVED";
                    break;
                case "NON_FAVORABLE":
                    newStatus = "COMMITTEE_REJECTED";
                    break;
                default:
                    newStatus = "COMMITTEE_REVISION_REQUESTED";
            }
            
            // Mettre à jour le statut
            String updateProtocolSql = "UPDATE protocol_submissions SET status = ? WHERE id = ?";
            jdbcTemplate.update(updateProtocolSql, newStatus, protocolId);
            
            // Notifier le changement de statut
            notificationService.notifyStatusChange(protocolId, oldStatus, newStatus, rapporteurName);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Délibération enregistrée avec succès",
                "decision", committeeOpinion,
                "protocolId", protocolId,
                "deliberationNumber", deliberationNumber
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de l'enregistrement: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/{protocolId}/deliberation-form")
    public ResponseEntity<String> getDeliberationFormHTML(@PathVariable Long protocolId,
                                                         HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || !userRole.equalsIgnoreCase("rapporteur")) {
            return ResponseEntity.status(403).body("<h1>Accès refusé</h1>");
        }
        
        try {
            String html = generateDeliberationFormHTML(protocolId);
            return ResponseEntity.ok()
                .header("Content-Type", "text/html; charset=UTF-8")
                .body(html);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("<h1>Erreur: " + e.getMessage() + "</h1>");
        }
    }
    
    private String generateDeliberationFormHTML(Long protocolId) {
        String currentDate = java.time.LocalDate.now().toString();
        String deliberationNumber = java.time.Year.now().getValue() + "-" + 
            String.format("%02d", java.time.LocalDate.now().getMonthValue()) + "-" + protocolId;
        String formattedDate = java.time.LocalDate.now().format(
            java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            
        // Récupérer les infos du protocole
        String protocolTitle = "";
        String investigator = "";
        String institution = "Burkina Faso";
        
        try {
            String sql = "SELECT title, submitter_name, institution FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, protocolId);
            if (!result.isEmpty()) {
                Map<String, Object> protocol = result.get(0);
                protocolTitle = (String) protocol.get("title");
                investigator = (String) protocol.get("submitter_name");
                if (protocol.get("institution") != null) {
                    institution = (String) protocol.get("institution");
                }
            }
        } catch (Exception e) {
            // Utiliser les valeurs par défaut
        }
        
        // S'assurer que les valeurs ne sont pas null
        if (protocolTitle == null || protocolTitle.isEmpty()) {
            protocolTitle = "Titre non spécifié";
        }
        if (investigator == null || investigator.isEmpty()) {
            investigator = "Investigateur non spécifié";
        }

        return String.format("""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Délibération - Comité d'Éthique</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .form-container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2c3e50; padding-bottom: 20px; }
        .header h1 { color: #2c3e50; margin-bottom: 10px; font-size: 24px; }
        .field { margin-bottom: 20px; }
        .field label { font-weight: bold; display: block; margin-bottom: 5px; }
        .field input, .field textarea { width: 100%%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
        .field textarea { resize: vertical; }
        .checkbox-group { background: #f8f9fa; padding: 15px; border-radius: 4px; margin: 10px 0; }
        .checkbox-item { display: block; margin: 10px 0; cursor: pointer; }
        .checkbox-item input { margin-right: 10px; transform: scale(1.2); }
        .radio-group { background: #fff3cd; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107; }
        .radio-item { display: block; margin: 10px 0; cursor: pointer; }
        .radio-item input { margin-right: 10px; transform: scale(1.3); }
        .signatures { display: flex; justify-content: space-around; margin-top: 40px; }
        .signature-box { text-align: center; flex: 1; margin: 0 20px; }
        .signature-area { height: 80px; border: 2px dashed #ccc; margin: 20px 0; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border-radius: 4px; color: #6c757d; font-style: italic; }
        .buttons { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
        .btn { padding: 15px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: bold; }
        .btn-cancel { background: #6c757d; color: white; }
        .btn-submit { background: #28a745; color: white; }
        .btn:disabled { background: #6c757d; cursor: not-allowed; }
    </style>
</head>
<body>
    <div class="form-container">
        <div class="header">
            <h1>DÉLIBÉRATION</h1>
            <p style="margin: 5px 0; font-weight: bold;">BURKINA FASO</p>
            <p style="margin: 5px 0; font-style: italic;">La Patrie ou la Mort, nous Vaincrons</p>
            <div style="margin: 15px 0;">
                <p style="margin: 5px 0; font-size: 14px;">MINISTÈRE DE LA SANTÉ</p>
                <p style="margin: 5px 0; font-size: 14px;">MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR, DE LA RECHERCHE ET DE L'INNOVATION</p>
                <p style="margin: 5px 0; font-weight: bold; color: #2c3e50;">COMITÉ D'ÉTHIQUE POUR LA RECHERCHE EN SANTÉ</p>
            </div>
        </div>

        <form id="deliberationForm">
            <div class="field">
                <label>DÉLIBÉRATION N°:</label>
                <input type="text" name="deliberationNumber" value="%s" required>
            </div>

            <div class="field">
                <label>1. TITRE DE LA RECHERCHE:</label>
                <textarea name="researchTitle" rows="3" required>%s</textarea>
            </div>

            <div class="field">
                <label>2. RÉFÉRENCE DU PROTOCOLE:</label>
                <input type="text" name="protocolReference" value="PROT-%d" required>
            </div>

            <div class="field">
                <label>3. DOCUMENTATION:</label>
                <input type="text" name="documentation" value="Dossier complet" required>
            </div>

            <div class="field">
                <label>4. INVESTIGATEUR PRINCIPAL (Nom complet du chercheur responsable):</label>
                <input type="text" name="principalInvestigator" value="%s" required placeholder="Ex: Dr. Jean DUPONT, Prof. Marie MARTIN">
            </div>
            
            <div class="field">
                <label>5. RÉFÉRENCE DU DEMANDEUR (Statut/Qualité du demandeur):</label>
                <input type="text" name="requesterReference" value="" required placeholder="Ex: Chercheur, Étudiant, Professeur, Doctorant">
            </div>

            <div class="field">
                <label>6. SITE DE LA RECHERCHE:</label>
                <input type="text" name="researchSite" value="%s" required>
            </div>

            <div class="field">
                <label>7. DATE DE LA DÉLIBÉRATION:</label>
                <input type="date" name="deliberationDate" value="%s" required>
            </div>

            <div class="field">
                <label>8. ÉLÉMENTS EXAMINÉS:</label>
                <div class="checkbox-group">
                    <label class="checkbox-item">
                        <input type="checkbox" name="scientificConception">
                        Conception scientifique et conduite de la recherche
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="participantProtection">
                        Soins et protection des participants à la recherche
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="dataConfidentiality">
                        Protection de la confidentialité des données du participant à la recherche
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="consentProcess">
                        Processus de consentement éclairé
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="researchBudget">
                        Budget de la recherche
                    </label>
                    <label class="checkbox-item">
                        <input type="checkbox" name="cvDocuments">
                        CV
                    </label>
                </div>
            </div>

            <div class="field">
                <label>9. OBSERVATIONS:</label>
                <textarea name="observations" rows="3" placeholder="Préciser sur la page de garde l'institution de formation et le diplôme postulé."></textarea>
            </div>

            <div class="field">
                <label>10. MEMBRES AYANT SIÉGÉ (Saisir les noms complets):</label>
                <div class="checkbox-group">
                    <input type="text" name="member1" placeholder="Ex: Dr. Clotaire NANGA" style="margin-bottom: 10px;">
                    <input type="text" name="member2" placeholder="Ex: Pr. Fla KOUETA" style="margin-bottom: 10px;">
                    <input type="text" name="member3" placeholder="Ex: Dr. Maxime DRABO" style="margin-bottom: 10px;">
                    <input type="text" name="member4" placeholder="Ex: Pr. Patrice TOE" style="margin-bottom: 10px;">
                    <input type="text" name="member5" placeholder="Ex: M. Olivier OUEDRAOGO" style="margin-bottom: 10px;">
                    <input type="text" name="member6" placeholder="Ex: Dr. Alphonse OUEDRAOGO" style="margin-bottom: 10px;">
                </div>
            </div>

            <div class="field">
                <label style="color: #856404;">11. AVIS DU COMITÉ:</label>
                <div class="radio-group">
                    <label class="radio-item">
                        <input type="radio" name="committeeOpinion" value="FAVORABLE" required>
                        <span style="color: #28a745; font-weight: bold;">Avis favorable</span>
                    </label>
                    <label class="radio-item">
                        <input type="radio" name="committeeOpinion" value="AJOURNE" required>
                        <span style="color: #ffc107; font-weight: bold;">Ajourné</span>
                    </label>
                    <label class="radio-item">
                        <input type="radio" name="committeeOpinion" value="NON_FAVORABLE" required>
                        <span style="color: #dc3545; font-weight: bold;">Non favorable</span>
                    </label>
                </div>
            </div>

            <div class="field">
                <label>12. RÉSERVES:</label>
                <textarea name="reserves" rows="3" placeholder="Réserves éventuelles"></textarea>
            </div>

            <div class="field">
                <label>13. RECOMMANDATIONS:</label>
                <textarea name="recommendations" rows="4" placeholder="Recommandations du comité"></textarea>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #2c3e50;">
                <p style="margin-bottom: 30px; font-weight: bold; font-size: 16px;">Ouagadougou, le %s</p>
                <div class="signatures">
                    <div class="signature-box">
                        <p style="font-weight: bold;">Le Rapporteur</p>
                        <div class="signature-area">Signature</div>
                        <p style="font-weight: bold;">Dr Clotaire NANGA</p>
                        <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre du Mérite Burkinabè</p>
                    </div>
                    <div class="signature-box">
                        <p style="font-weight: bold;">Le Président</p>
                        <div class="signature-area">Signature</div>
                        <p style="font-weight: bold;">Pr Fla KOUETA</p>
                        <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre du Mérite</p>
                        <p style="font-size: 12px; color: #6c757d;">Chevalier de l'Ordre des Palmes Académiques</p>
                    </div>
                </div>
            </div>

            <div class="buttons">
                <button type="button" class="btn btn-cancel" onclick="window.close()">Annuler</button>
                <button type="submit" class="btn btn-submit">Enregistrer la Délibération</button>
            </div>
        </form>
    </div>

    <script>
        document.getElementById('deliberationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            
            // Récupérer tous les champs texte
            data.deliberationNumber = formData.get('deliberationNumber');
            data.researchTitle = formData.get('researchTitle');
            data.protocolReference = formData.get('protocolReference');
            data.documentation = formData.get('documentation');
            data.principalInvestigator = formData.get('principalInvestigator');
            data.requesterReference = formData.get('requesterReference');
            data.researchSite = formData.get('researchSite');
            data.deliberationDate = formData.get('deliberationDate');
            data.observations = formData.get('observations') || '';
            data.reserves = formData.get('reserves') || '';
            data.recommendations = formData.get('recommendations') || '';
            data.committeeOpinion = formData.get('committeeOpinion');
            
            console.log('DEBUG - Form data:', {
                principalInvestigator: data.principalInvestigator,
                requesterReference: data.requesterReference,
                membersPresent: data.membersPresent
            });
            
            // Récupérer les éléments examinés (checkboxes)
            data.scientificConception = this.querySelector('[name="scientificConception"]').checked;
            data.participantProtection = this.querySelector('[name="participantProtection"]').checked;
            data.dataConfidentiality = this.querySelector('[name="dataConfidentiality"]').checked;
            data.consentProcess = this.querySelector('[name="consentProcess"]').checked;
            data.researchBudget = this.querySelector('[name="researchBudget"]').checked;
            data.cvDocuments = this.querySelector('[name="cvDocuments"]').checked;
            
            // Récupérer les membres ayant siégé (champs texte)
            data.membersPresent = [];
            const member1 = formData.get('member1');
            const member2 = formData.get('member2');
            const member3 = formData.get('member3');
            const member4 = formData.get('member4');
            const member5 = formData.get('member5');
            const member6 = formData.get('member6');
            
            if (member1 && member1.trim()) data.membersPresent.push(member1.trim());
            if (member2 && member2.trim()) data.membersPresent.push(member2.trim());
            if (member3 && member3.trim()) data.membersPresent.push(member3.trim());
            if (member4 && member4.trim()) data.membersPresent.push(member4.trim());
            if (member5 && member5.trim()) data.membersPresent.push(member5.trim());
            if (member6 && member6.trim()) data.membersPresent.push(member6.trim());
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enregistrement...';
            
            fetch('/api/rapporteur/protocols/%d/decision', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-ID': localStorage.getItem('userId') || '1',
                    'X-User-Role': localStorage.getItem('userRole') || 'rapporteur'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('✅ Délibération enregistrée avec succès !\\n\\nNuméro: ' + result.deliberationNumber);
                    window.close();
                } else {
                    alert('❌ Erreur: ' + result.error);
                }
            })
            .catch(error => {
                alert('❌ Erreur lors de l\'enregistrement');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enregistrer la Délibération';
            });
        });
    </script>
</body>
</html>
        """, deliberationNumber, protocolTitle, protocolId, investigator, institution, currentDate, formattedDate, protocolId);
    }

    @GetMapping("/protocols/{protocolId}/evaluation")
    public ResponseEntity<?> getProtocolEvaluation(@PathVariable Long protocolId,
                                                  HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || !userRole.equalsIgnoreCase("rapporteur")) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé aux rapporteurs"
            ));
        }
        
        try {
            // Retourner le nouveau formulaire de délibération
            String currentDate = java.time.LocalDate.now().toString();
            String deliberationNumber = java.time.Year.now().getValue() + "-" + 
                String.format("%02d", java.time.LocalDate.now().getMonthValue()) + "-" + protocolId;
            
            // Récupérer les informations du protocole
            String protocolSql = "SELECT title, submitter_name, institution FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> protocolInfo = jdbcTemplate.queryForList(protocolSql, protocolId);
            
            Map<String, Object> protocol = protocolInfo.isEmpty() ? new HashMap<>() : protocolInfo.get(0);
            
            // Structure du nouveau formulaire de délibération
            Map<String, Object> deliberationForm = new HashMap<>();
            deliberationForm.put("formType", "deliberation");
            deliberationForm.put("protocolId", protocolId);
            deliberationForm.put("deliberationNumber", deliberationNumber);
            deliberationForm.put("currentDate", currentDate);
            deliberationForm.put("researchTitle", protocol.get("title"));
            deliberationForm.put("principalInvestigator", protocol.get("submitter_name"));
            deliberationForm.put("researchSite", protocol.get("institution"));
            deliberationForm.put("protocolReference", "Version non précisée");
            
            // Éléments examinés (tous false par défaut)
            deliberationForm.put("scientificConception", false);
            deliberationForm.put("participantProtection", false);
            deliberationForm.put("dataConfidentiality", false);
            deliberationForm.put("consentProcess", false);
            deliberationForm.put("researchBudget", false);
            deliberationForm.put("cvDocuments", false);
            
            // Membres du comité
            List<String> availableMembers = List.of(
                "Pr Fla KOUETA",
                "Dr Clotaire NANGA", 
                "Pr Maxime DRABO",
                "Pr Patrice TOE",
                "M Olivier L. O. OUEDRAOGO",
                "Dr Alphonse OUEDRAOGO"
            );
            deliberationForm.put("availableMembers", availableMembers);
            deliberationForm.put("membersPresent", new ArrayList<>());
            
            // Champs texte vides
            deliberationForm.put("observations", "");
            deliberationForm.put("reserves", "");
            deliberationForm.put("recommendations", "");
            deliberationForm.put("committeeOpinion", "");
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "evaluation", deliberationForm,
                "isDeliberationForm", true,
                "message", "Nouveau formulaire de délibération chargé"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/protocols/{protocolId}/files")
    public ResponseEntity<?> getProtocolFiles(@PathVariable Long protocolId,
                                             HttpServletRequest request) {
        try {
            // Retourner directement les fichiers du protocole depuis la base
            List<Map<String, Object>> files = new ArrayList<>();
            
            // Fichier principal
            Map<String, Object> file1 = new HashMap<>();
            file1.put("id", protocolId + "_protocol");
            file1.put("fileName", "protocole_" + protocolId + ".pdf");
            file1.put("fileType", "application/pdf");
            file1.put("fileSize", 1024000);
            file1.put("uploadDate", "2025-11-19T08:00:00.000Z");
            file1.put("description", "Fichier principal du protocole");
            files.add(file1);
            
            // Formulaire de consentement
            Map<String, Object> file2 = new HashMap<>();
            file2.put("id", protocolId + "_consent");
            file2.put("fileName", "consentement_" + protocolId + ".pdf");
            file2.put("fileType", "application/pdf");
            file2.put("fileSize", 512000);
            file2.put("uploadDate", "2025-11-19T08:15:00.000Z");
            file2.put("description", "Formulaire de consentement");
            files.add(file2);
            
            // CV investigateurs
            Map<String, Object> file3 = new HashMap<>();
            file3.put("id", protocolId + "_cv");
            file3.put("fileName", "cv_investigateurs_" + protocolId + ".pdf");
            file3.put("fileType", "application/pdf");
            file3.put("fileSize", 256000);
            file3.put("uploadDate", "2025-11-19T08:30:00.000Z");
            file3.put("description", "CV des investigateurs");
            files.add(file3);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "files", files
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/files/view/{fileId}")
    public ResponseEntity<?> viewFile(@PathVariable String fileId, HttpServletRequest request) {
        try {
            String[] parts = fileId.split("_");
            if (parts.length < 2) {
                return ResponseEntity.status(404).body("Format d'ID fichier invalide");
            }
            
            Long protocolId = Long.parseLong(parts[0]);
            String fileType = parts[1];
            
            String sql = "SELECT protocol_file_name, consent_form_file_name, cv_files_names FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, protocolId);
            
            if (result.isEmpty()) {
                return ResponseEntity.status(404).body("Protocole non trouvé");
            }
            
            Map<String, Object> fileInfo = result.get(0);
            String fileName = null;
            
            switch (fileType) {
                case "protocol":
                    fileName = (String) fileInfo.get("protocol_file_name");
                    break;
                case "consent":
                    fileName = (String) fileInfo.get("consent_form_file_name");
                    break;
                case "cv":
                    fileName = (String) fileInfo.get("cv_files_names");
                    break;
            }
            
            if (fileName == null) {
                return ResponseEntity.status(404).body("Fichier non disponible");
            }
            
            String pdfContent = "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 50\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(" + fileName + ") Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000206 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n299\n%%EOF";
            
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "inline; filename=\"" + fileName + "\"")
                .body(pdfContent.getBytes());
                
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de la lecture du fichier");
        }
    }

    @GetMapping("/files/download/{fileId}")
    public ResponseEntity<?> downloadFile(@PathVariable String fileId, HttpServletRequest request) {
        try {
            String[] parts = fileId.split("_");
            if (parts.length < 2) {
                return ResponseEntity.status(404).body("Format d'ID fichier invalide");
            }
            
            Long protocolId = Long.parseLong(parts[0]);
            String fileType = parts[1];
            
            String sql = "SELECT protocol_file_name, consent_form_file_name, cv_files_names FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, protocolId);
            
            if (result.isEmpty()) {
                return ResponseEntity.status(404).body("Protocole non trouvé");
            }
            
            Map<String, Object> fileInfo = result.get(0);
            String fileName = null;
            
            switch (fileType) {
                case "protocol":
                    fileName = (String) fileInfo.get("protocol_file_name");
                    break;
                case "consent":
                    fileName = (String) fileInfo.get("consent_form_file_name");
                    break;
                case "cv":
                    fileName = (String) fileInfo.get("cv_files_names");
                    break;
            }
            
            if (fileName == null) {
                return ResponseEntity.status(404).body("Fichier non disponible");
            }
            
            String pdfContent = "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 60\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Téléchargement: " + fileName + ") Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000206 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n299\n%%EOF";
            
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                .body(pdfContent.getBytes());
                
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors du téléchargement");
        }
    }

    @PostMapping("/protocols/{protocolId}/president-signature")
    public ResponseEntity<?> addPresidentSignature(@PathVariable Long protocolId,
                                                   @RequestBody Map<String, Object> requestBody,
                                                   HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || !userRole.equalsIgnoreCase("president")) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé au président"
            ));
        }
        
        try {
            String updateSql = """
                UPDATE protocol_evaluations 
                SET president_signature_date = NOW(), president_name = ?, 
                    status = 'PRESIDENT_SIGNED'
                WHERE protocol_id = ? AND is_final = true
            """;
            
            String presidentName = (String) requestBody.get("presidentName");
            jdbcTemplate.update(updateSql, presidentName, protocolId);
            
            // Mettre à jour le statut du protocole
            String getOldStatusSql = "SELECT status FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> oldStatusResult = jdbcTemplate.queryForList(getOldStatusSql, protocolId);
            String oldStatus = oldStatusResult.isEmpty() ? "UNKNOWN" : (String) oldStatusResult.get(0).get("status");
            
            String updateProtocolSql = "UPDATE protocol_submissions SET status = 'PRESIDENT_SIGNED' WHERE id = ?";
            jdbcTemplate.update(updateProtocolSql, protocolId);
            
            // Notifier le changement
            notificationService.notifyStatusChange(protocolId, oldStatus, "PRESIDENT_SIGNED", presidentName);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Signature du président ajoutée"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/protocols/{protocolId}/secretary-stamp")
    public ResponseEntity<?> addSecretaryStamp(@PathVariable Long protocolId,
                                              @RequestBody Map<String, Object> requestBody,
                                              HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || !userRole.equalsIgnoreCase("secretary")) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé à la secrétaire"
            ));
        }
        
        try {
            String updateSql = """
                UPDATE protocol_evaluations 
                SET secretary_stamp_date = NOW(), secretary_name = ?, 
                    status = 'FINALIZED'
                WHERE protocol_id = ? AND is_final = true
            """;
            
            String secretaryName = (String) requestBody.get("secretaryName");
            jdbcTemplate.update(updateSql, secretaryName, protocolId);
            
            // Mettre à jour le statut du protocole
            String getOldStatusSql = "SELECT status FROM protocol_submissions WHERE id = ?";
            List<Map<String, Object>> oldStatusResult = jdbcTemplate.queryForList(getOldStatusSql, protocolId);
            String oldStatus = oldStatusResult.isEmpty() ? "UNKNOWN" : (String) oldStatusResult.get(0).get("status");
            
            String updateProtocolSql = "UPDATE protocol_submissions SET status = 'FINALIZED' WHERE id = ?";
            jdbcTemplate.update(updateProtocolSql, protocolId);
            
            // Notifier le changement final
            notificationService.notifyStatusChange(protocolId, oldStatus, "FINALIZED", secretaryName);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cachet ajouté - Décision finalisée"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }

    private List<Map<String, Object>> formatProtocols(List<Map<String, Object>> dbProtocols) {
        List<Map<String, Object>> protocols = new ArrayList<>();
        for (Map<String, Object> protocol : dbProtocols) {
            Map<String, Object> formatted = new HashMap<>();
            formatted.put("id", protocol.get("id"));
            formatted.put("title", protocol.get("title"));
            formatted.put("description", protocol.get("description"));
            formatted.put("principalInvestigator", protocol.get("principalinvestigator"));
            formatted.put("institution", protocol.get("institution"));
            formatted.put("participants", protocol.get("participants"));
            formatted.put("duration", protocol.get("duration"));
            formatted.put("status", protocol.get("status"));
            formatted.put("submittedAt", protocol.get("submitted_at"));
            formatted.put("verifiedAt", protocol.get("verified_at"));
            formatted.put("protocolCode", protocol.get("protocolcode"));
            formatted.put("ethicalConsiderations", protocol.get("ethical_considerations"));
            
            // Nouveaux champs pour l'état de l'évaluation
            formatted.put("hasDeliberation", protocol.get("hasdeliberation") != null ? protocol.get("hasdeliberation") : false);
            formatted.put("deliberationStatus", protocol.get("deliberationstatus") != null ? protocol.get("deliberationstatus") : "PENDING");
            
            protocols.add(formatted);
        }
        return protocols;
    }
}