/**
 * API Route: Validar token de reset de senha
 * POST /api/auth/validate-reset-token
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Token é obrigatório' },
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

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        valid: true,
        userId: tokenData.user_id,
      },
    });
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




