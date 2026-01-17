package comite.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DatabaseFixController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/fix-missing-fields")
    public ResponseEntity<?> fixMissingFields() {
        try {
            // Ajouter les colonnes manquantes
            String[] alterQueries = {
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS protocol_reference VARCHAR(255)",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS requester_reference VARCHAR(255)",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS documentation TEXT",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS reserves TEXT",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS scientific_conception BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS participant_protection BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS data_confidentiality BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS consent_process BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS research_budget BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS cv_documents BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_koueta BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_nanga BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_drabo BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_toe BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_ouedraogo1 BOOLEAN DEFAULT false",
                "ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_ouedraogo2 BOOLEAN DEFAULT false"
            };

            for (String query : alterQueries) {
                jdbcTemplate.execute(query);
            }

            // Mettre à jour les données existantes
            String updateQuery = """
                UPDATE protocol_evaluations 
                SET 
                    protocol_reference = COALESCE(protocol_reference, 'Version non précisée'),
                    requester_reference = COALESCE(requester_reference, principal_investigator),
                    documentation = COALESCE(documentation, 'Protocole de recherche, Copie du reçu de paiement'),
                    reserves = COALESCE(reserves, ''),
                    scientific_conception = COALESCE(scientific_conception, true),
                    participant_protection = COALESCE(participant_protection, true),
                    data_confidentiality = COALESCE(data_confidentiality, true),
                    consent_process = COALESCE(consent_process, true),
                    research_budget = COALESCE(research_budget, false),
                    cv_documents = COALESCE(cv_documents, true),
                    member_nanga = COALESCE(member_nanga, true),
                    member_koueta = COALESCE(member_koueta, true)
                WHERE id IS NOT NULL
            """;

            int updatedRows = jdbcTemplate.update(updateQuery);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Champs manquants ajoutés avec succès",
                "updatedRows", updatedRows
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
}