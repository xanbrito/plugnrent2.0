/**
 * Autenticação de Hosts (Usuários Principais)
 * Usa Supabase Auth
 */

import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

/**
 * Testar conexão com Supabase
 */
async function testSupabaseConnection(): Promise<boolean> {
  try {
    // Tentar fazer uma requisição simples ao Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL não configurado');
      return false;
    }

    // Testar se o endpoint está acessível
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000), // 5 segundos de timeout
    });
    
    return response.ok || response.status === 404; // 404 é OK, significa que o servidor respondeu
  } catch (error) {
    console.error('❌ Erro ao testar conexão com Supabase:', error);
    return false;
  }
}

/**
 * Login de host
 */
export async function loginHost(email: string, password: string): Promise<AuthResponse> {
  try {
    console.log('Tentando fazer login para:', email);
    
    // Verificar se o Supabase está configurado
    if (!supabase) {
      console.error('Cliente Supabase não inicializado');
      return { user: null, error: 'Erro de configuração. Verifique o arquivo .env.local' };
    }

    // Testar conexão antes de fazer login
    console.log('Testando conexão com Supabase...');
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      console.error('❌ Não foi possível conectar ao Supabase');
      return { 
        user: null, 
        error: 'Não foi possível conectar ao servidor. Verifique:\n- Sua conexão com a internet\n- Se o Supabase está acessível\n- Se as configurações no .env.local estão corretas' 
      };
    }
    console.log('✅ Conexão com Supabase OK');

    // Tentar fazer login com timeout
    console.log('Fazendo requisição de login...');
    
    // Wrapper para adicionar timeout ao login
    const loginWithTimeout = Promise.race([
      supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      }),
      new Promise<{ data: null; error: { message: string } }>((_, reject) => 
        setTimeout(() => reject({ data: null, error: { message: 'Timeout: O servidor não respondeu a tempo' } }), 15000)
      ),
    ]);

    const { data, error } = await loginWithTimeout;

    if (error) {
      console.error('Erro no login:', error);
      
      // Mensagens de erro mais amigáveis
      let errorMessage = error.message;
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login';
      } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error.message.includes('Timeout')) {
        errorMessage = 'Tempo de espera excedido. O servidor não respondeu. Verifique sua conexão.';
      }
      
      return { user: null, error: errorMessage };
    }

    if (!data?.user) {
      console.error('Login retornou sem usuário');
      return { user: null, error: 'Erro ao fazer login. Tente novamente.' };
    }

    console.log('Login bem-sucedido para:', data.user.email);
    return { user: data.user, error: null };
  } catch (error: any) {
    console.error('Exceção no login:', error);
    
    let errorMessage = 'Erro desconhecido ao fazer login';
    if (error?.message?.includes('Timeout')) {
      errorMessage = 'Tempo de espera excedido. Verifique:\n- Sua conexão com a internet\n- Se o Supabase está acessível\n- Se as configurações no .env.local estão corretas';
    } else if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
      errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
    } else if (error?.message?.includes('Supabase não respondeu')) {
      errorMessage = 'Servidor não respondeu. Verifique sua conexão e as configurações do Supabase.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return {
      user: null,
      error: errorMessage,
    };
  }
}

/**
 * Registro de host
 */
export async function registerHost(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/confirm`,
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    // Criar perfil do usuário
    if (data.user) {
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            full_name: fullName,
          } as any); // Type assertion necessário devido a limitação de tipos do Supabase

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          // Logar erro mas não falhar o registro (perfil pode ser criado pelo trigger)
          // Se necessário, pode-se fazer rollback aqui
        }
      } catch (profileError) {
        console.error('Exceção ao criar perfil:', profileError);
        // Não falhar o registro se o perfil não puder ser criado
      }

      // Enviar email de boas-vindas via Mailtrap
      try {
        const { sendWelcomeEmail } = await import('@/lib/email-service');
        await sendWelcomeEmail(email, fullName);
      } catch (emailError) {
        console.error('Erro ao enviar email de boas-vindas:', emailError);
        // Não falha o registro se o email falhar
      }
    }

    return { user: data.user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao registrar',
    };
  }
}

/**
 * Logout de host
 */
export async function logoutHost(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message || null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Erro desconhecido ao fazer logout',
    };
  }
}

/**
 * Obter usuário atual
 */
export async function getCurrentHost(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    return null;
  }
}

/**
 * Verificar se usuário está autenticado
 */
export async function isHostAuthenticated(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    return false;
  }
}

