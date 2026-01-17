-- Exécutez cette requête dans PostgreSQL :
ALTER TABLE member_evaluation_grids 
ADD COLUMN IF NOT EXISTS final_decision TEXT,
ADD COLUMN IF NOT EXISTS signature_image TEXT,
ADD COLUMN IF NOT EXISTS evaluator_name TEXT,
ADD COLUMN IF NOT EXISTS evaluation_date DATE;