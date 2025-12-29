# 🔗 Conexão Clerk ↔ Supabase

## 📋 Como Funciona a Referência

A conexão entre usuários do Clerk e registros no Supabase é feita através do **Clerk User ID** armazenado no campo `user_id` das tabelas:

- **Anfitriões** → `user_profiles.user_id` = Clerk User ID
- **Condomínios** → `condominiums.id` = Clerk User ID  
- **Hóspedes** → `guests.id` = Clerk User ID

## 🔑 Estrutura de Referência

### Anfitrião (Host)

```typescript
// Tabela: user_profiles
{
  user_id: string,     // ← Clerk User ID (referência principal)
  full_name: string,
  // ... outros campos
}
```

**Conexão:**
- Clerk User ID (`user_xxx`) → `user_profiles.user_id`
- Email e outros dados ficam no Clerk
- Dados adicionais (CPF, CNPJ, endereço) ficam no Supabase

### Condomínio

```typescript
// Tabela: condominiums
{
  id: string,          // ← Clerk User ID (referência principal)
  name: string,
  email: string,
  // ... outros campos
}
```

**Conexão:**
- Clerk User ID (`user_xxx`) → `condominiums.id`
- Email pode estar tanto no Clerk quanto no Supabase

### Hóspede

```typescript
// Tabela: guests
{
  id: string,          // ← Clerk User ID (referência principal)
  name: string,
  email: string,
  // ... outros campos
}
```

**Conexão:**
- Clerk User ID (`user_xxx`) → `guests.id`
- Email pode estar tanto no Clerk quanto no Supabase

## 🔄 Fluxo de Sincronização

### 1. Cadastro de Usuário

```
Usuário se cadastra no Clerk
    ↓
Clerk cria usuário com ID: user_abc123
    ↓
Webhook recebe evento user.created
    ↓
Webhook cria registro no Supabase:
  - user_profiles.user_id = 'user_abc123'
  - condominiums.id = 'user_abc123'
  - guests.id = 'user_abc123'
    ↓
✅ Referência criada!
```

### 2. Buscar Dados do Usuário

```typescript
// Obter Clerk User ID
const { userId } = await auth(); // 'user_abc123'

// Buscar no Supabase usando o Clerk User ID
const { data } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId) // ← Usa Clerk User ID
  .single();

// data.user_id = 'user_abc123' (referência ao Clerk)
```

### 3. Criar Propriedade (Exemplo)

```typescript
// Obter Clerk User ID
const { userId } = await auth(); // 'user_abc123'

// Obter email do Clerk
const clerkUser = await clerkClient.users.getUser(userId);
const email = clerkUser.emailAddresses[0]?.emailAddress;

// Criar propriedade no Supabase
await supabase
  .from('properties')
  .insert({
    user_id: userId,        // ← Referência ao Clerk User
    host_email: email,      // Email do Clerk
    // ... outros dados
  });
```

## 📊 Dados Distribuídos

### No Clerk (Autenticação)
- ✅ User ID (`user_xxx`)
- ✅ Email
- ✅ Nome completo
- ✅ Senha (hash)
- ✅ Metadata (`user_type`, etc.)
- ✅ Social providers (Google, Facebook, Apple)

### No Supabase (Dados de Negócio)
- ✅ Referência (`user_id` = Clerk User ID)
- ✅ Dados adicionais (CPF, CNPJ, endereço)
- ✅ Propriedades
- ✅ Reservas
- ✅ Relacionamentos

## 🔍 Exemplos de Uso

### Obter Perfil Completo

```typescript
import { auth, clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

async function getUserProfile() {
  // 1. Obter Clerk User ID
  const { userId } = await auth();
  
  // 2. Buscar dados do Clerk
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  const fullName = clerkUser.fullName;
  
  // 3. Buscar dados do Supabase
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  // 4. Combinar dados
  return {
    // Dados do Clerk
    email,
    clerkFullName: fullName,
    // Dados do Supabase
    ...profile,
  };
}
```

### Criar Propriedade

```typescript
async function createProperty(propertyData: any) {
  const { userId } = await auth();
  
  // Obter email do Clerk
  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  
  // Criar propriedade no Supabase
  const { data, error } = await supabase
    .from('properties')
    .insert({
      user_id: userId,        // ← Referência ao Clerk
      host_email: email,      // Email do Clerk
      ...propertyData,
    })
    .select()
    .single();
  
  return { data, error };
}
```

### Verificar se Usuário Existe

```typescript
async function userExists(userId: string) {
  // Verificar no Supabase usando Clerk User ID
  const { data } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('user_id', userId)
    .single();
  
  return !!data;
}
```

## ⚠️ Importante

1. **user_id é a chave primária:**
   - Sempre use o Clerk User ID como referência
   - Não crie IDs próprios para usuários

2. **Email não é obrigatório no Supabase:**
   - Email fica no Clerk
   - Se precisar do email, busque do Clerk usando `user_id`

3. **Sincronização automática:**
   - Webhook cria referência automaticamente
   - Callback garante sincronização se webhook falhar

4. **RLS Policies:**
   - Configure RLS para usar `user_id` (Clerk User ID)
   - Exemplo: `auth.uid() = user_id` (se usar Supabase Auth)
   - Ou: Verificar Clerk User ID diretamente

## 🔐 Segurança

- ✅ Clerk gerencia autenticação
- ✅ Supabase armazena dados de negócio
- ✅ `user_id` é a única referência necessária
- ✅ Webhook usa Service Role Key (bypass RLS)
- ✅ Aplicação verifica autenticação via Clerk

## 📝 Resumo

**A conexão é simples:**
- Clerk User ID (`user_xxx`) → Campo `user_id` ou `id` no Supabase
- Não precisa de email no Supabase para a referência funcionar
- Email pode ser obtido do Clerk quando necessário
- Webhook cria a referência automaticamente após cadastro




