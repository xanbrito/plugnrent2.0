'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import { useGuestAuth } from '@/components/guests/GuestAuthProvider';

export default function HospedeReservasPage() {
  const router = useRouter();
  const { guest, loading: authLoading } = useGuestAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!guest) {
        router.push('/hospede/login');
        return;
      }
      setLoading(false);
    }
  }, [guest, authLoading, router]);

  if (loading || authLoading) {
    return <Loading fullScreen text="Carregando..." />;
  }

  if (!guest) {
    return null;
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Sistema Vibing - Hóspede
          </h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">Olá, {guest.name || guest.email}</span>
            <button
              onClick={() => {
                localStorage.removeItem('guest');
                router.push('/');
              }}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Minhas Reservas</h2>

        <div className="card">
          <p className="text-gray-600">
            Você ainda não possui reservas. Acesse um link de check-in para começar.
          </p>
        </div>
      </main>
    </div>
  );
}

