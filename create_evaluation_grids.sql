-- Script pour créer la table des grilles d'évaluation
-- Exécuter avec: psql -h localhost -U postgres -d comite_ethique -f create_evaluation_grids.sql

CREATE TABLE IF NOT EXISTS evaluation_grids (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    member_name VARCHAR(255),
    
    -- Critères d'évaluation (échelle 1-5)
    scientific_quality INTEGER CHECK (scientific_quality >= 1 AND scientific_quality <= 5),
    ethical_compliance INTEGER CHECK (ethical_compliance >= 1 AND ethical_compliance <= 5),
    methodology_clarity INTEGER CHECK (methodology_clarity >= 1 AND methodology_clarity <= 5),
    risk_benefit_ratio INTEGER CHECK (risk_benefit_ratio >= 1 AND risk_benefit_ratio <= 5),
    informed_consent_quality INTEGER CHECK (informed_consent_quality >= 1 AND informed_consent_quality <= 5),
    data_protection INTEGER CHECK (data_protection >= 1 AND data_protection <= 5),
    participant_safety INTEGER CHECK (participant_safety >= 1 AND participant_safety <= 5),
    feasibility INTEGER CHECK (feasibility >= 1 AND feasibility <= 5),
    
    -- Commentaires
    strengths TEXT,
    weaknesses TEXT,
    recommendations TEXT,
    general_comments TEXT,
    
    -- Décision et statut
    decision VARCHAR(50), -- APPROVE, MINOR_REVISION, MAJOR_REVISION, REJECT
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED
    
    -- Dates
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Contraintes
    UNIQUE(protocol_id, member_id),
    FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id) ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX idx_evaluation_protocol ON evaluation_grids(protocol_id);
CREATE INDEX idx_evaluation_member ON evaluation_grids(member_id);
CREATE INDEX idx_evaluation_status ON evaluation_grids(status);

-- Vérifier la création
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'evaluation_grids' 
ORDER BY ordinal_position;
