/**
 * API Route: Solicitar reset de senha
 * POST /api/auth/reset-password
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendPasswordResetEmail } from '@/lib/email-service';
import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se usuário existe
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserByEmail(email);
    
    if (userError || !userData?.user) {
      // Por segurança, retornar sucesso mesmo se usuário não existir
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Se o email existir, você receberá um link para redefinir sua senha',
      });
    }

    const userId = userData.user.id;

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token válido por 1 hora

    // Salvar token no banco
    const { error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .insert({
        user_id: userId,
        token,
        expires_at: expiresAt.toISOString(),
        used: false,
      });

    if (tokenError) {
      console.error('Erro ao salvar token:', tokenError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Erro ao gerar token de reset' },
        { status: 500 }
      );
    }

    // Buscar nome do usuário
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('full_name')
      .eq('user_id', userId)
      .single();

    const name = profile?.full_name || userData.user.email || 'Usuário';

    // Enviar email
    const emailResult = await sendPasswordResetEmail(email, name, token);

    if (!emailResult.success) {
      console.error('Erro ao enviar email:', emailResult.error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Erro ao enviar email de reset' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Se o email existir, você receberá um link para redefinir sua senha',
    });
  } catch (error) {
    console.error('Erro ao processar reset de senha:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




