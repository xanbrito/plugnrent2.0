# ✅ Correção Implementada - Conexão Clerk ↔ Supabase

## 🐛 Problema Identificado

O código estava tentando usar o campo `host_email` na tabela `user_profiles`, mas esse campo **não existe** na estrutura atual da tabela.

**Erro:**
```
Could not find the 'host_email' column of 'user_profiles' in the schema cache
```

## ✅ Solução Implementada

### 1. Removido `host_email` de `user_profiles`

A tabela `user_profiles` não precisa do campo `host_email` porque:
- O email fica armazenado no Clerk
- A referência entre Clerk e Supabase é feita através do `user_id` (Clerk User ID)
- O email pode ser obtido do Clerk quando necessário

### 2. Estrutura Corrigida

**Antes (❌ Erro):**
```typescript
await supabaseAdmin
  .from('user_profiles')
  .insert({
    user_id: userId,
    full_name: fullName,
    host_email: email, // ❌ Campo não existe
  });
```

**Depois (✅ Correto):**
```typescript
await supabaseAdmin
  .from('user_profiles')
  .insert({
    user_id: userId, // ← Clerk User ID como referência
    full_name: fullName,
    // Email não é necessário aqui
  });
```

### 3. Arquivos Corrigidos

- ✅ `app/api/webhooks/clerk/route.ts`
  - Removido `host_email` de `syncHostUser()`
  - Removido `host_email` de `updateHostUser()`

- ✅ `app/api/auth/sync-user/route.ts`
  - Removido `host_email` de `syncHostUser()`

## 🔗 Como Funciona Agora

### Conexão Clerk ↔ Supabase

```
Clerk User ID (user_abc123)
    ↓
user_profiles.user_id = 'user_abc123'
    ↓
✅ Referência criada!
```

**Para obter email:**
```typescript
// Buscar email do Clerk usando user_id
const clerkUser = await clerkClient.users.getUser(userId);
const email = clerkUser.emailAddresses[0]?.emailAddress;
```

## 📊 Estrutura de Dados

### Tabela `user_profiles`

```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY,  -- ← Clerk User ID (referência)
  full_name TEXT NOT NULL,
  cpf TEXT,
  cnpj TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Nota:** `user_id` é a chave primária e contém o Clerk User ID.

## ✅ Teste Agora

1. **Reinicie o servidor** (se ainda estiver rodando)
2. **Crie um novo usuário** em `/auth/register?user_type=host`
3. **Verifique os logs:**
   ```
   [Webhook] ✅ Perfil de host criado: user_xxx
   ```
4. **Verifique no Supabase:**
   ```sql
   SELECT * FROM user_profiles WHERE user_id = 'user_xxx';
   ```

## 📝 Notas Importantes

1. **Email não é necessário no Supabase:**
   - Email fica no Clerk
   - Pode ser obtido via Clerk API quando necessário

2. **Referência única:**
   - `user_id` = Clerk User ID
   - Esta é a única referência necessária

3. **Outras tabelas:**
   - A tabela `properties` ainda usa `host_email` (isso está correto)
   - Apenas `user_profiles` não precisa do email

## 🎯 Próximos Passos

1. ✅ Testar cadastro de anfitrião
2. ✅ Verificar se registro é criado no Supabase
3. ✅ Testar cadastro de condomínio
4. ✅ Testar cadastro de hóspede

O erro deve estar resolvido agora! 🎉




