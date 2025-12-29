'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import ReservationDetailsModal from '@/components/reservations/ReservationDetailsModal';
import type { Reservation } from '@/types';

export default function ReservaDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const reservationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    if (reservationId) {
      loadReservation();
    }
  }, [reservationId]);

  async function loadReservation() {
    try {
      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select('*, properties(*)')
        .eq('id', reservationId)
        .single();

      if (fetchError || !data) {
        setError('Reserva não encontrada');
        setLoading(false);
        return;
      }

      setReservation(data as Reservation);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar reserva');
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!reservation) return;

    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservation.id);

      if (error) {
        setError('Erro ao excluir reserva');
        return;
      }

      router.push('/dashboard/reservas');
    } catch (err) {
      setError('Erro ao processar exclusão');
    }
  }

  if (loading) {
    return <Loading fullScreen text="Carregando reserva..." />;
  }

  if (error || !reservation) {
    return (
      <div className="space-y-6">
        <ErrorMessage message={error || 'Reserva não encontrada'} />
        <button
          onClick={() => router.push('/dashboard/reservas')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Detalhes da Reserva</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {reservation.name || 'Reserva sem nome'}
        </p>
      </div>

      <ReservationDetailsModal
        reservation={reservation}
        onClose={() => router.push('/dashboard/reservas')}
        onDelete={handleDelete}
      />
    </div>
  );
}




