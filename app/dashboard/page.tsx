'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { Home, Calendar, Settings, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import UpcomingReservations from '@/components/reservations/UpcomingReservations';
import type { Reservation, Property } from '@/types';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    properties: 0,
    reservations: 0,
    upcomingReservations: 0,
  });
  const [upcomingReservations, setUpcomingReservations] = useState<Reservation[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  // Timeout de segurança
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('Dashboard: Timeout de segurança - forçando parada do loading');
      setLoading(false);
    }, 8000);

    return () => clearTimeout(timeout);
  }, []);

  const loadDashboardData = useCallback(async () => {
    if (loadingRef.current) {
      console.log('Dashboard: Já está carregando, ignorando chamada duplicada');
      return;
    }
    
    if (!user?.id) {
      console.warn('Dashboard: Usuário não disponível para carregar dados');
      setLoading(false);
      return;
    }
    
    loadingRef.current = true;
    console.log('Carregando dados do dashboard para usuário:', user.id);
    
    const userId = user.id;
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao carregar dados do Supabase')), 10000)
      );

      const dataPromise = Promise.all([
        supabase
          .from('properties')
          .select('id')
          .eq('user_id', userId)
          .limit(1000),
        supabase
          .from('reservations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(100),
      ]);

      const results = await Promise.race([dataPromise, timeoutPromise]) as any;
      const [{ data: properties, error: propsError }, { data: reservations, error: resError }] = results;

      if (propsError || resError) {
        const errorMsg = propsError?.message || resError?.message || 'Erro desconhecido';
        const errorCode = propsError?.code || resError?.code || 'UNKNOWN';
        console.error('❌ Erro ao carregar dados:', {
          propertiesError: propsError,
          reservationsError: resError,
          userId,
        });
        
        // Mensagem mais específica baseada no código de erro
        let userFriendlyMessage = `Não foi possível carregar dados: ${errorMsg}`;
        if (errorCode === 'PGRST301' || errorMsg.includes('permission denied') || errorMsg.includes('row-level security')) {
          userFriendlyMessage = `Políticas RLS não configuradas. Execute o script SQL 'configurar-rls-policies.sql' no Supabase.`;
        } else if (errorCode === 'PGRST204') {
          userFriendlyMessage = `Tabela ou coluna não encontrada. Verifique o schema do banco de dados.`;
        }
        
        setDataError(userFriendlyMessage);
        setStats({
          properties: 0,
          reservations: 0,
          upcomingReservations: 0,
        });
        setUpcomingReservations([]);
      } else {
        console.log('✅ Dados carregados com sucesso:', {
          propertiesCount: properties?.length || 0,
          reservationsCount: reservations?.length || 0,
        });
        setDataError(null);
        setStats({
          properties: properties?.length || 0,
          reservations: reservations?.length || 0,
          upcomingReservations: (reservations || []).filter((r: any) => {
            const checkinData = r.checkin_data as any;
            if (!checkinData?.check_in) return false;
            const checkIn = new Date(checkinData.check_in);
            return checkIn >= new Date();
          }).length || 0,
        });

        setUpcomingReservations((reservations || []) as Reservation[]);
      }
      
      console.log('✅ Dados do dashboard carregados');
      setDataLoaded(true);
    } catch (error: any) {
      const errorMsg = error?.message || 'Erro desconhecido';
      console.error('❌ Erro ao carregar dados (catch):', error);
      
      let userFriendlyMessage = 'Timeout ao carregar dados.';
      if (errorMsg.includes('Timeout')) {
        userFriendlyMessage = 'Timeout ao carregar dados do Supabase. Verifique sua conexão e as políticas RLS.';
      } else if (errorMsg.includes('permission') || errorMsg.includes('RLS')) {
        userFriendlyMessage = 'Políticas RLS não configuradas. Execute o script SQL "configurar-rls-policies.sql" no Supabase.';
      } else {
        userFriendlyMessage = `Erro ao carregar dados: ${errorMsg}`;
      }
      
      setDataError(userFriendlyMessage);
      setStats({
        properties: 0,
        reservations: 0,
        upcomingReservations: 0,
      });
      setUpcomingReservations([]);
      setDataLoaded(true);
    } finally {
      console.log('✅ Finalizando loading do dashboard');
      setLoading(false);
      loadingRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user && !dataLoaded && !loadingRef.current) {
      console.log('Dashboard: Usuário autenticado, carregando dados...');
      loadDashboardData();
    }
  }, [user, authLoading, router, dataLoaded, loadDashboardData]);

  if (authLoading || loading) {
    return <Loading fullScreen text="Carregando dashboard..." />;
  }

  if (!user) {
    return null;
  }

  const userEmail = user.email || 'Usuário';
  const userName = user.user_metadata?.full_name || userEmail;

  const cards = [
    {
      id: 'espacos',
      href: '/dashboard/espacos',
      icon: Home,
      title: 'Espaços',
      description: `${stats.properties} propriedade${stats.properties !== 1 ? 's' : ''}`,
      color: 'from-blue-600 to-blue-700',
    },
    {
      id: 'reservas',
      href: '/dashboard/reservas',
      icon: Calendar,
      title: 'Reservas',
      description: `${stats.reservations} reserva${stats.reservations !== 1 ? 's' : ''}`,
      color: 'from-pink-600 to-pink-700',
    },
    {
      id: 'proximas',
      href: '/dashboard/reservas?filter=upcoming',
      icon: CheckCircle,
      title: 'Próximas',
      description: `${stats.upcomingReservations} próxima${stats.upcomingReservations !== 1 ? 's' : ''}`,
      color: 'from-green-600 to-green-700',
    },
    {
      id: 'configuracoes',
      href: '/dashboard/configuracoes',
      icon: Settings,
      title: 'Configurações',
      description: 'Configurações da conta',
      color: 'from-gray-600 to-gray-700',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bem-vindo de volta, {userName}!
        </p>
      </div>

      {dataError && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            ⚠️ {dataError}
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
            <strong>Solução:</strong> Execute o script SQL <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">configurar-rls-policies.sql</code> no Supabase SQL Editor. 
            Veja o arquivo <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">INSTRUCOES-CONFIGURAR-RLS.md</code> para instruções detalhadas.
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
            <strong>Usuário logado:</strong> {user?.id || 'N/A'} | <strong>Email:</strong> {user?.email || 'N/A'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.id}
              href={card.href}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingReservations
          reservations={upcomingReservations}
          onReservationClick={(reservation) => {
            router.push(`/dashboard/reservas/${reservation.id}`);
          }}
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <Link
              href="/dashboard/espacos/novo"
              className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg text-center font-medium hover:opacity-90 transition-opacity"
            >
              Criar Nova Propriedade
            </Link>
            <Link
              href="/dashboard/reservas/novo"
              className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Nova Reserva
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
