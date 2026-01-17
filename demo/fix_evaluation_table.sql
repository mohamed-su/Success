-- Script de vérification et correction de la table member_evaluation_grids

-- 1. Vérifier si la table existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'member_evaluation_grids'
);

-- 2. Créer la table si elle n'existe pas
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
    decision VARCHAR(50),
    
    -- Statut et dates
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT unique_member_protocol_eval UNIQUE (protocol_id, member_id)
);

-- 3. Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_member_eval_grids_protocol_id ON member_evaluation_grids(protocol_id);
CREATE INDEX IF NOT EXISTS idx_member_eval_grids_member_id ON member_evaluation_grids(member_id);
CREATE INDEX IF NOT EXISTS idx_member_eval_grids_status ON member_evaluation_grids(status);

-- 4. Vérifier le contenu actuel
SELECT COUNT(*) as total_grids FROM member_evaluation_grids;
SELECT COUNT(*) as submitted_grids FROM member_evaluation_grids WHERE status = 'SUBMITTED';

-- 5. Afficher les dernières grilles créées
SELECT id, protocol_id, member_id, member_name, status, created_at, submitted_at 
FROM member_evaluation_grids 
ORDER BY created_at DESC 
LIMIT 10;

-- 6. Test d'insertion pour vérifier que la table fonctionne
INSERT INTO member_evaluation_grids (protocol_id, member_id, member_name, decision, status, submitted_at)
VALUES (8, 4, 'Test Member', 'APPROVE', 'SUBMITTED', NOW())
ON CONFLICT (protocol_id, member_id) DO UPDATE SET
    decision = EXCLUDED.decision,
    status = EXCLUDED.status,
    submitted_at = EXCLUDED.submitted_at,
    updated_at = NOW();

-- 7. Vérifier que l'insertion a fonctionné
SELECT * FROM member_evaluation_grids WHERE protocol_id = 8 AND member_id = 4;