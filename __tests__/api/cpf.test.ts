/**
 * Testes para app/api/cpf/route.ts
 * Testing & QA Specialist Agent
 */

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/cpf/route';

describe('API Route: /api/cpf', () => {
  it('deve retornar erro se CPF não for fornecido', async () => {
    const request = new NextRequest('http://localhost:3000/api/cpf', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('CPF não fornecido');
  });

  it('deve validar CPF válido', async () => {
    const request = new NextRequest('http://localhost:3000/api/cpf', {
      method: 'POST',
      body: JSON.stringify({ cpf: '11144477735' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.isValid).toBe(true);
    expect(data.data.formatted).toBe('111.444.777-35');
    expect(data.data.cleaned).toBe('11144477735');
  });

  it('deve rejeitar CPF inválido', async () => {
    const request = new NextRequest('http://localhost:3000/api/cpf', {
      method: 'POST',
      body: JSON.stringify({ cpf: '12345678901' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.isValid).toBe(false);
    expect(data.data.formatted).toBeNull();
  });

  it('deve limpar formatação do CPF', async () => {
    const request = new NextRequest('http://localhost:3000/api/cpf', {
      method: 'POST',
      body: JSON.stringify({ cpf: '111.444.777-35' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.cleaned).toBe('11144477735');
  });
});

