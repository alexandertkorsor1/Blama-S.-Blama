import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const getStoredSupabaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('blama_supabase_url');
    if (local && local.trim()) return local.trim();
  }
  return import.meta.env.VITE_SUPABASE_URL || '';
};

const getStoredSupabaseAnonKey = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('blama_supabase_anon_key');
    if (local && local.trim()) return local.trim();
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
};

export const supabaseUrl = getStoredSupabaseUrl();
export const supabaseAnonKey = getStoredSupabaseAnonKey();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-project')
);

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. You can set them in .env or via the Admin login settings.'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export function getSupabaseConfigInfo() {
  const url = getStoredSupabaseUrl();
  const anonKey = getStoredSupabaseAnonKey();
  const isCustom = typeof window !== 'undefined' && Boolean(localStorage.getItem('blama_supabase_url'));
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && !url.includes('placeholder') && !url.includes('your-project')),
    isCustom,
  };
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('blama_supabase_url', url.trim());
    localStorage.setItem('blama_supabase_anon_key', anonKey.trim());
  }
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('blama_supabase_url');
    localStorage.removeItem('blama_supabase_anon_key');
  }
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    const cleanKey = anonKey.trim();

    if (!cleanUrl || !cleanUrl.startsWith('https://')) {
      return { success: false, error: 'Invalid URL. Supabase Project URL must start with https://' };
    }
    if (!cleanKey) {
      return { success: false, error: 'Anon key is required.' };
    }

    const testClient = createClient(cleanUrl, cleanKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await testClient.auth.getSession();
    if (error && error.message.includes('FetchError')) {
      return { success: false, error: 'Could not connect to Supabase. Please check your Project URL.' };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown connection error';
    return { success: false, error: message };
  }
}
