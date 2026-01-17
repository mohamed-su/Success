-- Ajout des champs manquants dans la table protocols

-- Ajouter les nouveaux champs pour StudyType et autres informations
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS study_type VARCHAR(50);
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS principal_investigator VARCHAR(255);
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS institution VARCHAR(255);
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS ethical_considerations TEXT;
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS study_duration_months INTEGER;
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS participant_count INTEGER;

-- Champs temporaires pour les fichiers (à migrer vers protocol_files plus tard)
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS protocol_file VARCHAR(500);
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS consent_form_file VARCHAR(500);
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS investigator_cv_files TEXT;
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS payment_receipt_file VARCHAR(500);

-- Champs pour compatibilité avec ResearcherController
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE protocols ADD COLUMN IF NOT EXISTS submitter_id BIGINT;

-- Ajouter la contrainte de clé étrangère pour submitter_id
ALTER TABLE protocols ADD CONSTRAINT fk_protocols_submitter 
    FOREIGN KEY (submitter_id) REFERENCES users(id);

-- Créer la table protocol_files si elle n'existe pas
CREATE TABLE IF NOT EXISTS protocol_files (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_category VARCHAR(50) NOT NULL DEFAULT 'OTHER' CHECK (file_category IN ('PROTOCOL_DOCUMENT', 'CONSENT_FORM', 'CV_FILE', 'PAYMENT_RECEIPT', 'OTHER')),
    FOREIGN KEY (protocol_id) REFERENCES protocols(id) ON DELETE CASCADE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_protocol_files_protocol ON protocol_files(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_files_category ON protocol_files(file_category);
CREATE INDEX IF NOT EXISTS idx_protocols_submitter ON protocols(submitter_id);
CREATE INDEX IF NOT EXISTS idx_protocols_study_type ON protocols(study_type);