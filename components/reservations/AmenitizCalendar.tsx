'use client';

import ReservationCalendar from './ReservationCalendar';
import type { Reservation } from '@/types';

interface AmenitizCalendarProps {
  reservations: Reservation[];
  onDateClick?: (date: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
  propertyId?: string;
}

/**
 * Calendário estilo Amenitiz
 * Visualização otimizada para gestão de propriedades
 */
export default function AmenitizCalendar(props: AmenitizCalendarProps) {
  return (
    <div className="amenitiz-calendar">
      <ReservationCalendar {...props} />
    </div>
  );
}




