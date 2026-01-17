-- Script pour ajouter les nouveaux champs obligatoires
-- Exécuter ce script sur votre base de données PostgreSQL

ALTER TABLE protocol_submissions 
ADD COLUMN IF NOT EXISTS president_letter_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS information_notice_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS informed_consent_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS chronogram_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS detailed_budget_file_name VARCHAR(255);

-- Vérifier les colonnes ajoutées
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'protocol_submissions' 
AND column_name IN (
    'president_letter_file_name',
    'information_notice_file_name', 
    'informed_consent_file_name',
    'chronogram_file_name',
    'detailed_budget_file_name'
);