-- Création des tables pour le système d'évaluation corrigé

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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_protocol_criteria_protocol_id ON protocol_evaluation_criteria(protocol_id);
CREATE INDEX IF NOT EXISTS idx_protocol_criteria_evaluator_id ON protocol_evaluation_criteria(evaluator_id);
CREATE INDEX IF NOT EXISTS idx_protocol_criteria_status ON protocol_evaluation_criteria(status);
CREATE INDEX IF NOT EXISTS idx_evaluation_pdfs_protocol_id ON evaluation_pdfs(protocol_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_pdfs_criteria_id ON evaluation_pdfs(criteria_id);

-- Insertion de données de test pour le protocole 8 (PROT-0008)
INSERT INTO protocol_evaluation_criteria (
    protocol_id, evaluator_id, evaluator_name, evaluator_role,
    protocol_french, cv_signed, consent_form, insurance, payment_proof,
    investigator_qualified, investigator_explanation, associated_investigators,
    study_justification, methodology, budget,
    comments, decision, observations, status, submitted_at
) VALUES 
(8, 4, 'Prof. Aminata Traoré', 'MEMBER',
 'Oui', 'Oui', 'Oui', 'Oui', 'Oui',
 'Oui', 'Investigateur principal très expérimenté avec plus de 15 ans d''expérience en recherche clinique', 'Oui',
 'Oui', 'Oui', 'Oui',
 '{"1":"Tous les documents sont conformes et complets","2":"Investigateur hautement qualifié","3":"Équipe de recherche compétente","4":"Justification scientifique solide","5":"Méthodologie rigoureuse","6":"Budget approprié"}',
 'Favorable', 'Protocole bien conçu et conforme aux standards éthiques. Recommandation d''approbation.', 
 'SUBMITTED', CURRENT_TIMESTAMP),

(8, 2, 'Dr. Fatou Diallo', 'MEMBER',
 'Oui', 'Oui', 'Oui', 'Oui', 'Oui',
 'Oui', 'Investigateur avec expertise reconnue dans le domaine', 'Oui',
 'Oui', 'Oui', 'Oui',
 '{"1":"Documentation complète","2":"Qualifications appropriées","3":"Équipe multidisciplinaire","4":"Objectifs clairs","5":"Méthodes validées","6":"Financement adéquat"}',
 'Favorable', 'Protocole de qualité avec une approche méthodologique solide.', 
 'SUBMITTED', CURRENT_TIMESTAMP),

(8, 1, 'Prof. Mamadou Diop', 'PRESIDENT',
 'Oui', 'Oui', 'Oui', 'Oui', 'Oui',
 'Oui', 'Investigateur principal reconnu internationalement', 'Oui',
 'Oui', 'Oui', 'Oui',
 '{"1":"Dossier complet et bien organisé","2":"Investigateur de renommée internationale","3":"Collaborateurs expérimentés","4":"Pertinence scientifique élevée","5":"Protocole rigoureux","6":"Budget justifié"}',
 'Favorable', 'Excellent protocole qui respecte tous les critères éthiques et scientifiques. Approbation recommandée.', 
 'SUBMITTED', CURRENT_TIMESTAMP);

-- Insertion de PDFs simulés
INSERT INTO evaluation_pdfs (
    protocol_id, evaluator_id, evaluator_name, evaluator_role, criteria_id,
    file_name, file_path, file_size, status
) VALUES 
(8, 4, 'Prof. Aminata Traoré', 'MEMBER', 1,
 'evaluation_PROT-8_Prof_Aminata_Traore_20251230_203000.pdf', 
 'uploads/evaluations/evaluation_PROT-8_Prof_Aminata_Traore_20251230_203000.pdf', 
 245760, 'GENERATED'),

(8, 2, 'Dr. Fatou Diallo', 'MEMBER', 2,
 'evaluation_PROT-8_Dr_Fatou_Diallo_20251230_203100.pdf', 
 'uploads/evaluations/evaluation_PROT-8_Dr_Fatou_Diallo_20251230_203100.pdf', 
 238945, 'GENERATED'),

(8, 1, 'Prof. Mamadou Diop', 'PRESIDENT', 3,
 'evaluation_PROT-8_Prof_Mamadou_Diop_20251230_203200.pdf', 
 'uploads/evaluations/evaluation_PROT-8_Prof_Mamadou_Diop_20251230_203200.pdf', 
 267834, 'GENERATED');

-- Données pour le protocole 6 (PROT-0006) aussi
INSERT INTO protocol_evaluation_criteria (
    protocol_id, evaluator_id, evaluator_name, evaluator_role,
    protocol_french, cv_signed, consent_form, insurance, payment_proof,
    investigator_qualified, investigator_explanation, associated_investigators,
    study_justification, methodology, budget,
    comments, decision, observations, status, submitted_at
) VALUES 
(6, 3, 'Dr. Aissatou Ba', 'MEMBER',
 'Oui', 'Oui', 'Oui', 'Oui', 'Oui',
 'Oui', 'Investigateur qualifié avec bonne expérience', 'Oui',
 'Oui', 'Oui', 'Oui',
 '{"1":"Documents conformes","2":"Investigateur compétent","3":"Équipe appropriée","4":"Justification valide","5":"Méthodologie acceptable","6":"Budget raisonnable"}',
 'Favorable', 'Protocole conforme aux exigences éthiques.', 
 'SUBMITTED', CURRENT_TIMESTAMP);

INSERT INTO evaluation_pdfs (
    protocol_id, evaluator_id, evaluator_name, evaluator_role, criteria_id,
    file_name, file_path, file_size, status
) VALUES 
(6, 3, 'Dr. Aissatou Ba', 'MEMBER', 4,
 'evaluation_PROT-6_Dr_Aissatou_Ba_20251230_203300.pdf', 
 'uploads/evaluations/evaluation_PROT-6_Dr_Aissatou_Ba_20251230_203300.pdf', 
 198765, 'GENERATED');

COMMIT;