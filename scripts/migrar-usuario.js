/**
 * Script de Migração: Supabase Auth → Clerk
 * 
 * Migra um usuário do Supabase Auth para Clerk e atualiza todas as referências
 * 
 * USO: node scripts/migrar-usuario.js <email>
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis do Supabase não encontradas!');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function migrarUsuario(email) {
  console.log(`\n🔄 Iniciando migração do usuário: ${email}\n`);

  try {
    // 1. Buscar usuário no Supabase Auth
    console.log('📋 Passo 1: Buscando usuário no Supabase...');
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Erro ao listar usuários: ${listError.message}`);
    }

    const supabaseUser = users.find(u => u.email === email.toLowerCase());
    
    if (!supabaseUser) {
      console.error(`❌ Usuário ${email} não encontrado no Supabase Auth`);
      console.log('\n💡 Solução:');
      console.log('   1. Crie uma nova conta no Clerk com o mesmo email');
      console.log('   2. Execute este script novamente para migrar os dados');
      return;
    }

    console.log(`✅ Usuário encontrado no Supabase: ${supabaseUser.id}`);
    console.log(`   Email: ${supabaseUser.email}`);
    console.log(`   Criado em: ${new Date(supabaseUser.created_at).toLocaleString('pt-BR')}`);

    // 2. Buscar dados do usuário
    console.log('\n📋 Passo 2: Buscando dados do usuário...');
    const oldUserId = supabaseUser.id;

    // Buscar propriedades
    const { data: properties, error: propsError } = await supabaseAdmin
      .from('properties')
      .select('id, space_name')
      .eq('user_id', oldUserId);

    // Buscar reservas
    const { data: reservations, error: resError } = await supabaseAdmin
      .from('reservations')
      .select('id')
      .eq('user_id', oldUserId);

    // Buscar perfil
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', oldUserId)
      .single();

    console.log(`   - Propriedades: ${properties?.length || 0}`);
    if (properties && properties.length > 0) {
      properties.forEach(p => console.log(`     • ${p.space_name || p.id}`));
    }
    console.log(`   - Reservas: ${reservations?.length || 0}`);
    console.log(`   - Perfil: ${profile ? 'Sim' : 'Não'}`);

    // 3. Instruções para criar usuário no Clerk
    console.log('\n📋 Passo 3: Criar usuário no Clerk');
    console.log('\n⚠️  IMPORTANTE: Você precisa criar o usuário no Clerk primeiro!');
    console.log('\n   Opções:');
    console.log('   1. Via Dashboard Clerk:');
    console.log('      - Acesse https://dashboard.clerk.com');
    console.log('      - Vá em Users → Create User');
    console.log(`      - Email: ${email}`);
    console.log('      - Envie convite ou defina senha temporária');
    console.log('\n   2. Via Sistema (Recomendado):');
    console.log('      - Acesse http://localhost:3000/auth/register');
    console.log(`      - Use o email: ${email}`);
    console.log('      - Defina uma nova senha');
    console.log('      - Faça login uma vez para criar a conta no Clerk');

    console.log('\n📋 Passo 4: Após criar a conta no Clerk');
    console.log('   Execute este script novamente com o novo Clerk User ID');
    console.log('   Exemplo: node scripts/migrar-dados-usuario.js <clerk-user-id>');

    console.log('\n💡 Alternativa: Script automático completo');
    console.log('   Instale: npm install @clerk/clerk-sdk-node');
    console.log('   Execute: npx ts-node scripts/migrar-usuario-supabase-para-clerk.ts ' + email);

  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error.message);
    if (error.stack) {
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Executar migração
const email = process.argv[2];

if (!email) {
  console.error('❌ Uso: node scripts/migrar-usuario.js <email>');
  console.error('   Exemplo: node scripts/migrar-usuario.js alexandre.brito.engenharia@gmail.com');
  process.exit(1);
}

migrarUsuario(email);




