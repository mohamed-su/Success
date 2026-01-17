@echo off
echo Arrêt du serveur actuel...
taskkill /f /im node.exe 2>nul

echo Démarrage du serveur sur le bon répertoire...
cd dist\frontend
npx http-server . -p 3000 -o -i index.html