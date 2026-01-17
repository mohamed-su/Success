-- Script SQL à exécuter manuellement pour ajouter les champs manquants

-- 1. Ajouter les colonnes manquantes une par une
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS protocol_reference VARCHAR(255);
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS requester_reference VARCHAR(255);
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS documentation TEXT;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS reserves TEXT;

-- 2. Ajouter les colonnes pour les éléments examinés
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS scientific_conception BOOLEAN DEFAULT false;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS participant_protection BOOLEAN DEFAULT false;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS data_confidentiality BOOLEAN DEFAULT false;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS consent_process BOOLEAN DEFAULT false;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS research_budget BOOLEAN DEFAULT false;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS cv_documents BOOLEAN DEFAULT false;

-- 3. Ajouter les colonnes pour les membres ayant siégé
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_koueta BOOLEAN DEFAULT false;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_nanga BOOLEAN DEFAULT false;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_drabo BOOLEAN DEFAULT false;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_toe BOOLEAN DEFAULT false;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_ouedraogo1 BOOLEAN DEFAULT false;
ALTER TABLE protocol_evaluations ADD COLUMN IF NOT EXISTS member_ouedraogo2 BOOLEAN DEFAULT false;

-- 4. Mettre à jour les données existantes avec des valeurs par défaut
UPDATE protocol_evaluations 
SET 
    protocol_reference = COALESCE(protocol_reference, 'Version non précisée'),
    requester_reference = COALESCE(requester_reference, principal_investigator),
    documentation = COALESCE(documentation, 'Protocole de recherche, Copie du reçu de paiement'),
    reserves = COALESCE(reserves, ''),
    scientific_conception = COALESCE(scientific_conception, true),
    participant_protection = COALESCE(participant_protection, true),
    data_confidentiality = COALESCE(data_confidentiality, true),
    consent_process = COALESCE(consent_process, true),
    research_budget = COALESCE(research_budget, false),
    cv_documents = COALESCE(cv_documents, true),
    member_nanga = COALESCE(member_nanga, true),
    member_koueta = COALESCE(member_koueta, true)
WHERE id IS NOT NULL;

-- 5. Vérifier les données après mise à jour
SELECT 
    id, 
    protocol_id,
    deliberation_number,
    research_title,
    protocol_reference,
    principal_investigator,
    requester_reference,
    research_site,
    deliberation_date,
    scientific_conception,
    participant_protection,
    data_confidentiality,
    consent_process,
    research_budget,
    cv_documents,
    observations,
    reserves,
    recommendations,
    recommandation_finale,
    member_koueta,
    member_nanga,
    member_drabo,
    member_toe,
    member_ouedraogo1,
    member_ouedraogo2,
    members_present,
    status
FROM protocol_evaluations 
WHERE is_final = true
ORDER BY evaluation_date DESC;