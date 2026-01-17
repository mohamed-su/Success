-- Script pour créer la table protocol_assignments manquante
-- Connexion à la base de données comite_ethique

\c comite_ethique;

-- Création de la table protocol_assignments
CREATE TABLE IF NOT EXISTS protocol_assignments (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    assigned_member_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    can_edit BOOLEAN DEFAULT true,
    downloaded BOOLEAN DEFAULT false,
    FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_member_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(protocol_id, assigned_member_id)
);

-- Création d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_protocol_assignments_protocol ON protocol_assignments(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_assignments_member ON protocol_assignments(assigned_member_id);

-- Ajout de quelques utilisateurs membres du comité pour les tests
INSERT INTO users (username, email, password, first_name, last_name, role, active) 
VALUES 
    ('president', 'president@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nHb8GjU5cWO', 'Président', 'Comité', 'president', true),
    ('member1', 'member1@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nHb8GjU5cWO', 'Dr. Jean', 'Dupont', 'COMMITTEE_MEMBER', true),
    ('member2', 'member2@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nHb8GjU5cWO', 'Dr. Marie', 'Martin', 'COMMITTEE_MEMBER', true),
    ('rapporteur1', 'rapporteur1@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nHb8GjU5cWO', 'Dr. Paul', 'Bernard', 'RAPPORTEUR', true)
ON CONFLICT (username) DO NOTHING;

-- Ajout de quelques protocoles de test avec statut VERIFIED
INSERT INTO protocol_submissions (
    title, description, principal_investigator, institution, 
    duration, participants, ethical_considerations, submitter_name, submitter_identifier, status
) VALUES 
    ('Protocole Test 1 - Vérifié', 
     'Description du protocole de test 1', 
     'Dr. Test Researcher', 'Institution Test', 
     6, 50, 'Considérations éthiques test', 
     'Test Researcher', 'test1', 'VERIFIED'),
    ('Protocole Test 2 - Vérifié', 
     'Description du protocole de test 2', 
     'Dr. Another Researcher', 'Autre Institution', 
     12, 100, 'Autres considérations éthiques', 
     'Another Researcher', 'test2', 'VERIFIED')
ON CONFLICT DO NOTHING;

-- Vérification des données
SELECT 'Tables créées avec succès' as status;
SELECT 'Protocoles VERIFIED:' as info, COUNT(*) as count FROM protocol_submissions WHERE status = 'VERIFIED';
SELECT 'Membres du comité:' as info, COUNT(*) as count FROM users WHERE role IN ('COMMITTEE_MEMBER', 'RAPPORTEUR');