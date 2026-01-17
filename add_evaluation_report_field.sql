-- Script pour ajouter le champ evaluation_report_file_name à la table protocol_submissions
-- À exécuter sur la base de données PostgreSQL

ALTER TABLE protocol_submissions 
ADD COLUMN IF NOT EXISTS evaluation_report_file_name VARCHAR(255);

-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'protocol_submissions' 
AND column_name = 'evaluation_report_file_name';

-- Afficher la structure complète de la table pour vérification
\d protocol_submissions;