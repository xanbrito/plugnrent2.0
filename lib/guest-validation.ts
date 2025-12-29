/**
 * Validação de dados de hóspedes
 */

import { isValidCPF, cleanCPF } from './cpf-validator';
import type { Guest } from '@/types';

/**
 * Validar dados do hóspede
 */
export interface GuestValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateGuest(guest: Partial<Guest>): GuestValidationResult {
  const errors: string[] = [];

  // Validar nome
  if (!guest.name || guest.name.trim().length < 3) {
    errors.push('Nome deve ter no mínimo 3 caracteres');
  }

  // Validar email
  if (!guest.email) {
    errors.push('Email é obrigatório');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guest.email)) {
      errors.push('Email inválido');
    }
  }

  // Validar CPF se fornecido
  if (guest.cpf) {
    const cleanedCPF = cleanCPF(guest.cpf);
    if (!isValidCPF(cleanedCPF)) {
      errors.push('CPF inválido');
    }
  }

  // Validar RG se fornecido
  if (guest.rg && guest.rg.trim().length < 5) {
    errors.push('RG deve ter no mínimo 5 caracteres');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validar perfil completo do hóspede
 */
export function validateGuestProfile(guest: Partial<Guest>): GuestValidationResult {
  const result = validateGuest(guest);
  const errors = [...result.errors];

  // Campos obrigatórios para perfil completo
  if (!guest.cpf) {
    errors.push('CPF é obrigatório para perfil completo');
  }

  if (!guest.address) {
    errors.push('Endereço é obrigatório para perfil completo');
  }

  if (!guest.city) {
    errors.push('Cidade é obrigatória para perfil completo');
  }

  if (!guest.state) {
    errors.push('Estado é obrigatório para perfil completo');
  }

  if (!guest.zip_code) {
    errors.push('CEP é obrigatório para perfil completo');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Verificar se hóspede pode fazer check-in
 */
export function canGuestCheckIn(guest: Guest | null): boolean {
  if (!guest) return false;

  const validation = validateGuestProfile(guest);
  return validation.valid && guest.status === 'active';
}




