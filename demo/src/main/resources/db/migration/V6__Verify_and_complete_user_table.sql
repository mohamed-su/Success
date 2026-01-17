-- Migration pour vérifier et compléter la table users avec tous les champs de l'entité User
-- Cette migration s'assure que tous les champs de l'entité User.java sont présents

-- Vérification et ajout des champs de base (au cas où ils manqueraient)
ALTER TABLE users ADD COLUMN IF NOT EXISTS id BIGSERIAL PRIMARY KEY;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;

-- Vérification et ajout des champs de sécurité avancée
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_expiry_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS previous_passwords TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_date TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login_ip VARCHAR(45);

-- Mise à jour des contraintes et valeurs par défaut pour les champs obligatoires
UPDATE users SET username = email WHERE username IS NULL OR username = '';
UPDATE users SET active = TRUE WHERE active IS NULL;
UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
UPDATE users SET failed_login_attempts = 0 WHERE failed_login_attempts IS NULL;
UPDATE users SET two_factor_enabled = FALSE WHERE two_factor_enabled IS NULL;
UPDATE users SET previous_passwords = '[]' WHERE previous_passwords IS NULL;

-- Application des contraintes NOT NULL pour les champs obligatoires
ALTER TABLE users ALTER COLUMN username SET NOT NULL;
ALTER TABLE users ALTER COLUMN password SET NOT NULL;
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN role SET NOT NULL;
ALTER TABLE users ALTER COLUMN active SET NOT NULL;
ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;

-- Contraintes d'unicité
ALTER TABLE users DROP CONSTRAINT IF EXISTS uk_users_username;
ALTER TABLE users ADD CONSTRAINT uk_users_username UNIQUE (username);
ALTER TABLE users DROP CONSTRAINT IF EXISTS uk_users_email;
ALTER TABLE users ADD CONSTRAINT uk_users_email UNIQUE (email);

-- Contraintes de validation
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_role;
ALTER TABLE users ADD CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'SECRETARY', 'PRESIDENT', 'COMMITTEE_MEMBER', 'RAPPORTEUR', 'RESEARCHER'));

ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_failed_attempts;
ALTER TABLE users ADD CONSTRAINT chk_failed_attempts CHECK (failed_login_attempts >= 0);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
CREATE INDEX IF NOT EXISTS idx_users_account_locked ON users(account_locked_until);
CREATE INDEX IF NOT EXISTS idx_users_failed_attempts ON users(failed_login_attempts);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login_date);

-- Commentaires pour la documentation
COMMENT ON TABLE users IS 'Table des utilisateurs du système CERS avec sécurité avancée';
COMMENT ON COLUMN users.id IS 'Identifiant unique de l''utilisateur';
COMMENT ON COLUMN users.username IS 'Nom d''utilisateur unique pour la connexion';
COMMENT ON COLUMN users.password IS 'Mot de passe hashé de l''utilisateur';
COMMENT ON COLUMN users.email IS 'Adresse email unique de l''utilisateur';
COMMENT ON COLUMN users.first_name IS 'Prénom de l''utilisateur';
COMMENT ON COLUMN users.last_name IS 'Nom de famille de l''utilisateur';
COMMENT ON COLUMN users.role IS 'Rôle de l''utilisateur dans le système';
COMMENT ON COLUMN users.phone_number IS 'Numéro de téléphone de l''utilisateur (optionnel)';
COMMENT ON COLUMN users.active IS 'Indique si le compte utilisateur est actif';
COMMENT ON COLUMN users.created_at IS 'Date et heure de création du compte';
COMMENT ON COLUMN users.password_expiry_date IS 'Date d''expiration du mot de passe';
COMMENT ON COLUMN users.previous_passwords IS 'Historique JSON des mots de passe précédents';
COMMENT ON COLUMN users.failed_login_attempts IS 'Nombre de tentatives de connexion échouées';
COMMENT ON COLUMN users.account_locked_until IS 'Date jusqu''à laquelle le compte est verrouillé';
COMMENT ON COLUMN users.reset_token IS 'Token pour la réinitialisation du mot de passe';
COMMENT ON COLUMN users.reset_token_expiry IS 'Date d''expiration du token de réinitialisation';
COMMENT ON COLUMN users.two_factor_enabled IS 'Authentification à deux facteurs activée';
COMMENT ON COLUMN users.two_factor_secret IS 'Clé secrète pour l''authentification à deux facteurs';
COMMENT ON COLUMN users.last_login_date IS 'Date de la dernière connexion réussie';
COMMENT ON COLUMN users.last_login_ip IS 'Adresse IP de la dernière connexion';