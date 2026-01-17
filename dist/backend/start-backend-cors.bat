@echo off
echo Starting backend with CORS override...
java -Dspring.web.cors.allowed-origins=http://127.0.0.1:5173,http://10.53.44.37:5173,http://localhost:5173 -Dspring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS -Dspring.web.cors.allowed-headers=* -Dspring.web.cors.allow-credentials=true -jar demo-0.0.1-SNAPSHOT.jar
pause