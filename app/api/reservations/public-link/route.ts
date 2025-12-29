/**
 * API Route: Gerar link público de reserva
 * POST /api/reservations/public-link
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendPublicReservationLinkEmail } from '@/lib/email-service';
import type { ApiResponse } from '@/types';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reservation_id, email, expires_in_days = 7 } = body;

    if (!reservation_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'reservation_id é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a reserva pertence ao usuário
    const { data: reservation, error: resError } = await supabase
      .from('reservations')
      .select('*, properties(*)')
      .eq('id', reservation_id)
      .eq('user_id', user.id)
      .single();

    if (resError || !reservation) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Reserva não encontrada' },
        { status: 404 }
      );
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expires_in_days);

    // Criar link público
    const { data: publicLink, error: linkError } = await supabaseAdmin
      .from('reservation_public_links')
      .insert({
        reservation_id,
        token,
        email: email || null,
        expires_at: expiresAt.toISOString(),
        created_by: user.id,
      })
      .select()
      .single();

    if (linkError || !publicLink) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Erro ao criar link público' },
        { status: 500 }
      );
    }

    const linkUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkin/${token}`;

    // Enviar email se fornecido
    if (email) {
      await sendPublicReservationLinkEmail(
        email,
        (reservation.properties as any)?.space_name || 'Propriedade',
        linkUrl,
        expiresAt.toISOString()
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        link: linkUrl,
        token,
        expires_at: expiresAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Erro ao gerar link público:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




