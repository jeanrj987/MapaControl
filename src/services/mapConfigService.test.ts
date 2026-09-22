import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DEFAULT_DIV_NORTE, DEFAULT_DIV_OESTE_LESTE, DEFAULT_DIV_PA } from '../types/dividers';

// Simula um ambiente sem Supabase configurado (mesma situação de rede offline
// ou variáveis de ambiente ausentes) para validar a resiliência descrita no
// Vault: a aplicação nunca deve travar por falta de nuvem.
vi.mock('./supabase', () => ({
  supabase: null,
  isSupabaseConfigured: false,
}));

const { loadDividers, saveDividers } = await import('./mapConfigService');

describe('mapConfigService sem Supabase configurado (fallback local)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loadDividers retorna os valores padrão quando não há nada salvo localmente', async () => {
    const result = await loadDividers();
    expect(result.divNorte).toEqual(DEFAULT_DIV_NORTE);
    expect(result.divOesteLeste).toEqual(DEFAULT_DIV_OESTE_LESTE);
    expect(result.divPa).toEqual(DEFAULT_DIV_PA);
  });

  it('saveDividers grava no localStorage e resolve como sucesso mesmo sem nuvem', async () => {
    const customNorte = [{ id: 'n0', x: 1, y: 2 }];
    const ok = await saveDividers(customNorte, DEFAULT_DIV_OESTE_LESTE, DEFAULT_DIV_PA);

    expect(ok).toBe(true);
    expect(JSON.parse(localStorage.getItem('mapa_live_div_norte')!)).toEqual(customNorte);
  });

  it('loadDividers lê de volta o que foi salvo por saveDividers', async () => {
    const customNorte = [{ id: 'n0', x: 5, y: 6 }];
    await saveDividers(customNorte, DEFAULT_DIV_OESTE_LESTE, DEFAULT_DIV_PA);

    const result = await loadDividers();
    expect(result.divNorte).toEqual(customNorte);
  });
});
