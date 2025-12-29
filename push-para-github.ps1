# Script para fazer push do projeto para GitHub
# Execute este script no diretório do projeto

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push para GitHub - Sistema Vibing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERRO: Execute este script no diretório do projeto!" -ForegroundColor Red
    Write-Host "   Diretório esperado: Projeto AIRBNB 2.0" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Diretório do projeto encontrado" -ForegroundColor Green
Write-Host ""

# Configurar Git
Write-Host "📝 Configurando Git..." -ForegroundColor Cyan
if (-not (Test-Path .git)) {
    git init
    Write-Host "✅ Repositório Git inicializado" -ForegroundColor Green
}

git config user.email "xanbrito@github.com"
git config user.name "Alexandre Brito"

# Configurar remote (sem token - use apenas quando o Git pedir credenciais)
git remote remove origin 2>&1 | Out-Null
git remote add origin "https://github.com/xanbrito/sistema-vibing.git"
Write-Host "✅ Remote configurado com token" -ForegroundColor Green

# Buscar branches remotos
Write-Host ""
Write-Host "📥 Buscando branches remotos..." -ForegroundColor Cyan
git fetch origin

# Criar branch main
Write-Host ""
Write-Host "🌿 Configurando branch main..." -ForegroundColor Cyan
git checkout -b main 2>&1 | Out-Null
git branch -M main
Write-Host "✅ Branch main configurada" -ForegroundColor Green

# Adicionar arquivos (respeitando .gitignore)
Write-Host ""
Write-Host "📦 Adicionando arquivos..." -ForegroundColor Cyan
git add .
$status = git status --short
$fileCount = ($status | Measure-Object -Line).Lines
Write-Host "✅ $fileCount arquivos adicionados" -ForegroundColor Green

# Criar commit
Write-Host ""
Write-Host "💾 Criando commit..." -ForegroundColor Cyan
$commitMessage = @"
Ponto de restauração: Correções de autenticação Supabase

- Correção de erros isSignedIn não definido
- Correção de erro 406 ao buscar condomínio
- Melhorias no CondominiumAuthProvider
- Integração completa com Supabase Auth
- Remoção completa de referências Clerk
"@

git commit -m $commitMessage
Write-Host "✅ Commit criado" -ForegroundColor Green

# Criar tag
Write-Host ""
Write-Host "🏷️  Criando tag de restauração..." -ForegroundColor Cyan
$tagName = "restauracao-correcoes-auth-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git tag -a $tagName -m "Ponto de restauração: Correções de autenticação Supabase"
Write-Host "✅ Tag criada: $tagName" -ForegroundColor Green

# Fazer push
Write-Host ""
Write-Host "🚀 Fazendo push para GitHub..." -ForegroundColor Cyan
Write-Host ""
git push -u origin main --tags

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Push concluído com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Repositório: https://github.com/xanbrito/sistema-vibing" -ForegroundColor Cyan
Write-Host "🏷️  Tag: $tagName" -ForegroundColor Cyan
Write-Host ""

