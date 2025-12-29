'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Sistema Vibing
            </h1>
          </Link>

          {/* Menu de Navegação e Autenticação */}
          <nav className="flex items-center gap-4">
            {loading ? (
              <div className="text-sm text-gray-400">Carregando...</div>
            ) : !user ? (
              <>
                <Link
                  href="/condominio/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Condomínio
                </Link>
                <Link
                  href="/hospede/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Hóspede
                </Link>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-full font-medium text-sm px-4 py-2 hover:opacity-90 transition-opacity"
                >
                  Cadastrar
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                >
                  Dashboard
                </Link>
                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    Sair
                  </button>
                </form>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}




