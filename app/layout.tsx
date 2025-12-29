import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { CondominiumAuthProvider } from '@/components/condominiums/CondominiumAuthProvider';
import { GuestAuthProvider } from '@/components/guests/GuestAuthProvider';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Sistema Vibing - Gestão de Propriedades',
  description: 'Plataforma completa de gestão de propriedades de hospedagem',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.variable}>
        <AuthProvider>
          <CondominiumAuthProvider>
            <GuestAuthProvider>
              <Header />
              {/* Conteúdo Principal */}
              <main className="min-h-[calc(100vh-4rem)]">
                {children}
              </main>
            </GuestAuthProvider>
          </CondominiumAuthProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
