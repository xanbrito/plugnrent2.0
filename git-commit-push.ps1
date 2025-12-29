# Sistema Vibing - Git Commit e Push
# PowerShell Script

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sistema Vibing - Git Commit e Push" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Função para encontrar Git
function Find-Git {
    $gitPaths = @(
        "git",
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
        "$env:ProgramFiles\Git\cmd\git.exe",
        "$env:ProgramFiles(x86)\Git\cmd\git.exe"
    )
    
    foreach ($path in $gitPaths) {
        try {
            if ($path -eq "git") {
                $result = Get-Command git -ErrorAction SilentlyContinue
                if ($result) {
                    return "git"
                }
            } elseif (Test-Path $path) {
                return $path
            }
        } catch {
            continue
        }
    }
    
    return $null
}

# Encontrar Git
Write-Host "[1/7] Procurando Git..." -ForegroundColor Yellow
$gitCmd = Find-Git

if (-not $gitCmd) {
    Write-Host "[ERRO] Git não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Git: https://git-scm.com/download/win" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "[OK] Git encontrado: $gitCmd" -ForegroundColor Green
Write-Host ""

# Verificar se é repositório Git
Write-Host "[2/7] Verificando repositório Git..." -ForegroundColor Yellow
$isGitRepo = Test-Path ".git"

if (-not $isGitRepo) {
    Write-Host "[INFO] Inicializando repositório Git..." -ForegroundColor Yellow
    & $gitCmd init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Falha ao inicializar repositório." -ForegroundColor Red
        Read-Host "Pressione Enter para sair"
        exit 1
    }
}

# Configurar repositório remoto
Write-Host "[3/7] Configurando repositório remoto..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/xanbrito/sistema-vibing.git"

try {
    $currentRemote = & $gitCmd remote get-url origin 2>$null
    if ($currentRemote -ne $remoteUrl) {
        & $gitCmd remote set-url origin $remoteUrl
        Write-Host "[OK] Repositório remoto atualizado." -ForegroundColor Green
    } else {
        Write-Host "[OK] Repositório remoto já configurado." -ForegroundColor Green
    }
} catch {
    & $gitCmd remote add origin $remoteUrl
    Write-Host "[OK] Repositório remoto adicionado." -ForegroundColor Green
}

Write-Host ""

# Adicionar arquivos
Write-Host "[4/7] Adicionando arquivos ao staging..." -ForegroundColor Yellow
& $gitCmd add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Falha ao adicionar arquivos." -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-Host "[OK] Arquivos adicionados." -ForegroundColor Green
Write-Host ""

# Criar commit
Write-Host "[5/7] Criando commit..." -ForegroundColor Yellow
$commitMsg = "Atualização do projeto - Sistema Vibing v1.0.0 - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
& $gitCmd commit -m $commitMsg
if ($LASTEXITCODE -ne 0) {
    Write-Host "[AVISO] Nenhuma mudança para commitar ou commit falhou." -ForegroundColor Yellow
    Write-Host "Continuando para push..." -ForegroundColor Yellow
} else {
    Write-Host "[OK] Commit criado com sucesso." -ForegroundColor Green
}
Write-Host ""

# Push para GitHub
Write-Host "[6/7] Enviando para o GitHub..." -ForegroundColor Yellow
$branches = @("main", "master")
$pushSuccess = $false

foreach ($branch in $branches) {
    try {
        & $gitCmd push -u origin $branch 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[OK] Push realizado com sucesso na branch '$branch'." -ForegroundColor Green
            $pushSuccess = $true
            break
        }
    } catch {
        continue
    }
}

if (-not $pushSuccess) {
    Write-Host "[ERRO] Falha ao fazer push." -ForegroundColor Red
    Write-Host "Verifique suas credenciais Git ou configure:" -ForegroundColor Yellow
    Write-Host "  git config --global user.name 'Seu Nome'" -ForegroundColor Yellow
    Write-Host "  git config --global user.email 'seu@email.com'" -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}
Write-Host ""

# Criar tag de versão
Write-Host "[7/7] Criando tag de versão v1.0.0..." -ForegroundColor Yellow
$tagExists = & $gitCmd tag -l "v1.0.0" 2>$null

if ($tagExists) {
    Write-Host "[INFO] Tag v1.0.0 já existe. Atualizando..." -ForegroundColor Yellow
    & $gitCmd tag -d v1.0.0 2>$null
}

& $gitCmd tag -a v1.0.0 -m "Versão 1.0.0 - Sistema Vibing - $(Get-Date -Format 'yyyy-MM-dd')"
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Tag v1.0.0 criada localmente." -ForegroundColor Green
    Write-Host ""
    Write-Host "Enviando tag para o GitHub..." -ForegroundColor Yellow
    & $gitCmd push origin v1.0.0
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Tag v1.0.0 enviada para o GitHub." -ForegroundColor Green
    } else {
        Write-Host "[AVISO] Falha ao enviar tag, mas commit foi realizado." -ForegroundColor Yellow
    }
} else {
    Write-Host "[AVISO] Falha ao criar tag." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ Processo concluído com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repositório: https://github.com/xanbrito/sistema-vibing" -ForegroundColor Cyan
Write-Host "Versão: v1.0.0" -ForegroundColor Cyan
Write-Host ""
Read-Host "Pressione Enter para sair"

