@echo off
echo Starting Spring Boot application with memory optimization...
set JAVA_OPTS=-Xms512m -Xmx2g -XX:MetaspaceSize=256m -XX:MaxMetaspaceSize=512m
mvn spring-boot:run
pause