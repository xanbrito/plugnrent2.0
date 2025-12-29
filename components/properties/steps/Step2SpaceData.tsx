'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Loader2, CheckCircle, XCircle, Star } from 'lucide-react';
import FormField from '@/components/ui/FormField';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import type { PropertyFormData } from '@/types';

interface Step2SpaceDataProps {
  data: PropertyFormData['step2'];
  onChange: (data: PropertyFormData['step2']) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2SpaceData({ data, onChange, onNext, onBack }: Step2SpaceDataProps) {
  const [scraping, setScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState('');
  const [scrapeSuccess, setScrapeSuccess] = useState(false);

  const handleScrapeAirbnb = async () => {
    if (!data.airbnb_link) {
      setScrapeError('Por favor, informe o link do Airbnb primeiro');
      return;
    }

    setScraping(true);
    setScrapeError('');
    setScrapeSuccess(false);

    try {
      const response = await fetch('/api/airbnb/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: data.airbnb_link }),
      });

      const result = await response.json();

      if (!result.success) {
        setScrapeError(result.error || 'Erro ao importar dados do Airbnb');
        setScraping(false);
        return;
      }

      // Preencher dados importados
      if (result.data) {
        const updates: PropertyFormData['step2'] = {
          ...data,
        };
        
        if (result.data.spaceName && result.data.spaceName !== 'Nome não encontrado') {
          updates.space_name = result.data.spaceName;
        }
        
        if (result.data.description && result.data.description !== 'Descrição não encontrada') {
          updates.description = result.data.description;
        }
        
        if (result.data.type) {
          updates.type = result.data.type;
        }

        // Fotos - só atualiza se houver fotos
        if (result.data.photos && Array.isArray(result.data.photos) && result.data.photos.length > 0) {
          updates.photos = result.data.photos
            .filter((url: string) => url && url.startsWith('http'))
            .map((url: string, index: number) => ({
              url,
              selected: true,
              isFeatured: index === 0, // Primeira foto é a capa por padrão
              category: 'property',
            }));
        }
        
        onChange(updates);
        setScrapeSuccess(true);
        setTimeout(() => setScrapeSuccess(false), 3000);
      }

      setScraping(false);
    } catch (error) {
      setScrapeError('Erro ao processar importação');
      setScraping(false);
    }
  };

  const togglePhotoSelection = (index: number) => {
    if (!data.photos) return;
    
    const newPhotos = [...data.photos];
    newPhotos[index].selected = !newPhotos[index].selected;
    
    // Se esta é a primeira foto selecionada, marcar como destaque
    const selectedPhotos = newPhotos.filter(p => p.selected);
    if (selectedPhotos.length === 1 && newPhotos[index].selected) {
      newPhotos[index].isFeatured = true;
    } else if (newPhotos[index].selected && index === 0) {
      // Se a primeira foto for selecionada, marcar como destaque
      newPhotos[index].isFeatured = true;
      // Remover destaque das outras
      newPhotos.forEach((p, i) => {
        if (i !== index) p.isFeatured = false;
      });
    }
    
    onChange({ ...data, photos: newPhotos });
  };

  const setFeaturedPhoto = (index: number) => {
    if (!data.photos) return;
    
    const newPhotos = [...data.photos];
    
    // Se a foto não está selecionada, selecionar primeiro
    if (!newPhotos[index].selected) {
      newPhotos[index].selected = true;
    }
    
    // Remover destaque de todas
    newPhotos.forEach(p => p.isFeatured = false);
    
    // Marcar a selecionada como destaque
    newPhotos[index].isFeatured = true;
    
    // Mover a foto escolhida como capa para o início da lista
    const featuredPhoto = newPhotos[index];
    newPhotos.splice(index, 1);
    newPhotos.unshift(featuredPhoto);
    
    onChange({ ...data, photos: newPhotos });
  };

  const validate = (): boolean => {
    return !!(data.space_name.trim() && data.description.trim());
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dados do Espaço</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Informe os dados da propriedade
        </p>
      </div>

      <div className="space-y-4">
        <FormField
          label="Nome do Espaço"
          name="space_name"
          value={data.space_name}
          onChange={(value) => onChange({ ...data, space_name: value })}
          required
          placeholder="Ex: Apartamento Centro, Casa na Praia"
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            Tipo de Espaço <span className="text-red-500">*</span>
          </label>
          <select
            value={data.type}
            onChange={(e) => onChange({ ...data, type: e.target.value as 'quarto' | 'espaco-inteiro' })}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="quarto">Quarto</option>
            <option value="espaco-inteiro">Espaço Inteiro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            value={data.description}
            onChange={(e) => onChange({ ...data, description: e.target.value })}
            required
            rows={6}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Descreva a propriedade..."
          />
        </div>

        <div className="space-y-2">
          <FormField
            label="Link do Airbnb (opcional)"
            name="airbnb_link"
            value={data.airbnb_link || ''}
            onChange={(value) => onChange({ ...data, airbnb_link: value })}
            placeholder="https://airbnb.com/rooms/..."
          />

          {data.airbnb_link && (
            <button
              type="button"
              onClick={handleScrapeAirbnb}
              disabled={scraping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {scraping ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Importando...
                </>
              ) : (
                'Importar Dados do Airbnb'
              )}
            </button>
          )}

          {scraping && <Loading text="Importando dados do Airbnb..." />}
          {scrapeError && <ErrorMessage message={scrapeError} onDismiss={() => setScrapeError('')} />}
          {scrapeSuccess && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle size={16} />
              Dados importados com sucesso!
            </div>
          )}
        </div>

        {/* Galeria de Fotos */}
        {data.photos && data.photos.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-3">
              Fotos Importadas (selecione as que deseja usar)
              <span className="text-xs text-gray-500 ml-2">A primeira foto selecionada será a capa</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.photos.map((photo, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    photo.selected
                      ? photo.isFeatured
                        ? 'border-purple-600 ring-4 ring-purple-600'
                        : 'border-blue-600 ring-2 ring-blue-600'
                      : 'border-gray-300 opacity-50'
                  }`}
                  onClick={() => togglePhotoSelection(index)}
                >
                  <Image
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {photo.isFeatured && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                      <Star size={12} className="fill-white" />
                      CAPA
                    </div>
                  )}
                  {photo.selected && !photo.isFeatured && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                      <CheckCircle size={16} />
                    </div>
                  )}
                  {photo.selected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeaturedPhoto(index);
                      }}
                      className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded hover:bg-opacity-70 transition-all"
                    >
                      {photo.isFeatured ? 'Capa' : 'Definir como Capa'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={handleNext}
          disabled={!validate()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
