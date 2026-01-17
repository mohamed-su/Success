@echo off
echo ========================================
echo REMPLACEMENT AUTOMATIQUE DES URLs
echo ========================================

cd /d "c:\Users\HP\Downloads\dev1\dev\front\src"

echo.
echo Remplacement de http://localhost:8081/api par ${BASE_URL}...

for /r %%f in (*.tsx *.ts *.jsx *.js) do (
    powershell -Command "(Get-Content '%%f') -replace 'http://localhost:8081/api', '${BASE_URL}' | Set-Content '%%f'"
)

echo.
echo Remplacement de http://localhost:9999/api par ${BASE_URL}...

for /r %%f in (*.tsx *.ts *.jsx *.js) do (
    powershell -Command "(Get-Content '%%f') -replace 'http://localhost:9999/api', '${BASE_URL}' | Set-Content '%%f'"
)

echo.
echo ========================================
echo REMPLACEMENT TERMINE
echo ========================================
echo.
echo ATTENTION: Vous devez maintenant ajouter manuellement dans chaque fichier modifié:
echo import { API_CONFIG } from '../config/api';
echo const BASE_URL = API_CONFIG.BASE_URL;
echo.
pause