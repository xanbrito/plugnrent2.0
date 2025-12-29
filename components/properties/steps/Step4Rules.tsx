'use client';

import { useState } from 'react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import type { PropertyFormData, Rule } from '@/types';

interface Step4RulesProps {
  data: PropertyFormData['step4'];
  onChange: (data: PropertyFormData['step4']) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step4Rules({ data, onChange, onNext, onBack }: Step4RulesProps) {
  const [rules, setRules] = useState<Rule[]>(data.rules || []);

  const addRule = () => {
    const newRule: Rule = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      iconType: 'default',
    };
    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onChange({ rules: updatedRules });
  };

  const removeRule = (id: string) => {
    const updatedRules = rules.filter((r) => r.id !== id);
    setRules(updatedRules);
    onChange({ rules: updatedRules });
  };

  const updateRule = (id: string, field: keyof Rule, value: any) => {
    const updatedRules = rules.map((r) =>
      r.id === id ? { ...r, [field]: value } : r
    );
    setRules(updatedRules);
    onChange({ rules: updatedRules });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Regras da Propriedade</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Defina as regras que os hóspedes devem seguir
        </p>
      </div>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div
            key={rule.id || index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">Regra {index + 1}</h3>
              <button
                onClick={() => removeRule(rule.id!)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Ícone</label>
                <select
                  value={rule.iconType || 'default'}
                  onChange={(e) =>
                    updateRule(rule.id!, 'iconType', e.target.value as 'emoji' | 'image' | 'default')
                  }
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                >
                  <option value="default">Padrão</option>
                  <option value="emoji">Emoji</option>
                  <option value="image">Imagem</option>
                </select>
              </div>

              {rule.iconType === 'emoji' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Emoji</label>
                  <input
                    type="text"
                    value={rule.icon || ''}
                    onChange={(e) => updateRule(rule.id!, 'icon', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                    placeholder="🚫"
                    maxLength={2}
                  />
                </div>
              )}

              {rule.iconType === 'image' && (
                <div>
                  <label className="block text-sm font-medium mb-2">URL da Imagem</label>
                  <input
                    type="url"
                    value={rule.icon || ''}
                    onChange={(e) => updateRule(rule.id!, 'icon', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={rule.title}
                onChange={(e) => updateRule(rule.id!, 'title', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                placeholder="Ex: Não fumar"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                value={rule.description}
                onChange={(e) => updateRule(rule.id!, 'description', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                rows={3}
                placeholder="Descrição detalhada da regra"
                required
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addRule}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar Regra</span>
        </button>
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




