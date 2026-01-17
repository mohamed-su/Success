-- Ajoute la colonne signature pour le président
ALTER TABLE protocol_evaluations 
ADD COLUMN IF NOT EXISTS president_signature TEXT;