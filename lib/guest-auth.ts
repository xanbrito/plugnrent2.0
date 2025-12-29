/**
 * Autenticação de Hóspedes
 * Sistema customizado usando tabela guests com password_hash
 */

import { supabase } from './supabase';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import type { Guest } from '@/types';

export interface GuestAuthResponse {
  guest: Guest | null;
  error: string | null;
}

/**
 * Hash de senha
 */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verificar senha
 */
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Login de hóspede
 */
export async function loginGuest(email: string, password: string): Promise<GuestAuthResponse> {
  try {
    const { data: guest, error } = await supabase
      .from('guests')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('status', 'active')
      .single();

    if (error || !guest) {
      return { guest: null, error: 'Email ou senha incorretos' };
    }

    const guestData = guest as any;
    if (!guestData.password_hash) {
      return { guest: null, error: 'Senha não configurada. Use recuperação de senha.' };
    }

    const isValid = await verifyPassword(password, guestData.password_hash);
    if (!isValid) {
      return { guest: null, error: 'Email ou senha incorretos' };
    }

    return { guest, error: null };
  } catch (error) {
    return {
      guest: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao fazer login',
    };
  }
}

/**
 * Registro de hóspede
 */
export async function registerGuest(
  email: string,
  password: string,
  name: string
): Promise<GuestAuthResponse> {
  try {
    // Verificar se email já existe
    const { data: existingGuest } = await supabase
      .from('guests')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingGuest) {
      return { guest: null, error: 'Email já cadastrado' };
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = crypto.randomUUID();

    const { data: guest, error } = await supabase
      .from('guests')
      .insert({
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        status: 'active',
        is_titular: true,
        email_verified: false,
        profile_complete: false,
        is_temporary: false,
        urgencia: false,
      } as any)
      .select()
      .single();

    if (error || !guest) {
      return { guest: null, error: error?.message || 'Erro ao criar conta' };
    }

    // TODO: Enviar email de verificação com verificationToken
    // await sendVerificationEmail(email, name, verificationToken);

    return { guest, error: null };
  } catch (error) {
    return {
      guest: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao registrar',
    };
  }
}

/**
 * Verificar email de hóspede
 */
export async function verifyGuestEmail(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Implementar verificação de token
    // Por enquanto, apenas retorna sucesso
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar email',
    };
  }
}

/**
 * Obter hóspede por ID
 */
export async function getGuestById(id: string): Promise<Guest | null> {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as Guest;
  } catch (error) {
    console.error('Erro ao obter hóspede:', error);
    return null;
  }
}

