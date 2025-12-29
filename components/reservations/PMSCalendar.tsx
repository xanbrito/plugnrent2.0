'use client';

import ReservationCalendar from './ReservationCalendar';
import type { Reservation } from '@/types';

interface PMSCalendarProps {
  reservations: Reservation[];
  onDateClick?: (date: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
  propertyId?: string;
}

/**
 * Calendário estilo PMS (Property Management System)
 * Visualização mais técnica e detalhada
 */
export default function PMSCalendar(props: PMSCalendarProps) {
  return (
    <div className="pms-calendar">
      <ReservationCalendar {...props} />
    </div>
  );
}




