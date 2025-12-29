'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import PropertyForm from '@/components/properties/PropertyForm';
import type { Property } from '@/types';

export default function EditarEspacoPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  async function loadProperty() {
    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (fetchError || !data) {
        setError('Propriedade não encontrada');
        setLoading(false);
        return;
      }

      setProperty(data as Property);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar propriedade');
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading fullScreen text="Carregando propriedade..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorMessage message={error} />
        <button
          onClick={() => router.push('/dashboard/espacos')}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Editar Propriedade</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {property?.space_name}
        </p>
      </div>

      <PropertyForm propertyId={propertyId} />
    </div>
  );
}




