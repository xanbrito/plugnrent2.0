-- ============================================
-- CONFIGURAÇÃO DE RLS (Row Level Security)
-- Sistema Vibing - Políticas de Segurança
-- ============================================
-- 
-- Este arquivo contém as políticas RLS necessárias para que
-- usuários autenticados possam acessar seus próprios dados.
--
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard
-- 2. Vá em SQL Editor
-- 3. Cole e execute este script completo
-- 4. Verifique se as políticas foram criadas corretamente
--
-- ============================================

-- ============================================
-- 1. HABILITAR RLS NAS TABELAS
-- ============================================

-- Habilitar RLS na tabela properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS na tabela reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS na tabela photos
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS na tabela user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. REMOVER POLÍTICAS EXISTENTES (SE HOUVER)
-- ============================================

-- Remover políticas antigas de properties
DROP POLICY IF EXISTS "Users can view own properties" ON properties;
DROP POLICY IF EXISTS "Users can insert own properties" ON properties;
DROP POLICY IF EXISTS "Users can update own properties" ON properties;
DROP POLICY IF EXISTS "Users can delete own properties" ON properties;

-- Remover políticas antigas de reservations
DROP POLICY IF EXISTS "Users can view own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can insert own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can update own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can delete own reservations" ON reservations;

-- Remover políticas antigas de photos
DROP POLICY IF EXISTS "Users can view own photos" ON photos;
DROP POLICY IF EXISTS "Users can insert own photos" ON photos;
DROP POLICY IF EXISTS "Users can update own photos" ON photos;
DROP POLICY IF EXISTS "Users can delete own photos" ON photos;

-- Remover políticas antigas de user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- ============================================
-- 3. POLÍTICAS PARA TABELA properties
-- ============================================

-- SELECT: Usuários podem ver apenas suas próprias propriedades
CREATE POLICY "Users can view own properties"
ON properties
FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Usuários podem criar propriedades para si mesmos
CREATE POLICY "Users can insert own properties"
ON properties
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuários podem atualizar apenas suas próprias propriedades
CREATE POLICY "Users can update own properties"
ON properties
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: Usuários podem deletar apenas suas próprias propriedades
CREATE POLICY "Users can delete own properties"
ON properties
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 4. POLÍTICAS PARA TABELA reservations
-- ============================================

-- SELECT: Usuários podem ver apenas suas próprias reservas
CREATE POLICY "Users can view own reservations"
ON reservations
FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Usuários podem criar reservas para si mesmos
CREATE POLICY "Users can insert own reservations"
ON reservations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuários podem atualizar apenas suas próprias reservas
CREATE POLICY "Users can update own reservations"
ON reservations
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: Usuários podem deletar apenas suas próprias reservas
CREATE POLICY "Users can delete own reservations"
ON reservations
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 5. POLÍTICAS PARA TABELA photos
-- ============================================

-- SELECT: Usuários podem ver fotos de suas próprias propriedades
CREATE POLICY "Users can view own photos"
ON photos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = photos.property_id
    AND properties.user_id = auth.uid()
  )
);

-- INSERT: Usuários podem adicionar fotos às suas propriedades
CREATE POLICY "Users can insert own photos"
ON photos
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = photos.property_id
    AND properties.user_id = auth.uid()
  )
);

-- UPDATE: Usuários podem atualizar fotos de suas propriedades
CREATE POLICY "Users can update own photos"
ON photos
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = photos.property_id
    AND properties.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = photos.property_id
    AND properties.user_id = auth.uid()
  )
);

-- DELETE: Usuários podem deletar fotos de suas propriedades
CREATE POLICY "Users can delete own photos"
ON photos
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = photos.property_id
    AND properties.user_id = auth.uid()
  )
);

-- ============================================
-- 6. POLÍTICAS PARA TABELA user_profiles
-- ============================================

-- SELECT: Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
USING (auth.uid() = user_id);

-- INSERT: Usuários podem criar seu próprio perfil
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 7. VERIFICAÇÃO DAS POLÍTICAS
-- ============================================

-- Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('properties', 'reservations', 'photos', 'user_profiles')
ORDER BY tablename;

-- Verificar políticas criadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('properties', 'reservations', 'photos', 'user_profiles')
ORDER BY tablename, policyname;

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- 
-- Após executar este script:
-- 1. Verifique se todas as políticas foram criadas
-- 2. Teste o login e acesso ao dashboard
-- 3. Verifique se os dados do usuário são carregados corretamente
--
-- Se ainda houver problemas:
-- - Verifique se o usuário está autenticado (auth.uid() não é NULL)
-- - Verifique se o user_id nas tabelas corresponde ao auth.uid()
-- - Verifique os logs do Supabase para erros específicos
-- ============================================



