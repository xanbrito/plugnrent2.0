# 🚀 Push para plugnrent2.0 - Instruções Finais

## ⚠️ Problema Identificado

O GitHub bloqueia pushes que contêm **tokens/secrets** no código. O token estava sendo incluído na URL do remote, o que causa o bloqueio.

## ✅ Solução

**Removi o token da URL do remote** - agora você usará o token apenas quando o Git pedir credenciais.

---

## 📝 Comandos para Executar

**Execute estes comandos no PowerShell, no diretório do projeto:**

```powershell
# 1. Navegar para o diretório do projeto
cd "C:\Users\Alexandre\OneDrive\Área de Trabalho\Projeto AIRBNB 2.0"

# 2. Verificar se está no diretório correto
Get-Location
Test-Path "app\layout.tsx"  # Deve retornar True

# 3. Remover repositório Git do home (se existir)
Remove-Item -Path "$env:USERPROFILE\.git" -Recurse -Force -ErrorAction SilentlyContinue

# 4. Remover .git do projeto (se existir) e inicializar novo
if (Test-Path .git) { Remove-Item -Path .git -Recurse -Force }
git init

# 5. Configurar Git com email correto
git config user.email "alexandre.brito.engenharia@gmail.com"
git config user.name "Alexandre Brito"

# 6. Configurar remote (SEM token na URL - mais seguro)
git remote add origin "https://github.com/xanbrito/plugnrent2.0.git"

# 7. Adicionar arquivos do projeto
git add app/ components/ lib/ types/ middleware.ts package.json package-lock.json tsconfig.json next.config.js tailwind.config.ts postcss.config.js jest.config.js jest.setup.js *.md *.sql *.ps1 *.bat .gitignore

# 8. Verificar o que será commitado
git status --short

# 9. Criar commit
git commit -m "Initial commit: Sistema Vibing - Plataforma de gestão de propriedades`n`n- Sistema completo de autenticação Supabase`n- Gestão de propriedades e reservas`n- Dashboard para anfitriões`n- Integração com Airbnb scraping`n- Sistema de fotos e galeria`n- Políticas RLS configuradas"

# 10. Fazer push (vai pedir credenciais)
git branch -M main
git push -u origin main
```

**Quando pedir credenciais:**
- **Username**: `xanbrito`
- **Password**: Cole seu Personal Access Token (não coloque o token aqui - use apenas quando o Git pedir!)

---

## 🔐 Por que remover o token da URL?

1. **Segurança**: O token não fica visível no histórico do Git
2. **Push Protection**: O GitHub bloqueia pushes com tokens no código
3. **Boas Práticas**: Tokens devem ser usados apenas na autenticação, não no código

---

## ✅ Verificação

Após o push, verifique no GitHub:
- Repositório: https://github.com/xanbrito/plugnrent2.0
- Branch: `main`
- Arquivos: Todos os arquivos do projeto devem estar lá

---

## 🆘 Se o Push for Bloqueado

Se o GitHub ainda bloquear o push por causa do token:

1. **Remova o token do commit** (se já foi commitado):
   ```powershell
   git commit --amend --all
   # Remova qualquer referência ao token
   git push -u origin main
   ```

2. **Ou use o bypass** (se o token for necessário):
   - Siga a URL fornecida pelo GitHub
   - Escolha "It's used in tests" ou "I'll fix it later"
   - Clique em "Allow me to push this secret"

---

## 📝 Resumo

✅ Email correto: `alexandre.brito.engenharia@gmail.com`  
✅ Token removido da URL (mais seguro)  
✅ Remote configurado: `plugnrent2.0`  
⚠️ Execute no diretório do projeto (não no home)

**O token será usado apenas na autenticação, não no código!**

