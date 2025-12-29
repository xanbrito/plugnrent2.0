import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <h1 className="text-5xl font-bold mb-6">Sistema Vibing</h1>
        <p className="text-xl mb-8">Plataforma completa de gestão de propriedades de hospedagem</p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/auth/login?user_type=host"
            className="bg-white text-primary-blue px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Área do Anfitrião
          </Link>
          <Link
            href="/auth/login?user_type=condominium"
            className="bg-white text-primary-blue px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Área do Condomínio
          </Link>
          <Link
            href="/auth/login?user_type=guest"
            className="bg-white text-primary-blue px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Área do Hóspede
          </Link>
        </div>
      </div>
    </div>
  );
}

