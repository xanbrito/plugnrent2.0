'use client';

import { format, isAfter, isBefore, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import type { Reservation } from '@/types';
import { OTAIconComponent } from '@/lib/ota-icons';

interface UpcomingReservationsProps {
  reservations: Reservation[];
  onReservationClick?: (reservation: Reservation) => void;
}

export default function UpcomingReservations({
  reservations,
  onReservationClick,
}: UpcomingReservationsProps) {
  const today = startOfToday();

  const upcomingReservations = reservations
    .filter((reservation) => {
      const checkinData = reservation.checkin_data as any;
      if (!checkinData?.check_in) return false;
      const checkIn = new Date(checkinData.check_in);
      return isAfter(checkIn, today) || isBefore(checkIn, today);
    })
    .sort((a, b) => {
      const aCheckIn = new Date((a.checkin_data as any)?.check_in || 0);
      const bCheckIn = new Date((b.checkin_data as any)?.check_in || 0);
      return aCheckIn.getTime() - bCheckIn.getTime();
    })
    .slice(0, 5); // Próximas 5 reservas

  if (upcomingReservations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Próximas Reservas</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          Nenhuma reserva próxima
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Próximas Reservas</h3>
      <div className="space-y-4">
        {upcomingReservations.map((reservation) => {
          const checkinData = reservation.checkin_data as any;
          return (
            <div
              key={reservation.id}
              onClick={() => onReservationClick?.(reservation)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{reservation.name || 'Reserva sem nome'}</h4>

                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {checkinData?.check_in
                          ? format(new Date(checkinData.check_in), "dd 'de' MMMM", { locale: ptBR })
                          : 'Data não informada'}
                        {' - '}
                        {checkinData?.check_out
                          ? format(new Date(checkinData.check_out), "dd 'de' MMMM", { locale: ptBR })
                          : 'Data não informada'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <OTAIconComponent channel={reservation.channel} />
                    </div>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reservation.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : reservation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {reservation.status === 'completed'
                    ? 'Concluída'
                    : reservation.status === 'pending'
                    ? 'Pendente'
                    : 'Cancelada'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}




