# ✅ Sincronização Clerk ↔ Supabase - Implementação Completa

## 🎯 Objetivo

Garantir que **todos os usuários criados no Clerk** sejam automaticamente sincronizados com as tabelas correspondentes no Supabase:

- ✅ **Anfitriões** → `user_profiles`
- ✅ **Condomínios** → `condominiums`
- ✅ **Hóspedes** → `guests`

## 🔄 Fluxo Completo

### 1. Cadastro de Usuário

```
Usuário → /auth/register?user_type=host
    ↓
Clerk cria usuário
    ↓
Webhook acionado (user.created)
    ↓
Webhook verifica user_type no metadata
    ↓
Cria registro no Supabase (tabela correspondente)
    ↓
Callback define user_type (se necessário)
    ↓
Sincroniza novamente com Supabase
    ↓
Redireciona para área correta
```

### 2. Login de Usuário

```
Usuário → /auth/login?user_type=host
    ↓
Clerk autentica
    ↓
Callback verifica user_type
    ↓
Sincroniza com Supabase (garantir que existe)
    ↓
Redireciona para área correta
```

## 📁 Arquivos Implementados

### Webhook (`app/api/webhooks/clerk/route.ts`)

- ✅ Recebe eventos `user.created` e `user.updated` do Clerk
- ✅ Verifica assinatura Svix para segurança
- ✅ Cria/atualiza registros no Supabase baseado no tipo
- ✅ Logs detalhados para debugging

### API de Sincronização (`app/api/auth/sync-user/route.ts`)

- ✅ Sincroniza usuário autenticado com Supabase
- ✅ Suporta todos os tipos de usuários
- ✅ Cria ou atualiza conforme necessário

### API de Definição de Tipo (`app/api/auth/set-user-type/route.ts`)

- ✅ Define `user_type` no metadata do Clerk
- ✅ Usado pelo callback após cadastro

### Callback (`app/auth/callback/page.tsx`)

- ✅ Define `user_type` se não estiver definido
- ✅ Sincroniza com Supabase após definir tipo
- ✅ Redireciona para área correta

## 🗄️ Estrutura de Dados no Supabase

### Anfitrião → `user_profiles`

```sql
INSERT INTO user_profiles (
  user_id,        -- Clerk User ID
  full_name,      -- Nome completo
  host_email      -- Email
) VALUES (...);
```

### Condomínio → `condominiums`

```sql
INSERT INTO condominiums (
  id,             -- Clerk User ID
  name,           -- Nome do condomínio
  email,          -- Email
  status          -- 'active'
) VALUES (...);
```

### Hóspede → `guests`

```sql
INSERT INTO guests (
  id,             -- Clerk User ID
  name,           -- Nome completo
  email,          -- Email
  email_verified  -- false
) VALUES (...);
```

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...  # ⚠️ OBRIGATÓRIO

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # ⚠️ OBRIGATÓRIO para webhook
```

### 2. Clerk Dashboard

1. **Criar Webhook Endpoint:**
   - URL: `https://seu-dominio.com/api/webhooks/clerk`
   - Eventos: `user.created`, `user.updated`
   - Copiar `CLERK_WEBHOOK_SECRET`

2. **Configurar Metadata:**
   - O sistema usa `publicMetadata.user_type`
   - Valores: `host`, `condominium`, `guest`

## ✅ Garantias do Sistema

1. **Sincronização Automática:**
   - Webhook cria registro imediatamente após cadastro
   - Callback garante sincronização se webhook falhar

2. **Idempotência:**
   - Verifica se registro já existe antes de criar
   - Atualiza se existir, cria se não existir

3. **Tratamento de Erros:**
   - Logs detalhados para debugging
   - Não bloqueia o fluxo do usuário em caso de erro

4. **Segurança:**
   - Webhook verifica assinatura Svix
   - Usa Service Role Key apenas no servidor
   - Valida dados antes de inserir

## 🧪 Como Testar

### 1. Testar Cadastro de Anfitrião

```bash
# 1. Acesse /auth/register?user_type=host
# 2. Preencha formulário
# 3. Verifique logs do servidor:
#    [Webhook] Usuário criado: user_xxx
#    [Webhook] ✅ Usuário sincronizado com sucesso como host
# 4. Verifique no Supabase:
#    SELECT * FROM user_profiles WHERE user_id = 'user_xxx';
```

### 2. Testar Cadastro de Condomínio

```bash
# 1. Acesse /auth/register?user_type=condominium
# 2. Preencha formulário
# 3. Verifique logs
# 4. Verifique no Supabase:
#    SELECT * FROM condominiums WHERE id = 'user_xxx';
```

### 3. Testar Cadastro de Hóspede

```bash
# 1. Acesse /auth/register?user_type=guest
# 2. Preencha formulário
# 3. Verifique logs
# 4. Verifique no Supabase:
#    SELECT * FROM guests WHERE id = 'user_xxx';
```

## 📊 Logs Esperados

### Webhook Sucesso

```
[Webhook] Evento recebido: user.created
[Webhook] Usuário criado: user_2abc123
[Webhook] Email: email@example.com, Nome: João Silva, Tipo: host
[Webhook] ✅ Usuário user_2abc123 sincronizado com sucesso como host
```

### Callback Sucesso

```
[AuthCallback] Redirecionando host para /dashboard
[AuthCallback] Tipo host definido, sincronizando com Supabase...
[AuthCallback] ✅ Usuário sincronizado com Supabase
```

## 🐛 Troubleshooting

### Usuário não aparece no Supabase

1. **Verifique se webhook está configurado:**
   - Clerk Dashboard → Webhooks → Endpoint criado?
   - `CLERK_WEBHOOK_SECRET` no `.env.local`?

2. **Verifique logs do servidor:**
   - Procure por `[Webhook]` nos logs
   - Erros aparecerão com `[Webhook] ❌`

3. **Verifique políticas RLS:**
   - Webhook usa `supabaseAdmin` (bypass RLS)
   - Mas verifique se tabelas existem

### Erro ao criar registro

1. **Verifique estrutura da tabela:**
   - Campos obrigatórios presentes?
   - Tipos de dados corretos?

2. **Verifique constraints:**
   - `user_id` único em `user_profiles`
   - `id` único em `condominiums` e `guests`

## 📚 Referências

- [Clerk Webhooks](https://clerk.com/docs/integrations/webhooks/overview)
- [Clerk Backend API](https://clerk.com/docs/reference/backend-api/tag/actor-tokens)
- [Svix Verification](https://docs.svix.com/receiving/verifying-payloads/how)




