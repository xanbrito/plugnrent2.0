/**
 * API Route: Registro de hóspede
 * POST /api/guests/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { registerGuest } from '@/lib/guest-auth';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      );
    }

    const result = await registerGuest(email, password, name);

    if (result.error || !result.guest) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error || 'Erro ao registrar hóspede' },
        { status: 400 }
      );
    }

    // Não retornar password_hash
    const { password_hash, ...guestData } = result.guest as any;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { guest: guestData },
    });
  } catch (error) {
    console.error('Erro ao registrar hóspede:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




