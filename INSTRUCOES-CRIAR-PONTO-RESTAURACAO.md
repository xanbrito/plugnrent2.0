# 📦 Instruções para Criar Ponto de Restauração

## 🎯 Objetivo
Criar um commit e tag de restauração no repositório GitHub com todas as correções de autenticação implementadas.

## 📋 Passos para Executar

### 1. Abrir PowerShell no Diretório do Projeto

Navegue até o diretório do projeto:
```powershell
cd "C:\Users\Alexandre\OneDrive\Área de Trabalho\Projeto AIRBNB 2.0"
```

### 2. Verificar se Git está Configurado

```powershell
git config user.email "xanbrito@github.com"
git config user.name "Alexandre Brito"
```

### 3. Inicializar Repositório (se necessário)

```powershell
# Verificar se já existe .git
if (-not (Test-Path .git)) {
    git init
    git remote add origin https://github.com/xanbrito/sistema-vibing.git
    git fetch origin
    git checkout -b main
}
```

### 4. Adicionar Arquivos ao Commit

```powershell
git add .
```

### 5. Criar Commit

```powershell
git commit -m "Ponto de restauração: Correções de autenticação Supabase

- Correção de erros isSignedIn não definido
- Correção de erro 406 ao buscar condomínio  
- Melhorias no CondominiumAuthProvider
- Integração completa com Supabase Auth"
```

### 6. Criar Tag de Restauração

```powershell
$tagName = "restauracao-correcoes-auth-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git tag -a $tagName -m "Ponto de restauração: Correções de autenticação Supabase"
Write-Host "Tag criada: $tagName"
```

### 7. Enviar para GitHub

```powershell
git push -u origin main --tags
```

## ✅ Verificação

Após executar os comandos, verifique no GitHub:
- Repositório: https://github.com/xanbrito/sistema-vibing
- Branch: `main`
- Tags: Procure pela tag `restauracao-correcoes-auth-*`

## 🔧 Solução de Problemas

### Erro: "Permission denied" ao adicionar arquivos
O `.gitignore` deve estar configurado corretamente. Verifique se arquivos do sistema não estão sendo adicionados.

### Erro: "src refspec main does not match any"
Isso significa que não há commits. Certifique-se de que o commit foi criado com sucesso antes de fazer push.

### Erro: "Failed to resolve 'HEAD'"
Isso significa que não há commits ainda. Crie um commit primeiro.

## 📝 Notas

- O `.gitignore` já está configurado para ignorar `node_modules`, `.vscode`, `.env.local`, etc.
- Se houver conflitos, você pode precisar fazer `git pull` primeiro
- Para autenticação no GitHub, você pode precisar configurar um token de acesso pessoal


