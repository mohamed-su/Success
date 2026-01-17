-- Script de vérification des grilles d'évaluation
-- Exécuter dans PostgreSQL

-- 1. Vérifier la structure de la table
\d member_evaluation_grids;

-- 2. Compter toutes les grilles
SELECT COUNT(*) as total_grilles FROM member_evaluation_grids;

-- 3. Voir les grilles par statut
SELECT status, COUNT(*) as count 
FROM member_evaluation_grids 
GROUP BY status;

-- 4. Voir les grilles récentes avec détails
SELECT 
    id,
    protocol_id,
    member_id,
    member_name,
    status,
    decision,
    submitted_at,
    created_at,
    CASE 
        WHEN protocol_french IS NOT NULL THEN 'Oui'
        ELSE 'Non'
    END as has_protocol_french,
    CASE 
        WHEN cv_signed IS NOT NULL THEN 'Oui'
        ELSE 'Non'
    END as has_cv_signed
FROM member_evaluation_grids 
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Vérifier les grilles pour un protocole spécifique (remplacer 8 par l'ID du protocole)
SELECT 
    id,
    member_name,
    decision,
    status,
    submitted_at,
    protocol_french,
    cv_signed,
    investigator_qualified
FROM member_evaluation_grids 
WHERE protocol_id = 8;

-- 6. Vérifier les assignations de protocole
SELECT 
    pa.protocol_id,
    pa.assigned_member_id,
    u.first_name,
    u.last_name,
    CASE 
        WHEN meg.id IS NOT NULL THEN 'Grille créée'
        ELSE 'Pas de grille'
    END as grille_status
FROM protocol_assignments pa
LEFT JOIN users u ON pa.assigned_member_id = u.id
LEFT JOIN member_evaluation_grids meg ON pa.protocol_id = meg.protocol_id AND pa.assigned_member_id = meg.member_id
WHERE pa.protocol_id = 8;

-- 7. Statistiques générales
SELECT 
    'Total protocoles' as metric, COUNT(*) as value FROM protocol_submissions
UNION ALL
SELECT 
    'Total assignations' as metric, COUNT(*) as value FROM protocol_assignments
UNION ALL
SELECT 
    'Total grilles' as metric, COUNT(*) as value FROM member_evaluation_grids
UNION ALL
SELECT 
    'Grilles soumises' as metric, COUNT(*) as value FROM member_evaluation_grids WHERE status = 'COMPLETED';