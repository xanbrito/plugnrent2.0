'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin, User, Phone, Mail } from 'lucide-react';
import { OTAIconComponent } from '@/lib/ota-icons';

export default function CondominioReservaPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservation, setReservation] = useState<any>(null);
  const [publicLink, setPublicLink] = useState<any>(null);

  useEffect(() => {
    if (token) {
      loadReservation();
    }
  }, [token]);

  async function loadReservation() {
    try {
      // Buscar link público
      const { data: linkData, error: linkError } = await supabase
        .from('reservation_public_links')
        .select('*, reservations(*, properties(*))')
        .eq('token', token)
        .single();

      if (linkError || !linkData) {
        setError('Link não encontrado ou expirado');
        setLoading(false);
        return;
      }

      // Verificar se expirou
      const expiresAt = new Date(linkData.expires_at);
      if (new Date() > expiresAt) {
        setError('Link expirado');
        setLoading(false);
        return;
      }

      setPublicLink(linkData);
      setReservation(linkData.reservations);
      setLoading(false);

      // Atualizar contador de acessos
      await supabase
        .from('reservation_public_links')
        .update({
          access_count: (linkData.access_count || 0) + 1,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('id', linkData.id);
    } catch (err) {
      setError('Erro ao carregar reserva');
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading fullScreen text="Carregando reserva..." />;
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <ErrorMessage message={error || 'Reserva não encontrada'} />
        </div>
      </div>
    );
  }

  const checkinData = reservation.checkin_data as any;
  const property = reservation.properties as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Detalhes da Reserva</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {property?.space_name || 'Propriedade'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações da Reserva */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Informações da Reserva</h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nome</p>
                  <p className="font-medium">{reservation.name || 'Sem nome'}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Check-in</p>
                    <p className="font-medium">
                      {checkinData?.check_in
                        ? format(new Date(checkinData.check_in), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                        : 'Não informado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Check-out</p>
                    <p className="font-medium">
                      {checkinData?.check_out
                        ? format(new Date(checkinData.check_out), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                        : 'Não informado'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Canal</p>
                  <OTAIconComponent channel={reservation.channel} />
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
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
            </div>

            {/* Informações da Propriedade */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Propriedade</h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nome</p>
                  <p className="font-medium">{property?.space_name || 'N/A'}</p>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Endereço</p>
                    <p className="font-medium">{property?.address || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tipo</p>
                  <p className="font-medium">
                    {property?.type === 'espaco-inteiro' ? 'Espaço Inteiro' : 'Quarto'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hóspedes */}
          {reservation.guests && Array.isArray(reservation.guests) && reservation.guests.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-4">Hóspedes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(reservation.guests as any[]).map((guest: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-medium mb-2">{guest.name || 'Sem nome'}</p>
                    {guest.email && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                        <span>{guest.email}</span>
                      </div>
                    )}
                    {guest.phone && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <Phone className="h-4 w-4" />
                        <span>{guest.phone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => router.push('/condominio/dashboard')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Voltar para Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




