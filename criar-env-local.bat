@echo off
echo ========================================
echo   Criando arquivo .env.local
echo ========================================
echo.

if exist ".env.local" (
    echo Arquivo .env.local ja existe!
    echo Deseja sobrescrever? (S/N)
    set /p resposta=
    if /i not "%resposta%"=="S" (
        echo Operacao cancelada.
        pause
        exit /b 0
    )
)

if exist ".env.local.template" (
    copy ".env.local.template" ".env.local" >nul
    echo Arquivo .env.local criado com sucesso!
    echo.
    echo IMPORTANTE: Verifique se todas as configuracoes estao corretas.
    echo.
) else (
    echo Erro: Arquivo .env.local.template nao encontrado!
    echo.
)

pause




