-- Migration pour ajouter les champs de sécurité avancée
-- Conforme aux normes OWASP, NIST et ISO 27001

-- Ajout des colonnes de sécurité à la table users avec gestion des valeurs NULL
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

-- Initialisation des valeurs par défaut pour les utilisateurs existants
UPDATE users 
SET password_expiry_date = CURRENT_TIMESTAMP + INTERVAL '90 days',
    previous_passwords = '[]',
    failed_login_attempts = 0,
    two_factor_enabled = FALSE
WHERE password_expiry_date IS NULL;

-- Index pour améliorer les performances des requêtes de sécurité
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
CREATE INDEX IF NOT EXISTS idx_users_account_locked ON users(account_locked_until);
CREATE INDEX IF NOT EXISTS idx_users_failed_attempts ON users(failed_login_attempts);

-- Table pour l'audit des connexions (conformité ISO 27001)
CREATE TABLE IF NOT EXISTS login_audit (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(255),
    session_id VARCHAR(255)
);

-- Index pour la table d'audit
CREATE INDEX IF NOT EXISTS idx_login_audit_username ON login_audit(username);
CREATE INDEX IF NOT EXISTS idx_login_audit_time ON login_audit(login_time);
CREATE INDEX IF NOT EXISTS idx_login_audit_ip ON login_audit(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_audit_success ON login_audit(success);

-- Table pour les tokens JWT révoqués (blacklist)
CREATE TABLE IF NOT EXISTS revoked_tokens (
    id BIGSERIAL PRIMARY KEY,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Index pour la table des tokens révoqués
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_hash ON revoked_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires ON revoked_tokens(expires_at);

-- Contraintes de sécurité
ALTER TABLE users ADD CONSTRAINT chk_failed_attempts CHECK (failed_login_attempts >= 0);
ALTER TABLE users ADD CONSTRAINT chk_password_expiry CHECK (password_expiry_date > created_at);

-- Commentaires pour la documentation
COMMENT ON COLUMN users.password_expiry_date IS 'Date d''expiration du mot de passe (90 jours par défaut)';
COMMENT ON COLUMN users.previous_passwords IS 'Historique JSON des 5 derniers mots de passe hashés';
COMMENT ON COLUMN users.failed_login_attempts IS 'Nombre de tentatives de connexion échouées consécutives';
COMMENT ON COLUMN users.account_locked_until IS 'Date jusqu''à laquelle le compte est verrouillé';
COMMENT ON COLUMN users.reset_token IS 'Token hashé pour la réinitialisation du mot de passe';
COMMENT ON COLUMN users.reset_token_expiry IS 'Date d''expiration du token de réinitialisation';
COMMENT ON COLUMN users.two_factor_enabled IS 'Indique si l''authentification à deux facteurs est activée';
COMMENT ON COLUMN users.two_factor_secret IS 'Clé secrète pour l''authentification à deux facteurs';
COMMENT ON COLUMN users.last_login_date IS 'Date de la dernière connexion réussie';
COMMENT ON COLUMN users.last_login_ip IS 'Adresse IP de la dernière connexion réussie';

COMMENT ON TABLE login_audit IS 'Table d''audit des tentatives de connexion pour conformité ISO 27001';
COMMENT ON TABLE revoked_tokens IS 'Liste noire des tokens JWT révoqués';