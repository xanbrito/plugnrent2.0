/**
 * Script de Migração de Dados: Atualiza user_id do Supabase para Clerk
 * 
 * Após criar a conta no Clerk, use este script para migrar os dados
 * 
 * USO: node scripts/migrar-dados-usuario.js <supabase-user-id> <clerk-user-id>
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

async function migrarDados(supabaseUserId, clerkUserId) {
  console.log(`\n🔄 Migrando dados de ${supabaseUserId} para ${clerkUserId}\n`);

  try {
    // 1. Buscar dados
    console.log('📋 Buscando dados do usuário...');
    
    const { data: properties } = await supabaseAdmin
      .from('properties')
      .select('id, space_name')
      .eq('user_id', supabaseUserId);

    const { data: reservations } = await supabaseAdmin
      .from('reservations')
      .select('id')
      .eq('user_id', supabaseUserId);

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', supabaseUserId)
      .single();

    console.log(`   - Propriedades: ${properties?.length || 0}`);
    console.log(`   - Reservas: ${reservations?.length || 0}`);
    console.log(`   - Perfil: ${profile ? 'Sim' : 'Não'}`);

    // 2. Atualizar referências
    console.log('\n📋 Atualizando referências...');

    // Properties
    if (properties && properties.length > 0) {
      const { error: propsError } = await supabaseAdmin
        .from('properties')
        .update({ user_id: clerkUserId })
        .eq('user_id', supabaseUserId);
      
      if (propsError) {
        console.error(`   ❌ Erro ao atualizar properties: ${propsError.message}`);
      } else {
        console.log(`   ✅ ${properties.length} propriedade(s) atualizada(s)`);
      }
    }

    // Reservations
    if (reservations && reservations.length > 0) {
      const { error: resError } = await supabaseAdmin
        .from('reservations')
        .update({ user_id: clerkUserId })
        .eq('user_id', supabaseUserId);
      
      if (resError) {
        console.error(`   ❌ Erro ao atualizar reservations: ${resError.message}`);
      } else {
        console.log(`   ✅ ${reservations.length} reserva(s) atualizada(s)`);
      }
    }

    // User Profiles
    if (profile) {
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update({ user_id: clerkUserId })
        .eq('user_id', supabaseUserId);
      
      if (profileError) {
        console.error(`   ❌ Erro ao atualizar user_profiles: ${profileError.message}`);
      } else {
        console.log(`   ✅ Perfil atualizado`);
      }
    } else {
      // Criar novo perfil se não existir
      const { data: supabaseUser } = await supabaseAdmin.auth.admin.getUserById(supabaseUserId);
      const email = supabaseUser?.user?.email || '';
      
      const { error: createError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: clerkUserId,
          full_name: supabaseUser?.user?.user_metadata?.full_name || email.split('@')[0],
          host_email: email,
        });
      
      if (createError) {
        console.error(`   ❌ Erro ao criar perfil: ${createError.message}`);
      } else {
        console.log(`   ✅ Perfil criado`);
      }
    }

    console.log('\n✅ Migração de dados concluída!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Faça login no sistema com sua conta Clerk');
    console.log('   2. Verifique se os dados aparecem corretamente');

  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error.message);
    if (error.stack) {
      console.error('   Stack:', error.stack);
    }
    process.exit(1);
  }
}

// Executar migração
const supabaseUserId = process.argv[2];
const clerkUserId = process.argv[3];

if (!supabaseUserId || !clerkUserId) {
  console.error('❌ Uso: node scripts/migrar-dados-usuario.js <supabase-user-id> <clerk-user-id>');
  console.error('\n   Para obter o Supabase User ID:');
  console.error('   node scripts/migrar-usuario.js <email>');
  console.error('\n   Para obter o Clerk User ID:');
  console.error('   - Faça login no sistema');
  console.error('   - Abra o console do navegador');
  console.error('   - Execute: localStorage.getItem("clerk:user")');
  console.error('   - Ou verifique no Dashboard Clerk: https://dashboard.clerk.com');
  process.exit(1);
}

migrarDados(supabaseUserId, clerkUserId);




