@echo off
REM Script pour lancer le backend Spring Boot avec JAVA_HOME configure

REM Configuration de JAVA_HOME
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

echo ====================================
echo Backend HKEYITNA - Spring Boot
echo ====================================
echo.
echo Java Home: %JAVA_HOME%
echo.

REM Verification de Java
java -version
echo.

REM Lancement du backend
echo Demarrage du serveur backend...
echo.
call mvnw.cmd spring-boot:run

pause
