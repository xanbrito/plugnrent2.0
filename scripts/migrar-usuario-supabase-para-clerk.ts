/**
 * Script de Migração: Supabase Auth → Clerk
 * 
 * Este script migra um usuário do Supabase Auth para Clerk e atualiza
 * todas as referências no banco de dados (properties, reservations, etc.)
 * 
 * USO:
 * 1. Instale as dependências: npm install @clerk/clerk-sdk-node
 * 2. Execute: npx ts-node scripts/migrar-usuario-supabase-para-clerk.ts <email>
 * 
 * IMPORTANTE: Este script requer:
 * - CLERK_SECRET_KEY no .env.local
 * - SUPABASE_SERVICE_ROLE_KEY no .env.local
 */

import { Clerk } from '@clerk/clerk-sdk-node';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis do Supabase não encontradas!');
  process.exit(1);
}

if (!clerkSecretKey) {
  console.error('❌ CLERK_SECRET_KEY não encontrada!');
  process.exit(1);
}

// Cliente Supabase Admin (com service role key)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Cliente Clerk
const clerk = new Clerk({ secretKey: clerkSecretKey });

async function migrarUsuario(email: string) {
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
      console.log('\n💡 Solução: Crie uma nova conta no Clerk com o mesmo email.');
      console.log('   Os dados do Supabase serão vinculados automaticamente quando você fizer login.');
      return;
    }

    console.log(`✅ Usuário encontrado no Supabase: ${supabaseUser.id}`);

    // 2. Verificar se já existe no Clerk
    console.log('\n📋 Passo 2: Verificando se usuário já existe no Clerk...');
    const clerkUsers = await clerk.users.getUserList({ emailAddress: [email] });
    
    if (clerkUsers.data.length > 0) {
      console.log(`⚠️  Usuário já existe no Clerk: ${clerkUsers.data[0].id}`);
      console.log('   Pulando criação de usuário...');
      return;
    }

    // 3. Criar usuário no Clerk
    console.log('\n📋 Passo 3: Criando usuário no Clerk...');
    const clerkUser = await clerk.users.createUser({
      emailAddress: [email],
      skipPasswordChecks: true, // Permitir que o usuário defina senha depois
      skipPasswordRequirement: true,
    });

    console.log(`✅ Usuário criado no Clerk: ${clerkUser.id}`);

    // 4. Buscar dados do usuário no Supabase (properties, reservations, etc.)
    console.log('\n📋 Passo 4: Buscando dados do usuário no Supabase...');
    const oldUserId = supabaseUser.id;
    const newUserId = clerkUser.id;

    // Buscar propriedades
    const { data: properties } = await supabaseAdmin
      .from('properties')
      .select('id')
      .eq('user_id', oldUserId);

    // Buscar reservas
    const { data: reservations } = await supabaseAdmin
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
    console.log(`   - Reservas: ${reservations?.length || 0}`);
    console.log(`   - Perfil: ${profile ? 'Sim' : 'Não'}`);

    // 5. Atualizar referências no banco de dados
    console.log('\n📋 Passo 5: Atualizando referências no banco de dados...');

    // Atualizar properties
    if (properties && properties.length > 0) {
      const { error: propsError } = await supabaseAdmin
        .from('properties')
        .update({ user_id: newUserId })
        .eq('user_id', oldUserId);
      
      if (propsError) {
        console.error(`   ⚠️  Erro ao atualizar properties: ${propsError.message}`);
      } else {
        console.log(`   ✅ ${properties.length} propriedade(s) atualizada(s)`);
      }
    }

    // Atualizar reservations
    if (reservations && reservations.length > 0) {
      const { error: resError } = await supabaseAdmin
        .from('reservations')
        .update({ user_id: newUserId })
        .eq('user_id', oldUserId);
      
      if (resError) {
        console.error(`   ⚠️  Erro ao atualizar reservations: ${resError.message}`);
      } else {
        console.log(`   ✅ ${reservations.length} reserva(s) atualizada(s)`);
      }
    }

    // Atualizar ou criar user_profiles
    if (profile) {
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .update({ user_id: newUserId })
        .eq('user_id', oldUserId);
      
      if (profileError) {
        console.error(`   ⚠️  Erro ao atualizar user_profiles: ${profileError.message}`);
      } else {
        console.log(`   ✅ Perfil atualizado`);
      }
    } else {
      // Criar novo perfil
      const { error: createError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: newUserId,
          full_name: supabaseUser.user_metadata?.full_name || email.split('@')[0],
          host_email: email,
        });
      
      if (createError) {
        console.error(`   ⚠️  Erro ao criar perfil: ${createError.message}`);
      } else {
        console.log(`   ✅ Perfil criado`);
      }
    }

    console.log('\n✅ Migração concluída com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Acesse https://dashboard.clerk.com');
    console.log('   2. Vá em Users e encontre o usuário criado');
    console.log('   3. Envie um email de redefinição de senha para o usuário');
    console.log('   4. O usuário poderá definir uma nova senha e fazer login');

  } catch (error: any) {
    console.error('\n❌ Erro durante a migração:', error.message);
    if (error.errors) {
      console.error('   Detalhes:', JSON.stringify(error.errors, null, 2));
    }
    process.exit(1);
  }
}

// Executar migração
const email = process.argv[2];

if (!email) {
  console.error('❌ Uso: npx ts-node scripts/migrar-usuario-supabase-para-clerk.ts <email>');
  console.error('   Exemplo: npx ts-node scripts/migrar-usuario-supabase-para-clerk.ts alexandre.brito.engenharia@gmail.com');
  process.exit(1);
}

migrarUsuario(email);




