-- Ajout des identifiants uniques pour l'isolation des données

-- Ajouter l'identifiant unique pour les utilisateurs
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_identifier VARCHAR(8) UNIQUE;

-- Générer des identifiants uniques pour les utilisateurs existants
UPDATE users SET user_identifier = UPPER(SUBSTRING(REPLACE(CAST(gen_random_uuid() AS TEXT), '-', ''), 1, 8)) WHERE user_identifier IS NULL;

-- Ajouter l'identifiant du soumetteur dans protocol_submissions
ALTER TABLE protocol_submissions ADD COLUMN IF NOT EXISTS submitter_identifier VARCHAR(8);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_identifier ON users(user_identifier);
CREATE INDEX IF NOT EXISTS idx_protocol_submissions_submitter ON protocol_submissions(submitter_identifier);