/**
 * API Route: Perfil do hóspede
 * GET /api/guests/profile - Obter perfil
 * PUT /api/guests/profile - Atualizar perfil
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const guestId = request.headers.get('x-guest-id');

    if (!guestId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ID do hóspede não fornecido' },
        { status: 400 }
      );
    }

    const { data: guest, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', guestId)
      .single();

    if (error || !guest) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Hóspede não encontrado' },
        { status: 404 }
      );
    }

    // Não retornar password_hash
    const { password_hash, ...guestData } = guest as any;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { guest: guestData },
    });
  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const guestId = request.headers.get('x-guest-id');
    const body = await request.json();

    if (!guestId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ID do hóspede não fornecido' },
        { status: 400 }
      );
    }

    // Remover campos que não devem ser atualizados diretamente
    const { password_hash, id, created_at, ...updateData } = body;

    const { data: guest, error } = await supabase
      .from('guests')
      .update(updateData)
      .eq('id', guestId)
      .select()
      .single();

    if (error || !guest) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Erro ao atualizar perfil' },
        { status: 500 }
      );
    }

    // Não retornar password_hash
    const { password_hash: _, ...guestData } = guest as any;

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { guest: guestData },
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




