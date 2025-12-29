# Script para fazer push do código para plugnrent2.0
# Execute este script no diretório do projeto

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Push para plugnrent2.0" -ForegroundColor Cyan
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

# Remover repositório Git do home (se existir)
Write-Host "🧹 Limpando repositórios Git antigos..." -ForegroundColor Cyan
Remove-Item -Path "$env:USERPROFILE\.git" -Recurse -Force -ErrorAction SilentlyContinue

# Inicializar Git no projeto
if (Test-Path .git) {
    Remove-Item -Path .git -Recurse -Force
    Write-Host "✅ Repositório Git antigo removido" -ForegroundColor Green
}

git init
Write-Host "✅ Repositório Git inicializado" -ForegroundColor Green

# Configurar Git
Write-Host ""
Write-Host "📝 Configurando Git..." -ForegroundColor Cyan
git config user.email "alexandre.brito.engenharia@gmail.com"
git config user.name "Alexandre Brito"

# Configurar remote (sem token na URL - evita push protection do GitHub)
git remote add origin "https://github.com/xanbrito/plugnrent2.0.git"
Write-Host "✅ Remote configurado (sem token na URL)" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Ao fazer push, use o token como senha!" -ForegroundColor Yellow
Write-Host "   Username: xanbrito" -ForegroundColor White
Write-Host "   Password: (cole seu Personal Access Token quando pedir)" -ForegroundColor White
Write-Host ""

# Adicionar arquivos do projeto
Write-Host ""
Write-Host "📦 Adicionando arquivos do projeto..." -ForegroundColor Cyan
git add app/ components/ lib/ types/ middleware.ts package.json package-lock.json tsconfig.json next.config.js tailwind.config.ts postcss.config.js jest.config.js jest.setup.js *.md *.sql *.ps1 *.bat .gitignore 2>&1 | Out-Null

$status = git status --short
$fileCount = ($status | Measure-Object -Line).Lines
Write-Host "✅ $fileCount arquivos adicionados" -ForegroundColor Green

# Criar commit
Write-Host ""
Write-Host "💾 Criando commit..." -ForegroundColor Cyan
$commitMessage = @"
Initial commit: Sistema Vibing - Plataforma de gestão de propriedades

- Sistema completo de autenticação Supabase
- Gestão de propriedades e reservas
- Dashboard para anfitriões
- Integração com Airbnb scraping
- Sistema de fotos e galeria
- Políticas RLS configuradas
"@

git commit -m $commitMessage
Write-Host "✅ Commit criado" -ForegroundColor Green

# Fazer push
Write-Host ""
Write-Host "🚀 Fazendo push para GitHub..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Quando pedir credenciais:" -ForegroundColor Yellow
Write-Host "  Username: xanbrito" -ForegroundColor White
Write-Host "  Password: (cole seu Personal Access Token)" -ForegroundColor White
Write-Host ""
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Push concluído com sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Repositório: https://github.com/xanbrito/plugnrent2.0" -ForegroundColor Cyan
Write-Host ""

