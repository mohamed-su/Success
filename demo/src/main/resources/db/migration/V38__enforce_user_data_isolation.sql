-- Migration pour forcer l'isolation des données par utilisateur au niveau base de données

-- 1. S'assurer que la colonne existe
ALTER TABLE protocol_submissions ADD COLUMN IF NOT EXISTS submitter_identifier VARCHAR(8);

-- 2. Mettre à jour les valeurs NULL existantes
UPDATE protocol_submissions 
SET submitter_identifier = 'default_user' 
WHERE submitter_identifier IS NULL OR submitter_identifier = '';

-- 3. S'assurer que submitter_identifier est obligatoire
ALTER TABLE protocol_submissions ALTER COLUMN submitter_identifier SET NOT NULL;