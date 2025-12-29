import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware simples para proteger rotas
 * A autenticação real é feita no lado do cliente com AuthProvider
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/confirm',
    '/condominio/login',
    '/condominio/cadastro',
    '/hospede/login',
    '/hospede/cadastro',
    '/checkin',
  ];

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Permitir todas as rotas por enquanto
  // A proteção real é feita no lado do cliente com AuthProvider
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
