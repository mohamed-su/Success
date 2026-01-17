-- Nettoyer les assignations de protocoles orphelines
DELETE FROM protocol_assignments 
WHERE protocol_id NOT IN (SELECT id FROM protocol_submissions);

-- Nettoyer les assignations de protocoles avec des membres inexistants
DELETE FROM protocol_assignments 
WHERE assigned_member_id NOT IN (SELECT id FROM users);

-- Ajouter une contrainte pour éviter ce problème à l'avenir
ALTER TABLE protocol_assignments 
DROP CONSTRAINT IF EXISTS fkavv3xusoi0wxj1io0g0f1qdub;

ALTER TABLE protocol_assignments 
ADD CONSTRAINT fk_protocol_assignments_protocol 
FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id) ON DELETE CASCADE;

ALTER TABLE protocol_assignments 
ADD CONSTRAINT fk_protocol_assignments_member 
FOREIGN KEY (assigned_member_id) REFERENCES users(id) ON DELETE CASCADE;