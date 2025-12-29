'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Plus, Edit, Trash2, MapPin, Home } from 'lucide-react';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import type { Property } from '@/types';

export default function EspacosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadProperties();
    }
  }, [user, authLoading, router]);

  async function loadProperties() {
    if (!user?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError('Erro ao carregar propriedades');
        setLoading(false);
        return;
      }

      setProperties((data as Property[]) || []);
      setLoading(false);
    } catch (err) {
      setError('Erro ao processar solicitação');
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta propriedade?')) {
      return;
    }

    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);

      if (error) {
        setError('Erro ao excluir propriedade');
        return;
      }

      setProperties(properties.filter((p) => p.id !== id));
    } catch (err) {
      setError('Erro ao processar exclusão');
    }
  }

  if (authLoading || loading) {
    return <Loading fullScreen text="Carregando propriedades..." />;
  }

    if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Espaços</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas propriedades
          </p>
        </div>
        <Link
          href="/dashboard/espacos/novo"
          className="px-4 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Propriedade</span>
        </Link>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}

      {properties.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma propriedade cadastrada</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comece criando sua primeira propriedade
          </p>
          <Link
            href="/dashboard/espacos/novo"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Criar Primeira Propriedade
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{property.space_name}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {property.description}
                </p>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{property.address}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-medium">
                    {property.type === 'espaco-inteiro' ? 'Espaço Inteiro' : 'Quarto'}
                  </span>

                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/dashboard/espacos/${property.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


