-- SCRIPT SQL COMPLET POUR TOUTES LES TABLES NÉCESSAIRES
-- ========================================================

-- 1. Table protocol_evaluations (délibérations)
CREATE TABLE IF NOT EXISTS protocol_evaluations (
    id SERIAL PRIMARY KEY,
    protocol_id INTEGER NOT NULL,
    evaluator_id INTEGER NOT NULL,
    nom_evaluateur VARCHAR(255),
    recommandation_finale VARCHAR(50),
    evaluation_form_data JSONB,
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_final BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deliberation_number VARCHAR(100),
    research_title TEXT,
    protocol_reference VARCHAR(100),
    documentation VARCHAR(255),
    applicant_reference VARCHAR(255),
    principal_investigator VARCHAR(255),
    research_site VARCHAR(255),
    deliberation_date DATE,
    protocol_examined BOOLEAN DEFAULT FALSE,
    information_notice_examined BOOLEAN DEFAULT FALSE,
    consent_form_examined BOOLEAN DEFAULT FALSE,
    investigator_cv_examined BOOLEAN DEFAULT FALSE,
    insurance_certificate_examined BOOLEAN DEFAULT FALSE,
    payment_proof_examined BOOLEAN DEFAULT FALSE,
    observations TEXT,
    members_present JSONB,
    committee_opinion VARCHAR(50),
    reserves TEXT,
    recommendations TEXT,
    rapporteur_signature VARCHAR(255),
    president_signature VARCHAR(255),
    rapporteur_signature_image TEXT
);

-- 2. Table member_evaluation_grids (si pas déjà créée)
CREATE TABLE IF NOT EXISTS member_evaluation_grids (
    id SERIAL PRIMARY KEY,
    protocol_id INTEGER NOT NULL,
    member_id INTEGER,
    member_name VARCHAR(255),
    protocol_french VARCHAR(10),
    cv_signed VARCHAR(10),
    consent_form VARCHAR(10),
    insurance VARCHAR(10),
    payment_proof VARCHAR(10),
    investigator_qualified VARCHAR(10),
    associated_investigators VARCHAR(10),
    justification_objectives VARCHAR(10),
    methodology_solid VARCHAR(10),
    budget_appropriate VARCHAR(10),
    trial_product VARCHAR(10),
    comparator_product VARCHAR(10),
    concomitant_product VARCHAR(10),
    decision VARCHAR(50),
    recommendations TEXT,
    comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    final_decision TEXT,
    signature_image TEXT,
    evaluator_name TEXT,
    evaluation_date DATE,
    rapporteur_signature_image TEXT,
    pdf_path VARCHAR(500),
    pdf_generated_at TIMESTAMP
);

-- 3. Table rapporteur_signatures
CREATE TABLE IF NOT EXISTS rapporteur_signatures (
    id SERIAL PRIMARY KEY,
    rapporteur_id INTEGER NOT NULL,
    signature_image TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. Index pour performances
CREATE INDEX IF NOT EXISTS idx_protocol_evaluations_protocol_id ON protocol_evaluations(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_evaluations_evaluator_id ON protocol_evaluations(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_member_evaluation_grids_protocol_id ON member_evaluation_grids(protocol_id);
CREATE INDEX IF NOT EXISTS idx_rapporteur_signatures_rapporteur_id ON rapporteur_signatures(rapporteur_id);

-- 5. Vérification des tables créées
SELECT 'protocol_evaluations' as table_name, COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'protocol_evaluations'
UNION ALL
SELECT 'member_evaluation_grids' as table_name, COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'member_evaluation_grids'
UNION ALL
SELECT 'rapporteur_signatures' as table_name, COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_name = 'rapporteur_signatures';