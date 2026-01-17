-- Migration pour corriger la table protocol_evaluations

-- Supprimer la table si elle existe avec une mauvaise structure
DROP TABLE IF EXISTS protocol_evaluations CASCADE;

-- Recréer la table avec la bonne structure
CREATE TABLE protocol_evaluations (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    evaluator_id BIGINT NOT NULL,
    nom_evaluateur VARCHAR(255),
    recommandation_finale VARCHAR(50),
    
    -- Données du formulaire de délibération
    evaluation_form_data JSONB,
    deliberation_number VARCHAR(100),
    research_title TEXT,
    protocol_reference VARCHAR(255),
    principal_investigator VARCHAR(255),
    research_site VARCHAR(255),
    deliberation_date DATE,
    observations TEXT,
    recommendations TEXT,
    members_present JSONB,
    
    -- Signatures et validation
    president_signature_date TIMESTAMP,
    president_name VARCHAR(255),
    secretary_stamp_date TIMESTAMP,
    secretary_name VARCHAR(255),
    
    -- Statut et dates
    status VARCHAR(50) DEFAULT 'DRAFT',
    evaluation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_final BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contraintes
    CONSTRAINT fk_protocol_evaluations_protocol FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id) ON DELETE CASCADE,
    CONSTRAINT fk_protocol_evaluations_evaluator FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_protocol_evaluator_final UNIQUE (protocol_id, evaluator_id, is_final)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_protocol_evaluations_protocol_id ON protocol_evaluations(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_evaluations_evaluator_id ON protocol_evaluations(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_protocol_evaluations_status ON protocol_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_protocol_evaluations_is_final ON protocol_evaluations(is_final);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_protocol_evaluations_updated_at 
    BEFORE UPDATE ON protocol_evaluations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();