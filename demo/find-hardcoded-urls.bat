@echo off
echo ========================================
echo REMPLACEMENT DES URLs HARDCODEES
echo ========================================

echo.
echo Recherche des fichiers contenant localhost:8081...

cd /d "c:\Users\HP\Downloads\dev1\dev\front\src"

echo.
echo Fichiers trouvés avec localhost:8081:
findstr /s /i "localhost:8081" *.* 2>nul

echo.
echo ========================================
echo CORRECTION MANUELLE REQUISE
echo ========================================
echo.
echo Les fichiers suivants doivent être corrigés manuellement:
echo 1. Remplacer http://localhost:8081/api par ${BASE_URL}
echo 2. Ajouter l'import: import { API_CONFIG } from '../config/api';
echo 3. Ajouter la constante: const BASE_URL = API_CONFIG.BASE_URL;
echo.

pause