'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getCurrentCondominium } from '@/lib/condominium-auth';
import type { Condominium } from '@/types';

interface CondominiumAuthContextType {
  user: User | null;
  condominium: Condominium | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const CondominiumAuthContext = createContext<CondominiumAuthContextType>({
  user: null,
  condominium: null,
  loading: true,
  signOut: async () => {},
});

export function CondominiumAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [condominium, setCondominium] = useState<Condominium | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar condomínio atual
    const checkCondominium = async () => {
      try {
        // Verificar se há sessão Supabase primeiro (condomínios usam Supabase Auth)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const currentCondominium = await getCurrentCondominium();
        if (currentCondominium) {
          setCondominium(currentCondominium);
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          setUser(currentUser);
        } else {
          // Usuário não é condomínio, apenas definir loading como false
          setCondominium(null);
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          setUser(currentUser);
        }
      } catch (error) {
        // Erro ao verificar condomínio (pode ser usuário normal, não é erro crítico)
        setCondominium(null);
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };
    checkCondominium();

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } =     supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const currentCondominium = await getCurrentCondominium();
          setCondominium(currentCondominium || null);
          setUser(session.user);
        } catch (error) {
          // Erro ao verificar condomínio (pode ser usuário normal)
          setCondominium(null);
          setUser(session.user);
        }
      } else {
        setCondominium(null);
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCondominium(null);
  };

  return (
    <CondominiumAuthContext.Provider value={{ user, condominium, loading, signOut }}>
      {children}
    </CondominiumAuthContext.Provider>
  );
}

export function useCondominiumAuth() {
  const context = useContext(CondominiumAuthContext);
  if (context === undefined) {
    throw new Error('useCondominiumAuth must be used within a CondominiumAuthProvider');
  }
  return context;
}

