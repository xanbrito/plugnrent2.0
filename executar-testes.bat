@echo off
chcp 65001 >nul
echo ========================================
echo   Executando Testes - Sistema Vibing
echo ========================================
echo.

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    echo.
)

echo Executando testes...
echo.

npx jest --coverage

echo.
echo Testes concluidos!
pause




