-- Script pour nettoyer les commentaires JSON mal formatés dans member_evaluation_grids
UPDATE member_evaluation_grids 
SET comments = REPLACE(REPLACE(comments, '\"', ''), '\\', '')
WHERE comments IS NOT NULL 
AND comments LIKE '\"%\"'
AND comments LIKE '%\\%';

-- Vérifier les résultats
SELECT id, protocol_id, member_name, 
       SUBSTRING(comments, 1, 100) as comments_preview
FROM member_evaluation_grids 
WHERE comments IS NOT NULL;