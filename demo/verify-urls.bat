@echo off
echo ========================================
echo VERIFICATION FINALE DES URLs
echo ========================================

cd /d "c:\Users\HP\Downloads\dev1\dev\front\src"

echo.
echo Recherche de localhost:8081...
findstr /s /i "localhost:8081" *.* 2>nul
if %errorlevel% equ 0 (
    echo ❌ URLs hardcodées trouvées !
) else (
    echo ✅ Aucune URL localhost:8081 trouvée
)

echo.
echo Recherche de localhost:9999...
findstr /s /i "localhost:9999" *.* 2>nul
if %errorlevel% equ 0 (
    echo ❌ URLs hardcodées trouvées !
) else (
    echo ✅ Aucune URL localhost:9999 trouvée
)

echo.
echo Vérification de l'utilisation de BASE_URL...
findstr /s /i "BASE_URL" *.* 2>nul | find /c "BASE_URL" > temp_count.txt
set /p count=<temp_count.txt
del temp_count.txt
echo ✅ BASE_URL utilisé dans %count% endroits

echo.
echo ========================================
echo VERIFICATION TERMINEE
echo ========================================
pause