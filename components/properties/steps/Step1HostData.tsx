'use client';

import { useState } from 'react';
import FormField from '@/components/ui/FormField';
import { isValidCPF, formatCPF } from '@/lib/cpf-validator';
import type { PropertyFormData } from '@/types';

interface Step1HostDataProps {
  data: PropertyFormData['step1'];
  onChange: (data: PropertyFormData['step1']) => void;
  onNext: () => void;
}

export default function Step1HostData({ data, onChange, onNext }: Step1HostDataProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.host_name.trim()) {
      newErrors.host_name = 'Nome é obrigatório';
    }

    if (!data.host_full_name.trim()) {
      newErrors.host_full_name = 'Nome completo é obrigatório';
    }

    if (!data.host_email.trim()) {
      newErrors.host_email = 'Email é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.host_email)) {
        newErrors.host_email = 'Email inválido';
      }
    }

    if (data.host_is_company) {
      if (!data.host_cnpj) {
        newErrors.host_cnpj = 'CNPJ é obrigatório para empresas';
      }
    } else {
      if (data.host_cpf && !isValidCPF(data.host_cpf)) {
        newErrors.host_cpf = 'CPF inválido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const validateCPF = (value: string): string | null => {
    if (!value) return null;
    if (!isValidCPF(value)) return 'CPF inválido';
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dados do Anfitrião</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Informe os dados do responsável pela propriedade
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="host_is_company"
            checked={data.host_is_company}
            onChange={(e) => onChange({ ...data, host_is_company: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="host_is_company" className="text-sm font-medium">
            É uma empresa?
          </label>
        </div>

        <FormField
          label="Nome"
          name="host_name"
          value={data.host_name}
          onChange={(value) => onChange({ ...data, host_name: value })}
          required
          placeholder="Nome do anfitrião"
          error={errors.host_name}
        />

        <FormField
          label="Nome Completo"
          name="host_full_name"
          value={data.host_full_name}
          onChange={(value) => onChange({ ...data, host_full_name: value })}
          required
          placeholder="Nome completo do anfitrião"
          error={errors.host_full_name}
        />

        <FormField
          label="Email"
          name="host_email"
          type="email"
          value={data.host_email}
          onChange={(value) => onChange({ ...data, host_email: value })}
          required
          placeholder="email@exemplo.com"
          error={errors.host_email}
        />

        <FormField
          label="Telefone"
          name="host_phone"
          value={data.host_phone || ''}
          onChange={(value) => onChange({ ...data, host_phone: value })}
          placeholder="(00) 00000-0000"
        />

        {data.host_is_company ? (
          <FormField
            label="CNPJ"
            name="host_cnpj"
            value={data.host_cnpj || ''}
            onChange={(value) => onChange({ ...data, host_cnpj: value })}
            required
            placeholder="00.000.000/0000-00"
            error={errors.host_cnpj}
          />
        ) : (
          <FormField
            label="CPF"
            name="host_cpf"
            value={data.host_cpf || ''}
            onChange={(value) => {
              const formatted = formatCPF(value);
              onChange({ ...data, host_cpf: formatted });
            }}
            placeholder="000.000.000-00"
            validate={validateCPF}
            error={errors.host_cpf}
          />
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}




