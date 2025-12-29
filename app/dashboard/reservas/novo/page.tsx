'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SuccessMessage from '@/components/ui/SuccessMessage';
import FormField from '@/components/ui/FormField';
import ReservationCalendar from '@/components/reservations/ReservationCalendar';
import type { Property, Reservation } from '@/types';
import crypto from 'crypto';

export default function NovaReservaPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    channel: 'direct',
    check_in: '',
    check_out: '',
    guests: [] as Array<{ name: string; email: string }>,
  });

  const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadProperties();
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (selectedProperty) {
      loadReservations();
    }
  }, [selectedProperty]);

  async function loadProperties() {
    if (!user?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('space_name');

      if (fetchError) {
        setError('Erro ao carregar propriedades');
        setLoading(false);
        return;
      }

      setProperties((data as Property[]) || []);
      if (data && data.length > 0) {
        setSelectedProperty(data[0].id);
      }
      setLoading(false);
    } catch (err) {
      setError('Erro ao processar solicitação');
      setLoading(false);
    }
  }

  async function loadReservations() {
    try {
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select('*')
        .eq('property_id', selectedProperty)
        .eq('status', 'pending');

      if (!fetchError && data) {
        setExistingReservations((data as Reservation[]) || []);
      }
    } catch (err) {
      console.error('Erro ao carregar reservas:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    if (!selectedProperty || !formData.check_in || !formData.check_out) {
      setError('Preencha todos os campos obrigatórios');
      setSaving(false);
      return;
    }

    try {
      // Gerar token único para check-in
      const checkinToken = crypto.randomUUID();

      if (!user?.id) {
        setError('Usuário não autenticado');
        setSaving(false);
        return;
      }

      const reservationData = {
        user_id: user.id,
        property_id: selectedProperty,
        checkin_link_token: checkinToken,
        checkin_data: {
          check_in: formData.check_in,
          check_out: formData.check_out,
        },
        guests: formData.guests,
        channel: formData.channel,
        status: 'pending' as const,
        name: formData.name || null,
      };

      const { data: newReservation, error: insertError } = await supabase
        .from('reservations')
        .insert(reservationData)
        .select()
        .single();

      if (insertError || !newReservation) {
        setError('Erro ao criar reserva');
        setSaving(false);
        return;
      }

      // Enviar automaticamente para condomínio se vinculado
      const { autoSendReservationToCondominium } = await import('@/lib/condominium-auto-send');
      await autoSendReservationToCondominium(newReservation.id);

      setSuccess('Reserva criada com sucesso!');
      setTimeout(() => {
        router.push(`/dashboard/reservas/${newReservation.id}`);
      }, 2000);
    } catch (err) {
      setError('Erro ao processar reserva');
      setSaving(false);
    }
  }

  const addGuest = () => {
    setFormData({
      ...formData,
      guests: [...formData.guests, { name: '', email: '' }],
    });
  };

  const removeGuest = (index: number) => {
    setFormData({
      ...formData,
      guests: formData.guests.filter((_, i) => i !== index),
    });
  };

  const updateGuest = (index: number, field: 'name' | 'email', value: string) => {
    const updatedGuests = [...formData.guests];
    updatedGuests[index][field] = value;
    setFormData({ ...formData, guests: updatedGuests });
  };

  if (authLoading || loading) {
    return <Loading fullScreen text="Carregando..." />;
  }

    if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Nova Reserva</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Crie uma nova reserva para sua propriedade
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
            {success && <SuccessMessage message={success} />}

            <div>
              <label className="block text-sm font-medium mb-2">
                Propriedade <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Selecione uma propriedade</option>
                {properties.map((prop) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.space_name}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Nome da Reserva"
              name="name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              placeholder="Ex: Reserva Família Silva"
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Canal <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.channel}
                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                required
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="direct">Direto</option>
                <option value="airbnb">Airbnb</option>
                <option value="booking">Booking.com</option>
                <option value="expedia">Expedia</option>
                <option value="vrbo">VRBO</option>
                <option value="other">Outro</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Check-in"
                name="check_in"
                type="date"
                value={formData.check_in}
                onChange={(value) => setFormData({ ...formData, check_in: value })}
                required
              />

              <FormField
                label="Check-out"
                name="check_out"
                type="date"
                value={formData.check_out}
                onChange={(value) => setFormData({ ...formData, check_out: value })}
                required
              />
            </div>

            {/* Hóspedes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Hóspedes</label>
                <button
                  type="button"
                  onClick={addGuest}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Adicionar Hóspede
                </button>
              </div>
              <div className="space-y-2">
                {formData.guests.map((guest, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={guest.name}
                      onChange={(e) => updateGuest(index, 'name', e.target.value)}
                      placeholder="Nome"
                      className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm"
                    />
                    <input
                      type="email"
                      value={guest.email}
                      onChange={(e) => updateGuest(index, 'email', e.target.value)}
                      placeholder="Email"
                      className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeGuest(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'Criando...' : 'Criar Reserva'}
            </button>
          </form>
        </div>

        {/* Calendário */}
        {selectedProperty && (
          <div>
            <ReservationCalendar
              reservations={existingReservations}
              propertyId={selectedProperty}
              onDateClick={(date) => {
                if (!formData.check_in) {
                  setFormData({ ...formData, check_in: format(date, 'yyyy-MM-dd') });
                } else if (!formData.check_out && date > new Date(formData.check_in)) {
                  setFormData({ ...formData, check_out: format(date, 'yyyy-MM-dd') });
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

