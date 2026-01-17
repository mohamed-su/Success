-- Insertion des utilisateurs par défaut

-- Admin par défaut
INSERT INTO users (username, password, email, first_name, last_name, role, active) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nRs.fvuNjO6', 'admin@comite.com', 'Admin', 'System', 'ADMIN', true);

-- Secrétaire par défaut
INSERT INTO users (username, password, email, first_name, last_name, role, active) VALUES
('secretaire', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nRs.fvuNjO6', 'secretaire@comite.com', 'Marie', 'Dupont', 'SECRETARY', true);

-- Président par défaut
INSERT INTO users (username, password, email, first_name, last_name, role, active) VALUES
('president', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nRs.fvuNjO6', 'president@comite.com', 'Jean', 'Martin', 'PRESIDENT', true);

-- Rapporteur par défaut
INSERT INTO users (username, password, email, first_name, last_name, role, active) VALUES
('rapporteur', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nRs.fvuNjO6', 'rapporteur@comite.com', 'Pierre', 'Durand', 'RAPPORTEUR', true);

-- Membres du comité par défaut
INSERT INTO users (username, password, email, first_name, last_name, role, active) VALUES
('membre1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nRs.fvuNjO6', 'membre1@comite.com', 'Sophie', 'Bernard', 'COMMITTEE_MEMBER', true),
('membre2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nRs.fvuNjO6', 'membre2@comite.com', 'Paul', 'Moreau', 'COMMITTEE_MEMBER', true);

-- Chercheurs par défaut
INSERT INTO users (username, password, email, first_name, last_name, role, active) VALUES
('chercheur1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nRs.fvuNjO6', 'chercheur1@univ.com', 'Alice', 'Rousseau', 'RESEARCHER', true),
('chercheur2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nRs.fvuNjO6', 'chercheur2@univ.com', 'Bob', 'Leroy', 'RESEARCHER', true);