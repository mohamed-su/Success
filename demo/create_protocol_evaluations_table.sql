-- Script SQL pour créer/modifier la table protocol_evaluations
-- Exécuter ces requêtes dans PostgreSQL

-- 1. Créer la table protocol_evaluations si elle n'existe pas
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Ajouter les colonnes manquantes pour le formulaire de délibération
ALTER TABLE protocol_evaluations 
ADD COLUMN IF NOT EXISTS deliberation_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS research_title TEXT,
ADD COLUMN IF NOT EXISTS protocol_reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS documentation VARCHAR(255),
ADD COLUMN IF NOT EXISTS applicant_reference VARCHAR(255),
ADD COLUMN IF NOT EXISTS principal_investigator VARCHAR(255),
ADD COLUMN IF NOT EXISTS research_site VARCHAR(255),
ADD COLUMN IF NOT EXISTS deliberation_date DATE,
ADD COLUMN IF NOT EXISTS protocol_examined BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS information_notice_examined BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS consent_form_examined BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS investigator_cv_examined BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS insurance_certificate_examined BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_proof_examined BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS observations TEXT,
ADD COLUMN IF NOT EXISTS members_present JSONB,
ADD COLUMN IF NOT EXISTS committee_opinion VARCHAR(50),
ADD COLUMN IF NOT EXISTS reserves TEXT,
ADD COLUMN IF NOT EXISTS recommendations TEXT,
ADD COLUMN IF NOT EXISTS rapporteur_signature VARCHAR(255),
ADD COLUMN IF NOT EXISTS president_signature VARCHAR(255),
ADD COLUMN IF NOT EXISTS rapporteur_signature_image TEXT;

-- 3. Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_protocol_evaluations_protocol_id ON protocol_evaluations(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_evaluations_evaluator_id ON protocol_evaluations(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_protocol_evaluations_deliberation_date ON protocol_evaluations(deliberation_date);

-- 4. Vérifier la structure de la table (requête de vérification - ne pas exécuter)
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'protocol_evaluations' 
-- ORDER BY ordinal_position;