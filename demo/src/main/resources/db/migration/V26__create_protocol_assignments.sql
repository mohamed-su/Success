CREATE TABLE IF NOT EXISTS protocol_assignments (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    assigned_by VARCHAR(255),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id)
);