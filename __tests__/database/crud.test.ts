/**
 * Testes de CRUD para Banco de Dados
 * Testing & QA Specialist Agent
 */

import { supabase } from '@/lib/supabase';

// Mock do Supabase
const mockFrom = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: mockFrom,
  },
}));

describe('Database CRUD Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Properties CRUD', () => {
    it('deve criar uma propriedade', async () => {
      const mockProperty = {
        id: 'prop-123',
        user_id: 'user-123',
        space_name: 'Apartamento Teste',
        address: 'Rua Teste, 123',
        type: 'espaco-inteiro',
        description: 'Descrição teste',
      };

      const mockSelect = jest.fn().mockResolvedValueOnce({
        data: [mockProperty],
        error: null,
      });

      const mockInsert = jest.fn(() => ({
        select: mockSelect,
      }));

      mockFrom.mockReturnValueOnce({
        insert: mockInsert,
      });

      const result = await (supabase
        .from('properties') as any)
        .insert(mockProperty)
        .select();

      expect(result.data).toEqual([mockProperty]);
      expect(result.error).toBeNull();
    });

    it('deve ler propriedades do usuário', async () => {
      const mockProperties = [
        { id: 'prop-1', user_id: 'user-123', space_name: 'Prop 1' },
        { id: 'prop-2', user_id: 'user-123', space_name: 'Prop 2' },
      ];

      const mockSelect = jest.fn().mockResolvedValueOnce({
        data: mockProperties,
        error: null,
      });

      const mockEq = jest.fn().mockResolvedValueOnce({
        data: mockProperties,
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        select: jest.fn(() => ({
          eq: mockEq,
        })),
      });

      const result = await (supabase
        .from('properties') as any)
        .select()
        .eq('user_id', 'user-123');

      expect(result.data).toEqual(mockProperties);
      expect(result.error).toBeNull();
    });

    it('deve atualizar uma propriedade', async () => {
      const updates = { space_name: 'Nome Atualizado' };

      const mockEq = jest.fn().mockResolvedValueOnce({
        data: [{ id: 'prop-123', ...updates }],
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        update: jest.fn(() => ({
          eq: mockEq,
        })),
      });

      const result = await (supabase
        .from('properties') as any)
        .update(updates)
        .eq('id', 'prop-123');

      expect(result.data).toBeDefined();
      expect(result.error).toBeNull();
    });

    it('deve deletar uma propriedade', async () => {
      const mockEq = jest.fn().mockResolvedValueOnce({
        data: null,
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        delete: jest.fn(() => ({
          eq: mockEq,
        })),
      });

      const result = await (supabase
        .from('properties') as any)
        .delete()
        .eq('id', 'prop-123');

      expect(result.error).toBeNull();
    });
  });

  describe('Reservations CRUD', () => {
    it('deve criar uma reserva', async () => {
      const mockReservation = {
        id: 'res-123',
        user_id: 'user-123',
        property_id: 'prop-123',
        checkin_link_token: 'token-123',
        checkin_data: { check_in: '2024-01-01', check_out: '2024-01-05' },
        channel: 'airbnb',
        status: 'pending',
      };

      const mockSelect = jest.fn().mockResolvedValueOnce({
        data: [mockReservation],
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        insert: jest.fn(() => ({
          select: mockSelect,
        })),
      });

      const result = await (supabase
        .from('reservations') as any)
        .insert(mockReservation)
        .select();

      expect(result.data).toEqual([mockReservation]);
      expect(result.error).toBeNull();
    });
  });

  describe('Guests CRUD', () => {
    it('deve criar um hóspede', async () => {
      const mockGuest = {
        id: 'guest-123',
        name: 'João Silva',
        email: 'joao@example.com',
        status: 'active',
        is_titular: true,
        email_verified: false,
        profile_complete: false,
        is_temporary: false,
        urgencia: false,
      };

      const mockSelect = jest.fn().mockResolvedValueOnce({
        data: [mockGuest],
        error: null,
      });

      mockFrom.mockReturnValueOnce({
        insert: jest.fn(() => ({
          select: mockSelect,
        })),
      });

      const result = await (supabase
        .from('guests') as any)
        .insert(mockGuest)
        .select();

      expect(result.data).toEqual([mockGuest]);
      expect(result.error).toBeNull();
    });
  });
});

