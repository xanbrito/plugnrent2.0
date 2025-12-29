'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Guest } from '@/types';

interface GuestAuthContextType {
  guest: Guest | null;
  loading: boolean;
  setGuest: (guest: Guest | null) => void;
  signOut: () => void;
}

const GuestAuthContext = createContext<GuestAuthContextType>({
  guest: null,
  loading: true,
  setGuest: () => {},
  signOut: () => {},
});

export function GuestAuthProvider({ children }: { children: ReactNode }) {
  const [guest, setGuestState] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar hóspede do localStorage
    try {
      const guestStr = localStorage.getItem('guest');
      if (guestStr) {
        try {
          const guestData = JSON.parse(guestStr);
          setGuestState(guestData);
        } catch (error) {
          console.error('Erro ao carregar hóspede:', error);
          localStorage.removeItem('guest');
        }
      }
    } catch (error) {
      console.error('Erro ao acessar localStorage:', error);
    } finally {
      setLoading(false);
    }

    // Timeout de segurança
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const setGuest = (newGuest: Guest | null) => {
    setGuestState(newGuest);
    if (newGuest) {
      localStorage.setItem('guest', JSON.stringify(newGuest));
    } else {
      localStorage.removeItem('guest');
    }
  };

  const signOut = () => {
    setGuestState(null);
    localStorage.removeItem('guest');
  };

  return (
    <GuestAuthContext.Provider value={{ guest, loading, setGuest, signOut }}>
      {children}
    </GuestAuthContext.Provider>
  );
}

export function useGuestAuth() {
  const context = useContext(GuestAuthContext);
  if (context === undefined) {
    throw new Error('useGuestAuth must be used within a GuestAuthProvider');
  }
  return context;
}

