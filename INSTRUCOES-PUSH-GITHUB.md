# 🚀 Instruções para Fazer Push no GitHub

## ✅ Você NÃO precisa de SSH Keys!

Use **HTTPS com Personal Access Token** - é mais simples.

---

## 📝 Passo a Passo Rápido

### 1️⃣ Criar Personal Access Token

1. Acesse: **https://github.com/settings/tokens**
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Nome: `Sistema Vibing`
4. Permissão: ✅ **`repo`** (marcar a caixa)
5. Clique em **"Generate token"**
6. **⚠️ COPIE O TOKEN!** (você só verá uma vez)

### 2️⃣ Fazer Push

Execute no PowerShell (no diretório do projeto):

```powershell
git push -u origin main --tags
```

**Quando pedir credenciais:**
- **Username**: `xanbrito`
- **Password**: **Cole o token** (não sua senha do GitHub!)

---

## ✅ Pronto!

Seus arquivos estarão no GitHub: https://github.com/xanbrito/sistema-vibing

**Não precisa configurar SSH keys!** HTTPS com token funciona perfeitamente.

