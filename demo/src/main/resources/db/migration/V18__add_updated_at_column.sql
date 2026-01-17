-- Migration pour ajouter la colonne updated_at
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Initialiser updated_at avec created_at pour les utilisateurs existants
UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;