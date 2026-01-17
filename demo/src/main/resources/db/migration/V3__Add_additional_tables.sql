-- Ajout de tables supplémentaires pour enrichir le système

-- Table des sessions utilisateur
CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des documents attachés aux protocoles
CREATE TABLE protocol_documents (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_path VARCHAR(500) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    uploaded_by BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (protocol_id) REFERENCES protocols(id),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Table des commentaires sur les protocoles
CREATE TABLE protocol_comments (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    comment_text TEXT NOT NULL,
    comment_type VARCHAR(50) DEFAULT 'GENERAL' CHECK (comment_type IN ('GENERAL', 'CORRECTION', 'APPROVAL', 'REJECTION')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (protocol_id) REFERENCES protocols(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des réunions du comité
CREATE TABLE committee_meetings (
    id BIGSERIAL PRIMARY KEY,
    meeting_title VARCHAR(255) NOT NULL,
    meeting_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    agenda TEXT,
    minutes TEXT,
    status VARCHAR(50) DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Table des participants aux réunions
CREATE TABLE meeting_participants (
    id BIGSERIAL PRIMARY KEY,
    meeting_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    attendance_status VARCHAR(50) DEFAULT 'INVITED' CHECK (attendance_status IN ('INVITED', 'CONFIRMED', 'PRESENT', 'ABSENT')),
    role_in_meeting VARCHAR(50) DEFAULT 'PARTICIPANT' CHECK (role_in_meeting IN ('PARTICIPANT', 'PRESENTER', 'MODERATOR')),
    FOREIGN KEY (meeting_id) REFERENCES committee_meetings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(meeting_id, user_id)
);

-- Table des protocoles discutés en réunion
CREATE TABLE meeting_protocols (
    id BIGSERIAL PRIMARY KEY,
    meeting_id BIGINT NOT NULL,
    protocol_id BIGINT NOT NULL,
    discussion_notes TEXT,
    decision VARCHAR(50) CHECK (decision IN ('APPROVED', 'REJECTED', 'NEEDS_REVISION', 'DEFERRED')),
    vote_for INTEGER DEFAULT 0,
    vote_against INTEGER DEFAULT 0,
    vote_abstain INTEGER DEFAULT 0,
    FOREIGN KEY (meeting_id) REFERENCES committee_meetings(id),
    FOREIGN KEY (protocol_id) REFERENCES protocols(id),
    UNIQUE(meeting_id, protocol_id)
);

-- Table des logs d'activité
CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    description TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index pour les nouvelles tables
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_protocol_documents_protocol ON protocol_documents(protocol_id);
CREATE INDEX idx_protocol_comments_protocol ON protocol_comments(protocol_id);
CREATE INDEX idx_protocol_comments_user ON protocol_comments(user_id);
CREATE INDEX idx_committee_meetings_date ON committee_meetings(meeting_date);
CREATE INDEX idx_meeting_participants_meeting ON meeting_participants(meeting_id);
CREATE INDEX idx_meeting_participants_user ON meeting_participants(user_id);
CREATE INDEX idx_meeting_protocols_meeting ON meeting_protocols(meeting_id);
CREATE INDEX idx_meeting_protocols_protocol ON meeting_protocols(protocol_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);