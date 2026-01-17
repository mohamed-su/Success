-- Supprimer la contrainte de clé étrangère problématique
ALTER TABLE protocol_assignments DROP CONSTRAINT IF EXISTS fkavv3xusoi0wxj1io0g0f1qdub;

-- Ajouter une contrainte vers protocol_submissions au lieu de protocols
ALTER TABLE protocol_assignments 
ADD CONSTRAINT fk_protocol_assignments_protocol_submissions 
FOREIGN KEY (protocol_id) REFERENCES protocol_submissions(id);