'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import FormField from '@/components/ui/FormField';
import { supabase } from '@/lib/supabase';

export default function CheckinPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservation, setReservation] = useState<any>(null);
  const [step, setStep] = useState<'loading' | 'login' | 'form' | 'success'>('loading');
  
  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [isNewGuest, setIsNewGuest] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Token não fornecido');
      setLoading(false);
      return;
    }

    // Buscar reserva pelo token
    fetchReservation();
  }, [token]);

  async function fetchReservation() {
    try {
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select('*, properties(*)')
        .eq('checkin_link_token', token)
        .single();

      if (fetchError || !data) {
        setError('Reserva não encontrada ou link inválido');
        setLoading(false);
        return;
      }

      setReservation(data);
      setStep('login');
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar reserva');
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/guests/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        if (data.error?.includes('não cadastrado') || data.error?.includes('incorretos')) {
          setIsNewGuest(true);
          setStep('form');
        } else {
          setError(data.error || 'Erro ao fazer login');
        }
        return;
      }

      // Login bem-sucedido, ir para formulário
      setName(data.data.guest.name || '');
      setEmail(data.data.guest.email || email);
      setStep('form');
    } catch (err) {
      setError('Erro ao processar login');
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!password || password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      const response = await fetch('/api/guests/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Erro ao criar conta');
        return;
      }

      // Registro bem-sucedido, continuar com formulário
      setStep('form');
    } catch (err) {
      setError('Erro ao processar registro');
    }
  }

  async function handleSubmitCheckin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name || !cpf) {
      setError('Nome e CPF são obrigatórios');
      return;
    }

    setLoading(true);

    try {
      // Atualizar ou criar hóspede
      const guestData = {
        reservation_id: reservation.id,
        name,
        email,
        cpf: cpf.replace(/\D/g, ''),
        rg: rg || null,
        status: 'active' as const,
        is_titular: true,
        profile_complete: true,
      };

      const { error: guestError } = await supabase
        .from('guests')
        .upsert(guestData, { onConflict: 'email' });

      if (guestError) {
        setError('Erro ao salvar dados do hóspede');
        setLoading(false);
        return;
      }

      // Atualizar reserva
      const { error: resError } = await supabase
        .from('reservations')
        .update({ status: 'completed' })
        .eq('id', reservation.id);

      if (resError) {
        console.error('Erro ao atualizar reserva:', resError);
      }

      setStep('success');
      setLoading(false);
    } catch (err) {
      setError('Erro ao processar check-in');
      setLoading(false);
    }
  }

  const validateCPF = (value: string): string | null => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length !== 11) return 'CPF deve ter 11 dígitos';
    return null;
  };

  if (loading && step === 'loading') {
    return <Loading fullScreen text="Carregando reserva..." />;
  }

  if (error && !reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h1 className="text-2xl font-bold">Check-in realizado com sucesso!</h1>
          <p className="text-gray-600">
            Seus dados foram registrados. O anfitrião será notificado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Check-in
            </h1>
            {reservation && (
              <p className="text-gray-600 mt-2">
                {reservation.properties?.space_name || 'Reserva'}
              </p>
            )}
          </div>

          {step === 'login' && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-4">
                  Faça login ou crie uma conta para continuar
                </p>
              </div>

              <form onSubmit={isNewGuest ? handleRegister : handleLogin} className="space-y-4">
                {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                  placeholder="seu@email.com"
                />

                {isNewGuest && (
                  <FormField
                    label="Nome"
                    name="name"
                    value={name}
                    onChange={setName}
                    required
                    placeholder="Seu nome completo"
                  />
                )}

                <FormField
                  label="Senha"
                  name="password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  required
                  placeholder="••••••••"
                />

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {isNewGuest ? 'Criar conta e continuar' : 'Entrar e continuar'}
                </button>

                {!isNewGuest && (
                  <button
                    type="button"
                    onClick={() => setIsNewGuest(true)}
                    className="w-full text-sm text-blue-600 hover:underline"
                  >
                    Não tenho conta. Criar nova conta.
                  </button>
                )}
              </form>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleSubmitCheckin} className="space-y-4">
              {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

              <FormField
                label="Nome Completo"
                name="name"
                value={name}
                onChange={setName}
                required
                placeholder="Seu nome completo"
              />

              <FormField
                label="CPF"
                name="cpf"
                value={cpf}
                onChange={setCpf}
                required
                placeholder="000.000.000-00"
                validate={validateCPF}
              />

              <FormField
                label="RG (opcional)"
                name="rg"
                value={rg}
                onChange={setRg}
                placeholder="00.000.000-0"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Finalizar Check-in'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}




