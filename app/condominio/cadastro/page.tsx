'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function CondominioCadastroPage() {
  const router = useRouter();

  // Redirecionar para novo sistema de cadastro
  useEffect(() => {
    router.replace('/auth/register?user_type=condominium');
  }, [router]);

  return <Loading fullScreen text="Redirecionando..." />;
}
