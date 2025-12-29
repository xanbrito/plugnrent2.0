/**
 * Testes para app/api/cep/route.ts
 * Testing & QA Specialist Agent
 */

import { NextRequest } from 'next/server';
import { GET } from '@/app/api/cep/route';

// Mock do fetch global
global.fetch = jest.fn();

describe('API Route: /api/cep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar erro se CEP não for fornecido', async () => {
    const request = new NextRequest('http://localhost:3000/api/cep');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('CEP não fornecido');
  });

  it('deve retornar erro se CEP for inválido', async () => {
    const request = new NextRequest('http://localhost:3000/api/cep?cep=123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('CEP inválido');
  });

  it('deve buscar CEP válido no ViaCEP', async () => {
    const mockResponse = {
      cep: '01310-100',
      logradouro: 'Avenida Paulista',
      complemento: '',
      bairro: 'Bela Vista',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7107',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request = new NextRequest('http://localhost:3000/api/cep?cep=01310100');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://viacep.com.br/ws/01310100/json/'
    );
  });

  it('deve retornar erro se CEP não for encontrado', async () => {
    const mockResponse = { erro: true };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const request = new NextRequest('http://localhost:3000/api/cep?cep=00000000');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toContain('CEP não encontrado');
  });

  it('deve tratar erros de rede', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/cep?cep=01310100');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });
});

