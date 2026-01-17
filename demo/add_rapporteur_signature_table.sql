-- Créer la table pour les signatures du rapporteur
CREATE TABLE IF NOT EXISTS rapporteur_signatures (
    id SERIAL PRIMARY KEY,
    rapporteur_id INTEGER NOT NULL,
    signature_image TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Ajouter une colonne pour la signature du rapporteur dans les évaluations complètes
ALTER TABLE member_evaluation_grids 
ADD COLUMN IF NOT EXISTS rapporteur_signature_image TEXT;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_rapporteur_signatures_rapporteur_id ON rapporteur_signatures(rapporteur_id);
CREATE INDEX IF NOT EXISTS idx_rapporteur_signatures_active ON rapporteur_signatures(is_active);