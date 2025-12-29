/**
 * API Route: Login de hóspede
 * POST /api/guests/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { loginGuest } from '@/lib/guest-auth';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await loginGuest(email, password);

    if (result.error || !result.guest) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error || 'Erro ao fazer login' },
        { status: 401 }
      );
    }

    // Não retornar password_hash
    const { password_hash, ...guestData } = result.guest as any;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { guest: guestData },
    });
  } catch (error) {
    console.error('Erro ao fazer login de hóspede:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




