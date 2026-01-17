@echo off
echo ========================================
echo Modification JAR pour CORS
echo ========================================

cd dist\backend

echo 1. Sauvegarde du JAR original...
copy demo-0.0.1-SNAPSHOT.jar demo-0.0.1-SNAPSHOT.jar.backup

echo 2. Extraction du JAR...
mkdir temp-jar
cd temp-jar
java -jar ..\demo-0.0.1-SNAPSHOT.jar --extract 2>nul
if %errorlevel% neq 0 (
    echo Extraction avec 7zip...
    7z x ..\demo-0.0.1-SNAPSHOT.jar
)

echo 3. Creation du dossier config...
mkdir BOOT-INF\classes\comite\demo\config 2>nul

echo 4. Compilation de la config CORS...
javac -cp "..\demo-0.0.1-SNAPSHOT.jar" ..\OverrideCorsConfig.java -d BOOT-INF\classes\

echo 5. Recreation du JAR...
jar -cfm ..\demo-0.0.1-SNAPSHOT-new.jar META-INF\MANIFEST.MF *

cd ..
move demo-0.0.1-SNAPSHOT-new.jar demo-0.0.1-SNAPSHOT.jar

echo 6. Nettoyage...
rmdir /s /q temp-jar

echo.
echo JAR modifie avec succes !
echo CORS est maintenant desactive.
pause