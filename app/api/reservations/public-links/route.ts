/**
 * API Route: Listar links públicos de reservas
 * GET /api/reservations/public-links
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

    const searchParams = request.nextUrl.searchParams;
    const reservationId = searchParams.get('reservation_id');

    let query = supabase
      .from('reservation_public_links')
      .select('*, reservations(*)')
      .eq('created_by', user.id);

    if (reservationId) {
      query = query.eq('reservation_id', reservationId);
    }

    const { data: links, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Erro ao buscar links' },
        { status: 500 }
      );
    }

    // Adicionar URL completa aos links
    const linksWithUrl = links?.map((link: any) => ({
      ...link,
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkin/${link.token}`,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { links: linksWithUrl },
    });
  } catch (error) {
    console.error('Erro ao listar links:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




