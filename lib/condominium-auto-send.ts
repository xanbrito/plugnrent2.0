/**
 * Sistema de envio automático de reservas para condomínios
 */

import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';
import {
  sendCondominiumReservationEmail,
  sendCondominiumInviteEmail,
} from './email-service';
import crypto from 'crypto';

/**
 * Enviar reserva automaticamente para condomínio vinculado
 */
export async function autoSendReservationToCondominium(
  reservationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar reserva com propriedade
    const { data: reservation, error: resError } = await supabaseAdmin
      .from('reservations')
      .select('*, properties(*)')
      .eq('id', reservationId)
      .single();

    if (resError || !reservation) {
      return { success: false, error: 'Reserva não encontrada' };
    }

    const property = reservation.properties as any;

    // Verificar se propriedade está vinculada a condomínio
    const { data: condominiumProperty, error: cpError } = await supabaseAdmin
      .from('condominium_properties')
      .select('*, condominiums(*)')
      .eq('property_id', reservation.property_id)
      .single();

    if (cpError || !condominiumProperty) {
      // Propriedade não vinculada a condomínio, não fazer nada
      return { success: true };
    }

    const condominium = condominiumProperty.condominiums as any;

    if (!condominium || condominium.status !== 'active') {
      return { success: false, error: 'Condomínio inativo' };
    }

    // Enviar email para condomínio
    const dashboardLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/condominio/dashboard`;

    await sendCondominiumReservationEmail(
      condominium.email,
      condominium.name,
      property.space_name,
      reservation as any,
      dashboardLink
    );

    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar reserva para condomínio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Enviar convite para condomínio não cadastrado
 */
export async function sendCondominiumInvite(
  propertyId: string,
  condominiumEmail: string
): Promise<{ success: boolean; error?: string; token?: string }> {
  try {
    // Verificar se condomínio já existe
    const { data: existingCondominium } = await supabaseAdmin
      .from('condominiums')
      .select('id')
      .eq('email', condominiumEmail.toLowerCase())
      .single();

    if (existingCondominium) {
      // Condomínio já existe, apenas vincular propriedade
      const { error: linkError } = await supabaseAdmin
        .from('condominium_properties')
        .insert({
          condominium_id: existingCondominium.id,
          property_id: propertyId,
        });

      if (linkError) {
        return { success: false, error: 'Erro ao vincular propriedade' };
      }

      return { success: true };
    }

    // Buscar propriedade
    const { data: property } = await supabaseAdmin
      .from('properties')
      .select('space_name, user_id')
      .eq('id', propertyId)
      .single();

    if (!property) {
      return { success: false, error: 'Propriedade não encontrada' };
    }

    // Gerar token de convite
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Válido por 7 dias

    // Criar convite
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from('condominium_invites')
      .insert({
        property_id: propertyId,
        host_id: property.user_id,
        email: condominiumEmail.toLowerCase(),
        token,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      })
      .select()
      .single();

    if (inviteError || !invite) {
      return { success: false, error: 'Erro ao criar convite' };
    }

    // Enviar email de convite
    await sendCondominiumInviteEmail(
      condominiumEmail,
      'Condomínio', // Nome será preenchido no cadastro
      property.space_name,
      token
    );

    return { success: true, token };
  } catch (error) {
    console.error('Erro ao enviar convite:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}




