@echo off
echo ===== SOLUTION ALTERNATIVE - MODIFICATION HOSTS =====
echo.

echo Cette solution redirige e-agrement.minsante.bf vers localhost
echo sans serveur proxy.
echo.

echo 1. Sauvegarde du fichier hosts...
copy "%SystemRoot%\System32\drivers\etc\hosts" "%SystemRoot%\System32\drivers\etc\hosts.backup" >nul 2>&1

echo 2. Ajout de la redirection...
echo.
echo IMPORTANT: Executez ce script en tant qu'ADMINISTRATEUR
echo.

findstr /C:"e-agrement.minsante.bf" "%SystemRoot%\System32\drivers\etc\hosts" >nul 2>&1
if %errorlevel% neq 0 (
    echo 127.0.0.1 e-agrement.minsante.bf >> "%SystemRoot%\System32\drivers\etc\hosts"
    echo ✓ Redirection ajoutee
) else (
    echo ✓ Redirection deja presente
)

echo.
echo 3. Verification...
ping -n 1 e-agrement.minsante.bf | findstr "127.0.0.1" >nul
if %errorlevel% equ 0 (
    echo ✓ e-agrement.minsante.bf pointe vers 127.0.0.1
) else (
    echo ✗ Probleme de redirection
)

echo.
echo 4. IMPORTANT: Changez le port dans votre backend
echo    Le frontend va appeler https://e-agrement.minsante.bf/api
echo    Qui va maintenant pointer vers 127.0.0.1 (localhost)
echo.
echo    Mais il faut que votre backend ecoute sur le port 443 (HTTPS)
echo    ou configurez un proxy HTTPS vers HTTP.
echo.

echo 5. Pour annuler cette modification plus tard:
echo    copy "%SystemRoot%\System32\drivers\etc\hosts.backup" "%SystemRoot%\System32\drivers\etc\hosts"
echo.
pause