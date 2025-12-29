/**
 * API Route: Reservas do hóspede
 * GET /api/guests/reservations - Listar reservas do hóspede
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const guestId = request.headers.get('x-guest-id');

    if (!guestId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'ID do hóspede não fornecido' },
        { status: 400 }
      );
    }

    // Buscar reservas do hóspede
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*, properties(*)')
      .contains('guests', [{ id: guestId }])
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Erro ao buscar reservas' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { reservations },
    });
  } catch (error) {
    console.error('Erro ao listar reservas:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




