@echo off
echo ============================================
echo Build et démarrage de l'application Spring Boot
echo ============================================
echo.

echo Étape 1: Compilation du projet...
cd /d "%~dp0"

REM Vérifier si mvn est disponible
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Maven trouvé dans le PATH
    mvn clean install -DskipTests
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo Étape 2: Démarrage de l'application...
        mvn spring-boot:run
    ) else (
        echo Erreur lors de la compilation!
        pause
        exit /b 1
    )
) else (
    echo.
    echo ============================================
    echo Maven n'est pas installé ou pas dans le PATH
    echo ============================================
    echo.
    echo INSTRUCTIONS:
    echo 1. Ouvrez IntelliJ IDEA
    echo 2. Ouvrez ce projet hkeyitna
    echo 3. Dans le panneau Maven (à droite):
    echo    - Cliquez sur Lifecycle
    echo    - Double-clic sur 'clean'
    echo    - Double-clic sur 'install'
    echo 4. Ensuite:
    echo    - Trouvez HkeyitnaApplication.java
    echo    - Clic droit - Run 'HkeyitnaApplication'
    echo.
    pause
    exit /b 1
)
