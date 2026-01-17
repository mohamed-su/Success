-- Migration pour ajouter la colonne user_identifier
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_identifier VARCHAR(8) UNIQUE;

-- Générer des identifiants uniques pour les utilisateurs existants
UPDATE users SET user_identifier = UPPER(SUBSTRING(MD5(RANDOM()::text), 1, 8)) WHERE user_identifier IS NULL;

-- Rendre la colonne NOT NULL après avoir rempli les valeurs
ALTER TABLE users ALTER COLUMN user_identifier SET NOT NULL;