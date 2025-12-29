'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { createPhoto, getPropertyPhotos, updatePhoto } from '@/lib/supabase';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import SuccessMessage from '@/components/ui/SuccessMessage';
import Step1HostData from './steps/Step1HostData';
import Step2SpaceData from './steps/Step2SpaceData';
import Step3Location from './steps/Step3Location';
import Step4Rules from './steps/Step4Rules';
import Step5PropertyItems from './steps/Step5PropertyItems';
import Step6LocalTips from './steps/Step6LocalTips';
import type { PropertyFormData } from '@/types';
import crypto from 'crypto';

interface PropertyFormProps {
  propertyId?: string; // Se fornecido, é edição
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState<PropertyFormData>({
    step1: {
      host_name: '',
      host_full_name: '',
      host_cpf: '',
      host_cnpj: '',
      host_email: '',
      host_phone: '',
      host_is_company: false,
    },
    step2: {
      space_name: '',
      type: 'espaco-inteiro',
      description: '',
      airbnb_link: '',
    },
    step3: {
      address: '',
      city: '',
      state: '',
      zip_code: '',
      how_to_enter: '',
      google_maps_link: '',
      waze_link: '',
      wifi_name: '',
      wifi_password: '',
    },
    step4: {
      rules: [],
    },
    step5: {
      property_items: {},
    },
    step6: {
      local_tips: [],
    },
  });

  const updateStepData = (step: keyof PropertyFormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [step]: data,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      // Preparar dados para salvar
      const propertyData = {
        user_id: user.id,
        host_name: formData.step1.host_name,
        host_full_name: formData.step1.host_full_name,
        host_cpf: formData.step1.host_cpf || null,
        host_cnpj: formData.step1.host_cnpj || null,
        host_email: formData.step1.host_email,
        host_phone: formData.step1.host_phone || null,
        host_is_company: formData.step1.host_is_company,
        space_name: formData.step2.space_name,
        type: formData.step2.type,
        description: formData.step2.description,
        airbnb_link: formData.step2.airbnb_link || null,
        address: formData.step3.address,
        how_to_enter: formData.step3.how_to_enter || null,
        google_maps_link: formData.step3.google_maps_link || null,
        waze_link: formData.step3.waze_link || null,
        rules: formData.step4.rules,
        property_items: formData.step5.property_items,
        local_tips: formData.step6.local_tips,
        budget_via_site: false,
        pet_friendly_allowed: false,
      };

      let savedPropertyId: string;

      if (propertyId) {
        // Atualizar propriedade existente
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', propertyId);

        if (updateError) {
          setError('Erro ao atualizar propriedade');
          setLoading(false);
          return;
        }

        savedPropertyId = propertyId;
        setSuccess('Propriedade atualizada com sucesso!');
      } else {
        // Criar nova propriedade
        const { data: newProperty, error: insertError } = await supabase
          .from('properties')
          .insert(propertyData)
          .select()
          .single();

        if (insertError || !newProperty) {
          setError('Erro ao criar propriedade');
          setLoading(false);
          return;
        }

        savedPropertyId = newProperty.id;
        setSuccess('Propriedade criada com sucesso!');
      }

      // Processar fotos selecionadas
      const selectedPhotos = formData.step2.photos?.filter((p) => p.selected) || [];
      
      if (selectedPhotos.length > 0) {
        try {
          // Identificar foto de capa
          const featuredPhoto = selectedPhotos.find(p => p.isFeatured) || selectedPhotos[0];
          
          if (propertyId) {
            // Edição: verificar fotos existentes
            const existingPhotos = await getPropertyPhotos(propertyId);
            const existingPhotosMap = new Map(
              existingPhotos.map((photo: any) => [photo.url, photo])
            );
            const existingUrls = new Set(existingPhotos.map((p: any) => p.url));
            const currentFeatured = existingPhotos.find((p: any) => p.is_featured === true);
            
            // Processar mudança de capa se necessário
            if (featuredPhoto) {
              const photoToUpdate = existingPhotosMap.get(featuredPhoto.url);
              
              if (photoToUpdate) {
                // Foto existe - atualizar como capa se necessário
                if (!currentFeatured || currentFeatured.id !== photoToUpdate.id) {
                  // Remover capa anterior
                  if (currentFeatured) {
                    await updatePhoto(currentFeatured.id, { is_featured: false });
                  }
                  // Atualizar nova capa
                  await updatePhoto(photoToUpdate.id, { 
                    is_featured: true,
                    order: 1
                  });
                }
              } else {
                // Foto não existe - criar como capa
                await createPhoto(savedPropertyId, {
                  url: featuredPhoto.url,
                  category: featuredPhoto.category || 'property',
                  is_featured: true,
                  order: 1,
                });
                existingUrls.add(featuredPhoto.url);
              }
            }
            
            // Adicionar outras fotos novas
            let nextOrder = 2;
            for (const photo of selectedPhotos) {
              if (photo.url !== featuredPhoto?.url && !existingUrls.has(photo.url)) {
                await createPhoto(savedPropertyId, {
                  url: photo.url,
                  category: photo.category || 'property',
                  is_featured: false,
                  order: nextOrder,
                });
                nextOrder++;
              }
            }
          } else {
            // Nova propriedade - salvar foto de capa primeiro
            if (featuredPhoto) {
              await createPhoto(savedPropertyId, {
                url: featuredPhoto.url,
                category: featuredPhoto.category || 'property',
                is_featured: true,
                order: 1,
              });
            }
            
            // Salvar outras fotos
            let order = 2;
            for (const photo of selectedPhotos) {
              if (photo.url !== featuredPhoto?.url) {
                await createPhoto(savedPropertyId, {
                  url: photo.url,
                  category: photo.category || 'property',
                  is_featured: false,
                  order: order,
                });
                order++;
              }
            }
          }
        } catch (photoError) {
          console.error('Erro ao processar fotos:', photoError);
          // Não bloquear o salvamento se houver erro nas fotos
        }
      }

      if (!propertyId) {
        setTimeout(() => {
          router.push(`/dashboard/espacos/${savedPropertyId}`);
        }, 2000);
      }

      setLoading(false);
    } catch (err) {
      setError('Erro ao processar formulário');
      setLoading(false);
    }
  };

  const steps = [
    { component: Step1HostData, title: 'Dados do Anfitrião' },
    { component: Step2SpaceData, title: 'Dados do Espaço' },
    { component: Step3Location, title: 'Localização' },
    { component: Step4Rules, title: 'Regras' },
    { component: Step5PropertyItems, title: 'Itens do Imóvel' },
    { component: Step6LocalTips, title: 'Dicas Locais' },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex-1 text-center text-sm font-medium ${
                  index + 1 <= currentStep
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400'
                }`}
              >
                {index + 1}. {step.title}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError('')} />}
        {success && <SuccessMessage message={success} onDismiss={() => setSuccess('')} />}

        {loading ? (
          <Loading text="Salvando propriedade..." />
        ) : (
          <CurrentStepComponent
            data={formData[`step${currentStep}` as keyof PropertyFormData] as any}
            onChange={(data) => updateStepData(`step${currentStep}` as keyof PropertyFormData, data)}
            onNext={() => setCurrentStep((prev) => Math.min(prev + 1, steps.length))}
            onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}

