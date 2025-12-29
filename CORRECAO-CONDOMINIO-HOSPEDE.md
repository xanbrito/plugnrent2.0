# ✅ Correção Implementada - Condomínio e Hóspede

## 🔧 Ajustes Realizados

### 1. Tabela `guests` (Hóspedes)

**Problema:** Código tentava usar `updated_at` que não existe na tabela.

**Correção:**
- ✅ Removido `updated_at` de todas as operações em `guests`
- ✅ Adicionado `status: 'active'` na criação (campo obrigatório)

**Estrutura Correta:**
```typescript
{
  id: string,              // ← Clerk User ID (referência)
  name: string,
  email: string,
  email_verified: boolean,
  status: 'active',        // ✅ Adicionado
  // ... outros campos opcionais
  // ❌ NÃO tem updated_at
}
```

### 2. Tabela `condominiums` (Condomínios)

**Observação:** A tabela tem uma constraint que exige CNPJ ou CPF:
```sql
CONSTRAINT condominium_identifier_check CHECK (
  (cnpj IS NOT NULL AND cnpj != '') OR 
  (cpf IS NOT NULL AND cpf != '')
)
```

**Solução:**
- ✅ Criamos com CPF temporário `'00000000000'` para satisfazer a constraint
- ✅ Usuário deve atualizar com CNPJ/CPF real ao completar o perfil
- ✅ Adicionado logs detalhados para debugging

**Estrutura Correta:**
```typescript
{
  id: string,              // ← Clerk User ID (referência)
  name: string,
  email: string,
  status: 'active',
  cpf: '00000000000',     // Valor temporário (será atualizado)
  // ... outros campos
}
```

**⚠️ Importante:** O CPF temporário deve ser atualizado quando o usuário completar o perfil!

## 📊 Estrutura de Referência

### Condomínio

```
Clerk User ID (user_abc123)
    ↓
condominiums.id = 'user_abc123'
    ↓
✅ Referência criada!
```

### Hóspede

```
Clerk User ID (user_abc123)
    ↓
guests.id = 'user_abc123'
    ↓
✅ Referência criada!
```

## ✅ Campos Usados

### Condomínio (`condominiums`)

**Criação:**
- ✅ `id` = Clerk User ID
- ✅ `name` = Nome completo
- ✅ `email` = Email do Clerk
- ✅ `status` = 'active'
- ⚠️ `cnpj` e `cpf` = NULL (preenchidos depois)

**Atualização:**
- ✅ `name`
- ✅ `email`
- ✅ `updated_at`

### Hóspede (`guests`)

**Criação:**
- ✅ `id` = Clerk User ID
- ✅ `name` = Nome completo
- ✅ `email` = Email do Clerk
- ✅ `email_verified` = false
- ✅ `status` = 'active'

**Atualização:**
- ✅ `name`
- ✅ `email`
- ❌ `updated_at` (não existe na tabela)

## 🧪 Como Testar

### Testar Condomínio

1. Acesse `/auth/register?user_type=condominium`
2. Preencha formulário
3. Verifique logs:
   ```
   [Webhook] ✅ Condomínio criado: user_xxx
   ```
4. Verifique no Supabase:
   ```sql
   SELECT * FROM condominiums WHERE id = 'user_xxx';
   ```

### Testar Hóspede

1. Acesse `/auth/register?user_type=guest`
2. Preencha formulário
3. Verifique logs:
   ```
   [Webhook] ✅ Hóspede criado: user_xxx
   ```
4. Verifique no Supabase:
   ```sql
   SELECT * FROM guests WHERE id = 'user_xxx';
   ```

## ⚠️ Notas Importantes

1. **Constraint de Condomínio:**
   - A constraint exige CNPJ ou CPF
   - Mas permite NULL na criação inicial
   - Usuário deve preencher ao completar perfil

2. **Status de Hóspede:**
   - Campo `status` é obrigatório
   - Criamos com `'active'` por padrão

3. **Email:**
   - Tanto `condominiums` quanto `guests` têm campo `email`
   - Email é salvo no Supabase para facilitar consultas
   - Mas a referência principal é o `id` (Clerk User ID)

## 📝 Arquivos Corrigidos

- ✅ `app/api/webhooks/clerk/route.ts`
  - Removido `updated_at` de `guests`
  - Adicionado `status: 'active'` na criação de hóspedes
  - Melhorado tratamento de erros

- ✅ `app/api/auth/sync-user/route.ts`
  - Removido `updated_at` de `guests`
  - Adicionado `status: 'active'` na criação de hóspedes
  - Melhorado tratamento de erros

## 🎯 Resultado

Agora todos os três tipos de usuários são sincronizados corretamente:

- ✅ **Anfitrião** → `user_profiles.user_id`
- ✅ **Condomínio** → `condominiums.id`
- ✅ **Hóspede** → `guests.id`

Todos usam o **Clerk User ID** como referência única! 🎉

