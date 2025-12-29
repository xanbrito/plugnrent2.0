'use client';

import { X, Calendar, User, MapPin, Link as LinkIcon, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import SuccessMessage from '@/components/ui/SuccessMessage';
import type { Reservation } from '@/types';
import { OTAIconComponent } from '@/lib/ota-icons';

interface ReservationDetailsModalProps {
  reservation: Reservation | null;
  onClose: () => void;
  onEdit?: (reservation: Reservation) => void;
  onDelete?: (reservationId: string) => void;
}

export default function ReservationDetailsModal({
  reservation,
  onClose,
  onEdit,
  onDelete,
}: ReservationDetailsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!reservation) return null;

  const checkinData = reservation.checkin_data as any;
  const checkInLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkin/${reservation.checkin_link_token}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(checkInLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Detalhes da Reserva</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {copied && <SuccessMessage message="Link copiado!" />}

          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Nome</h3>
              <p className="text-gray-600 dark:text-gray-400">{reservation.name || 'Sem nome'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Check-in</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {checkinData?.check_in
                    ? format(new Date(checkinData.check_in), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : 'Não informado'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Check-out</span>
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {checkinData?.check_out
                    ? format(new Date(checkinData.check_out), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : 'Não informado'}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Canal</span>
              </h3>
              <OTAIconComponent channel={reservation.channel} />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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

          {/* Link de Check-in */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-semibold mb-2 flex items-center space-x-2">
              <LinkIcon className="h-4 w-4" />
              <span>Link de Check-in</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={checkInLink}
                readOnly
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Hóspedes */}
          {reservation.guests && Array.isArray(reservation.guests) && reservation.guests.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-semibold mb-4">Hóspedes</h3>
              <div className="space-y-2">
                {(reservation.guests as any[]).map((guest: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-medium">{guest.name || 'Sem nome'}</p>
                    {guest.email && <p className="text-sm text-gray-600 dark:text-gray-400">{guest.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-gray-700">
          {onEdit && (
            <button
              onClick={() => {
                onEdit(reservation);
                onClose();
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir esta reserva?')) {
                  onDelete(reservation.id);
                  onClose();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Excluir
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}




