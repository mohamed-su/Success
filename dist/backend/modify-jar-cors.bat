@echo off
echo Modifying JAR to override CORS configuration...

:: Create temporary directory
mkdir temp_jar 2>nul

:: Extract JAR
echo Extracting JAR...
jar -xf demo-0.0.1-SNAPSHOT.jar -C temp_jar

:: Copy new CORS config
echo Adding CORS override...
copy OverrideCorsConfig.java temp_jar\BOOT-INF\classes\comite\demo\config\

:: Compile the new config
echo Compiling CORS config...
javac -cp "temp_jar\BOOT-INF\lib\*;temp_jar\BOOT-INF\classes" temp_jar\BOOT-INF\classes\comite\demo\config\OverrideCorsConfig.java

:: Recreate JAR
echo Recreating JAR...
cd temp_jar
jar -cfm ..\demo-0.0.1-SNAPSHOT-cors.jar META-INF\MANIFEST.MF .
cd ..

:: Cleanup
rmdir /s /q temp_jar

echo Done! Use demo-0.0.1-SNAPSHOT-cors.jar to start backend
pause