-- REQUÊTES SQL À EXÉCUTER POUR LES NOUVELLES FONCTIONNALITÉS
-- ================================================================

-- 1. Ajouter les colonnes pour la décision finale et la signature (déjà existant)
ALTER TABLE member_evaluation_grids 
ADD COLUMN IF NOT EXISTS final_decision TEXT,
ADD COLUMN IF NOT EXISTS signature_image TEXT,
ADD COLUMN IF NOT EXISTS evaluator_name TEXT,
ADD COLUMN IF NOT EXISTS evaluation_date DATE;

-- 2. Créer la table pour les signatures du rapporteur
CREATE TABLE IF NOT EXISTS rapporteur_signatures (
    id SERIAL PRIMARY KEY,
    rapporteur_id INTEGER NOT NULL,
    signature_image TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Ajouter une colonne pour la signature du rapporteur dans les évaluations complètes
ALTER TABLE member_evaluation_grids 
ADD COLUMN IF NOT EXISTS rapporteur_signature_image TEXT;

-- 4. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_rapporteur_signatures_rapporteur_id ON rapporteur_signatures(rapporteur_id);
CREATE INDEX IF NOT EXISTS idx_rapporteur_signatures_active ON rapporteur_signatures(is_active);

-- 5. Vérifier que la table member_evaluation_grids existe avec les bonnes colonnes
-- (Cette requête est pour vérification - ne pas exécuter)
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'member_evaluation_grids';

-- NOTES D'IMPLÉMENTATION :
-- ========================
-- 1. Le bouton "+" pour ajouter des membres apparaît quand il y a 6+ membres
-- 2. L'endpoint /api/protocol-evaluation/protocol/{protocolId}/add-members ajoute automatiquement 2-3 membres
-- 3. Le système d'upload de signature permet PNG/JPG jusqu'à 2MB
-- 4. Les signatures sont stockées en Base64 dans la base de données
-- 5. Seule la signature active la plus récente est utilisée pour chaque rapporteur