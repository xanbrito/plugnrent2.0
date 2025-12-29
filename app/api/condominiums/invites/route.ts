/**
 * API Route: Gestão de convites de condomínio
 * GET /api/condominiums/invites - Listar convites
 * POST /api/condominiums/invites - Criar convite
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { sendCondominiumInviteEmail } from '@/lib/email-service';
import type { ApiResponse } from '@/types';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar convites do condomínio
    const { data: invites, error } = await supabase
      .from('condominium_invites')
      .select('*')
      .eq('condominium_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Erro ao buscar convites' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { invites },
    });
  } catch (error) {
    console.error('Erro ao listar convites:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}

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
    const { email, property_id } = body;

    if (!email || !property_id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Email e property_id são obrigatórios' },
        { status: 400 }
      );
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Válido por 7 dias

    // Criar convite
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('condominium_invites')
      .insert({
        condominium_id: user.id,
        property_id,
        email: email.toLowerCase(),
        token,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      })
      .select()
      .single();

    if (inviteError || !invite) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Erro ao criar convite' },
        { status: 500 }
      );
    }

    // Buscar dados do condomínio e propriedade
    const { data: condominium } = await supabase
      .from('condominiums')
      .select('name')
      .eq('id', user.id)
      .single();

    const { data: property } = await supabase
      .from('properties')
      .select('space_name')
      .eq('id', property_id)
      .single();

    // Enviar email
    await sendCondominiumInviteEmail(
      email,
      condominium?.name || 'Condomínio',
      property?.space_name || 'Propriedade',
      token
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { invite },
    });
  } catch (error) {
    console.error('Erro ao criar convite:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




