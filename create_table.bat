@echo off
echo ========================================
echo Creation de la table final_deliberations
echo ========================================

echo.
echo Execution du script SQL...
psql -h localhost -U postgres -d comite_ethique -f create_final_deliberations_table.sql

echo.
echo ========================================
echo Table creee avec succes
echo ========================================
pause