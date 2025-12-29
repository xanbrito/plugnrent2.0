'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isCondominiumAuthenticated, getCurrentCondominium } from '@/lib/condominium-auth';
import Link from 'next/link';

export default function CondominioDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [condominium, setCondominium] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      const authenticated = await isCondominiumAuthenticated();
      if (!authenticated) {
        router.push('/condominio/login');
        return;
      }

      const current = await getCurrentCondominium();
      setCondominium(current);
      setLoading(false);
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Sistema Vibing - Condomínio
          </h1>
          <div className="flex gap-4">
            <span className="text-gray-600">{condominium?.name}</span>
            <button
              onClick={async () => {
                const { logoutCondominium } = await import('@/lib/condominium-auth');
                await logoutCondominium();
                router.push('/');
              }}
              className="text-red-600 hover:underline"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Dashboard do Condomínio</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/condominio/reservas"
            className="card hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">Reservas</h3>
            <p className="text-gray-600">Ver todas as reservas</p>
          </Link>

          <div className="card">
            <h3 className="text-xl font-semibold mb-2">Informações</h3>
            <p className="text-gray-600">Email: {condominium?.email}</p>
            <p className="text-gray-600">Status: {condominium?.status}</p>
          </div>
        </div>
      </main>
    </div>
  );
}




