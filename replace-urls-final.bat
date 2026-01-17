@echo off
echo Remplacement definitif des URLs...

cd dist\frontend\assets

echo Sauvegarde du fichier original...
if not exist "index-DFKal6Pg.js.original" copy index-DFKal6Pg.js index-DFKal6Pg.js.original

echo Remplacement des URLs dans le fichier JS...
powershell -Command ^
"$content = Get-Content 'index-DFKal6Pg.js' -Raw; ^
$content = $content -replace '\\$\\{BASE_URL\\}', 'http://localhost:8081'; ^
$content = $content -replace '%%24%%7BBASE_URL%%7D', 'http://localhost:8081'; ^
$content = $content -replace '\\$%%7BBASE_URL%%7D', 'http://localhost:8081'; ^
$content = $content -replace 'encodeURIComponent\\(\\`\\$\\{BASE_URL\\}\\`\\)', '\"http://localhost:8081\"'; ^
Set-Content 'index-DFKal6Pg.js' $content -NoNewline"

echo URLs remplacees avec succes !
echo Redemarrez le serveur frontend maintenant.
pause