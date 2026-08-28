import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ufuihouryjkrnleacakq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_Rgvg8mggyU4LCyAyHwyadA_o76RblPy';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.warn('Erro ao inicializar Supabase client:', err);
    client = null;
  }
}

export const supabase = client;
