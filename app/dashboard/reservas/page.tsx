'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Calendar, Filter } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import ReservationCalendar from '@/components/reservations/ReservationCalendar';
import ReservationDetailsModal from '@/components/reservations/ReservationDetailsModal';
import UpcomingReservations from '@/components/reservations/UpcomingReservations';
import type { Reservation } from '@/types';

export default function ReservasPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadReservations();
    }
  }, [user, authLoading, filter, router]);

  async function loadReservations() {
    if (!user?.id) return;

    try {
      let query = supabase
        .from('reservations')
        .select('*, properties(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError('Erro ao carregar reservas');
        setLoading(false);
        return;
      }

      setReservations((data as Reservation[]) || []);
      setLoading(false);
    } catch (err) {
      setError('Erro ao processar solicitação');
      setLoading(false);
    }
  }

  async function handleDelete(reservationId: string) {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationId);

      if (error) {
        setError('Erro ao excluir reserva');
        return;
      }

      setReservations(reservations.filter((r) => r.id !== reservationId));
      setSelectedReservation(null);
    } catch (err) {
      setError('Erro ao processar exclusão');
    }
  }

  if (authLoading || loading) {
    return <Loading fullScreen text="Carregando reservas..." />;
  }

    if (!user) {
    return null;
  }

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reservas</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie todas as suas reservas
          </p>
        </div>
        <Link
          href="/dashboard/reservas/novo"
          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Reserva</span>
        </Link>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {/* Filtros */}
      <div className="flex items-center space-x-2">
        <Filter className="h-5 w-5 text-gray-600" />
        <div className="flex gap-2">
          {(['all', 'pending', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-pink-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {status === 'all'
                ? 'Todas'
                : status === 'pending'
                ? 'Pendentes'
                : status === 'completed'
                ? 'Concluídas'
                : 'Canceladas'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <div className="lg:col-span-2">
          <ReservationCalendar
            reservations={filteredReservations}
            onReservationClick={setSelectedReservation}
          />
        </div>

        {/* Próximas Reservas */}
        <div>
          <UpcomingReservations
            reservations={reservations}
            onReservationClick={setSelectedReservation}
          />
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedReservation && (
        <ReservationDetailsModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onDelete={handleDelete}
          onEdit={(reservation) => {
            router.push(`/dashboard/reservas/${reservation.id}`);
          }}
        />
      )}
    </div>
  );
}


