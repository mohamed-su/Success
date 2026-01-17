@echo off
echo Execution des scripts SQL pour corriger les commentaires...

echo.
echo 1. Ajout de la colonne comments si necessaire...
echo DO $$ > temp_add_column.sql
echo BEGIN >> temp_add_column.sql
echo     IF NOT EXISTS ( >> temp_add_column.sql
echo         SELECT 1 FROM information_schema.columns  >> temp_add_column.sql
echo         WHERE table_name = 'member_evaluation_grids'  >> temp_add_column.sql
echo         AND column_name = 'comments' >> temp_add_column.sql
echo     ) THEN >> temp_add_column.sql
echo         ALTER TABLE member_evaluation_grids  >> temp_add_column.sql
echo         ADD COLUMN comments TEXT; >> temp_add_column.sql
echo         RAISE NOTICE 'Colonne comments ajoutee a member_evaluation_grids'; >> temp_add_column.sql
echo     ELSE >> temp_add_column.sql
echo         RAISE NOTICE 'Colonne comments existe deja dans member_evaluation_grids'; >> temp_add_column.sql
echo     END IF; >> temp_add_column.sql
echo END $$; >> temp_add_column.sql

echo.
echo 2. Nettoyage des commentaires JSON mal formates...
echo UPDATE member_evaluation_grids > temp_clean_comments.sql
echo SET comments = REPLACE(REPLACE(comments, '\"', ''), '\\', '') >> temp_clean_comments.sql
echo WHERE comments IS NOT NULL >> temp_clean_comments.sql
echo AND comments LIKE '\"%%\"' >> temp_clean_comments.sql
echo AND comments LIKE '%%\\%%'; >> temp_clean_comments.sql

echo.
echo 3. Verification des resultats...
echo SELECT id, protocol_id, member_name, > temp_verify.sql
echo        SUBSTRING(comments, 1, 100) as comments_preview >> temp_verify.sql
echo FROM member_evaluation_grids >> temp_verify.sql
echo WHERE comments IS NOT NULL; >> temp_verify.sql

echo.
echo Scripts SQL crees dans le repertoire courant:
echo - temp_add_column.sql
echo - temp_clean_comments.sql  
echo - temp_verify.sql
echo.
echo Executez ces scripts dans votre client PostgreSQL ou via l'interface d'administration.

pause