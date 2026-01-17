-- Migration pour ajouter la colonne username manquante
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);

-- Mettre à jour les valeurs username avec l'email pour les utilisateurs existants
UPDATE users SET username = email WHERE username IS NULL;

-- Ajouter la contrainte NOT NULL après avoir rempli les valeurs
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Ajouter la contrainte d'unicité
ALTER TABLE users ADD CONSTRAINT uk_users_username UNIQUE (username);