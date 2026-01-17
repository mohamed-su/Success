-- SCRIPT SQL EXACT POUR member_evaluation_grids
-- À exécuter dans PostgreSQL pour garantir la persistance

-- 1. Vérifier si la table existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'member_evaluation_grids'
) AS table_exists;

-- 2. Créer la table avec la structure EXACTE
CREATE TABLE IF NOT EXISTS member_evaluation_grids (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    member_name VARCHAR(255) NOT NULL,
    
    -- Critères d'évaluation (échelle 1-5)
    scientific_quality INTEGER,
    ethical_compliance INTEGER,
    methodology_clarity INTEGER,
    risk_benefit_ratio INTEGER,
    informed_consent_quality INTEGER,
    data_protection INTEGER,
    participant_safety INTEGER,
    feasibility INTEGER,
    
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
SELECT 
    COUNT(*) as total_grids,
    COUNT(CASE WHEN status = 'SUBMITTED' THEN 1 END) as submitted_grids,
    COUNT(CASE WHEN decision IS NOT NULL THEN 1 END) as grids_with_decision
FROM member_evaluation_grids;

-- 5. Afficher les dernières grilles créées
SELECT 
    id, 
    protocol_id, 
    member_id, 
    member_name, 
    decision,
    status, 
    created_at, 
    submitted_at 
FROM member_evaluation_grids 
ORDER BY created_at DESC 
LIMIT 10;

-- 6. Test d'insertion pour vérifier que la table fonctionne
INSERT INTO member_evaluation_grids (
    protocol_id, 
    member_id, 
    member_name, 
    decision, 
    status, 
    submitted_at,
    scientific_quality,
    ethical_compliance
)
VALUES (
    999, 
    999, 
    'Test Persistance', 
    'APPROVE', 
    'SUBMITTED', 
    NOW(),
    4,
    5
)
ON CONFLICT (protocol_id, member_id) DO UPDATE SET
    decision = EXCLUDED.decision,
    status = EXCLUDED.status,
    submitted_at = EXCLUDED.submitted_at,
    updated_at = NOW();

-- 7. Vérifier que l'insertion a fonctionné
SELECT * FROM member_evaluation_grids WHERE protocol_id = 999 AND member_id = 999;

-- 8. Nettoyer le test
DELETE FROM member_evaluation_grids WHERE protocol_id = 999 AND member_id = 999;