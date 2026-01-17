@echo off
echo Correction des URLs dans le build...
cd dist\frontend\assets
powershell -Command "(Get-Content index-DFKal6Pg.js) -replace '\\$\\{BASE_URL\\}', 'http://localhost:8081' | Set-Content index-DFKal6Pg.js"
echo URLs corrigées !
pause