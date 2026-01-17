-- MISE À JOUR DE LA TABLE member_evaluation_grids POUR VALIDATION ET PDF

-- 1. Ajouter les colonnes pour le PDF si elles n'existent pas
ALTER TABLE member_evaluation_grids 
ADD COLUMN IF NOT EXISTS pdf_path VARCHAR(500),
ADD COLUMN IF NOT EXISTS pdf_generated_at TIMESTAMP;

-- 2. Mettre à jour les contraintes pour les champs obligatoires
ALTER TABLE member_evaluation_grids 
ALTER COLUMN scientific_quality SET NOT NULL,
ALTER COLUMN ethical_compliance SET NOT NULL,
ALTER COLUMN methodology_clarity SET NOT NULL,
ALTER COLUMN risk_benefit_ratio SET NOT NULL,
ALTER COLUMN informed_consent_quality SET NOT NULL,
ALTER COLUMN recommendations SET NOT NULL,
ALTER COLUMN decision SET NOT NULL;

-- 3. Ajouter des contraintes de validation
ALTER TABLE member_evaluation_grids 
ADD CONSTRAINT chk_scientific_quality CHECK (scientific_quality >= 1 AND scientific_quality <= 5),
ADD CONSTRAINT chk_ethical_compliance CHECK (ethical_compliance >= 1 AND ethical_compliance <= 5),
ADD CONSTRAINT chk_methodology_clarity CHECK (methodology_clarity >= 1 AND methodology_clarity <= 5),
ADD CONSTRAINT chk_risk_benefit_ratio CHECK (risk_benefit_ratio >= 1 AND risk_benefit_ratio <= 5),
ADD CONSTRAINT chk_informed_consent_quality CHECK (informed_consent_quality >= 1 AND informed_consent_quality <= 5);

-- 4. Ajouter contrainte sur la décision
ALTER TABLE member_evaluation_grids 
ADD CONSTRAINT chk_decision CHECK (decision IN ('APPROVE', 'MINOR_REVISION', 'MAJOR_REVISION', 'REJECT'));

-- 5. Ajouter contrainte sur le statut
ALTER TABLE member_evaluation_grids 
ADD CONSTRAINT chk_status CHECK (status IN ('DRAFT', 'COMPLETED'));

-- 6. Créer un index sur le chemin PDF
CREATE INDEX IF NOT EXISTS idx_member_eval_grids_pdf_path ON member_evaluation_grids(pdf_path);

-- 7. Vérifier la structure mise à jour
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'member_evaluation_grids' 
ORDER BY ordinal_position;

-- 8. Vérifier les contraintes
SELECT 
    constraint_name, 
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'member_evaluation_grids';

-- 9. Test d'insertion avec validation
INSERT INTO member_evaluation_grids (
    protocol_id, 
    member_id, 
    member_name,
    scientific_quality,
    ethical_compliance,
    methodology_clarity,
    risk_benefit_ratio,
    informed_consent_quality,
    recommendations,
    decision,
    status,
    submitted_at
) VALUES (
    9999,
    9999,
    'Test Validation',
    4,
    5,
    3,
    4,
    5,
    'Recommandations de test',
    'APPROVE',
    'COMPLETED',
    NOW()
) ON CONFLICT (protocol_id, member_id) DO UPDATE SET
    scientific_quality = EXCLUDED.scientific_quality,
    ethical_compliance = EXCLUDED.ethical_compliance,
    methodology_clarity = EXCLUDED.methodology_clarity,
    risk_benefit_ratio = EXCLUDED.risk_benefit_ratio,
    informed_consent_quality = EXCLUDED.informed_consent_quality,
    recommendations = EXCLUDED.recommendations,
    decision = EXCLUDED.decision,
    status = EXCLUDED.status,
    submitted_at = EXCLUDED.submitted_at,
    updated_at = NOW();

-- 10. Vérifier l'insertion
SELECT * FROM member_evaluation_grids WHERE protocol_id = 9999;

-- 11. Nettoyer le test
DELETE FROM member_evaluation_grids WHERE protocol_id = 9999;