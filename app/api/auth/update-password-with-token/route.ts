/**
 * API Route: Atualizar senha com token
 * POST /api/auth/update-password-with-token
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Token e nova senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar senha (mínimo 6 caracteres)
    if (newPassword.length < 6) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    // Buscar token no banco
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Token inválido ou já utilizado' },
        { status: 400 }
      );
    }

    // Verificar se token expirou
    const expiresAt = new Date(tokenData.expires_at);
    const now = new Date();

    if (now > expiresAt) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Token expirado' },
        { status: 400 }
      );
    }

    // Atualizar senha do usuário
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      tokenData.user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Erro ao atualizar senha:', updateError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Erro ao atualizar senha' },
        { status: 500 }
      );
    }

    // Marcar token como usado
    await supabaseAdmin
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', tokenData.id);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Senha atualizada com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




