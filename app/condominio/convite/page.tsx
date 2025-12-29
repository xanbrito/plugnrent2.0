'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SuccessMessage from '@/components/ui/SuccessMessage';
import { supabase } from '@/lib/supabase';

export default function CondominioConvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [invite, setInvite] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      setError('Token não fornecido');
      setLoading(false);
      return;
    }

    fetchInvite();
  }, [token]);

  async function fetchInvite() {
    try {
      const { data, error: fetchError } = await supabase
        .from('condominium_invites')
        .select('*, properties(*), condominiums(*)')
        .eq('token', token)
        .eq('status', 'pending')
        .single();

      if (fetchError || !data) {
        setError('Convite não encontrado ou já utilizado');
        setLoading(false);
        return;
      }

      // Verificar se expirou
      const expiresAt = new Date(data.expires_at);
      if (new Date() > expiresAt) {
        setError('Convite expirado');
        setLoading(false);
        return;
      }

      setInvite(data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar convite');
      setLoading(false);
    }
  }

  async function handleAccept() {
    setLoading(true);
    setError('');

    try {
      // Verificar se condomínio já existe
      const { data: existing } = await supabase
        .from('condominiums')
        .select('id')
        .eq('email', invite.email)
        .single();

      if (existing) {
        // Condomínio já existe, apenas vincular propriedade
        const { error: linkError } = await supabase
          .from('condominium_properties')
          .insert({
            condominium_id: existing.id,
            property_id: invite.property_id,
          });

        if (linkError) {
          setError('Erro ao vincular propriedade');
          setLoading(false);
          return;
        }
      } else {
        // Redirecionar para cadastro
        router.push(`/condominio/cadastro?email=${encodeURIComponent(invite.email)}&token=${token}`);
        return;
      }

      // Marcar convite como aceito
      await supabase
        .from('condominium_invites')
        .update({ status: 'accepted' })
        .eq('id', invite.id);

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        router.push('/condominio/login');
      }, 3000);
    } catch (err) {
      setError('Erro ao aceitar convite');
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading fullScreen text="Carregando convite..." />;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h1 className="text-2xl font-bold">Convite aceito!</h1>
          <p className="text-gray-600">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            Convite de Condomínio
          </h1>
        </div>

        {error ? (
          <div className="space-y-4">
            <ErrorMessage message={error} />
            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Voltar para home
              </Link>
            </div>
          </div>
        ) : invite ? (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Propriedade:</strong> {(invite.properties as any)?.space_name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Email:</strong> {invite.email}
              </p>
            </div>

            <button
              onClick={handleAccept}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Aceitar Convite'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}




