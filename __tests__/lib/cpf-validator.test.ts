/**
 * Testes para lib/cpf-validator.ts
 * Testing & QA Specialist Agent
 */

import { cleanCPF, isValidCPF, formatCPF } from '@/lib/cpf-validator';

describe('CPF Validator', () => {
  describe('cleanCPF', () => {
    it('deve remover formatação do CPF', () => {
      expect(cleanCPF('123.456.789-00')).toBe('12345678900');
      expect(cleanCPF('12345678900')).toBe('12345678900');
      expect(cleanCPF('123 456 789 00')).toBe('12345678900');
    });

    it('deve remover todos os caracteres não numéricos', () => {
      expect(cleanCPF('abc123.456.789-00def')).toBe('12345678900');
    });
  });

  describe('isValidCPF', () => {
    it('deve validar CPF válido', () => {
      // CPF válido de exemplo: 123.456.789-09
      expect(isValidCPF('12345678909')).toBe(true);
      // Outro CPF válido: 111.444.777-35
      expect(isValidCPF('11144477735')).toBe(true);
    });

    it('deve rejeitar CPF com menos de 11 dígitos', () => {
      expect(isValidCPF('1234567890')).toBe(false);
      expect(isValidCPF('123')).toBe(false);
    });

    it('deve rejeitar CPF com todos os dígitos iguais', () => {
      expect(isValidCPF('11111111111')).toBe(false);
      expect(isValidCPF('00000000000')).toBe(false);
      expect(isValidCPF('99999999999')).toBe(false);
    });

    it('deve rejeitar CPF inválido', () => {
      expect(isValidCPF('12345678901')).toBe(false);
    });
  });

  describe('formatCPF', () => {
    it('deve formatar CPF corretamente', () => {
      expect(formatCPF('12345678900')).toBe('123.456.789-00');
    });

    it('deve retornar CPF original se não tiver 11 dígitos', () => {
      expect(formatCPF('123')).toBe('123');
      expect(formatCPF('1234567890')).toBe('1234567890');
    });

    it('deve formatar CPF já formatado', () => {
      expect(formatCPF('123.456.789-00')).toBe('123.456.789-00');
    });
  });
});
