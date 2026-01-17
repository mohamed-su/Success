-- Script pour supprimer le protocole ID 3 (bobi)
-- Exécuter avec: psql -h localhost -U postgres -d comite_ethique -f delete_protocol_3.sql

DELETE FROM protocol_submissions WHERE id = 3;

-- Vérifier la suppression
SELECT id, title, status FROM protocol_submissions ORDER BY id;
