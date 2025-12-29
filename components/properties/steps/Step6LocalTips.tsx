'use client';

import { useState } from 'react';
import { Plus, Trash2, MapPin, Phone, MessageCircle, Globe } from 'lucide-react';
import type { PropertyFormData, LocalTip } from '@/types';

interface Step6LocalTipsProps {
  data: PropertyFormData['step6'];
  onChange: (data: PropertyFormData['step6']) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export default function Step6LocalTips({ data, onChange, onBack, onSubmit }: Step6LocalTipsProps) {
  const [tips, setTips] = useState<LocalTip[]>(data.local_tips || []);

  const addTip = () => {
    const newTip: LocalTip = {
      id: crypto.randomUUID(),
      category: 'restaurant',
      name: '',
      description: '',
    };
    const updatedTips = [...tips, newTip];
    setTips(updatedTips);
    onChange({ local_tips: updatedTips });
  };

  const removeTip = (id: string) => {
    const updatedTips = tips.filter((t) => t.id !== id);
    setTips(updatedTips);
    onChange({ local_tips: updatedTips });
  };

  const updateTip = (id: string, field: keyof LocalTip, value: any) => {
    const updatedTips = tips.map((t) =>
      t.id === id ? { ...t, [field]: value } : t
    );
    setTips(updatedTips);
    onChange({ local_tips: updatedTips });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dicas Locais</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Adicione recomendações de lugares próximos para os hóspedes
        </p>
      </div>

      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div
            key={tip.id || index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium">Dica {index + 1}</h3>
              <button
                onClick={() => removeTip(tip.id!)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Categoria</label>
              <select
                value={tip.category}
                onChange={(e) =>
                  updateTip(tip.id!, 'category', e.target.value as LocalTip['category'])
                }
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
              >
                <option value="restaurant">Restaurante</option>
                <option value="attraction">Atração</option>
                <option value="service">Serviço</option>
                <option value="experience">Experiência</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nome</label>
              <input
                type="text"
                value={tip.name}
                onChange={(e) => updateTip(tip.id!, 'name', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                placeholder="Nome do lugar"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                value={tip.description}
                onChange={(e) => updateTip(tip.id!, 'description', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                rows={3}
                placeholder="Descrição do lugar"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">URL da Foto de Capa</label>
                <input
                  type="url"
                  value={tip.cover_photo || ''}
                  onChange={(e) => updateTip(tip.id!, 'cover_photo', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link</label>
                <input
                  type="url"
                  value={tip.link || ''}
                  onChange={(e) => updateTip(tip.id!, 'link', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefone</label>
                <input
                  type="tel"
                  value={tip.phone || ''}
                  onChange={(e) => updateTip(tip.id!, 'phone', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp</label>
                <input
                  type="tel"
                  value={tip.whatsapp || ''}
                  onChange={(e) => updateTip(tip.id!, 'whatsapp', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Endereço</label>
                <input
                  type="text"
                  value={tip.address || ''}
                  onChange={(e) => updateTip(tip.id!, 'address', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm"
                  placeholder="Endereço completo"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addTip}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Adicionar Dica Local</span>
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
          onClick={onSubmit}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}




