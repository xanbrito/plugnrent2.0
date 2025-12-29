'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getCurrentHost } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    console.log('AuthProvider: Iniciando verificação de autenticação...');

    // Verificar sessão atual primeiro (mais rápido)
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Sessão obtida', session ? '✅ Usuário encontrado' : '❌ Sem sessão');
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
        console.log('AuthProvider: Loading desativado após getSession');
      }
    }).catch((error) => {
      console.error('AuthProvider: Erro ao obter sessão:', error);
      if (mounted) {
        setUser(null);
        setLoading(false);
        console.log('AuthProvider: Loading desativado após erro');
      }
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthProvider: Mudança de estado de auth:', event, session ? '✅' : '❌');
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
        console.log('AuthProvider: Loading desativado após onAuthStateChange');
      }
    });

    // Timeout de segurança - para o loading após 3 segundos (mais rápido)
    const timeout = setTimeout(() => {
      if (mounted) {
        console.warn('AuthProvider: Timeout de segurança - forçando parada do loading');
        setLoading(false);
      }
    }, 3000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

