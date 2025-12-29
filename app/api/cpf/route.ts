/**
 * API Route: Validação de CPF
 * POST /api/cpf
 * Body: { cpf: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { isValidCPF, formatCPF, cleanCPF } from '@/lib/cpf-validator';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cpf } = body;

    if (!cpf) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'CPF não fornecido' },
        { status: 400 }
      );
    }

    const cleaned = cleanCPF(cpf);
    const isValid = isValidCPF(cleaned);
    const formatted = isValid ? formatCPF(cleaned) : null;

    return NextResponse.json<ApiResponse<{
      isValid: boolean;
      formatted: string | null;
      cleaned: string;
    }>>({
      success: true,
      data: {
        isValid,
        formatted,
        cleaned,
      },
    });
  } catch (error) {
    console.error('Erro ao validar CPF:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




