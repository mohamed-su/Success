-- Création de la table evaluation_grids pour les grilles d'évaluation des protocoles

CREATE TABLE IF NOT EXISTS evaluation_grids (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    member_name VARCHAR(255),
    
    -- Critères d'évaluation (échelle 1-5)
    scientific_quality INTEGER,
    ethical_compliance INTEGER,
    methodology_clarity INTEGER,
    risk_benefit_ratio INTEGER,
    informed_consent_quality INTEGER,
    data_protection INTEGER,
    participant_safety INTEGER,
    feasibility INTEGER,
    
    -- Commentaires
    strengths TEXT,
    weaknesses TEXT,
    recommendations TEXT,
    general_comments TEXT,
    
    -- Décision et statut
    decision VARCHAR(50), -- APPROVE, MINOR_REVISION, MAJOR_REVISION, REJECT
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED
    
    -- Dates
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    
    -- Contraintes
    CONSTRAINT fk_evaluation_protocol FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluation_member FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_protocol_member UNIQUE (protocol_id, member_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_evaluation_grids_protocol_id ON evaluation_grids(protocol_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_grids_member_id ON evaluation_grids(member_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_grids_status ON evaluation_grids(status);