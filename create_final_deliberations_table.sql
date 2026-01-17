-- Script pour créer la table des délibérations finales
-- Cette table stocke de façon permanente les délibérations soumises par les rapporteurs

CREATE TABLE IF NOT EXISTS final_deliberations (
    id SERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    protocol_code VARCHAR(50),
    deliberation_number VARCHAR(50),
    research_title TEXT,
    protocol_reference VARCHAR(100),
    principal_investigator VARCHAR(255),
    requester_reference VARCHAR(100),
    research_site VARCHAR(255),
    deliberation_date DATE,
    documentation TEXT,
    scientific_conception BOOLEAN DEFAULT false,
    participant_protection BOOLEAN DEFAULT false,
    data_confidentiality BOOLEAN DEFAULT false,
    consent_process BOOLEAN DEFAULT false,
    research_budget BOOLEAN DEFAULT false,
    cv_documents BOOLEAN DEFAULT false,
    observations TEXT,
    reserves TEXT,
    recommendations TEXT,
    decision VARCHAR(50) DEFAULT 'FAVORABLE',
    member_koueta BOOLEAN DEFAULT false,
    member_nanga BOOLEAN DEFAULT false,
    member_drabo BOOLEAN DEFAULT false,
    member_toe BOOLEAN DEFAULT false,
    member_ouedraogo1 BOOLEAN DEFAULT false,
    member_ouedraogo2 BOOLEAN DEFAULT false,
    members_present TEXT,
    rapporteur VARCHAR(255),
    evaluation_date DATE,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    president_signature_date TIMESTAMP,
    president_name VARCHAR(255),
    secretary_stamp_date TIMESTAMP,
    secretary_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_final_deliberations_protocol 
        FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_final_deliberations_protocol_id ON final_deliberations(protocol_id);
CREATE INDEX IF NOT EXISTS idx_final_deliberations_status ON final_deliberations(status);
CREATE INDEX IF NOT EXISTS idx_final_deliberations_rapporteur ON final_deliberations(rapporteur);

-- Commentaires pour documentation
COMMENT ON TABLE final_deliberations IS 'Table stockant les délibérations finales soumises par les rapporteurs';
COMMENT ON COLUMN final_deliberations.protocol_id IS 'Référence vers le protocole évalué';
COMMENT ON COLUMN final_deliberations.status IS 'Statut: SUBMITTED, SIGNED, SENT';
COMMENT ON COLUMN final_deliberations.decision IS 'Décision finale: FAVORABLE, NON_FAVORABLE, AJOURNE';