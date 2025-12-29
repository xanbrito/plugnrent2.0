import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅' : '❌');
  throw new Error('Missing Supabase environment variables. Verifique o arquivo .env.local');
}

// Cliente Supabase para uso no cliente (browser)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper para obter o cliente Supabase do servidor
export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Helper para obter sessão do usuário
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

// Helper para obter usuário atual
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Funções de gerenciamento de fotos
export async function createPhoto(
  propertyId: string,
  photoData: {
    url: string;
    category?: string;
    is_featured?: boolean;
    order?: number;
  }
) {
  const { data, error } = await supabase
    .from('photos')
    .insert({
      property_id: propertyId,
      url: photoData.url,
      category: photoData.category || 'property',
      is_featured: photoData.is_featured || false,
      order: photoData.order || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePhoto(
  photoId: string,
  updates: {
    url?: string;
    category?: string;
    is_featured?: boolean;
    order?: number;
  }
) {
  const { data, error } = await supabase
    .from('photos')
    .update(updates)
    .eq('id', photoId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPropertyPhotos(propertyId: string) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('property_id', propertyId)
    .order('order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function deletePhoto(photoId: string) {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId);

  if (error) throw error;
}

