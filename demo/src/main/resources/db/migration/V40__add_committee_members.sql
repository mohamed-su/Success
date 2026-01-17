-- Ajouter plus de membres du comité pour la sélection du rapporteur
INSERT INTO users (username, password, email, first_name, last_name, role, active, created_at, user_identifier) VALUES
('membre2', '$2a$12$LQv3c1yqBw2jo6H1Ph.VleXAiHRgPESt6dpB.F25LdkVgKgUBfUAu', 'membre2@comite-ethique.bf', 'Dr. Aminata', 'Traoré', 'COMMITTEE_MEMBER', true, NOW(), 'MBR002'),
('membre3', '$2a$12$LQv3c1yqBw2jo6H1Ph.VleXAiHRgPESt6dpB.F25LdkVgKgUBfUAu', 'membre3@comite-ethique.bf', 'Prof. Boukary', 'Ouédraogo', 'COMMITTEE_MEMBER', true, NOW(), 'MBR003'),
('membre4', '$2a$12$LQv3c1yqBw2jo6H1Ph.VleXAiHRgPESt6dpB.F25LdkVgKgUBfUAu', 'membre4@comite-ethique.bf', 'Dr. Fatimata', 'Kaboré', 'COMMITTEE_MEMBER', true, NOW(), 'MBR004'),
('rapporteur1', '$2a$12$LQv3c1yqBw2jo6H1Ph.VleXAiHRgPESt6dpB.F25LdkVgKgUBfUAu', 'rapporteur@comite-ethique.bf', 'Dr. Moussa', 'Sawadogo', 'RAPPORTEUR', true, NOW(), 'RAP001');

-- Mot de passe pour tous: membre123