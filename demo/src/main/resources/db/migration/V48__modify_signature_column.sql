-- Modifie la colonne signature pour stocker le chemin du fichier
ALTER TABLE protocol_evaluations 
ALTER COLUMN president_signature TYPE VARCHAR(500);