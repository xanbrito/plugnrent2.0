# 🚀 Guia Completo: Fazer Push para GitHub

## ❓ Você NÃO precisa de SSH Keys!

**Use HTTPS com Personal Access Token** - é mais simples e funciona perfeitamente.

---

## 📋 Passo a Passo

### 1️⃣ Criar Personal Access Token no GitHub

1. Acesse: **https://github.com/settings/tokens**
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Dê um nome: `Sistema Vibing - Push`
4. Selecione a permissão: ✅ **`repo`** (acesso completo aos repositórios)
5. Clique em **"Generate token"**
6. **⚠️ COPIE O TOKEN AGORA!** (você só verá ele uma vez)

---

### 2️⃣ Abrir PowerShell no Diretório do Projeto

Navegue até o diretório do projeto:
```powershell
cd "C:\Users\Alexandre\OneDrive\Área de Trabalho\Projeto AIRBNB 2.0"
```

---

### 3️⃣ Configurar Git (se ainda não configurou)

```powershell
# Configurar usuário
git config user.email "xanbrito@github.com"
git config user.name "Alexandre Brito"

# Configurar remote
git remote remove origin
git remote add origin https://github.com/xanbrito/sistema-vibing.git

# Buscar branches remotos
git fetch origin
```

---

### 4️⃣ Criar Branch e Adicionar Arquivos

```powershell
# Criar branch main
git checkout -b main
git branch -M main

# Adicionar arquivos do projeto (respeitando .gitignore)
git add app/ components/ lib/ types/ middleware.ts package.json tsconfig.json next.config.js tailwind.config.ts postcss.config.js *.md *.sql *.ps1 *.bat

# Verificar o que será commitado
git status
```

---

### 5️⃣ Criar Commit

```powershell
git commit -m "Ponto de restauração: Correções de autenticação Supabase

- Correção de erros isSignedIn não definido
- Correção de erro 406 ao buscar condomínio
- Melhorias no CondominiumAuthProvider
- Integração completa com Supabase Auth
- Remoção completa de referências Clerk"
```

---

### 6️⃣ Criar Tag de Restauração

```powershell
$tagName = "restauracao-correcoes-auth-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git tag -a $tagName -m "Ponto de restauração: Correções de autenticação Supabase"
Write-Host "Tag criada: $tagName"
```

---

### 7️⃣ Fazer Push para GitHub

```powershell
git push -u origin main --tags
```

**Quando pedir credenciais:**
- **Username**: `xanbrito`
- **Password**: **Cole o Personal Access Token** (não sua senha do GitHub!)

---

## ✅ Pronto!

Seus arquivos estarão no GitHub: **https://github.com/xanbrito/sistema-vibing**

---

## 🔧 Solução de Problemas

### Erro: "Authentication failed"
- Verifique se está usando o **token** como senha, não sua senha do GitHub
- Verifique se o token tem permissão `repo`
- Verifique se o token não expirou

### Erro: "Repository not found"
- Verifique se o repositório existe: https://github.com/xanbrito/sistema-vibing
- Verifique se você tem permissão de escrita no repositório

### Erro: "Permission denied"
- Verifique se o token está ativo
- Crie um novo token se necessário

---

## 📝 Resumo

1. ✅ **Criar token**: https://github.com/settings/tokens
2. ✅ **Navegar para o projeto** no PowerShell
3. ✅ **Configurar Git** (se necessário)
4. ✅ **Adicionar arquivos**: `git add .`
5. ✅ **Criar commit**: `git commit -m "mensagem"`
6. ✅ **Criar tag**: `git tag -a nome-tag -m "mensagem"`
7. ✅ **Fazer push**: `git push -u origin main --tags`
8. ✅ **Usar token como senha** quando pedir

**Não precisa configurar SSH keys!** HTTPS com token é suficiente e mais fácil.

