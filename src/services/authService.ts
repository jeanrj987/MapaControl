import { supabase, isSupabaseConfigured } from './supabase';
import type { Session } from '@supabase/supabase-js';

export type { Session };

export interface SignInResult {
  session: Session | null;
  error: string | null;
}

/**
 * Autentica com email e senha (contas criadas manualmente no painel do Supabase).
 */
export async function signIn(email: string, password: string): Promise<SignInResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { session: null, error: 'Sincronização em nuvem não configurada.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const message = error.message === 'Invalid login credentials'
      ? 'Email ou senha incorretos.'
      : error.message;
    return { session: null, error: message };
  }

  return { session: data.session, error: null };
}

export async function signOut(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentSession(): Promise<Session | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Assina mudanças de sessão (login/logout/refresh de token) em tempo real.
 */
export function subscribeToAuthChanges(callback: (session: Session | null) => void): () => void {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });

  return () => data.subscription.unsubscribe();
}
