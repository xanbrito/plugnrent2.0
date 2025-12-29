# 🔐 Instruções para Configurar RLS (Row Level Security)

## Problema

Ao fazer login, o dashboard não consegue carregar as propriedades e reservas do usuário, mesmo que elas existam no banco de dados. Isso acontece porque as políticas RLS (Row Level Security) não estão configuradas no Supabase.

## Solução

Execute o script SQL `configurar-rls-policies.sql` no Supabase para habilitar e configurar as políticas de segurança.

## Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Faça login na sua conta
3. Selecione o projeto **Sistema Vibing**

### 2. Abrir o SQL Editor

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query** (Nova Consulta)

### 3. Executar o Script

1. Abra o arquivo `configurar-rls-policies.sql` neste projeto
2. Copie **TODO** o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

### 4. Verificar se Funcionou

Após executar o script, você deve ver:

- ✅ Mensagens de sucesso indicando que as políticas foram criadas
- ✅ Uma tabela mostrando as políticas criadas (no final do script)

### 5. Testar no Dashboard

1. Faça logout e login novamente no sistema
2. Acesse o dashboard
3. As propriedades e reservas do usuário devem aparecer corretamente

## O que o Script Faz

O script `configurar-rls-policies.sql`:

1. **Habilita RLS** nas tabelas:
   - `properties`
   - `reservations`
   - `photos`
   - `user_profiles`

2. **Cria políticas de segurança** que permitem:
   - **SELECT**: Usuários veem apenas seus próprios dados
   - **INSERT**: Usuários criam dados apenas para si mesmos
   - **UPDATE**: Usuários atualizam apenas seus próprios dados
   - **DELETE**: Usuários deletam apenas seus próprios dados

3. **Verifica** se tudo foi configurado corretamente

## Políticas Criadas

### Properties (Propriedades)
- Usuários podem ver/criar/atualizar/deletar apenas suas próprias propriedades
- Verificação: `auth.uid() = user_id`

### Reservations (Reservas)
- Usuários podem ver/criar/atualizar/deletar apenas suas próprias reservas
- Verificação: `auth.uid() = user_id`

### Photos (Fotos)
- Usuários podem ver/criar/atualizar/deletar fotos apenas de suas próprias propriedades
- Verificação: `properties.user_id = auth.uid()`

### User Profiles (Perfis)
- Usuários podem ver/criar/atualizar apenas seu próprio perfil
- Verificação: `auth.uid() = user_id`

## Troubleshooting

### Erro: "permission denied" ou "row-level security"

**Causa**: RLS está habilitado mas não há políticas configuradas, ou as políticas estão incorretas.

**Solução**: Execute o script `configurar-rls-policies.sql` novamente.

### Erro: "relation does not exist"

**Causa**: As tabelas não existem no banco de dados.

**Solução**: Execute primeiro os scripts de criação de tabelas (migrations).

### Dados não aparecem mesmo após configurar RLS

**Verificações**:

1. O `user_id` nas tabelas corresponde ao `auth.uid()` do usuário logado?
   ```sql
   -- Verificar user_id das propriedades
   SELECT id, user_id, space_name 
   FROM properties 
   WHERE user_id = 'c600953f-cdc2-4ec9-b6b8-efed0314906a';
   ```

2. O usuário está autenticado?
   - Verifique se `auth.uid()` não é NULL no Supabase
   - Verifique se a sessão está ativa no navegador

3. As políticas foram criadas corretamente?
   ```sql
   -- Verificar políticas
   SELECT tablename, policyname, cmd
   FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename IN ('properties', 'reservations', 'photos', 'user_profiles');
   ```

## Comandos SQL Úteis

### Verificar se RLS está habilitado
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('properties', 'reservations', 'photos', 'user_profiles');
```

### Ver todas as políticas
```sql
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Testar acesso como usuário específico
```sql
-- Substitua 'USER_ID_AQUI' pelo ID do usuário
SET LOCAL role authenticated;
SET LOCAL request.jwt.claim.sub = 'USER_ID_AQUI';

SELECT * FROM properties;
SELECT * FROM reservations;
```

## Segurança

⚠️ **IMPORTANTE**: As políticas RLS são essenciais para a segurança dos dados. Sem elas:

- ❌ Qualquer usuário autenticado pode ver dados de outros usuários
- ❌ Dados sensíveis podem ser expostos
- ❌ A integridade dos dados pode ser comprometida

✅ **Com RLS configurado**:
- ✅ Cada usuário vê apenas seus próprios dados
- ✅ Dados são protegidos automaticamente
- ✅ Acesso é controlado pelo Supabase

## Suporte

Se após executar o script ainda houver problemas:

1. Verifique os logs do Supabase (Dashboard > Logs)
2. Verifique o console do navegador para erros específicos
3. Execute os comandos SQL de verificação acima
4. Certifique-se de que o `user_id` nas tabelas corresponde ao ID do usuário autenticado

---

**Última atualização**: 2024
**Versão do Script**: 1.0



