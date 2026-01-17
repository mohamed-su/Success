@echo off
echo Mise à jour de la base de données pour le nouveau formulaire de délibération...

REM Essayer différents chemins pour PostgreSQL
set PGPATH=""
if exist "C:\Program Files\PostgreSQL\18\bin\psql.exe" set PGPATH="C:\Program Files\PostgreSQL\18\bin\"
if exist "C:\Program Files\PostgreSQL\17\bin\psql.exe" set PGPATH="C:\Program Files\PostgreSQL\17\bin\"
if exist "C:\Program Files\PostgreSQL\16\bin\psql.exe" set PGPATH="C:\Program Files\PostgreSQL\16\bin\"
if exist "C:\Program Files\PostgreSQL\15\bin\psql.exe" set PGPATH="C:\Program Files\PostgreSQL\15\bin\"

if %PGPATH%=="" (
    echo PostgreSQL non trouvé. Veuillez exécuter manuellement le script add_deliberation_columns.sql
    pause
    exit /b 1
)

echo Utilisation de PostgreSQL dans %PGPATH%

%PGPATH%psql.exe -h localhost -p 5432 -U postgres -d comite_ethique -f add_deliberation_columns.sql

if %ERRORLEVEL% EQU 0 (
    echo Base de données mise à jour avec succès !
) else (
    echo Erreur lors de la mise à jour. Vérifiez que PostgreSQL est démarré et que la base comite_ethique existe.
)

pause