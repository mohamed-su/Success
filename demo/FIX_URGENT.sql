-- SCRIPT SQL URGENT À EXÉCUTER MAINTENANT
-- ==========================================

-- Ajouter toutes les colonnes manquantes à la table protocol_evaluations
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