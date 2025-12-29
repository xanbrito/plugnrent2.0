# 🔧 Instruções de Configuração do Clerk

## ✅ O que foi implementado

O sistema agora usa **Clerk** para autenticação de **todos os tipos de usuários**:
- ✅ Anfitriões (Hosts)
- ✅ Condomínios (Condominiums)  
- ✅ Hóspedes (Guests)

Cada tipo tem seu próprio fluxo, mas todos usam a mesma infraestrutura do Clerk.

## 🎯 Configuração no Clerk Dashboard

### 1. Desabilitar Telefone

1. Acesse https://dashboard.clerk.com
2. Vá em **User & Authentication** → **Email, Phone, Username**
3. **Desabilite** "Phone number"
4. Mantenha apenas **Email address** habilitado

### 2. Habilitar Social Providers

1. Vá em **User & Authentication** → **Social Connections**
2. Habilite os providers desejados:
   - ✅ **Google** (recomendado)
   - ✅ **Facebook** (opcional)
   - ✅ **Apple** (opcional)
3. Configure as credenciais de cada provider conforme necessário

### 3. Configurar Webhook

1. Vá em **Webhooks**
2. Clique em **Add Endpoint**
3. Configure:
   - **Endpoint URL:** `https://seu-dominio.com/api/webhooks/clerk`
   - **Events:** Selecione `user.created`
4. Clique em **Create**
5. **Copie o Signing Secret** (começa com `whsec_`)
6. Adicione ao `.env.local`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

### 4. Configurar URLs (Opcional)

1. Vá em **Settings** → **Paths**
2. Configure:
   - **Sign-in URL:** `/auth/login`
   - **Sign-up URL:** `/auth/register`
   - **After sign-in URL:** `/dashboard` (será sobrescrito pelo código)
   - **After sign-up URL:** `/dashboard` (será sobrescrito pelo código)

## 🔄 Como Funciona

### Fluxo de Cadastro:

1. Usuário clica em "Área do Anfitrião/Condomínio/Hóspede" na home
2. Redireciona para `/auth/register?user_type=<tipo>`
3. Preenche formulário no Clerk (email, senha ou social)
4. Após cadastro, o sistema:
   - Define `user_type` no metadata do Clerk
   - Webhook sincroniza com Supabase
   - Redireciona para área correta

### Fluxo de Login:

1. Usuário clica em "Área do Anfitrião/Condomínio/Hóspede"
2. Redireciona para `/auth/login?user_type=<tipo>`
3. Faz login no Clerk
4. Sistema verifica tipo do usuário
5. Redireciona para área correta:
   - `host` → `/dashboard`
   - `condominium` → `/condominio/dashboard`
   - `guest` → `/hospede/reservas`

## 📝 Variáveis de Ambiente

Certifique-se de ter no `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...  # Novo - necessário para webhooks

# Supabase (mantido para banco de dados)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 🚀 Testando

1. **Reinicie o servidor** após adicionar `CLERK_WEBHOOK_SECRET`
2. Acesse a home (`/`)
3. Clique em "Área do Anfitrião"
4. Teste criar uma conta
5. Verifique se redireciona para `/dashboard`
6. Repita para Condomínio e Hóspede

## ⚠️ Importante

- **Telefone está desabilitado** - apenas email e social providers
- **Webhook é necessário** - para sincronizar automaticamente com Supabase
- **Metadata do Clerk** - o `user_type` é salvo em `publicMetadata.user_type`
- **Redirecionamento automático** - o sistema detecta o tipo e redireciona corretamente

## 🐛 Troubleshooting

### Webhook não funciona
- Verifique se `CLERK_WEBHOOK_SECRET` está no `.env.local`
- Verifique se o webhook está configurado no Clerk Dashboard
- Verifique os logs do servidor

### Usuário não é redirecionado
- Verifique se o `user_type` está definido no metadata do Clerk
- Verifique o console do navegador para erros
- Verifique se a API `/api/auth/set-user-type` está funcionando

### Dados não aparecem
- Verifique se o webhook sincronizou com Supabase
- Verifique as políticas RLS no Supabase
- Verifique os logs do servidor




