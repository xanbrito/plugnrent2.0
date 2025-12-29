# 🔗 Guia de Configuração do Webhook Clerk → Supabase

## 📋 Visão Geral

O webhook do Clerk sincroniza automaticamente os usuários criados no Clerk com as tabelas correspondentes no Supabase:

- **Anfitriões (Hosts)** → `user_profiles`
- **Condomínios (Condominiums)** → `condominiums`
- **Hóspedes (Guests)** → `guests`

## 🔧 Configuração no Clerk Dashboard

### 1. Criar Webhook Endpoint

1. Acesse https://dashboard.clerk.com
2. Vá em **Webhooks** no menu lateral
3. Clique em **Add Endpoint**
4. Configure:
   - **Endpoint URL:** `https://seu-dominio.com/api/webhooks/clerk`
     - Para desenvolvimento local, use: `https://seu-ngrok-url.ngrok.io/api/webhooks/clerk`
   - **Events:** Selecione:
     - ✅ `user.created` (obrigatório)
     - ✅ `user.updated` (opcional, mas recomendado)

5. Clique em **Create**

### 2. Obter Webhook Secret

1. Após criar o endpoint, clique nele
2. Na seção **Signing Secret**, clique em **Copy**
3. Adicione ao `.env.local`:
   ```env
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

### 3. Testar Webhook (Opcional)

1. No Clerk Dashboard, vá em **Webhooks** → Seu endpoint
2. Clique em **Send test event**
3. Selecione `user.created`
4. Verifique os logs do servidor para confirmar que foi recebido

## 🔄 Como Funciona

### Fluxo de Cadastro:

1. **Usuário se cadastra no Clerk**
   - Preenche formulário em `/auth/register?user_type=host`
   - Clerk cria o usuário

2. **Webhook é acionado**
   - Clerk envia evento `user.created` para `/api/webhooks/clerk`
   - Webhook verifica `public_metadata.user_type`
   - Se não tiver tipo, cria como `host` por padrão

3. **Sincronização com Supabase**
   - Webhook cria registro na tabela correspondente:
     - `host` → `user_profiles`
     - `condominium` → `condominiums`
     - `guest` → `guests`

4. **Callback define tipo (se necessário)**
   - Após cadastro, usuário é redirecionado para `/auth/callback`
   - Callback define `user_type` no metadata do Clerk
   - Sincroniza novamente com Supabase para garantir

### Fluxo de Atualização:

1. **Usuário atualiza perfil no Clerk**
   - Clerk envia evento `user.updated` para webhook
   - Webhook atualiza registro correspondente no Supabase

## 📊 Estrutura de Dados

### Anfitrião (Host) → `user_profiles`

```typescript
{
  user_id: string,        // Clerk User ID
  full_name: string,      // Nome completo
  host_email: string,      // Email
  // ... outros campos opcionais
}
```

### Condomínio → `condominiums`

```typescript
{
  id: string,             // Clerk User ID
  name: string,           // Nome do condomínio
  email: string,          // Email
  status: 'active',       // Status
  // ... outros campos opcionais
}
```

### Hóspede → `guests`

```typescript
{
  id: string,             // Clerk User ID
  name: string,           // Nome completo
  email: string,          // Email
  email_verified: false,  // Status de verificação
  // ... outros campos opcionais
}
```

## 🐛 Troubleshooting

### Webhook não está sendo chamado

1. **Verifique se o secret está configurado:**
   ```bash
   # Verificar .env.local
   CLERK_WEBHOOK_SECRET=whsec_...
   ```

2. **Verifique os logs do servidor:**
   - Procure por `[Webhook]` nos logs
   - Erros aparecerão com `[Webhook] ❌`

3. **Teste o endpoint manualmente:**
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/clerk \
     -H "Content-Type: application/json" \
     -d '{"type":"user.created","data":{"id":"test"}}'
   ```

### Usuário criado mas não aparece no Supabase

1. **Verifique se o webhook foi acionado:**
   - Veja os logs do servidor
   - Verifique no Clerk Dashboard → Webhooks → Seu endpoint → Recent deliveries

2. **Verifique se o tipo está definido:**
   - O webhook precisa do `user_type` no metadata
   - Se não tiver, criará como `host` por padrão

3. **Verifique as políticas RLS no Supabase:**
   - O webhook usa `supabaseAdmin` (Service Role)
   - Deve ter acesso total às tabelas

### Erro ao criar registro no Supabase

1. **Verifique a estrutura da tabela:**
   - Campos obrigatórios devem estar presentes
   - Tipos de dados devem corresponder

2. **Verifique constraints:**
   - `user_id` deve ser único em `user_profiles`
   - `id` deve ser único em `condominiums` e `guests`
   - `email` deve ser único em `condominiums`

## 📝 Logs

O webhook gera logs detalhados:

```
[Webhook] Evento recebido: user.created
[Webhook] Usuário criado: user_xxx
[Webhook] Email: email@example.com, Nome: Nome, Tipo: host
[Webhook] ✅ Usuário user_xxx sincronizado com sucesso como host
```

## 🔐 Segurança

- ✅ Webhook verifica assinatura Svix
- ✅ Usa Service Role Key do Supabase (acesso total)
- ✅ Valida dados antes de inserir
- ✅ Trata erros graciosamente

## 📚 Referências

- [Clerk Webhooks Documentation](https://clerk.com/docs/integrations/webhooks/overview)
- [Svix Webhook Verification](https://docs.svix.com/receiving/verifying-payloads/how)
- [Clerk Backend API](https://clerk.com/docs/reference/backend-api/tag/actor-tokens)




