-- Script de configuration de la base de données PostgreSQL
-- Comité d'Éthique de la Recherche

-- Création de la base de données (si elle n'existe pas)
CREATE DATABASE IF NOT EXISTS comite_ethique;

-- Utilisation de la base de données
\c comite_ethique;

-- Vérification et création de la table protocol_submissions
CREATE TABLE IF NOT EXISTS protocol_submissions (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    study_type VARCHAR(100),
    principal_investigator VARCHAR(200),
    institution VARCHAR(200),
    duration INTEGER,
    participants INTEGER,
    ethics_considerations TEXT,
    protocol_file_name VARCHAR(255),
    consent_form_file_name VARCHAR(255),
    cv_files_names VARCHAR(500),
    payment_receipt_file_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    submitter_name VARCHAR(200),
    submitter_identifier VARCHAR(100),
    verification_comments TEXT,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_verified_at TIMESTAMP,
    payment_verified_by BIGINT,
    payment_comments TEXT,
    ethical_considerations TEXT,
    evaluation_comments TEXT,
    evaluated_by VARCHAR(200),
    evaluated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table users (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'researcher',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table protocol_member_assignments (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS protocol_member_assignments (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    member_name VARCHAR(200),
    assigned_by_id BIGINT,
    assigned_by_name VARCHAR(200),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ASSIGNED',
    FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(protocol_id, member_id)
);

-- Insertion de données de test (utilisateurs)
INSERT INTO users (username, email, password, first_name, last_name, role) 
VALUES 
    ('admin', 'admin@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nHb8GjU5cWO', 'Admin', 'System', 'admin'),
    ('secretary', 'secretary@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nHb8GjU5cWO', 'Secrétaire', 'Comité', 'secretary'),
    ('moamoa33944', 'moamoa33944@gmail.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nHb8GjU5cWO', 'Mohamed', 'Ouedraogo', 'researcher')
ON CONFLICT (username) DO NOTHING;

-- Insertion de données de test (protocoles)
INSERT INTO protocol_submissions (
    title, description, study_type, principal_investigator, institution, 
    duration, participants, ethical_considerations, submitter_name, submitter_identifier, status
) VALUES 
    ('Étude sur l''efficacité des traitements traditionnels', 
     'Recherche comparative sur l''efficacité des traitements traditionnels versus modernes', 
     'Clinique', 'Dr. Mohamed Ouedraogo', 'Université de Ouagadougou', 
     12, 150, 'Consentement éclairé requis pour tous les participants', 
     'Mohamed Ouedraogo', 'moamoa33944', 'SUBMITTED'),
    ('Impact de la nutrition sur la santé infantile', 
     'Étude longitudinale sur l''impact de la nutrition sur le développement des enfants', 
     'Observationnelle', 'Dr. Fatima Kone', 'CHU Yalgado', 
     18, 200, 'Protection spéciale pour les mineurs', 
     'Fatima Kone', 'fatima.kone', 'DRAFT')
ON CONFLICT DO NOTHING;

-- Création d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_protocol_submissions_status ON protocol_submissions(status);
CREATE INDEX IF NOT EXISTS idx_protocol_submissions_submitter ON protocol_submissions(submitter_identifier);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Mise à jour du timestamp automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mise à jour automatique
DROP TRIGGER IF EXISTS update_protocol_submissions_updated_at ON protocol_submissions;
CREATE TRIGGER update_protocol_submissions_updated_at 
    BEFORE UPDATE ON protocol_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vérification des données
SELECT 'Protocoles:' as info, COUNT(*) as count FROM protocol_submissions
UNION ALL
SELECT 'Utilisateurs:', COUNT(*) FROM users
UNION ALL
SELECT 'Assignations:', COUNT(*) FROM protocol_member_assignments;

-- Affichage des protocoles existants
SELECT id, title, status, submitter_identifier, created_at 
FROM protocol_submissions 
ORDER BY id;