/**
 * API Route: Registro de condomínio
 * POST /api/condominiums/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { registerCondominium } from '@/lib/condominium-auth';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, cnpj, cpf } = body;

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

    const result = await registerCondominium(email, password, name, cnpj, cpf);

    if (result.error || !result.user || !result.condominium) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error || 'Erro ao registrar condomínio' },
        { status: 400 }
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
    console.error('Erro ao registrar condomínio:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




