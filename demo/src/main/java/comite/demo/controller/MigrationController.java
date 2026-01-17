package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/migration")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MigrationController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/migrate-evaluations")
    public ResponseEntity<?> migrateEvaluations() {
        try {
            Map<String, Object> result = new HashMap<>();
            
            // 1. Créer les nouvelles tables
            createTables();
            result.put("tables_created", true);
            
            // 2. Migrer les données existantes
            int migratedCount = migrateExistingData();
            result.put("evaluations_migrated", migratedCount);
            
            // 3. Créer les PDFs simulés
            int pdfsCreated = createSimulatedPdfs();
            result.put("pdfs_created", pdfsCreated);
            
            // 4. Récupérer un résumé
            List<Map<String, Object>> summary = getSummary();
            result.put("summary", summary);
            
            result.put("success", true);
            result.put("message", "Migration terminée avec succès");
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    private void createTables() {
        // Créer la table protocol_evaluation_criteria
        jdbcTemplate.execute("""
            CREATE TABLE IF NOT EXISTS protocol_evaluation_criteria (
                id BIGSERIAL PRIMARY KEY,
                protocol_id BIGINT NOT NULL,
                evaluator_id BIGINT NOT NULL,
                evaluator_name VARCHAR(255),
                evaluator_role VARCHAR(50) DEFAULT 'MEMBER',
                
                protocol_french VARCHAR(10),
                cv_signed VARCHAR(10),
                consent_form VARCHAR(10),
                insurance VARCHAR(10),
                payment_proof VARCHAR(10),
                investigator_qualified VARCHAR(10),
                investigator_explanation TEXT,
                associated_investigators VARCHAR(10),
                study_justification VARCHAR(10),
                methodology VARCHAR(10),
                budget VARCHAR(10),
                investigation_product VARCHAR(10),
                comparator_product VARCHAR(10),
                concomitant_product VARCHAR(10),
                
                comments TEXT,
                decision VARCHAR(50),
                observations TEXT,
                
                status VARCHAR(20) DEFAULT 'DRAFT',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                submitted_at TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                CONSTRAINT unique_protocol_evaluator UNIQUE (protocol_id, evaluator_id)
            )
        """);
        
        // Créer la table evaluation_pdfs
        jdbcTemplate.execute("""
            CREATE TABLE IF NOT EXISTS evaluation_pdfs (
                id BIGSERIAL PRIMARY KEY,
                protocol_id BIGINT NOT NULL,
                evaluator_id BIGINT NOT NULL,
                evaluator_name VARCHAR(255),
                evaluator_role VARCHAR(50),
                criteria_id BIGINT,
                
                file_name VARCHAR(500) NOT NULL,
                file_path VARCHAR(1000) NOT NULL,
                file_size BIGINT,
                mime_type VARCHAR(100) DEFAULT 'application/pdf',
                
                status VARCHAR(20) DEFAULT 'GENERATED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """);
    }
    
    private int migrateExistingData() {
        return jdbcTemplate.update("""
            INSERT INTO protocol_evaluation_criteria (
                protocol_id, evaluator_id, evaluator_name, evaluator_role,
                protocol_french, cv_signed, consent_form, insurance, payment_proof,
                investigator_qualified, associated_investigators, study_justification, methodology,
                comments, decision, observations, status, created_at, submitted_at, updated_at
            )
            SELECT 
                meg.protocol_id,
                meg.member_id,
                meg.member_name,
                COALESCE(u.role::text, 'MEMBER'),
                
                'Oui' as protocol_french,
                'Oui' as cv_signed, 
                'Oui' as consent_form,
                'Oui' as insurance,
                'Oui' as payment_proof,
                
                CASE 
                    WHEN meg.scientific_quality >= 4 THEN 'Oui'
                    WHEN meg.scientific_quality >= 2 THEN 'Partiellement'
                    ELSE 'Non'
                END as investigator_qualified,
                
                CASE 
                    WHEN meg.feasibility >= 4 THEN 'Oui'
                    WHEN meg.feasibility >= 2 THEN 'Partiellement'
                    ELSE 'Non'
                END as associated_investigators,
                
                CASE 
                    WHEN meg.ethical_compliance >= 4 THEN 'Oui'
                    WHEN meg.ethical_compliance >= 2 THEN 'Partiellement'
                    ELSE 'Non'
                END as study_justification,
                
                CASE 
                    WHEN meg.methodology_clarity >= 4 THEN 'Oui'
                    WHEN meg.methodology_clarity >= 2 THEN 'Partiellement'
                    ELSE 'Non'
                END as methodology,
                
                CONCAT('{',
                    '"strengths":"', COALESCE(REPLACE(meg.strengths, '"', '\\"'), ''), '",',
                    '"weaknesses":"', COALESCE(REPLACE(meg.weaknesses, '"', '\\"'), ''), '",',
                    '"recommendations":"', COALESCE(REPLACE(meg.recommendations, '"', '\\"'), ''), '",',
                    '"general_comments":"', COALESCE(REPLACE(meg.general_comments, '"', '\\"'), ''), '",',
                    '"scientific_quality":', COALESCE(meg.scientific_quality, 0), ',',
                    '"ethical_compliance":', COALESCE(meg.ethical_compliance, 0), ',',
                    '"methodology_clarity":', COALESCE(meg.methodology_clarity, 0), ',',
                    '"risk_benefit_ratio":', COALESCE(meg.risk_benefit_ratio, 0), ',',
                    '"informed_consent_quality":', COALESCE(meg.informed_consent_quality, 0), ',',
                    '"data_protection":', COALESCE(meg.data_protection, 0), ',',
                    '"participant_safety":', COALESCE(meg.participant_safety, 0), ',',
                    '"feasibility":', COALESCE(meg.feasibility, 0),
                    '}') as comments,
                
                CASE 
                    WHEN meg.decision = 'APPROVE' THEN 'Favorable'
                    WHEN meg.decision = 'REJECT' THEN 'Non favorable'
                    WHEN meg.decision = 'MINOR_REVISION' OR meg.decision = 'MAJOR_REVISION' THEN 'Ajourné'
                    ELSE 'Favorable'
                END as decision,
                
                CONCAT_WS(' | ',
                    CASE WHEN meg.strengths IS NOT NULL AND meg.strengths != '' THEN 'Points forts: ' || meg.strengths END,
                    CASE WHEN meg.weaknesses IS NOT NULL AND meg.weaknesses != '' THEN 'Points faibles: ' || meg.weaknesses END,
                    CASE WHEN meg.recommendations IS NOT NULL AND meg.recommendations != '' THEN 'Recommandations: ' || meg.recommendations END,
                    CASE WHEN meg.general_comments IS NOT NULL AND meg.general_comments != '' THEN 'Commentaires: ' || meg.general_comments END
                ) as observations,
                
                CASE 
                    WHEN meg.status = 'SUBMITTED' THEN 'SUBMITTED'
                    WHEN meg.submitted_at IS NOT NULL THEN 'SUBMITTED'
                    ELSE 'DRAFT'
                END as status,
                
                meg.created_at,
                meg.submitted_at,
                meg.updated_at

            FROM member_evaluation_grids meg
            LEFT JOIN users u ON meg.member_id = u.id
            WHERE NOT EXISTS (
                SELECT 1 FROM protocol_evaluation_criteria pec 
                WHERE pec.protocol_id = meg.protocol_id AND pec.evaluator_id = meg.member_id
            )
        """);
    }
    
    private int createSimulatedPdfs() {
        return jdbcTemplate.update("""
            INSERT INTO evaluation_pdfs (
                protocol_id, evaluator_id, evaluator_name, evaluator_role, criteria_id,
                file_name, file_path, file_size, status, created_at
            )
            SELECT 
                pec.protocol_id,
                pec.evaluator_id,
                pec.evaluator_name,
                pec.evaluator_role,
                pec.id,
                CONCAT('evaluation_PROT-', pec.protocol_id, '_', REPLACE(pec.evaluator_name, ' ', '_'), '_', 
                       TO_CHAR(COALESCE(pec.submitted_at, pec.created_at), 'YYYYMMDD_HH24MISS'), '.pdf'),
                CONCAT('uploads/evaluations/evaluation_PROT-', pec.protocol_id, '_', REPLACE(pec.evaluator_name, ' ', '_'), '_', 
                       TO_CHAR(COALESCE(pec.submitted_at, pec.created_at), 'YYYYMMDD_HH24MISS'), '.pdf'),
                FLOOR(RANDOM() * 200000 + 150000)::BIGINT,
                'GENERATED',
                COALESCE(pec.submitted_at, pec.created_at)
            FROM protocol_evaluation_criteria pec
            WHERE pec.status = 'SUBMITTED'
            AND NOT EXISTS (
                SELECT 1 FROM evaluation_pdfs ep 
                WHERE ep.protocol_id = pec.protocol_id AND ep.evaluator_id = pec.evaluator_id
            )
        """);
    }
    
    private List<Map<String, Object>> getSummary() {
        return jdbcTemplate.queryForList("""
            SELECT 
                pec.protocol_id,
                CONCAT('PROT-', LPAD(pec.protocol_id::text, 4, '0')) as protocol_code,
                COUNT(*) as nb_evaluations,
                STRING_AGG(pec.evaluator_name, ', ') as evaluateurs,
                COUNT(ep.id) as nb_pdfs
            FROM protocol_evaluation_criteria pec
            LEFT JOIN evaluation_pdfs ep ON pec.protocol_id = ep.protocol_id AND pec.evaluator_id = ep.evaluator_id
            GROUP BY pec.protocol_id
            ORDER BY pec.protocol_id
        """);
    }
    
    @GetMapping("/check-existing-data")
    public ResponseEntity<?> checkExistingData() {
        try {
            Map<String, Object> result = new HashMap<>();
            
            // Vérifier les données dans member_evaluation_grids
            List<Map<String, Object>> existingData = jdbcTemplate.queryForList("""
                SELECT 
                    meg.protocol_id,
                    CONCAT('PROT-', LPAD(meg.protocol_id::text, 4, '0')) as protocol_code,
                    COUNT(*) as nb_evaluations,
                    STRING_AGG(meg.member_name, ', ') as evaluateurs,
                    STRING_AGG(meg.status, ', ') as statuts
                FROM member_evaluation_grids meg
                GROUP BY meg.protocol_id
                ORDER BY meg.protocol_id
            """);
            
            result.put("existing_evaluations", existingData);
            result.put("success", true);
            
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}