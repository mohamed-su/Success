-- Ajout des champs pour la suspension automatique des utilisateurs

ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS suspension_reason TEXT;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_suspended ON users(suspended);
CREATE INDEX IF NOT EXISTS idx_users_active_suspended ON users(active, suspended);