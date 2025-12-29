'use client';

import { useState } from 'react';
import FormField from '@/components/ui/FormField';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import type { PropertyFormData } from '@/types';

interface Step3LocationProps {
  data: PropertyFormData['step3'];
  onChange: (data: PropertyFormData['step3']) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3Location({ data, onChange, onNext, onBack }: Step3LocationProps) {
  const [loadingCEP, setLoadingCEP] = useState(false);
  const [cepError, setCepError] = useState('');

  const handleSearchCEP = async () => {
    if (!data.zip_code || data.zip_code.replace(/\D/g, '').length !== 8) {
      setCepError('CEP deve ter 8 dígitos');
      return;
    }

    setLoadingCEP(true);
    setCepError('');

    try {
      const cleanedCEP = data.zip_code.replace(/\D/g, '');
      const response = await fetch(`/api/cep?cep=${cleanedCEP}`);
      const result = await response.json();

      if (!result.success || !result.data) {
        setCepError('CEP não encontrado');
        setLoadingCEP(false);
        return;
      }

      onChange({
        ...data,
        address: result.data.logradouro || data.address,
        city: result.data.localidade || data.city,
        state: result.data.uf || data.state,
        zip_code: result.data.cep || data.zip_code,
      });

      setLoadingCEP(false);
    } catch (error) {
      setCepError('Erro ao buscar CEP');
      setLoadingCEP(false);
    }
  };

  const validate = (): boolean => {
    return !!(data.address.trim() && data.city.trim() && data.state.trim() && data.zip_code.trim());
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Localização</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Informe o endereço completo da propriedade
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <FormField
              label="CEP"
              name="zip_code"
              value={data.zip_code}
              onChange={(value) => onChange({ ...data, zip_code: value.replace(/\D/g, '') })}
              required
              placeholder="00000000"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearchCEP}
              disabled={loadingCEP}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Buscar
            </button>
          </div>
        </div>

        {loadingCEP && <Loading text="Buscando CEP..." />}
        {cepError && <ErrorMessage message={cepError} onDismiss={() => setCepError('')} />}

        <FormField
          label="Endereço"
          name="address"
          value={data.address}
          onChange={(value) => onChange({ ...data, address: value })}
          required
          placeholder="Rua, Avenida, etc."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Cidade"
            name="city"
            value={data.city}
            onChange={(value) => onChange({ ...data, city: value })}
            required
            placeholder="Cidade"
          />

          <FormField
            label="Estado"
            name="state"
            value={data.state}
            onChange={(value) => onChange({ ...data, state: value.toUpperCase().slice(0, 2) })}
            required
            placeholder="UF"
            maxLength={2}
          />
        </div>

        <FormField
          label="Como Entrar"
          name="how_to_enter"
          value={data.how_to_enter || ''}
          onChange={(value) => onChange({ ...data, how_to_enter: value })}
          placeholder="Instruções de acesso (portaria, fechadura digital, etc.)"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Link Google Maps"
            name="google_maps_link"
            type="url"
            value={data.google_maps_link || ''}
            onChange={(value) => onChange({ ...data, google_maps_link: value })}
            placeholder="https://maps.google.com/..."
          />

          <FormField
            label="Link Waze"
            name="waze_link"
            type="url"
            value={data.waze_link || ''}
            onChange={(value) => onChange({ ...data, waze_link: value })}
            placeholder="https://waze.com/..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Nome do WiFi"
            name="wifi_name"
            value={data.wifi_name || ''}
            onChange={(value) => onChange({ ...data, wifi_name: value })}
            placeholder="Nome da rede WiFi"
          />

          <FormField
            label="Senha do WiFi"
            name="wifi_password"
            type="password"
            value={data.wifi_password || ''}
            onChange={(value) => onChange({ ...data, wifi_password: value })}
            placeholder="Senha do WiFi"
          />
        </div>
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




