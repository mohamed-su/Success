-- Migration pour supprimer les champs de sécurité avancée non utilisés

-- Suppression des colonnes de sécurité avancée non utilisées
ALTER TABLE users DROP COLUMN IF EXISTS password_expiry_date;
ALTER TABLE users DROP COLUMN IF EXISTS previous_passwords;
ALTER TABLE users DROP COLUMN IF EXISTS failed_login_attempts;
ALTER TABLE users DROP COLUMN IF EXISTS account_locked_until;
ALTER TABLE users DROP COLUMN IF EXISTS reset_token;
ALTER TABLE users DROP COLUMN IF EXISTS reset_token_expiry;
ALTER TABLE users DROP COLUMN IF EXISTS two_factor_enabled;
ALTER TABLE users DROP COLUMN IF EXISTS two_factor_secret;
ALTER TABLE users DROP COLUMN IF EXISTS last_login_date;
ALTER TABLE users DROP COLUMN IF EXISTS last_login_ip;

-- Suppression des tables d'audit non utilisées
DROP TABLE IF EXISTS login_audit;
DROP TABLE IF EXISTS revoked_tokens;