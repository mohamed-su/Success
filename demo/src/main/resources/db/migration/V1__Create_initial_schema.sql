-- Migration initiale pour créer le schéma de base

-- Table des utilisateurs
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'SECRETARY', 'PRESIDENT', 'COMMITTEE_MEMBER', 'RAPPORTEUR', 'RESEARCHER')),
    phone_number VARCHAR(255),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des protocoles
CREATE TABLE protocols (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    researcher_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'VALIDATED_BY_SECRETARY', 'ASSIGNED_TO_COMMITTEE', 'UNDER_REVIEW', 'SYNTHESIS_COMPLETED', 'APPROVED', 'REJECTED', 'NEEDS_CORRECTION')),
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP,
    deadline TIMESTAMP,
    secretary_comments TEXT,
    president_comments TEXT,
    rapporteur_synthesis TEXT,
    FOREIGN KEY (researcher_id) REFERENCES users(id)
);

-- Table des assignations de protocoles
CREATE TABLE protocol_assignments (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    assigned_member_id BIGINT NOT NULL,
    assigned_by_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    can_edit BOOLEAN NOT NULL DEFAULT FALSE,
    downloaded BOOLEAN NOT NULL DEFAULT FALSE,
    downloaded_at TIMESTAMP,
    member_comments TEXT,
    FOREIGN KEY (protocol_id) REFERENCES protocols(id),
    FOREIGN KEY (assigned_member_id) REFERENCES users(id),
    FOREIGN KEY (assigned_by_id) REFERENCES users(id)
);

-- Table des notifications
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    protocol_id BIGINT,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('PROTOCOL_SUBMITTED', 'PROTOCOL_VALIDATED', 'PROTOCOL_ASSIGNED', 'PROTOCOL_REVIEWED', 'DEADLINE_REMINDER', 'STATUS_CHANGED')),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (protocol_id) REFERENCES protocols(id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_protocols_researcher ON protocols(researcher_id);
CREATE INDEX idx_protocols_status ON protocols(status);
CREATE INDEX idx_protocol_assignments_protocol ON protocol_assignments(protocol_id);
CREATE INDEX idx_protocol_assignments_member ON protocol_assignments(assigned_member_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);