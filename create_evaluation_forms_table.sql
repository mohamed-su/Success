-- Table pour stocker les évaluations complètes des protocoles
CREATE TABLE IF NOT EXISTS protocol_evaluation_forms (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    researcher_id BIGINT NOT NULL,
    
    -- Critère 1
    protocol_french VARCHAR(10),
    cv_signed VARCHAR(10),
    consent_form VARCHAR(10),
    insurance VARCHAR(10),
    payment_proof VARCHAR(10),
    
    -- Critère 2
    investigator_qualified VARCHAR(10),
    investigator_explanation TEXT,
    
    -- Critères 3-9
    associated_investigators VARCHAR(10),
    study_justification VARCHAR(10),
    methodology VARCHAR(10),
    budget VARCHAR(10),
    investigation_product VARCHAR(10),
    comparator_product VARCHAR(10),
    concomitant_product VARCHAR(10),
    
    -- Commentaires (JSON)
    comments TEXT,
    
    -- Décision finale
    decision VARCHAR(50),
    observations TEXT,
    evaluator_name VARCHAR(255),
    signature_file_name VARCHAR(255),
    
    -- Statut et dates
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    
    CONSTRAINT fk_evaluation_protocol FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluation_member FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluation_researcher FOREIGN KEY (researcher_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_protocol_member UNIQUE (protocol_id, member_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_evaluation_protocol ON protocol_evaluation_forms(protocol_id);
CREATE INDEX idx_evaluation_member ON protocol_evaluation_forms(member_id);
CREATE INDEX idx_evaluation_researcher ON protocol_evaluation_forms(researcher_id);
CREATE INDEX idx_evaluation_status ON protocol_evaluation_forms(status);

-- Commentaire sur la table
COMMENT ON TABLE protocol_evaluation_forms IS 'Stocke les évaluations complètes des protocoles par les membres du comité';
