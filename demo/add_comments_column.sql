-- Ajouter la colonne comments à la table member_evaluation_grids si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'member_evaluation_grids' 
        AND column_name = 'comments'
    ) THEN
        ALTER TABLE member_evaluation_grids 
        ADD COLUMN comments TEXT;
        
        RAISE NOTICE 'Colonne comments ajoutée à member_evaluation_grids';
    ELSE
        RAISE NOTICE 'Colonne comments existe déjà dans member_evaluation_grids';
    END IF;
END $$;