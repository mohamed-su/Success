-- Supprimer les anciennes assignations pour éviter les conflits
DELETE FROM protocol_member_assignments;

-- Ajouter les assignations de test avec les IDs utilisateurs existants
-- Utiliser l'ID 10 pour Dr. Amadou OUEDRAOGO (membre1@comite-ethique.bf)
INSERT INTO protocol_member_assignments (protocol_id, member_id, member_name, assigned_by_id, assigned_by_name, assigned_at, status)
SELECT 1, 10, 'Dr. Amadou OUEDRAOGO', 3, 'Prof. Aminata Traoré', NOW(), 'ASSIGNED'
WHERE EXISTS (SELECT 1 FROM users WHERE id = 10)
AND EXISTS (SELECT 1 FROM protocol_submissions WHERE id = 1);

-- Utiliser l'ID 11 pour Dr. Fatimata KONE (membre2@comite-ethique.bf)
INSERT INTO protocol_member_assignments (protocol_id, member_id, member_name, assigned_by_id, assigned_by_name, assigned_at, status)
SELECT 2, 11, 'Dr. Fatimata KONE', 3, 'Prof. Aminata Traoré', NOW(), 'ASSIGNED'
WHERE EXISTS (SELECT 1 FROM users WHERE id = 11)
AND EXISTS (SELECT 1 FROM protocol_submissions WHERE id = 2);

-- Mettre à jour le statut des protocoles assignés
UPDATE protocol_submissions SET status = 'ASSIGNED_TO_MEMBER' WHERE id IN (1, 2);