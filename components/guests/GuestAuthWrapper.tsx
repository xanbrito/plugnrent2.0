'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useGuestAuth } from './GuestAuthProvider';
import Loading from '@/components/ui/Loading';

export function GuestAuthWrapper({ children }: { children: React.ReactNode }) {
  const { guest, loading } = useGuestAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !guest) {
      router.push('/hospede/login');
    }
  }, [guest, loading, router]);

  if (loading) {
    return <Loading fullScreen text="Carregando..." />;
  }

  if (!guest) {
    return null;
  }

  return <>{children}</>;
}




