/**
 * Testes para lib/auth.ts
 * Testing & QA Specialist Agent
 */

import { supabase } from '@/lib/supabase';
import { loginHost, registerHost, logoutHost, getCurrentHost } from '@/lib/auth';

// Mock do Supabase
const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();
const mockSignOut = jest.fn();
const mockGetUser = jest.fn();
const mockGetSession = jest.fn();
const mockFrom = jest.fn();
const mockInsert = jest.fn();
const mockSelect = jest.fn();

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
      getUser: mockGetUser,
      getSession: mockGetSession,
    },
    from: mockFrom,
  },
}));

describe('Auth - Host Authentication', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFrom.mockReturnValue({
      insert: jest.fn(() => ({
        select: jest.fn(),
      })),
    });
  });

  describe('loginHost', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const result = await loginHost('test@example.com', 'password123');

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      mockSignInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      });

      const result = await loginHost('test@example.com', 'wrongpassword');

      expect(result.user).toBeNull();
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('registerHost', () => {
    it('deve registrar novo host com sucesso', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'newuser@example.com',
      };

      mockSignUp.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const mockInsertResult = jest.fn().mockResolvedValueOnce({ error: null });
      mockFrom.mockReturnValueOnce({
        insert: jest.fn(() => ({ 
          select: jest.fn().mockResolvedValueOnce({ error: null })
        })),
      });

      const result = await registerHost('newuser@example.com', 'password123', 'John Doe');

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('deve retornar erro se email já existe', async () => {
      mockSignUp.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'User already registered' },
      });

      const result = await registerHost('existing@example.com', 'password123', 'John Doe');

      expect(result.user).toBeNull();
      expect(result.error).toBe('User already registered');
    });
  });

  describe('logoutHost', () => {
    it('deve fazer logout com sucesso', async () => {
      mockSignOut.mockResolvedValueOnce({
        error: null,
      });

      const result = await logoutHost();

      expect(result.error).toBeNull();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('getCurrentHost', () => {
    it('deve retornar usuário atual se autenticado', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      mockGetUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const result = await getCurrentHost();

      expect(result).toEqual(mockUser);
    });

    it('deve retornar null se não autenticado', async () => {
      mockGetUser.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const result = await getCurrentHost();

      expect(result).toBeNull();
    });
  });
});

