-- Migration pour ajouter la colonne submitter_identifier à protocol_submissions
ALTER TABLE protocol_submissions ADD COLUMN IF NOT EXISTS submitter_identifier VARCHAR(8);

-- Générer des identifiants pour les protocoles existants (optionnel)
UPDATE protocol_submissions SET submitter_identifier = UPPER(SUBSTRING(MD5(RANDOM()::text), 1, 8)) WHERE submitter_identifier IS NULL;