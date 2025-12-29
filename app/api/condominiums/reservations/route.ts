/**
 * API Route: Reservas do condomínio
 * GET /api/condominiums/reservations - Listar reservas
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar propriedades vinculadas ao condomínio
    const { data: condominiumProperties } = await supabase
      .from('condominium_properties')
      .select('property_id')
      .eq('condominium_id', user.id);

    if (!condominiumProperties || condominiumProperties.length === 0) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: { reservations: [] },
      });
    }

    const propertyIds = condominiumProperties.map((cp) => cp.property_id);

    // Buscar reservas das propriedades
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('*, properties(*)')
      .in('property_id', propertyIds)
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




