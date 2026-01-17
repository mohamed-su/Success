-- Amélioration du système d'assignation des protocoles

-- Ajout d'index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_protocol_assignments_member_id ON protocol_assignments(assigned_member_id);
CREATE INDEX IF NOT EXISTS idx_protocol_assignments_protocol_id ON protocol_assignments(protocol_id);

-- Ajout de contraintes pour assurer l'intégrité
ALTER TABLE protocol_assignments 
ADD CONSTRAINT fk_protocol_assignments_user 
FOREIGN KEY (assigned_member_id) REFERENCES users(id) ON DELETE CASCADE;

-- Mise à jour des protocoles existants pour s'assurer qu'ils ont le bon statut
UPDATE protocol_submissions 
SET status = 'ASSIGNED_TO_MEMBER' 
WHERE id IN (
    SELECT DISTINCT protocol_id 
    FROM protocol_assignments 
    WHERE assigned_member_id IS NOT NULL
) AND status = 'VERIFIED';

-- Ajout d'une vue pour faciliter les requêtes
CREATE OR REPLACE VIEW v_user_assigned_protocols AS
SELECT 
    u.id as user_id,
    u.username,
    u.first_name,
    u.last_name,
    u.role,
    pa.id as assignment_id,
    pa.protocol_id,
    pa.assigned_at,
    pa.can_edit,
    pa.downloaded,
    ps.title as protocol_title,
    ps.description as protocol_description,
    ps.principal_investigator,
    ps.institution,
    ps.participants,
    ps.duration,
    ps.status as protocol_status,
    ps.submitted_at
FROM users u
JOIN protocol_assignments pa ON u.id = pa.assigned_member_id
JOIN protocol_submissions ps ON pa.protocol_id = ps.id
WHERE u.active = true;