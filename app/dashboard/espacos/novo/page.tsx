'use client';

import PropertyForm from '@/components/properties/PropertyForm';

export default function NovoEspacoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Nova Propriedade</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Preencha o formulário para cadastrar uma nova propriedade
        </p>
      </div>

      <PropertyForm />
    </div>
  );
}




