/**
 * API Route: Envio de emails
 * POST /api/email
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendReservationInviteEmail,
  sendCondominiumInviteEmail,
  sendCondominiumReservationEmail,
  sendPublicReservationLinkEmail,
  sendTemporaryAccountEmail,
  sendCondominiumWelcomeEmail,
} from '@/lib/email-service';
import type { ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    let result;

    switch (type) {
      case 'verification':
        result = await sendVerificationEmail(
          data.email,
          data.name,
          data.token
        );
        break;

      case 'password-reset':
        result = await sendPasswordResetEmail(
          data.email,
          data.name,
          data.token
        );
        break;

      case 'reservation-invite':
        result = await sendReservationInviteEmail(
          data.email,
          data.name,
          data.propertyName,
          data.checkinLink
        );
        break;

      case 'condominium-invite':
        result = await sendCondominiumInviteEmail(
          data.email,
          data.condominiumName,
          data.propertyName,
          data.inviteToken
        );
        break;

      case 'condominium-reservation':
        result = await sendCondominiumReservationEmail(
          data.email,
          data.condominiumName,
          data.propertyName,
          data.reservationDetails,
          data.dashboardLink
        );
        break;

      case 'public-reservation-link':
        result = await sendPublicReservationLinkEmail(
          data.email,
          data.propertyName,
          data.publicLink,
          data.expiresAt
        );
        break;

      case 'temporary-account':
        result = await sendTemporaryAccountEmail(
          data.email,
          data.name,
          data.password,
          data.reservationLink
        );
        break;

      case 'condominium-welcome':
        result = await sendCondominiumWelcomeEmail(
          data.email,
          data.condominiumName
        );
        break;

      default:
        return NextResponse.json<ApiResponse>(
          { success: false, error: 'Tipo de email inválido' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: result.error || 'Erro ao enviar email' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Email enviado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    );
  }
}




