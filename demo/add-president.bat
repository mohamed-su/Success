@echo off
echo Ajout du président Prof. Aminata Traoré...
psql -h localhost -p 5432 -U postgres -d comite_ethique -f add-president.sql
pause