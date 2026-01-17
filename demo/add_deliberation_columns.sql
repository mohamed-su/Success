-- Script pour ajouter les colonnes du nouveau formulaire de délibération
-- Basé sur le document officiel du Comité d'Éthique

ALTER TABLE protocol_evaluations 
ADD COLUMN IF NOT EXISTS deliberation_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS research_title TEXT,
ADD COLUMN IF NOT EXISTS protocol_reference VARCHAR(100),
ADD COLUMN IF NOT EXISTS principal_investigator VARCHAR(255),
ADD COLUMN IF NOT EXISTS research_site VARCHAR(255),
ADD COLUMN IF NOT EXISTS deliberation_date DATE,
ADD COLUMN IF NOT EXISTS observations TEXT,
ADD COLUMN IF NOT EXISTS recommendations TEXT,
ADD COLUMN IF NOT EXISTS members_present TEXT,
ADD COLUMN IF NOT EXISTS scientific_conception BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS participant_protection BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS data_confidentiality BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS consent_process BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS research_budget BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS cv_documents BOOLEAN DEFAULT FALSE;