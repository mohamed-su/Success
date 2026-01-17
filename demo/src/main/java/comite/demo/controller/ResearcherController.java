package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/researcher")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ResearcherController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/decisions")
    public ResponseEntity<?> getResearcherDecisions(HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || !userRole.equalsIgnoreCase("researcher")) {
            return ResponseEntity.status(403).body(Map.of(
                "success", false,
                "error", "Accès réservé aux chercheurs"
            ));
        }
        
        try {
            String sql = """
                SELECT pe.id, pe.protocol_id as protocolid, 
                       CONCAT('PROT-', LPAD(pe.protocol_id::text, 4, '0')) as protocolcode,
                       pe.deliberation_number as deliberationnumber,
                       COALESCE(pe.research_title, ps.title) as researchtitle,
                       pe.protocol_reference as protocolreference,
                       COALESCE(pe.principal_investigator, ps.submitter_name) as principalinvestigator,
                       pe.requester_reference as requesterreference,
                       pe.research_site as researchsite,
                       pe.deliberation_date as deliberationdate,
                       pe.documentation,
                       pe.scientific_conception as scientificconception,
                       pe.participant_protection as participantprotection,
                       pe.data_confidentiality as dataconfidentiality,
                       pe.consent_process as consentprocess,
                       pe.research_budget as researchbudget,
                       pe.cv_documents as cvdocuments,
                       pe.observations,
                       pe.reserves,
                       pe.recommendations,
                       pe.recommandation_finale as decision,
                       pe.members_present as memberspresent,
                       pe.nom_evaluateur as rapporteur,
                       pe.evaluation_date as evaluationdate,
                       pe.president_signature_date as presidentsignaturedate,
                       pe.president_name as presidentname,
                       pe.president_signature as presidentsignature,
                       ps.institution,
                       ps.participants,
                       ps.duration,
                       ps.description,
                       ps.study_type as studytype,
                       ps.ethical_considerations,
                       ps.protocol_file_name,
                       ps.consent_form_file_name,
                       ps.cv_files_names,
                       ps.payment_receipt_file_name,
                       ps.payment_status,
                       ps.submitter_email,
                       ps.submitter_phone,
                       ps.submission_datetime
                FROM protocol_evaluations pe
                JOIN protocol_submissions ps ON pe.protocol_id = ps.id
                WHERE pe.president_signature_date IS NOT NULL
                ORDER BY pe.president_signature_date DESC
            """;
            
            List<Map<String, Object>> dbResults = jdbcTemplate.queryForList(sql);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "decisions", dbResults,
                "count", dbResults.size()
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", "Erreur lors de la récupération des décisions: " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/decisions/{decisionId}/signature")
    public ResponseEntity<?> downloadSignature(@PathVariable Long decisionId, HttpServletRequest request) {
        String userId = request.getHeader("X-User-ID");
        String userRole = request.getHeader("X-User-Role");
        
        if (userId == null || !userRole.equalsIgnoreCase("researcher")) {
            return ResponseEntity.status(403).build();
        }
        
        try {
            String sql = "SELECT president_signature FROM protocol_evaluations WHERE id = ? AND status = 'SENT_TO_RESEARCHER'";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, decisionId);
            
            if (result.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            String signatureFilePath = (String) result.get(0).get("president_signature");
            if (signatureFilePath == null) {
                return ResponseEntity.notFound().build();
            }
            
            java.nio.file.Path filePath = java.nio.file.Paths.get(signatureFilePath);
            if (!java.nio.file.Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            org.springframework.core.io.Resource resource = new org.springframework.core.io.FileSystemResource(filePath);
            
            return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"signature_president." + getFileExtension(signatureFilePath) + "\"")
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return "png";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }
}