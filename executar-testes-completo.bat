@echo off
chcp 65001 >nul
echo ========================================
echo   Sistema Vibing - Executando Testes
echo ========================================
echo.

REM Mudar para o diretório do script
cd /d "%~dp0"

REM Verificar se Node.js está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js 18+ de https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Verificar se npm está instalado
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: npm nao encontrado!
    echo Por favor, instale o Node.js que inclui o npm
    echo.
    pause
    exit /b 1
)

echo Diretorio atual: %CD%
echo.

REM Executar testes
echo Executando testes...
echo.
npx jest --testPathPatterns="__tests__" --verbose 2>&1

echo.
echo ========================================
echo   Testes concluidos
echo ========================================
echo.
pause
