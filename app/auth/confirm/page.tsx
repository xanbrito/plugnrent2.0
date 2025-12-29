'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SuccessMessage from '@/components/ui/SuccessMessage';

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type') || 'host';

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token não fornecido');
      return;
    }

    // Confirmar email via Supabase
    // Por enquanto, apenas simula confirmação
    // TODO: Implementar confirmação real via Supabase
    setTimeout(() => {
      setStatus('success');
      setMessage('Email confirmado com sucesso!');
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        if (type === 'condominium') {
          router.push('/condominio/login');
        } else if (type === 'guest') {
          router.push('/hospede/login');
        } else {
          router.push('/dashboard');
        }
      }, 3000);
    }, 1000);
  }, [token, type, router]);

  if (status === 'loading') {
    return <Loading fullScreen text="Confirmando email..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {status === 'success' ? (
          <div className="space-y-4">
            <SuccessMessage message={message} />
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Redirecionando...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <ErrorMessage message={message || 'Erro ao confirmar email'} />
            <div className="text-center space-y-2">
              <Link
                href="/auth/login"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Voltar para login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




