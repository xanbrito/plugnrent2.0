/**
 * Autenticação de Condomínios
 * Usa Supabase Auth (mesma tabela auth.users)
 */

import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import type { Condominium } from '@/types';

export interface CondominiumAuthResponse {
  user: User | null;
  condominium: Condominium | null;
  error: string | null;
}

/**
 * Login de condomínio
 */
export async function loginCondominium(
  email: string,
  password: string
): Promise<CondominiumAuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, condominium: null, error: error.message };
    }

    // Verificar se é um condomínio
    const { data: condominium, error: condError } = await supabase
      .from('condominiums')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (condError || !condominium) {
      return {
        user: null,
        condominium: null,
        error: 'Conta não encontrada ou não é um condomínio',
      };
    }

    return { user: data.user, condominium, error: null };
  } catch (error) {
    return {
      user: null,
      condominium: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao fazer login',
    };
  }
}

/**
 * Registro de condomínio
 */
export async function registerCondominium(
  email: string,
  password: string,
  name: string,
  cnpj?: string,
  cpf?: string
): Promise<CondominiumAuthResponse> {
  try {
    // Verificar se email já existe
    const { data: existing } = await supabase
      .from('condominiums')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return {
        user: null,
        condominium: null,
        error: 'Email já cadastrado',
      };
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          name,
          type: 'condominium',
        },
      },
    });

    if (authError || !authData.user) {
      return {
        user: null,
        condominium: null,
        error: authError?.message || 'Erro ao criar conta',
      };
    }

    // Criar registro de condomínio
    const { data: condominium, error: condError } = await supabase
      .from('condominiums')
      .insert({
        id: authData.user.id,
        name,
        email: email.toLowerCase(),
        cnpj: cnpj || null,
        cpf: cpf || null,
        status: 'active',
      })
      .select()
      .single();

    if (condError || !condominium) {
      // Rollback: deletar usuário criado
      await supabase.auth.admin.deleteUser(authData.user.id);
      return {
        user: null,
        condominium: null,
        error: condError?.message || 'Erro ao criar condomínio',
      };
    }

    return { user: authData.user, condominium, error: null };
  } catch (error) {
    return {
      user: null,
      condominium: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao registrar',
    };
  }
}

/**
 * Logout de condomínio
 */
export async function logoutCondominium(): Promise<{ error: string | null }> {
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
 * Obter condomínio atual
 */
export async function getCurrentCondominium(): Promise<Condominium | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Buscar condomínio pelo email do usuário autenticado
    // (condomínios são identificados por email, não por user_id)
    const { data: condominium } = await supabase
      .from('condominiums')
      .select('*')
      .eq('email', user.email)
      .single();

    // Se não encontrou por email, retorna null (usuário não é condomínio)
    return condominium as Condominium | null;
  } catch (error) {
    // Erro esperado se não encontrar condomínio (usuário normal não é condomínio)
    // Não logar como erro, apenas retornar null
    return null;
  }
}

/**
 * Verificar se condomínio está autenticado
 */
export async function isCondominiumAuthenticated(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const condominium = await getCurrentCondominium();
    return !!condominium;
  } catch (error) {
    return false;
  }
}


