-- Ajout des champs pour l'évaluation des protocoles
ALTER TABLE protocol_submissions ADD COLUMN IF NOT EXISTS ethical_considerations TEXT;
ALTER TABLE protocol_submissions ADD COLUMN IF NOT EXISTS evaluation_comments TEXT;
ALTER TABLE protocol_submissions ADD COLUMN IF NOT EXISTS evaluated_by VARCHAR(255);
ALTER TABLE protocol_submissions ADD COLUMN IF NOT EXISTS evaluated_at TIMESTAMP;

-- Mise à jour des protocoles existants avec des considérations éthiques par défaut
UPDATE protocol_submissions 
SET ethical_considerations = 'Considérations éthiques à évaluer par le comité d''éthique.'
WHERE ethical_considerations IS NULL;