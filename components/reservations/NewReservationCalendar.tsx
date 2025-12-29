'use client';

import ReservationCalendar from './ReservationCalendar';
import type { Reservation } from '@/types';

interface NewReservationCalendarProps {
  reservations: Reservation[];
  onDateClick?: (date: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
  propertyId?: string;
}

/**
 * Novo calendário de reservas
 * Versão atualizada com melhorias de UX
 */
export default function NewReservationCalendar(props: NewReservationCalendarProps) {
  return (
    <div className="new-reservation-calendar">
      <ReservationCalendar {...props} />
    </div>
  );
}




