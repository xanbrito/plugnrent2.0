'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SuccessMessage from '@/components/ui/SuccessMessage';
import FormField from '@/components/ui/FormField';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token não fornecido');
      setValidating(false);
      return;
    }

    // Validar token
    fetch('/api/auth/validate-reset-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTokenValid(true);
        } else {
          setError(data.error || 'Token inválido ou expirado');
        }
        setValidating(false);
      })
      .catch(() => {
        setError('Erro ao validar token');
        setValidating(false);
      });
  }, [token]);

  const validatePassword = (value: string): string | null => {
    if (!value) return 'Senha é obrigatória';
    if (value.length < 6) return 'Senha deve ter no mínimo 6 caracteres';
    return null;
  };

  const validateConfirmPassword = (value: string): string | null => {
    if (!value) return 'Confirmação de senha é obrigatória';
    if (value !== password) return 'As senhas não coincidem';
    return null;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/update-password-with-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Erro ao atualizar senha');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err) {
      setError('Erro ao processar solicitação. Tente novamente.');
      setLoading(false);
    }
  }

  if (validating) {
    return <Loading fullScreen text="Validando token..." />;
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <ErrorMessage message={error || 'Token inválido ou expirado'} />
          <div className="mt-6 text-center space-y-2">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Solicitar novo link
            </Link>
            <div>
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
              >
                Voltar para login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <SuccessMessage message="Senha atualizada com sucesso! Redirecionando para login..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Redefinir Senha
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Digite sua nova senha
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

            <FormField
              label="Nova Senha"
              name="password"
              type="password"
              value={password}
              onChange={setPassword}
              required
              placeholder="Mínimo 6 caracteres"
              validate={validatePassword}
            />

            <FormField
              label="Confirmar Senha"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              placeholder="Digite a senha novamente"
              validate={validateConfirmPassword}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
            >
              Voltar para login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




