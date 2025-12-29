/**
 * API Route: Login de condomínio
 * POST /api/condominiums/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { loginCondominium } from '@/lib/condominium-auth';
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

    const result = await loginCondominium(email, password);

    if (result.error || !result.user || !result.condominium) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error || 'Erro ao fazer login' },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: result.user,
        condominium: result.condominium,
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login de condomínio:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




