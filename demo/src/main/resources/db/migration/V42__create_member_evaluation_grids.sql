-- Création de la table pour les grilles d'évaluation soumises par les membres

CREATE TABLE IF NOT EXISTS member_evaluation_grids (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    
    -- Critères d'évaluation (échelle 1-5)
    scientific_quality INTEGER CHECK (scientific_quality >= 1 AND scientific_quality <= 5),
    ethical_compliance INTEGER CHECK (ethical_compliance >= 1 AND ethical_compliance <= 5),
    methodology_clarity INTEGER CHECK (methodology_clarity >= 1 AND methodology_clarity <= 5),
    risk_benefit_ratio INTEGER CHECK (risk_benefit_ratio >= 1 AND risk_benefit_ratio <= 5),
    informed_consent_quality INTEGER CHECK (informed_consent_quality >= 1 AND informed_consent_quality <= 5),
    data_protection INTEGER CHECK (data_protection >= 1 AND data_protection <= 5),
    participant_safety INTEGER CHECK (participant_safety >= 1 AND participant_safety <= 5),
    feasibility INTEGER CHECK (feasibility >= 1 AND feasibility <= 5),
    
    -- Commentaires détaillés
    strengths TEXT,
    weaknesses TEXT,
    recommendations TEXT,
    general_comments TEXT,
    
    -- Décision finale du membre
    decision VARCHAR(50) CHECK (decision IN ('APPROVE', 'MINOR_REVISION', 'MAJOR_REVISION', 'REJECT')),
    
    -- Statut et dates
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'COMPLETED')),
    submitted_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT fk_member_eval_protocol FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_member_eval_member FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_member_protocol_eval UNIQUE (protocol_id, member_id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_member_eval_grids_protocol_id ON member_evaluation_grids(protocol_id);
CREATE INDEX IF NOT EXISTS idx_member_eval_grids_member_id ON member_evaluation_grids(member_id);
CREATE INDEX IF NOT EXISTS idx_member_eval_grids_status ON member_evaluation_grids(status);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_member_eval_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_member_eval_updated_at
    BEFORE UPDATE ON member_evaluation_grids
    FOR EACH ROW
    EXECUTE FUNCTION update_member_eval_updated_at();