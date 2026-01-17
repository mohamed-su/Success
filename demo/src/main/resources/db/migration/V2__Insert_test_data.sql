-- Insert test users
INSERT INTO users (first_name, last_name, email, password, role, user_identifier, access_level, is_active) VALUES
('Admin', 'System', 'admin@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM5lE2cBFy6.0P7pTJRu', 'ADMIN', 'admin001', 'FULL', true),
('Jean', 'Dupont', 'jean.dupont@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM5lE2cBFy6.0P7pTJRu', 'MEMBER', 'member001', 'STANDARD', true),
('Marie', 'Martin', 'marie.martin@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM5lE2cBFy6.0P7pTJRu', 'SECRETARY', 'secretary001', 'STANDARD', true),
('Paul', 'Ouedraogo', 'paul.ouedraogo@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM5lE2cBFy6.0P7pTJRu', 'PRESIDENT', 'president001', 'ELEVATED', true),
('Sarah', 'Kabore', 'sarah.kabore@comite.bf', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM5lE2cBFy6.0P7pTJRu', 'RESEARCHER', 'researcher001', 'STANDARD', true);

-- Insert test protocols
INSERT INTO protocol_submissions (title, description, principal_investigator, institution, participants, duration, status, submitter_name, payment_status) VALUES
('Étude sur l''efficacité des traitements', 'Recherche comparative sur les nouveaux traitements', 'Dr. Martin Dupont', 'CHU de Ouagadougou', 100, 12, 'ASSIGNED_TO_MEMBER', 'Dr. Martin Dupont', 'PAID'),
('Impact des nouvelles thérapies', 'Analyse de l''impact des thérapies innovantes', 'Dr. Sarah Ouedraogo', 'Université de Ouagadougou', 50, 8, 'ASSIGNED_TO_MEMBER', 'Dr. Sarah Ouedraogo', 'PAID'),
('Étude clinique randomisée', 'Essai clinique sur de nouveaux médicaments', 'Dr. Jean Kaboré', 'IRSS Ouagadougou', 200, 18, 'ASSIGNED_TO_MEMBER', 'Dr. Jean Kaboré', 'PAID'),
('Recherche en santé publique', 'Étude épidémiologique sur les maladies tropicales', 'Dr. Marie Sawadogo', 'Institut de Recherche', 300, 24, 'ASSIGNED_TO_MEMBER', 'Dr. Marie Sawadogo', 'PAID'),
('Innovation thérapeutique', 'Développement de nouvelles approches thérapeutiques', 'Dr. Paul Traoré', 'Centre de Recherche Médicale', 150, 15, 'ASSIGNED_TO_MEMBER', 'Dr. Paul Traoré', 'PAID');

-- Assign all protocols to the president (user ID 4)
INSERT INTO protocol_member_assignments (protocol_id, member_id, member_name, assigned_by, assigned_by_name) VALUES
(1, 4, 'Paul Ouedraogo', 1, 'Admin System'),
(2, 4, 'Paul Ouedraogo', 1, 'Admin System'),
(3, 4, 'Paul Ouedraogo', 1, 'Admin System'),
(4, 4, 'Paul Ouedraogo', 1, 'Admin System'),
(5, 4, 'Paul Ouedraogo', 1, 'Admin System');