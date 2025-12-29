# 🔐 Guia: Configurar Push para GitHub

## 📋 Opções de Autenticação

Você tem **duas opções** para fazer push para o GitHub:

### Opção 1: HTTPS com Personal Access Token (Recomendado - Mais Fácil) ✅

Esta é a opção mais simples e não requer SSH keys.

#### Passo 1: Criar Personal Access Token no GitHub

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Dê um nome para o token (ex: "Sistema Vibing")
4. Selecione as permissões:
   - ✅ `repo` (acesso completo aos repositórios)
5. Clique em **"Generate token"**
6. **COPIE O TOKEN** (você só verá ele uma vez!)

#### Passo 2: Usar o Token ao Fazer Push

Quando você fizer `git push`, o GitHub pedirá suas credenciais:
- **Username**: seu username do GitHub (xanbrito)
- **Password**: **COLE O TOKEN** (não sua senha do GitHub!)

#### Passo 3: Salvar Credenciais (Opcional)

Para não precisar digitar o token toda vez:

```powershell
# Instalar Git Credential Manager (se ainda não tiver)
# O Git Credential Manager salva suas credenciais automaticamente
```

Ou configure o Git para usar o token na URL:

```powershell
git remote set-url origin https://SEU_TOKEN@github.com/xanbrito/sistema-vibing.git
```

**⚠️ ATENÇÃO**: Não commite o token no código! Use variáveis de ambiente ou Git Credential Manager.

---

### Opção 2: SSH Keys (Mais Seguro, mas Mais Complexo)

Se você preferir usar SSH keys:

#### Passo 1: Gerar SSH Key

```powershell
# Gerar nova chave SSH
ssh-keygen -t ed25519 -C "xanbrito@github.com"

# Quando perguntar onde salvar, pressione Enter (salva em C:\Users\Alexandre\.ssh\id_ed25519)
# Quando perguntar senha, pode deixar vazio ou criar uma senha
```

#### Passo 2: Copiar a Chave Pública

```powershell
# Mostrar a chave pública
Get-Content ~\.ssh\id_ed25519.pub | Set-Clipboard
```

#### Passo 3: Adicionar no GitHub

1. Acesse: https://github.com/settings/keys
2. Clique em **"New SSH key"**
3. Dê um título (ex: "Meu PC")
4. Cole a chave pública no campo "Key"
5. Clique em **"Add SSH key"**

#### Passo 4: Alterar Remote para SSH

```powershell
git remote set-url origin git@github.com:xanbrito/sistema-vibing.git
```

---

## 🚀 Fazer Push Agora (Usando HTTPS)

Execute estes comandos no PowerShell:

```powershell
# 1. Adicionar arquivos
git add .

# 2. Criar commit
git commit -m "Ponto de restauração: Correções de autenticação Supabase

- Correção de erros isSignedIn não definido
- Correção de erro 406 ao buscar condomínio
- Melhorias no CondominiumAuthProvider
- Integração completa com Supabase Auth"

# 3. Criar tag
$tagName = "restauracao-correcoes-auth-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
git tag -a $tagName -m "Ponto de restauração: Correções de autenticação Supabase"

# 4. Fazer push (vai pedir credenciais)
git push -u origin main --tags
```

Quando pedir credenciais:
- **Username**: `xanbrito`
- **Password**: Seu Personal Access Token (não sua senha!)

---

## 📝 Resumo Rápido

**Para começar rápido:**
1. Crie um Personal Access Token: https://github.com/settings/tokens
2. Use HTTPS (já está configurado)
3. Ao fazer push, use o token como senha

**Não precisa de SSH keys para fazer push!** HTTPS com token funciona perfeitamente.

