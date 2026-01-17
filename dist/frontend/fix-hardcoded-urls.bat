@echo off
echo Remplacement des URLs hardcod\u00e9es par BASE_URL dynamique...

cd /d "C:\Users\HP\Downloads\dev1\dev\dist\frontend\assets"

:: Sauvegarde du fichier original
if not exist "index-DFKal6Pg.js.original" (
    copy "index-DFKal6Pg.js" "index-DFKal6Pg.js.original"
)

:: Remplacement des URLs hardcod\u00e9es
powershell -Command "(Get-Content 'index-DFKal6Pg.js') -replace 'http://localhost:8081', '${BASE_URL}' | Set-Content 'index-DFKal6Pg.js'"

echo URLs remplac\u00e9es par ${BASE_URL} dans le JavaScript compil\u00e9
echo Red\u00e9marrez le frontend pour appliquer les changements
pause