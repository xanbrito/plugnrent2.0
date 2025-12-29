# Sistema Vibing - Git Commit, Push e Tag de Versão
# PowerShell Script para Windows

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sistema Vibing - Git Commit e Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Função para encontrar Git
function Find-Git {
    $gitPaths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
        "$env:ProgramFiles\Git\cmd\git.exe",
        "$env:ProgramFiles(x86)\Git\cmd\git.exe"
    )
    
    # Verificar se git está no PATH
    $gitInPath = Get-Command git -ErrorAction SilentlyContinue
    if ($gitInPath) {
        return "git"
    }
    
    # Tentar encontrar em locais comuns
    foreach ($path in $gitPaths) {
        if (Test-Path $path) {
            Write-Host "[OK] Git encontrado em: $path" -ForegroundColor Green
            return $path
        }
    }
    
    Write-Host "[ERRO] Git não encontrado. Por favor, instale o Git." -ForegroundColor Red
    Write-Host "Download: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Encontrar Git
$gitCmd = Find-Git

# Ler versão do package.json
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$version = $packageJson.version
$tagName = "v$version"

Write-Host "[INFO] Versão detectada: $version" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se repositório Git está inicializado
Write-Host "[1/7] Verificando repositório Git..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "[INFO] Inicializando repositório Git..." -ForegroundColor Yellow
    & $gitCmd init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Falha ao inicializar repositório Git." -ForegroundColor Red
        exit 1
    }
}

# 2. Verificar repositório remoto
Write-Host "[2/7] Verificando repositório remoto..." -ForegroundColor Yellow
$remoteUrl = & $gitCmd remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[INFO] Configurando repositório remoto..." -ForegroundColor Yellow
    & $gitCmd remote add origin https://github.com/xanbrito/sistema-vibing.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Falha ao adicionar repositório remoto." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[OK] Repositório remoto já configurado: $remoteUrl" -ForegroundColor Green
    & $gitCmd remote set-url origin https://github.com/xanbrito/sistema-vibing.git
}

# 3. Verificar branch atual
Write-Host "[3/7] Verificando branch atual..." -ForegroundColor Yellow
$currentBranch = & $gitCmd branch --show-current 2>$null
if ([string]::IsNullOrEmpty($currentBranch)) {
    Write-Host "[INFO] Criando branch main..." -ForegroundColor Yellow
    & $gitCmd checkout -b main
    $currentBranch = "main"
} else {
    Write-Host "[OK] Branch atual: $currentBranch" -ForegroundColor Green
}

# 4. Adicionar arquivos
Write-Host "[4/7] Adicionando arquivos ao staging..." -ForegroundColor Yellow
& $gitCmd add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Falha ao adicionar arquivos." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Arquivos adicionados." -ForegroundColor Green

# 5. Criar commit
Write-Host "[5/7] Criando commit..." -ForegroundColor Yellow
$commitMessage = "Atualização do projeto - Sistema Vibing $tagName - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
& $gitCmd commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "[AVISO] Nenhuma mudança para commitar ou commit falhou." -ForegroundColor Yellow
    Write-Host "Continuando para push..." -ForegroundColor Yellow
} else {
    Write-Host "[OK] Commit criado com sucesso." -ForegroundColor Green
}

# 6. Push para GitHub
Write-Host "[6/7] Enviando para o GitHub (push)..." -ForegroundColor Yellow
& $gitCmd push -u origin $currentBranch
if ($LASTEXITCODE -ne 0) {
    Write-Host "[AVISO] Push para '$currentBranch' falhou. Tentando 'main'..." -ForegroundColor Yellow
    & $gitCmd push -u origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[AVISO] Push falhou. Verifique suas credenciais Git." -ForegroundColor Yellow
        Write-Host "Dica: Configure suas credenciais com:" -ForegroundColor Yellow
        Write-Host "  git config --global user.name `"Seu Nome`"" -ForegroundColor Yellow
        Write-Host "  git config --global user.email `"seu@email.com`"" -ForegroundColor Yellow
    } else {
        Write-Host "[OK] Push realizado com sucesso." -ForegroundColor Green
    }
} else {
    Write-Host "[OK] Push realizado com sucesso." -ForegroundColor Green
}

# 7. Criar e enviar tag
Write-Host "[7/7] Criando tag de versão $tagName..." -ForegroundColor Yellow
& $gitCmd tag -a $tagName -m "Versão $version - Sistema Vibing - $(Get-Date -Format 'yyyy-MM-dd')" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Tag $tagName criada localmente." -ForegroundColor Green
    Write-Host "Enviando tag para o GitHub..." -ForegroundColor Yellow
    & $gitCmd push origin $tagName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Tag $tagName enviada para o GitHub." -ForegroundColor Green
    } else {
        Write-Host "[AVISO] Falha ao enviar tag, mas commit foi realizado." -ForegroundColor Yellow
    }
} else {
    Write-Host "[AVISO] Tag já existe ou falha ao criar. Tentando enviar tag existente..." -ForegroundColor Yellow
    & $gitCmd push origin $tagName 2>$null
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ Processo concluído com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repositório: https://github.com/xanbrito/sistema-vibing" -ForegroundColor Cyan
Write-Host "Versão: $tagName" -ForegroundColor Cyan
Write-Host "Branch: $currentBranch" -ForegroundColor Cyan
Write-Host ""




