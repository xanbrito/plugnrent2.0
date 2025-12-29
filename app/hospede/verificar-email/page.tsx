'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SuccessMessage from '@/components/ui/SuccessMessage';
import { useGuestAuth } from '@/components/guests/GuestAuthProvider';

export default function VerificarEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { guest } = useGuestAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token]);

  async function verifyEmail() {
    if (!token) {
      setError('Token não fornecido');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implementar verificação real via API
      // Por enquanto, apenas simula
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push('/hospede/perfil');
      }, 3000);
    } catch (err) {
      setError('Erro ao verificar email');
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading fullScreen text="Verificando email..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {success ? (
          <div className="text-center space-y-4">
            <div className="text-6xl">✅</div>
            <h1 className="text-2xl font-bold">Email Verificado!</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Seu email foi verificado com sucesso. Redirecionando...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Verificar Email</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {token
                  ? 'Verificando seu email...'
                  : 'Acesse o link enviado por email para verificar sua conta'}
              </p>
            </div>

            {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

            {!token && (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Não recebeu o email? Verifique sua caixa de spam ou solicite um novo.
                </p>
                <button
                  onClick={() => router.push('/hospede/perfil')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Voltar para perfil
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




