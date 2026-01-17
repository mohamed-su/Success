-- Script pour ajouter des grilles d'évaluation de test pour le protocole PROT-0008 (ID 8)

-- D'abord, s'assurer que le protocole 8 existe et est assigné à des membres
INSERT INTO protocol_submissions (id, title, description, submitter_name, institution, participants, duration, status, submitted_at, verified_at) 
VALUES (8, 'H', 'Type d''étude: interventional Investigateur principal: G Institution: V', 'Chercheur', 'V', 3, 5, 'VERIFIED', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Assigner le protocole à quelques membres (si pas déjà fait)
INSERT INTO protocol_assignments (protocol_id, assigned_member_id, assigned_at, can_edit, downloaded)
SELECT 8, u.id, NOW() - INTERVAL '1 day', true, false
FROM users u 
WHERE u.role IN ('COMMITTEE_MEMBER', 'PRESIDENT', 'RAPPORTEUR') 
AND u.active = true
LIMIT 3
ON CONFLICT (protocol_id, assigned_member_id) DO NOTHING;

-- Ajouter des grilles d'évaluation pour les membres assignés
INSERT INTO evaluation_grids (
    protocol_id, member_id, member_name, 
    scientific_quality, ethical_compliance, methodology_clarity, risk_benefit_ratio,
    informed_consent_quality, data_protection, participant_safety, feasibility,
    strengths, weaknesses, recommendations, general_comments,
    decision, status, assigned_at, completed_at
)
SELECT 
    8 as protocol_id,
    pa.assigned_member_id as member_id,
    u.first_name || ' ' || u.last_name as member_name,
    4 as scientific_quality,
    5 as ethical_compliance, 
    4 as methodology_clarity,
    4 as risk_benefit_ratio,
    5 as informed_consent_quality,
    5 as data_protection,
    4 as participant_safety,
    3 as feasibility,
    'Protocole bien structuré avec une méthodologie claire' as strengths,
    'Durée d''étude pourrait être réduite' as weaknesses,
    'Recommande l''approbation avec modifications mineures' as recommendations,
    'Protocole globalement satisfaisant, respecte les normes éthiques' as general_comments,
    'MINOR_REVISION' as decision,
    'COMPLETED' as status,
    NOW() - INTERVAL '1 day' as assigned_at,
    NOW() - INTERVAL '2 hours' as completed_at
FROM protocol_assignments pa
JOIN users u ON pa.assigned_member_id = u.id
WHERE pa.protocol_id = 8
ON CONFLICT (protocol_id, member_id) DO NOTHING;

-- Ajouter une deuxième grille avec des scores différents
INSERT INTO evaluation_grids (
    protocol_id, member_id, member_name, 
    scientific_quality, ethical_compliance, methodology_clarity, risk_benefit_ratio,
    informed_consent_quality, data_protection, participant_safety, feasibility,
    strengths, weaknesses, recommendations, general_comments,
    decision, status, assigned_at, completed_at
)
SELECT 
    8 as protocol_id,
    pa.assigned_member_id as member_id,
    u.first_name || ' ' || u.last_name as member_name,
    5 as scientific_quality,
    4 as ethical_compliance, 
    5 as methodology_clarity,
    5 as risk_benefit_ratio,
    4 as informed_consent_quality,
    5 as data_protection,
    5 as participant_safety,
    4 as feasibility,
    'Excellente qualité scientifique, méthodologie rigoureuse' as strengths,
    'Quelques aspects du consentement à améliorer' as weaknesses,
    'Protocole recommandé pour approbation' as recommendations,
    'Protocole de haute qualité, conforme aux standards internationaux' as general_comments,
    'APPROVE' as decision,
    'COMPLETED' as status,
    NOW() - INTERVAL '1 day' as assigned_at,
    NOW() - INTERVAL '1 hour' as completed_at
FROM protocol_assignments pa
JOIN users u ON pa.assigned_member_id = u.id
WHERE pa.protocol_id = 8
AND pa.assigned_member_id != (
    SELECT MIN(assigned_member_id) FROM protocol_assignments WHERE protocol_id = 8
)
LIMIT 1
ON CONFLICT (protocol_id, member_id) DO NOTHING;