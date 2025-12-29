# 🔄 Migração de Conta: Supabase → Clerk

## 📋 Situação

Você tem uma conta criada no **Supabase Auth** (`alexandre.brito.engenharia@gmail.com`), mas o sistema agora usa **Clerk** para autenticação de anfitriões.

## ✅ Soluções Disponíveis

### Opção 1: Criar Nova Conta no Clerk (Recomendado - Mais Simples)

1. **Criar nova conta no Clerk:**
   - Acesse `/auth/register` no sistema
   - Use o mesmo email: `alexandre.brito.engenharia@gmail.com`
   - Defina uma nova senha
   - Faça login

2. **Migrar dados manualmente:**
   - Após criar a conta no Clerk, os dados do Supabase precisarão ser vinculados
   - Execute o script de migração (veja Opção 2) para vincular os dados

### Opção 2: Usar Script de Migração Automática

O script `scripts/migrar-usuario-supabase-para-clerk.ts` faz automaticamente:

1. ✅ Busca o usuário no Supabase Auth
2. ✅ Cria o usuário no Clerk com o mesmo email
3. ✅ Atualiza todas as referências no banco de dados:
   - `properties.user_id`
   - `reservations.user_id`
   - `user_profiles.user_id`

**Como usar:**

```bash
# 1. Instalar dependência do Clerk SDK
npm install @clerk/clerk-sdk-node

# 2. Executar o script de migração
npx ts-node scripts/migrar-usuario-supabase-para-clerk.ts alexandre.brito.engenharia@gmail.com
```

**Após a migração:**
1. Acesse https://dashboard.clerk.com
2. Vá em **Users** e encontre seu usuário
3. Envie um email de redefinição de senha
4. Defina uma nova senha
5. Faça login no sistema

### Opção 3: Importar via Clerk Dashboard (Manual)

1. Acesse https://dashboard.clerk.com
2. Vá em **Users** → **Create User**
3. Crie o usuário com o email `alexandre.brito.engenharia@gmail.com`
4. Envie email de convite ou defina senha temporária
5. Execute o script de migração de dados (sem criar usuário)

## 🔧 Script de Migração de Dados (Sem Criar Usuário)

Se você já criou a conta no Clerk manualmente, use este script para migrar apenas os dados:

```typescript
// scripts/migrar-dados-usuario.ts
// Atualiza user_id nas tabelas do Supabase
```

## ⚠️ Importante

- **Senhas não são migradas** - Você precisará definir uma nova senha no Clerk
- **Dados são preservados** - Todas as propriedades, reservas e perfis são mantidos
- **RLS Policies** - Certifique-se de que as políticas RLS no Supabase permitem acesso com Clerk userId

## 🐛 Problemas Comuns

### Erro: "User already exists in Clerk"
- O usuário já foi criado no Clerk
- Execute apenas a migração de dados (sem criar usuário)

### Erro: "User not found in Supabase"
- Verifique se o email está correto
- Verifique se a conta existe no Supabase Auth

### Dados não aparecem após migração
- Verifique as políticas RLS no Supabase
- Certifique-se de que `user_id` foi atualizado corretamente

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs do script de migração
2. Console do navegador
3. Logs do Supabase Dashboard
4. Logs do Clerk Dashboard




