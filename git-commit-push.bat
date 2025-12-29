@echo off
chcp 65001 >nul
echo ========================================
echo   Sistema Vibing - Git Commit e Push
echo ========================================
echo.

REM Verificar se Git está instalado
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Git não encontrado no PATH.
    echo.
    echo Tentando localizar Git em locais comuns...
    
    REM Tentar locais comuns do Git no Windows
    set "GIT_PATH="
    
    if exist "C:\Program Files\Git\bin\git.exe" (
        set "GIT_PATH=C:\Program Files\Git\bin\git.exe"
    ) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
        set "GIT_PATH=C:\Program Files (x86)\Git\bin\git.exe"
    ) else if exist "%LOCALAPPDATA%\Programs\Git\bin\git.exe" (
        set "GIT_PATH=%LOCALAPPDATA%\Programs\Git\bin\git.exe"
    )
    
    if "%GIT_PATH%"=="" (
        echo [ERRO] Git não encontrado. Por favor, instale o Git ou adicione ao PATH.
        echo Download: https://git-scm.com/download/win
        pause
        exit /b 1
    ) else (
        echo [OK] Git encontrado em: %GIT_PATH%
        set "PATH=%PATH%;%~dp0"
    )
)

echo.
echo [1/6] Verificando status do repositório...
git status --short
if %errorlevel% neq 0 (
    echo.
    echo [INFO] Repositório Git não inicializado. Inicializando...
    git init
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao inicializar repositório Git.
        pause
        exit /b 1
    )
)

echo.
echo [2/6] Verificando repositório remoto...
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Repositório remoto não configurado. Configurando...
    git remote add origin https://github.com/xanbrito/sistema-vibing.git
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao adicionar repositório remoto.
        pause
        exit /b 1
    )
) else (
    git remote set-url origin https://github.com/xanbrito/sistema-vibing.git
    echo [OK] Repositório remoto configurado.
)

echo.
echo [3/6] Adicionando arquivos ao staging...
git add .
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao adicionar arquivos.
    pause
    exit /b 1
)
echo [OK] Arquivos adicionados.

echo.
echo [4/6] Criando commit...
set "COMMIT_MSG=Atualização do projeto - Sistema Vibing v1.0.0"
git commit -m "%COMMIT_MSG%"
if %errorlevel% neq 0 (
    echo [AVISO] Nenhuma mudança para commitar ou commit falhou.
    echo Continuando para push...
) else (
    echo [OK] Commit criado com sucesso.
)

echo.
echo [5/6] Enviando para o GitHub (push)...
git push -u origin main
if %errorlevel% neq 0 (
    echo [AVISO] Push para 'main' falhou. Tentando 'master'...
    git push -u origin master
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao fazer push. Verifique suas credenciais Git.
        echo.
        echo Dica: Configure suas credenciais com:
        echo   git config --global user.name "Seu Nome"
        echo   git config --global user.email "seu@email.com"
        pause
        exit /b 1
    )
)
echo [OK] Push realizado com sucesso.

echo.
echo [6/6] Criando tag de versão v1.0.0...
git tag -a v1.0.0 -m "Versão 1.0.0 - Sistema Vibing" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Tag v1.0.0 criada localmente.
    echo.
    echo Enviando tag para o GitHub...
    git push origin v1.0.0
    if %errorlevel% equ 0 (
        echo [OK] Tag v1.0.0 enviada para o GitHub.
    ) else (
        echo [AVISO] Falha ao enviar tag, mas commit foi realizado.
    )
) else (
    echo [AVISO] Tag já existe ou falha ao criar. Continuando...
    git push origin v1.0.0 2>nul
)

echo.
echo ========================================
echo   ✓ Processo concluído com sucesso!
echo ========================================
echo.
echo Repositório: https://github.com/xanbrito/sistema-vibing
echo Versão: v1.0.0
echo.
pause

