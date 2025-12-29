/**
 * Helpers para funcionalidades de condomínios
 */

import { supabase } from './supabase';
import type { Condominium, Property } from '@/types';

/**
 * Verificar se propriedade está vinculada a condomínio
 */
export async function isPropertyLinkedToCondominium(
  propertyId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('condominium_properties')
    .select('id')
    .eq('property_id', propertyId)
    .single();

  return !error && !!data;
}

/**
 * Obter condomínio vinculado à propriedade
 */
export async function getCondominiumByProperty(
  propertyId: string
): Promise<Condominium | null> {
  const { data, error } = await supabase
    .from('condominium_properties')
    .select('*, condominiums(*)')
    .eq('property_id', propertyId)
    .single();

  if (error || !data) return null;

  return (data as any).condominiums as Condominium;
}

/**
 * Obter propriedades vinculadas ao condomínio
 */
export async function getPropertiesByCondominium(
  condominiumId: string
): Promise<Property[]> {
  const { data, error } = await supabase
    .from('condominium_properties')
    .select('*, properties(*)')
    .eq('condominium_id', condominiumId);

  if (error || !data) return [];

  return data.map((item: any) => item.properties as Property);
}

/**
 * Vincular propriedade a condomínio
 */
export async function linkPropertyToCondominium(
  propertyId: string,
  condominiumId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar se já está vinculada
    const { data: existing } = await supabase
      .from('condominium_properties')
      .select('id')
      .eq('property_id', propertyId)
      .single();

    if (existing) {
      // Atualizar vinculação
      const { error: updateError } = await supabase
        .from('condominium_properties')
        .update({ condominium_id: condominiumId })
        .eq('property_id', propertyId);

      if (updateError) {
        return { success: false, error: 'Erro ao atualizar vinculação' };
      }
    } else {
      // Criar nova vinculação
      const { error: insertError } = await supabase
        .from('condominium_properties')
        .insert({
          property_id: propertyId,
          condominium_id: condominiumId,
          created_by: userId,
        });

      if (insertError) {
        return { success: false, error: 'Erro ao vincular propriedade' };
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Desvincular propriedade de condomínio
 */
export async function unlinkPropertyFromCondominium(
  propertyId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('condominium_properties')
      .delete()
      .eq('property_id', propertyId);

    if (error) {
      return { success: false, error: 'Erro ao desvincular propriedade' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}




