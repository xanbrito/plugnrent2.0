'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SuccessMessage from '@/components/ui/SuccessMessage';
import FormField from '@/components/ui/FormField';

export default function HospedePerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [guest, setGuest] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    rg: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
  });

  useEffect(() => {
    loadGuest();
  }, []);

  async function loadGuest() {
    try {
      const guestStr = localStorage.getItem('guest');
      if (!guestStr) {
        router.push('/hospede/login');
        return;
      }

      const guestData = JSON.parse(guestStr);
      setGuest(guestData);

      // Buscar dados completos
      const response = await fetch(`/api/guests/profile`, {
        headers: {
          'x-guest-id': guestData.id,
        },
      });

      const data = await response.json();
      if (data.success && data.data.guest) {
        const g = data.data.guest;
        setFormData({
          name: g.name || '',
          email: g.email || '',
          cpf: g.cpf || '',
          rg: g.rg || '',
          phone: g.phone || '',
          address: g.address || '',
          city: g.city || '',
          state: g.state || '',
          zip_code: g.zip_code || '',
        });
      }

      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar perfil');
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/guests/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-guest-id': guest.id,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Erro ao atualizar perfil');
        setSaving(false);
        return;
      }

      // Atualizar localStorage
      localStorage.setItem('guest', JSON.stringify(data.data.guest));
      setSuccess('Perfil atualizado com sucesso!');
      setSaving(false);
    } catch (err) {
      setError('Erro ao processar atualização');
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading fullScreen text="Carregando perfil..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              Meu Perfil
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
              Atualize suas informações pessoais
            </p>
          </div>

          {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
          {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              required
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={(value) => setFormData({ ...formData, cpf: value })}
                placeholder="000.000.000-00"
              />

              <FormField
                label="RG"
                name="rg"
                value={formData.rg}
                onChange={(value) => setFormData({ ...formData, rg: value })}
                placeholder="00.000.000-0"
              />
            </div>

            <FormField
              label="Telefone"
              name="phone"
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              placeholder="(00) 00000-0000"
            />

            <FormField
              label="Endereço"
              name="address"
              value={formData.address}
              onChange={(value) => setFormData({ ...formData, address: value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={(value) => setFormData({ ...formData, city: value })}
              />

              <FormField
                label="Estado"
                name="state"
                value={formData.state}
                onChange={(value) => setFormData({ ...formData, state: value })}
              />

              <FormField
                label="CEP"
                name="zip_code"
                value={formData.zip_code}
                onChange={(value) => setFormData({ ...formData, zip_code: value })}
                placeholder="00000-000"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}




