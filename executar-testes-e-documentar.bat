@echo off
chcp 65001 >nul
echo ========================================
echo   Sistema Vibing - Executando Testes e Documentando Erros
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

REM Criar arquivo temporário para capturar saída dos testes
set TEMP_OUTPUT=%TEMP%\jest-output-%RANDOM%.txt

REM Executar testes e salvar saída
echo Executando testes e salvando resultado...
echo.
npx jest --testPathPatterns="__tests__" --verbose 2>&1 | tee "%TEMP_OUTPUT%"

echo.
echo ========================================
echo   Analisando resultados...
echo ========================================
echo.

REM Verificar se há erros
findstr /C:"FAIL" /C:"Error" /C:"failing" "%TEMP_OUTPUT%" >nul 2>&1
if %errorlevel% equ 0 (
    echo ERROS ENCONTRADOS!
    echo.
    echo Por favor, copie a saida acima e envie para documentacao.
    echo Ou execute manualmente:
    echo   node scripts/adicionar-erro-teste.js "Nome" "arquivo" "severidade" "Desc" "Msg"
) else (
    echo Todos os testes passaram! ^(^)
)

echo.
echo Saida completa salva em: %TEMP_OUTPUT%
echo.
echo ========================================
echo   Testes concluidos
echo ========================================
echo.
pause

REM Limpar arquivo temporário após 5 segundos
timeout /t 5 /nobreak >nul
del "%TEMP_OUTPUT%" >nul 2>&1




