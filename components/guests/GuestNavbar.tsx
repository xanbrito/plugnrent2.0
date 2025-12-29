'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGuestAuth } from './GuestAuthProvider';
import { LogOut, User, Calendar } from 'lucide-react';

export default function GuestNavbar() {
  const { guest, signOut } = useGuestAuth();
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push('/hospede/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/hospede/reservas" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                Sistema Vibing
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {guest && (
              <>
                <Link
                  href="/hospede/reservas"
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="hidden sm:inline">Reservas</span>
                </Link>

                <Link
                  href="/hospede/perfil"
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{guest.name}</span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}




