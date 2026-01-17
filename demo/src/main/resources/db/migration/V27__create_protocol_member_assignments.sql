-- Table pour les assignations de protocoles aux membres du comité
CREATE TABLE IF NOT EXISTS protocol_member_assignments (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    assigned_by_id BIGINT NOT NULL,
    assigned_by_name VARCHAR(255) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ASSIGNED',
    comments TEXT,
    reviewed_at TIMESTAMP,
    FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id),
    FOREIGN KEY (member_id) REFERENCES users(id),
    FOREIGN KEY (assigned_by_id) REFERENCES users(id)
);