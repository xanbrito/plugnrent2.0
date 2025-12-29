# 🔄 Migração para Clerk - Guia de Configuração

## ✅ O que foi migrado

A autenticação foi migrada de **Supabase Auth** para **Clerk**, mantendo o Supabase apenas como banco de dados.

### Arquivos Modificados

1. ✅ `middleware.ts` - Criado com `clerkMiddleware()`
2. ✅ `app/layout.tsx` - Atualizado para usar `<ClerkProvider>`
3. ✅ `app/auth/login/page.tsx` - Migrado para usar `<SignIn>` do Clerk
4. ✅ `app/auth/register/page.tsx` - Criado com `<SignUp>` do Clerk
5. ✅ `app/dashboard/page.tsx` - Atualizado para usar hooks do Clerk
6. ✅ `lib/clerk-helpers.ts` - Criado helpers para sincronizar Clerk com Supabase

### Arquivos que ainda precisam ser atualizados

- `app/dashboard/espacos/page.tsx` - Usa `useAuth` do AuthProvider antigo
- `app/dashboard/reservas/page.tsx` - Usa `useAuth` do AuthProvider antigo
- `app/dashboard/reservas/novo/page.tsx` - Pode precisar atualização
- `app/dashboard/espacos/novo/page.tsx` - Pode precisar atualização
- Outras páginas protegidas que usam autenticação

---

## 🔧 Configuração do Clerk

### 1. Criar conta no Clerk

1. Acesse: https://clerk.com
2. Crie uma conta gratuita
3. Crie um novo aplicativo

### 2. Obter as chaves

1. No Dashboard do Clerk, vá em **API Keys**
2. Copie:
   - **Publishable Key** (começa com `pk_`)
   - **Secret Key** (começa com `sk_`)

### 3. Configurar variáveis de ambiente

Adicione ao arquivo `.env.local` na raiz do projeto:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase (mantido apenas para banco de dados)
NEXT_PUBLIC_SUPABASE_URL=https://fdlglyqbfonmintvzhvm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Configurar URLs no Clerk Dashboard

No Dashboard do Clerk, vá em **Settings > Paths** e configure:

- **Sign-in URL:** `/auth/login`
- **Sign-up URL:** `/auth/register`
- **After sign-in URL:** `/dashboard`
- **After sign-up URL:** `/dashboard`

---

## 🔄 Sincronização Clerk ↔ Supabase

O sistema agora sincroniza automaticamente os usuários do Clerk com a tabela `user_profiles` do Supabase:

- Quando um usuário faz login, o sistema verifica se existe um perfil no Supabase
- Se não existir, cria automaticamente
- O `user_id` no Supabase será o mesmo `id` do Clerk

### Importante: Atualizar RLS Policies

As políticas RLS no Supabase precisam ser atualizadas para usar o `user_id` do Clerk:

```sql
-- Exemplo: Política para properties
CREATE POLICY "Users can view own properties"
ON properties FOR SELECT
USING (auth.uid()::text = user_id::text);

-- Atualizar para usar Clerk userId
-- O user_id agora será o Clerk userId, não mais o Supabase auth.uid()
```

---

## 🚀 Próximos Passos

1. **Configurar Clerk:**
   - Criar conta e obter as chaves
   - Adicionar ao `.env.local`
   - Reiniciar o servidor

2. **Testar autenticação:**
   - Acessar `/auth/login`
   - Criar uma conta
   - Verificar se redireciona para `/dashboard`

3. **Atualizar outras páginas:**
   - Substituir `useAuth` do AuthProvider por `useUser` e `useAuth` do Clerk
   - Atualizar todas as referências de `user.id` para usar Clerk userId

4. **Atualizar RLS Policies:**
   - Modificar as políticas no Supabase para funcionar com Clerk userId

---

## 📝 Notas Importantes

- ⚠️ **Não remova o Supabase** - Ele ainda é usado para banco de dados
- ✅ **Clerk** agora gerencia toda a autenticação
- 🔄 **Sincronização automática** entre Clerk e Supabase
- 🔐 **RLS Policies** precisam ser atualizadas para usar Clerk userId

---

## 🐛 Troubleshooting

### Erro: "Clerk not configured"
- Verifique se as variáveis de ambiente estão no `.env.local`
- Reinicie o servidor após adicionar as variáveis

### Erro: "User not found in Supabase"
- A sincronização acontece automaticamente no primeiro login
- Verifique se a tabela `user_profiles` existe
- Verifique os logs do console para erros de sincronização

### Dashboard não carrega dados
- Verifique as políticas RLS no Supabase
- O `user_id` agora é o Clerk userId, não mais o Supabase auth.uid()




