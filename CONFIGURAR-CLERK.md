# 🔧 Configuração Rápida do Clerk

## ⚠️ Erro Atual

Você está vendo o erro: **"Missing publishableKey"**

Isso significa que as chaves do Clerk não foram configuradas ainda.

---

## ✅ Solução Rápida (3 passos)

### 1. Criar conta no Clerk

1. Acesse: https://clerk.com
2. Clique em **"Sign up"** ou **"Get started"**
3. Crie sua conta (pode usar GitHub, Google, ou email)

### 2. Obter as chaves

1. Após criar a conta, você será redirecionado para o Dashboard
2. Vá em **"API Keys"** no menu lateral
3. Você verá duas chaves:
   - **Publishable Key** (começa com `pk_test_` ou `pk_live_`)
   - **Secret Key** (começa com `sk_test_` ou `sk_live_`)

### 3. Adicionar ao .env.local

Abra o arquivo `.env.local` na raiz do projeto e adicione:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_AQUI
CLERK_SECRET_KEY=sk_test_SUA_CHAVE_AQUI
```

**⚠️ IMPORTANTE:**
- Substitua `SUA_CHAVE_AQUI` pelas chaves reais do Clerk
- Não deixe espaços antes ou depois do `=`
- Não use aspas nas chaves

### 4. Reiniciar o servidor

1. Pare o servidor (pressione `Ctrl+C` no terminal)
2. Execute `start.bat` novamente
3. Acesse `http://localhost:3000`

---

## 📋 Exemplo Completo do .env.local

Seu arquivo `.env.local` deve ter algo assim:

```env
# Supabase (banco de dados)
NEXT_PUBLIC_SUPABASE_URL=https://fdlglyqbfonmintvzhvm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clerk (autenticação)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_abc123xyz...
CLERK_SECRET_KEY=sk_test_def456uvw...

# Mailtrap (emails)
MAILTRAP_API_TOKEN=4b125b5b72581617724cb6ed15e2c618
MAILTRAP_FROM_EMAIL=comercial@plugnrent.com.br
```

---

## 🎯 Configurar URLs no Clerk Dashboard

Após adicionar as chaves, configure as URLs no Clerk:

1. No Dashboard do Clerk, vá em **Settings > Paths**
2. Configure:
   - **Sign-in URL:** `/auth/login`
   - **Sign-up URL:** `/auth/register`
   - **After sign-in URL:** `/dashboard`
   - **After sign-up URL:** `/dashboard`

---

## ✅ Verificar se funcionou

Após configurar e reiniciar:

1. Acesse `http://localhost:3000`
2. Você não deve mais ver o erro de "Missing publishableKey"
3. Acesse `/auth/login` para testar o login

---

## 🆘 Ainda com problemas?

- Verifique se o arquivo `.env.local` está na **raiz do projeto** (mesmo nível que `package.json`)
- Verifique se não há espaços extras nas variáveis
- Certifique-se de ter **reiniciado o servidor** após adicionar as variáveis
- Verifique o console do navegador para outros erros




