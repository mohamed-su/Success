-- Migration pour créer les tables d'évaluation des protocoles

-- Table pour stocker les critères d'évaluation
CREATE TABLE IF NOT EXISTS protocol_evaluation_criteria (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    evaluator_id BIGINT NOT NULL,
    evaluator_name VARCHAR(255),
    evaluator_role VARCHAR(50) DEFAULT 'MEMBER',
    
    -- Critères spécifiques
    protocol_french VARCHAR(10),
    cv_signed VARCHAR(10),
    consent_form VARCHAR(10),
    insurance VARCHAR(10),
    payment_proof VARCHAR(10),
    investigator_qualified VARCHAR(10),
    investigator_explanation TEXT,
    associated_investigators VARCHAR(10),
    study_justification VARCHAR(10),
    methodology VARCHAR(10),
    budget VARCHAR(10),
    investigation_product VARCHAR(10),
    comparator_product VARCHAR(10),
    concomitant_product VARCHAR(10),
    
    -- Commentaires et décision
    comments TEXT,
    decision VARCHAR(50),
    observations TEXT,
    
    -- Statut et dates
    status VARCHAR(20) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes
    CONSTRAINT fk_protocol_criteria_protocol FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_protocol_criteria_evaluator FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_protocol_evaluator UNIQUE (protocol_id, evaluator_id)
);

-- Table pour stocker les PDFs générés
CREATE TABLE IF NOT EXISTS evaluation_pdfs (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    evaluator_id BIGINT NOT NULL,
    evaluator_name VARCHAR(255),
    evaluator_role VARCHAR(50),
    criteria_id BIGINT,
    
    -- Informations du fichier
    file_name VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    
    -- Statut et dates
    status VARCHAR(20) DEFAULT 'GENERATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes
    CONSTRAINT fk_evaluation_pdf_protocol FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluation_pdf_evaluator FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_evaluation_pdf_criteria FOREIGN KEY (criteria_id) REFERENCES protocol_evaluation_criteria(id) ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_protocol_criteria_protocol_id ON protocol_evaluation_criteria(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_criteria_evaluator_id ON protocol_evaluation_criteria(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_protocol_criteria_status ON protocol_evaluation_criteria(status);
CREATE INDEX IF NOT EXISTS idx_evaluation_pdfs_protocol_id ON evaluation_pdfs(protocol_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_pdfs_criteria_id ON evaluation_pdfs(criteria_id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_protocol_criteria_updated_at 
    BEFORE UPDATE ON protocol_evaluation_criteria 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluation_pdfs_updated_at 
    BEFORE UPDATE ON evaluation_pdfs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();