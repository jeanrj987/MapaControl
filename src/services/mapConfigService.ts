import { supabase, isSupabaseConfigured } from './supabase';
import { ControlPoint, DEFAULT_DIV_NORTE, DEFAULT_DIV_OESTE_LESTE } from '../types/dividers';
import { RegionTimers, DEFAULT_REGION_TIMERS } from '../components/UI/TvSettingsModal';

const TABLE_NAME = 'mapa_config';

const LOCAL_STORAGE_KEY_NORTE = 'mapa_live_div_norte';
const LOCAL_STORAGE_KEY_OESTE_LESTE = 'mapa_live_div_oeste_leste';
const LOCAL_STORAGE_KEY_TIMERS = 'controlsoft_tv_region_timers';

export interface DividersData {
  divNorte: ControlPoint[];
  divOesteLeste: ControlPoint[];
}

/**
 * Carrega as divisas (Supabase com fallback para localStorage e padrão)
 */
export async function loadDividers(): Promise<DividersData> {
  // 1. Tenta carregar do Supabase se estiver configurado
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('key, value')
        .in('key', ['div_norte', 'div_oeste_leste']);

      if (!error && data && data.length > 0) {
        const norteRow = data.find((r) => r.key === 'div_norte');
        const olRow = data.find((r) => r.key === 'div_oeste_leste');

        const divNorte: ControlPoint[] = norteRow?.value || DEFAULT_DIV_NORTE;
        const divOesteLeste: ControlPoint[] = olRow?.value || DEFAULT_DIV_OESTE_LESTE;

        // Atualiza cache local
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY_NORTE, JSON.stringify(divNorte));
          localStorage.setItem(LOCAL_STORAGE_KEY_OESTE_LESTE, JSON.stringify(divOesteLeste));
        } catch {}

        return { divNorte, divOesteLeste };
      }
    } catch (err) {
      console.warn('Erro ao carregar divisas do Supabase, usando fallback local:', err);
    }
  }

  // 2. Fallback para localStorage
  try {
    const savedNorte = localStorage.getItem(LOCAL_STORAGE_KEY_NORTE);
    const savedOL = localStorage.getItem(LOCAL_STORAGE_KEY_OESTE_LESTE);
    return {
      divNorte: savedNorte ? JSON.parse(savedNorte) : DEFAULT_DIV_NORTE,
      divOesteLeste: savedOL ? JSON.parse(savedOL) : DEFAULT_DIV_OESTE_LESTE,
    };
  } catch {
    return {
      divNorte: DEFAULT_DIV_NORTE,
      divOesteLeste: DEFAULT_DIV_OESTE_LESTE,
    };
  }
}

/**
 * Salva as divisas no Supabase e no localStorage
 */
export async function saveDividers(divNorte: ControlPoint[], divOesteLeste: ControlPoint[]): Promise<boolean> {
  // 1. Salva no localStorage imediatamente
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_NORTE, JSON.stringify(divNorte));
    localStorage.setItem(LOCAL_STORAGE_KEY_OESTE_LESTE, JSON.stringify(divOesteLeste));
  } catch {}

  // 2. Salva no Supabase se estiver configurado
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from(TABLE_NAME).upsert([
        { key: 'div_norte', value: divNorte, updated_at: new Date().toISOString() },
        { key: 'div_oeste_leste', value: divOesteLeste, updated_at: new Date().toISOString() },
      ]);

      if (error) {
        console.error('Erro ao salvar divisas no Supabase:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Erro ao persistir divisas no Supabase:', err);
      return false;
    }
  }

  return true;
}

/**
 * Carrega os tempos de rotação da TV
 */
export async function loadTvTimers(): Promise<RegionTimers> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('value')
        .eq('key', 'tv_timers')
        .single();

      if (!error && data?.value) {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY_TIMERS, JSON.stringify(data.value));
        } catch {}
        return { ...DEFAULT_REGION_TIMERS, ...data.value };
      }
    } catch (err) {
      console.warn('Erro ao carregar tempos de TV do Supabase:', err);
    }
  }

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_TIMERS);
    if (saved) return { ...DEFAULT_REGION_TIMERS, ...JSON.parse(saved) };
  } catch {}

  return DEFAULT_REGION_TIMERS;
}

/**
 * Salva os tempos de rotação da TV
 */
export async function saveTvTimers(timers: RegionTimers): Promise<boolean> {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_TIMERS, JSON.stringify(timers));
  } catch {}

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from(TABLE_NAME).upsert([
        { key: 'tv_timers', value: timers, updated_at: new Date().toISOString() },
      ]);
      return !error;
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * Escuta alterações no Supabase em Tempo Real (Realtime)
 * Faz com que a TV na parede receba atualizações instantaneamente sem precisar de F5
 */
export function subscribeToMapConfigChanges(
  onDividersChange?: (dividers: DividersData) => void,
  onTimersChange?: (timers: RegionTimers) => void
) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const client = supabase;
  const channel = client
    .channel('mapa_config_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE_NAME },
      (payload) => {
        const newRecord = payload.new as { key: string; value: any } | null;
        if (!newRecord) return;

        if (newRecord.key === 'div_norte' || newRecord.key === 'div_oeste_leste') {
          // Recarrega divisas
          loadDividers().then((divs) => onDividersChange?.(divs));
        } else if (newRecord.key === 'tv_timers') {
          onTimersChange?.(newRecord.value);
        }
      }
    )
    .subscribe();

  return () => {
    client.removeChannel(channel);
  };
}

