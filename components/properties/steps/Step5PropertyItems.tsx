'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { PropertyFormData, PropertyItems } from '@/types';

interface Step5PropertyItemsProps {
  data: PropertyFormData['step5'];
  onChange: (data: PropertyFormData['step5']) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step5PropertyItems({ data, onChange, onNext, onBack }: Step5PropertyItemsProps) {
  const [items, setItems] = useState<PropertyItems>(data.property_items || {});

  const updateItems = (newItems: PropertyItems) => {
    setItems(newItems);
    onChange({ property_items: newItems });
  };

  const addItem = (category: keyof PropertyItems) => {
    if (category === 'breakfast') {
      updateItems({
        ...items,
        breakfast: {
          provided: false,
          description: '',
          extra_fee: 0,
        },
      });
    } else {
      const currentItems = (items[category] as string[]) || [];
      updateItems({
        ...items,
        [category]: [...currentItems, ''],
      });
    }
  };

  const removeItem = (category: keyof PropertyItems, index?: number) => {
    if (category === 'breakfast') {
      const { breakfast, ...rest } = items;
      updateItems(rest);
    } else {
      const currentItems = (items[category] as string[]) || [];
      const updatedItems = currentItems.filter((_, i) => i !== index);
      updateItems({
        ...items,
        [category]: updatedItems,
      });
    }
  };

  const updateItem = (category: keyof PropertyItems, index: number | null, value: any) => {
    if (category === 'breakfast') {
      updateItems({
        ...items,
        breakfast: {
          ...items.breakfast!,
          ...value,
        },
      });
    } else {
      const currentItems = (items[category] as string[]) || [];
      const updatedItems = [...currentItems];
      updatedItems[index!] = value;
      updateItems({
        ...items,
        [category]: updatedItems,
      });
    }
  };

  const categories: Array<{ key: keyof PropertyItems; label: string; singular: string }> = [
    { key: 'kitchen', label: 'Cozinha', singular: 'item' },
    { key: 'bedroom', label: 'Quarto', singular: 'item' },
    { key: 'bathroom', label: 'Banheiro', singular: 'item' },
    { key: 'laundry', label: 'Lavanderia', singular: 'item' },
    { key: 'other', label: 'Outros', singular: 'item' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">O que tem no imóvel</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Liste os itens disponíveis na propriedade
        </p>
      </div>

      <div className="space-y-6">
        {/* Café da Manhã */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Café da Manhã</h3>
            {!items.breakfast && (
              <button
                onClick={() => addItem('breakfast')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="h-4 w-4 inline mr-1" />
                Adicionar
              </button>
            )}
          </div>

          {items.breakfast && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="breakfast_provided"
                  checked={items.breakfast.provided}
                  onChange={(e) => updateItem('breakfast', null, { provided: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="breakfast_provided" className="text-sm">
                  Café da manhã fornecido
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição</label>
                <textarea
                  value={items.breakfast.description || ''}
                  onChange={(e) => updateItem('breakfast', null, { description: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                  rows={3}
                  placeholder="Descreva o café da manhã..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Taxa Extra (R$)</label>
                <input
                  type="number"
                  value={items.breakfast.extra_fee || 0}
                  onChange={(e) => updateItem('breakfast', null, { extra_fee: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                  min="0"
                  step="0.01"
                />
              </div>

              <button
                onClick={() => removeItem('breakfast')}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                <Trash2 className="h-4 w-4 inline mr-1" />
                Remover
              </button>
            </div>
          )}
        </div>

        {/* Outras Categorias */}
        {categories.map((category) => {
          const categoryItems = (items[category.key] as string[]) || [];
          return (
            <div
              key={category.key}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{category.label}</h3>
                <button
                  onClick={() => addItem(category.key)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="h-4 w-4 inline mr-1" />
                  Adicionar
                </button>
              </div>

              <div className="space-y-2">
                {categoryItems.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateItem(category.key, index, e.target.value)}
                      className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                      placeholder={`${category.singular} ${index + 1}`}
                    />
                    <button
                      onClick={() => removeItem(category.key, index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}




