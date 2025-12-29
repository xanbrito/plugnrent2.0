'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/ui/Loading';

export default function CondominioLoginPage() {
  const router = useRouter();

  // Redirecionar para novo sistema de login
  useEffect(() => {
    router.replace('/auth/login?user_type=condominium');
  }, [router]);
  return <Loading fullScreen text="Redirecionando..." />;
}

