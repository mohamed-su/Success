-- Ajouter les champs de gestion des paiements à la table protocol_submissions
ALTER TABLE protocol_submissions 
ADD COLUMN payment_status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
ADD COLUMN payment_verified_at TIMESTAMP,
ADD COLUMN payment_verified_by BIGINT,
ADD COLUMN payment_comments TEXT;

-- Ajouter un commentaire pour documenter les statuts possibles
COMMENT ON COLUMN protocol_submissions.payment_status IS 'Statut du paiement: PENDING, PAID, VERIFIED, REJECTED';

-- Mettre à jour les protocoles existants avec le statut PENDING
UPDATE protocol_submissions SET payment_status = 'PENDING' WHERE payment_status IS NULL;