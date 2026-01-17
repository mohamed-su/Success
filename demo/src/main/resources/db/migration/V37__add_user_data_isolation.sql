-- Migration pour renforcer l'isolation des données utilisateur

-- Ajouter des index pour améliorer les performances des requêtes filtrées par utilisateur
CREATE INDEX IF NOT EXISTS idx_protocol_submissions_submitter_identifier 
ON protocol_submissions(submitter_identifier);

-- Ajouter des commentaires pour documenter la sécurité
COMMENT ON COLUMN protocol_submissions.submitter_identifier IS 'Identifiant unique du soumetteur - utilisé pour l''isolation des données';