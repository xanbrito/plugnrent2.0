'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Reservation } from '@/types';

interface ReservationCalendarProps {
  reservations: Reservation[];
  onDateClick?: (date: Date) => void;
  onReservationClick?: (reservation: Reservation) => void;
  propertyId?: string;
}

export default function ReservationCalendar({
  reservations,
  onDateClick,
  onReservationClick,
  propertyId,
}: ReservationCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getReservationsForDate = (date: Date): Reservation[] => {
    return reservations.filter((reservation) => {
      const checkinData = reservation.checkin_data as any;
      if (!checkinData?.check_in || !checkinData?.check_out) return false;

      const checkIn = new Date(checkinData.check_in);
      const checkOut = new Date(checkinData.check_out);
      return date >= checkIn && date <= checkOut;
    });
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysInMonth.map((day) => {
          const dayReservations = getReservationsForDate(day);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick?.(day)}
              className={`min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors ${
                isCurrentDay
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
              }`}
            >
              <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-blue-600' : ''}`}>
                {format(day, 'd')}
              </div>

              <div className="space-y-1">
                {dayReservations.slice(0, 2).map((reservation) => (
                  <div
                    key={reservation.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReservationClick?.(reservation);
                    }}
                    className={`text-xs p-1 rounded ${getStatusColor(reservation.status)} text-white truncate cursor-pointer hover:opacity-80`}
                    title={reservation.name || 'Reserva'}
                  >
                    {reservation.name || 'Reserva'}
                  </div>
                ))}
                {dayReservations.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayReservations.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Concluída</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Pendente</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Cancelada</span>
        </div>
      </div>
    </div>
  );
}




