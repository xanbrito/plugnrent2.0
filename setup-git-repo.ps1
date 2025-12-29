# Script para configurar Git e criar ponto de restauração
# Sistema Vibing - Ponto de Restauração

Write-Host "🔧 Configurando repositório Git..." -ForegroundColor Cyan

# Verificar se já existe .git
if (Test-Path .git) {
    Write-Host "⚠️  Repositório Git já existe. Continuando..." -ForegroundColor Yellow
} else {
    Write-Host "📦 Inicializando repositório Git..." -ForegroundColor Green
    git init
}

# Configurar usuário Git (apenas localmente)
git config user.email "xanbrito@github.com"
git config user.name "Alexandre Brito"

# Adicionar remote se não existir
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    Write-Host "🔗 Adicionando remote origin..." -ForegroundColor Green
    git remote add origin https://github.com/xanbrito/sistema-vibing.git
} else {
    Write-Host "✅ Remote origin já configurado" -ForegroundColor Green
}

# Buscar branches remotos
Write-Host "📥 Buscando branches remotos..." -ForegroundColor Green
git fetch origin

# Verificar se há commits locais
$hasCommits = git rev-parse --verify HEAD 2>$null
if (-not $hasCommits) {
    Write-Host "📝 Criando commit inicial..." -ForegroundColor Green
    
    # Adicionar todos os arquivos (respeitando .gitignore)
    git add .
    
    # Criar commit
    $commitMessage = "Ponto de restauração: Correções de autenticação e remoção de referências Clerk`n`n- Correção de erros isSignedIn não definido`n- Correção de erro 406 ao buscar condomínio`n- Melhorias no CondominiumAuthProvider`n- Integração completa com Supabase Auth"
    git commit -m $commitMessage
    
    Write-Host "✅ Commit criado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "📝 Adicionando mudanças ao commit..." -ForegroundColor Green
    git add .
    $commitMessage = "Ponto de restauração: Correções de autenticação e remoção de referências Clerk`n`n- Correção de erros isSignedIn não definido`n- Correção de erro 406 ao buscar condomínio`n- Melhorias no CondominiumAuthProvider`n- Integração completa com Supabase Auth"
    git commit -m $commitMessage --allow-empty
}

# Criar tag de restauração
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$tagName = "restauracao-correcoes-auth-$timestamp"
Write-Host "🏷️  Criando tag de restauração: $tagName" -ForegroundColor Green
git tag -a $tagName -m "Ponto de restauração: Correções de autenticação Supabase - $timestamp"

# Fazer push
Write-Host "🚀 Enviando para o repositório remoto..." -ForegroundColor Green
git push -u origin main --tags

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Ponto de restauração criado com sucesso!" -ForegroundColor Green
    Write-Host "📍 Tag: $tagName" -ForegroundColor Cyan
    Write-Host "🔗 Repositório: https://github.com/xanbrito/sistema-vibing" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Erro ao fazer push. Verifique as credenciais do Git." -ForegroundColor Yellow
    Write-Host "💡 Você pode precisar configurar autenticação SSH ou token de acesso." -ForegroundColor Yellow
}


