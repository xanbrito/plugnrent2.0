# 🚀 Instruções para Fazer Push para plugnrent2.0

## ✅ Email Corrigido!

O email foi atualizado para: `alexandre.brito.engenharia@gmail.com`

---

## 📝 Comandos para Executar Manualmente

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

# 6. Configurar remote com token
# Token removido por segurança - use apenas quando o Git pedir credenciais
git remote add origin "https://$token@github.com/xanbrito/plugnrent2.0.git"

# 7. Adicionar arquivos do projeto
git add app/ components/ lib/ types/ middleware.ts package.json package-lock.json tsconfig.json next.config.js tailwind.config.ts postcss.config.js jest.config.js jest.setup.js *.md *.sql *.ps1 *.bat .gitignore

# 8. Verificar o que será commitado
git status --short

# 9. Criar commit
git commit -m "Initial commit: Sistema Vibing - Plataforma de gestão de propriedades`n`n- Sistema completo de autenticação Supabase`n- Gestão de propriedades e reservas`n- Dashboard para anfitriões`n- Integração com Airbnb scraping`n- Sistema de fotos e galeria`n- Políticas RLS configuradas"

# 10. Fazer push
git branch -M main
git push -u origin main
```

---

## 🔧 Ou Execute o Script

Se preferir, execute o script que foi criado:

```powershell
cd "C:\Users\Alexandre\OneDrive\Área de Trabalho\Projeto AIRBNB 2.0"
.\push-plugnrent2.0.ps1
```

**Nota:** Se der erro de política de execução, execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## ✅ Verificação

Após o push, verifique no GitHub:
- Repositório: https://github.com/xanbrito/plugnrent2.0
- Branch: `main`
- Arquivos: Todos os arquivos do projeto devem estar lá

---

## 📝 Resumo

1. ✅ Email atualizado: `alexandre.brito.engenharia@gmail.com`
2. ✅ Token configurado no script
3. ✅ Remote apontando para: `plugnrent2.0`
4. ⚠️ Execute no diretório do projeto (não no home)

**O email não era o problema principal - o problema é que o Git precisa ser inicializado no diretório correto do projeto!**

