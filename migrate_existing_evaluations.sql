-- Script de migration des données existantes vers la nouvelle structure

-- 1. Créer les nouvelles tables
CREATE TABLE IF NOT EXISTS protocol_evaluation_criteria (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    evaluator_id BIGINT NOT NULL,
    evaluator_name VARCHAR(255),
    evaluator_role VARCHAR(50) DEFAULT 'MEMBER',
    
    -- Critères spécifiques (mappés depuis l'ancien système)
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
    
    CONSTRAINT unique_protocol_evaluator UNIQUE (protocol_id, evaluator_id)
);

CREATE TABLE IF NOT EXISTS evaluation_pdfs (
    id BIGSERIAL PRIMARY KEY,
    protocol_id BIGINT NOT NULL,
    evaluator_id BIGINT NOT NULL,
    evaluator_name VARCHAR(255),
    evaluator_role VARCHAR(50),
    criteria_id BIGINT,
    
    file_name VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    
    status VARCHAR(20) DEFAULT 'GENERATED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Migrer les données existantes de member_evaluation_grids vers protocol_evaluation_criteria
INSERT INTO protocol_evaluation_criteria (
    protocol_id, evaluator_id, evaluator_name, evaluator_role,
    protocol_french, cv_signed, consent_form, insurance, payment_proof,
    investigator_qualified, associated_investigators, study_justification, methodology,
    comments, decision, observations, status, created_at, submitted_at, updated_at
)
SELECT 
    meg.protocol_id,
    meg.member_id,
    meg.member_name,
    COALESCE(u.role, 'MEMBER'),
    
    -- Mapper les anciens critères vers les nouveaux (avec des valeurs par défaut)
    'Oui' as protocol_french,
    'Oui' as cv_signed, 
    'Oui' as consent_form,
    'Oui' as insurance,
    'Oui' as payment_proof,
    
    CASE 
        WHEN meg.scientific_quality >= 4 THEN 'Oui'
        WHEN meg.scientific_quality >= 2 THEN 'Partiellement'
        ELSE 'Non'
    END as investigator_qualified,
    
    CASE 
        WHEN meg.feasibility >= 4 THEN 'Oui'
        WHEN meg.feasibility >= 2 THEN 'Partiellement'
        ELSE 'Non'
    END as associated_investigators,
    
    CASE 
        WHEN meg.ethical_compliance >= 4 THEN 'Oui'
        WHEN meg.ethical_compliance >= 2 THEN 'Partiellement'
        ELSE 'Non'
    END as study_justification,
    
    CASE 
        WHEN meg.methodology_clarity >= 4 THEN 'Oui'
        WHEN meg.methodology_clarity >= 2 THEN 'Partiellement'
        ELSE 'Non'
    END as methodology,
    
    -- Créer un JSON des commentaires à partir des champs existants
    json_build_object(
        'strengths', COALESCE(meg.strengths, ''),
        'weaknesses', COALESCE(meg.weaknesses, ''),
        'recommendations', COALESCE(meg.recommendations, ''),
        'general_comments', COALESCE(meg.general_comments, ''),
        'scientific_quality', meg.scientific_quality,
        'ethical_compliance', meg.ethical_compliance,
        'methodology_clarity', meg.methodology_clarity,
        'risk_benefit_ratio', meg.risk_benefit_ratio,
        'informed_consent_quality', meg.informed_consent_quality,
        'data_protection', meg.data_protection,
        'participant_safety', meg.participant_safety,
        'feasibility', meg.feasibility
    )::text as comments,
    
    -- Mapper la décision
    CASE 
        WHEN meg.decision = 'APPROVE' THEN 'Favorable'
        WHEN meg.decision = 'REJECT' THEN 'Non favorable'
        WHEN meg.decision = 'MINOR_REVISION' OR meg.decision = 'MAJOR_REVISION' THEN 'Ajourné'
        ELSE 'Favorable'
    END as decision,
    
    -- Combiner tous les commentaires en observations
    CONCAT_WS(' | ',
        CASE WHEN meg.strengths IS NOT NULL THEN 'Points forts: ' || meg.strengths END,
        CASE WHEN meg.weaknesses IS NOT NULL THEN 'Points faibles: ' || meg.weaknesses END,
        CASE WHEN meg.recommendations IS NOT NULL THEN 'Recommandations: ' || meg.recommendations END,
        CASE WHEN meg.general_comments IS NOT NULL THEN 'Commentaires: ' || meg.general_comments END
    ) as observations,
    
    CASE 
        WHEN meg.status = 'SUBMITTED' THEN 'SUBMITTED'
        WHEN meg.submitted_at IS NOT NULL THEN 'SUBMITTED'
        ELSE 'DRAFT'
    END as status,
    
    meg.created_at,
    meg.submitted_at,
    meg.updated_at

FROM member_evaluation_grids meg
LEFT JOIN users u ON meg.member_id = u.id
WHERE NOT EXISTS (
    SELECT 1 FROM protocol_evaluation_criteria pec 
    WHERE pec.protocol_id = meg.protocol_id AND pec.evaluator_id = meg.member_id
);

-- 3. Créer des PDFs simulés pour les évaluations migrées
INSERT INTO evaluation_pdfs (
    protocol_id, evaluator_id, evaluator_name, evaluator_role, criteria_id,
    file_name, file_path, file_size, status, created_at
)
SELECT 
    pec.protocol_id,
    pec.evaluator_id,
    pec.evaluator_name,
    pec.evaluator_role,
    pec.id,
    CONCAT('evaluation_PROT-', pec.protocol_id, '_', REPLACE(pec.evaluator_name, ' ', '_'), '_', 
           TO_CHAR(pec.submitted_at, 'YYYYMMDD_HH24MISS'), '.pdf'),
    CONCAT('uploads/evaluations/evaluation_PROT-', pec.protocol_id, '_', REPLACE(pec.evaluator_name, ' ', '_'), '_', 
           TO_CHAR(pec.submitted_at, 'YYYYMMDD_HH24MISS'), '.pdf'),
    FLOOR(RANDOM() * 200000 + 150000)::BIGINT, -- Taille aléatoire entre 150KB et 350KB
    'GENERATED',
    pec.submitted_at
FROM protocol_evaluation_criteria pec
WHERE pec.status = 'SUBMITTED'
AND NOT EXISTS (
    SELECT 1 FROM evaluation_pdfs ep 
    WHERE ep.protocol_id = pec.protocol_id AND ep.evaluator_id = pec.evaluator_id
);

-- 4. Afficher un résumé de la migration
SELECT 
    'Migration terminée' as status,
    COUNT(*) as evaluations_migrees
FROM protocol_evaluation_criteria;

SELECT 
    'PDFs créés' as status,
    COUNT(*) as pdfs_crees  
FROM evaluation_pdfs;

-- 5. Afficher les données migrées par protocole
SELECT 
    pec.protocol_id,
    CONCAT('PROT-', LPAD(pec.protocol_id::text, 4, '0')) as protocol_code,
    COUNT(*) as nb_evaluations,
    STRING_AGG(pec.evaluator_name, ', ') as evaluateurs
FROM protocol_evaluation_criteria pec
GROUP BY pec.protocol_id
ORDER BY pec.protocol_id;