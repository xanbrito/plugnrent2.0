/**
 * API Route: Busca de CEP via ViaCEP
 * GET /api/cep?cep=12345678
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ViaCepResponse, ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cep = searchParams.get('cep');

    if (!cep) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'CEP não fornecido' },
        { status: 400 }
      );
    }

    // Limpar CEP (remover formatação)
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'CEP inválido. Deve conter 8 dígitos.' },
        { status: 400 }
      );
    }

    // Buscar no ViaCEP com timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Erro ao buscar CEP' },
          { status: response.status }
        );
      }

    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'CEP não encontrado' },
        { status: 404 }
      );
    }

      return NextResponse.json<ApiResponse<ViaCepResponse>>({
        success: true,
        data,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Timeout: A requisição demorou muito para responder' },
          { status: 504 }
        );
      }
      
      throw fetchError;
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




