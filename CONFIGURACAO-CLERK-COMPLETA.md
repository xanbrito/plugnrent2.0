# 🔐 Configuração Completa do Clerk - Sistema Vibing

## 📋 Visão Geral

O sistema agora usa **Clerk** para autenticação de **todos os tipos de usuários**:
- ✅ **Anfitriões (Hosts)**
- ✅ **Condomínios (Condominiums)**
- ✅ **Hóspedes (Guests)**

Cada tipo de usuário tem seu próprio fluxo de login/cadastro, mas todos usam a mesma infraestrutura do Clerk.

## 🎯 Fluxo de Autenticação

### 1. Página Inicial (`/`)
- Três botões: "Área do Anfitrião", "Área do Condomínio", "Área do Hóspede"
- Cada botão redireciona para `/auth/login?user_type=<tipo>`

### 2. Login (`/auth/login?user_type=<tipo>`)
- Detecta o tipo via query parameter
- Mostra formulário de login específico para o tipo
- Após login, verifica o tipo do usuário e redireciona:
  - `host` → `/dashboard`
  - `condominium` → `/condominio/dashboard`
  - `guest` → `/hospede/reservas`

### 3. Cadastro (`/auth/register?user_type=<tipo>`)
- Detecta o tipo via query parameter
- Mostra formulário de cadastro específico
- Após cadastro, define o `user_type` no metadata do Clerk
- Sincroniza com Supabase na tabela correspondente
- Redireciona para a área correta

## 🔧 Configuração no Clerk Dashboard

### 1. Configurar Social Providers

1. Acesse https://dashboard.clerk.com
2. Vá em **User & Authentication** → **Social Connections**
3. Habilite:
   - ✅ **Google**
   - ✅ **Facebook**
   - ✅ **Apple**
4. Configure as credenciais de cada provider

### 2. Desabilitar Telefone

1. Vá em **User & Authentication** → **Email, Phone, Username**
2. Desabilite **Phone number**
3. Mantenha apenas **Email address** habilitado

### 3. Configurar Webhook

1. Vá em **Webhooks**
2. Clique em **Add Endpoint**
3. URL: `https://seu-dominio.com/api/webhooks/clerk`
4. Eventos para escutar:
   - ✅ `user.created`
5. Copie o **Signing Secret** e adicione ao `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

### 4. Configurar URLs

1. Vá em **Settings** → **Paths**
2. Configure:
   - **Sign-in URL:** `/auth/login`
   - **Sign-up URL:** `/auth/register`
   - **After sign-in URL:** `/dashboard` (será sobrescrito pelo código)
   - **After sign-up URL:** `/dashboard` (será sobrescrito pelo código)

## 📁 Estrutura de Arquivos

```
app/
  auth/
    login/[[...rest]]/page.tsx      # Login unificado (detecta tipo)
    register/[[...rest]]/page.tsx   # Cadastro unificado (detecta tipo)
  api/
    auth/
      sync-user/route.ts            # Sincroniza Clerk → Supabase
      set-user-type/route.ts         # Define tipo de usuário
    webhooks/
      clerk/route.ts                # Webhook do Clerk

components/
  auth/
    ClerkSignInWrapper.tsx          # Wrapper SignIn com redirecionamento
    ClerkSignUpWrapper.tsx          # Wrapper SignUp com definição de tipo

lib/
  hooks/
    useUserType.ts                  # Hook para obter tipo de usuário
```

## 🔄 Sincronização Clerk ↔ Supabase

### Tabelas no Supabase:

1. **Hosts** → `user_profiles`
   - `user_id` = Clerk User ID
   - `full_name`, `host_email`

2. **Condomínios** → `condominiums`
   - `id` = Clerk User ID
   - `name`, `email`, `status`

3. **Hóspedes** → `guests`
   - `id` = Clerk User ID
   - `name`, `email`, `email_verified`

### Fluxo de Sincronização:

1. **Webhook** (`/api/webhooks/clerk`):
   - Captura evento `user.created`
   - Lê `user_type` do metadata
   - Cria registro na tabela correspondente

2. **API Route** (`/api/auth/sync-user`):
   - Chamada após login
   - Verifica se registro existe
   - Cria ou atualiza conforme necessário

## 🚀 Como Usar

### Para Anfitriões:
1. Acesse `/auth/login?user_type=host` ou clique em "Área do Anfitrião"
2. Faça login ou cadastre-se
3. Será redirecionado para `/dashboard`

### Para Condomínios:
1. Acesse `/auth/login?user_type=condominium` ou clique em "Área do Condomínio"
2. Faça login ou cadastre-se
3. Será redirecionado para `/condominio/dashboard`

### Para Hóspedes:
1. Acesse `/auth/login?user_type=guest` ou clique em "Área do Hóspede"
2. Faça login ou cadastre-se
3. Será redirecionado para `/hospede/reservas`

## ⚙️ Variáveis de Ambiente

Adicione ao `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...  # Para webhooks

# Supabase (mantido para banco de dados)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 🔐 Proteção de Rotas

O middleware protege rotas baseado no tipo de usuário:

- `/dashboard/*` → Apenas `host`
- `/condominio/*` → Apenas `condominium`
- `/hospede/*` → Apenas `guest`

## 📝 Notas Importantes

1. **Metadata do Clerk**: O `user_type` é salvo em `publicMetadata.user_type`
2. **Redirecionamento**: Após login, o sistema verifica o tipo e redireciona automaticamente
3. **Sincronização**: Dados são sincronizados automaticamente via webhook e API routes
4. **Senhas**: Gerenciadas pelo Clerk (não são armazenadas no Supabase)

## 🐛 Troubleshooting

### Usuário não é redirecionado corretamente
- Verifique se o `user_type` está definido no metadata do Clerk
- Verifique os logs do console do navegador

### Dados não aparecem após login
- Verifique se o webhook está configurado corretamente
- Verifique se a sincronização foi executada (`/api/auth/sync-user`)
- Verifique as políticas RLS no Supabase

### Erro ao criar usuário
- Verifique se o webhook está funcionando
- Verifique os logs do servidor
- Verifique se as tabelas no Supabase existem




