'use client';

import Link from 'next/link';

export default function CondominioReservasPage() {
  return (
    <div className="min-h-screen bg-light-gray">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/condominio/dashboard" className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            Sistema Vibing - Condomínio
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Reservas</h2>
        <div className="card">
          <p className="text-gray-600 mb-4">Visualização de reservas em desenvolvimento.</p>
          <Link href="/condominio/dashboard" className="text-primary-blue hover:underline">
            ← Voltar para Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}




