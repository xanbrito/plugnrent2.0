# 🔍 Diagnóstico de Problemas de Login

## ⚠️ Problema: Timeout ao fazer login

Se você está vendo o erro "Tempo de espera excedido", siga estes passos:

## ✅ Checklist de Verificação

### 1. Verificar Arquivo .env.local

Certifique-se de que o arquivo `.env.local` existe na raiz do projeto e contém:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fdlglyqbfonmintvzhvm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Como verificar:**
- Abra o arquivo `.env.local` na raiz do projeto
- Verifique se as variáveis estão corretas
- **IMPORTANTE:** Reinicie o servidor após alterar o `.env.local`

### 2. Verificar Conexão com Internet

O Supabase precisa de conexão com a internet para funcionar.

**Teste:**
- Abra: https://fdlglyqbfonmintvzhvm.supabase.co
- Se não abrir, há problema de conexão ou o Supabase está inacessível

### 3. Verificar se o Usuário Existe no Supabase

1. Acesse: https://supabase.com/dashboard
2. Vá em **Authentication > Users**
3. Verifique se o email `alexandre.brito.engenharia@gmail.com` existe
4. Se não existir, crie um usuário manualmente

### 4. Verificar Console do Navegador

Abra o console (F12) e verifique:

**Se aparecer:**
- `❌ Variáveis de ambiente do Supabase não encontradas!` → Problema no `.env.local`
- `Tentando fazer login para: [email]` → Login iniciado
- `Erro no login: [detalhes]` → Veja o erro específico

### 5. Reiniciar o Servidor

Após alterar o `.env.local`, **sempre reinicie o servidor:**

1. Pare o servidor (Ctrl+C)
2. Execute `start.bat` novamente

## 🔧 Soluções Comuns

### Problema: Variáveis de ambiente não carregadas

**Solução:**
1. Pare o servidor
2. Verifique o `.env.local`
3. Reinicie o servidor

### Problema: Usuário não existe

**Solução:**
1. Acesse o Supabase Dashboard
2. Vá em Authentication > Users
3. Clique em "Add user" ou "Invite user"
4. Crie o usuário com o email e senha desejados

### Problema: Supabase não responde

**Solução:**
1. Verifique sua conexão com a internet
2. Verifique se o Supabase está online: https://status.supabase.com
3. Tente acessar a URL do Supabase diretamente no navegador

## 📝 Logs de Debug

O sistema agora mostra logs no console:

- ✅ `Tentando fazer login para: [email]` - Login iniciado
- ✅ `Fazendo requisição de login...` - Requisição sendo enviada
- ✅ `Login bem-sucedido para: [email]` - Login funcionou
- ❌ `Erro no login: [detalhes]` - Erro específico

## 🚨 Se Nada Funcionar

1. **Verifique o console do navegador (F12)** para ver os logs
2. **Verifique o terminal do servidor** para ver erros do Next.js
3. **Teste a conexão com o Supabase** acessando a URL diretamente
4. **Crie um novo usuário** no Supabase Dashboard

---

**Última atualização:** Correções aplicadas para melhor diagnóstico e tratamento de erros.




