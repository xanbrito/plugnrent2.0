'use client';

import ReservationCalendar from './ReservationCalendar';
import type { Reservation } from '@/types';

interface AirbnbStyleCalendarProps {
  reservations: Reservation[];
  onDateClick?: (date: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
  propertyId?: string;
}

/**
 * Calendário com estilo similar ao Airbnb
 * Visualização mais limpa e minimalista
 */
export default function AirbnbStyleCalendar(props: AirbnbStyleCalendarProps) {
  return (
    <div className="airbnb-style-calendar">
      <ReservationCalendar {...props} />
    </div>
  );
}




