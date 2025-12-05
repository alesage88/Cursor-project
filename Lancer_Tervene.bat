@echo off
title Tervene License Manager - Demarrage
color 0A
echo.
echo ========================================
echo   TERVENE LICENSE MANAGER
echo   Demarrage en cours...
echo ========================================
echo.

cd /d "%~dp0"

echo Verification de Node.js...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERREUR] Node.js n'est pas installe !
    echo.
    echo Veuillez installer Node.js depuis:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js detecte !
echo.

if not exist "node_modules\" (
    echo Installation des dependances...
    echo Cela peut prendre quelques minutes...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo.
        echo [ERREUR] Installation echouee !
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Installation terminee !
    echo.
)

echo Lancement de l'application...
echo.
echo ========================================
echo   Application prete !
echo   URL: http://localhost:3000
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arreter
echo.

call npm run dev

pause






