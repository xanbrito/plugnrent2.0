'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SuccessMessage from '@/components/ui/SuccessMessage';
import FormField from '@/components/ui/FormField';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string): string | null => {
    if (!value) return 'Email é obrigatório';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Email inválido';
    return null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Erro ao solicitar reset de senha');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('Erro ao processar solicitação. Tente novamente.');
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading fullScreen text="Processando..." />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Esqueceu sua senha?
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Digite seu email e enviaremos um link para redefinir sua senha
            </p>
          </div>

          {success ? (
            <div className="space-y-4">
              <SuccessMessage message="Se o email existir, você receberá um link para redefinir sua senha. Verifique sua caixa de entrada." />
              <Link
                href="/auth/login"
                className="block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Voltar para login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

              <FormField
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={setEmail}
                required
                placeholder="seu@email.com"
                validate={validateEmail}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar link de recuperação
              </button>
            </form>
          )}

          <div className="text-center space-y-2">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Voltar para login
            </Link>
            <div>
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
              >
                Voltar para home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




