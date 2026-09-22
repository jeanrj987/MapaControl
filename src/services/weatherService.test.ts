import { describe, it, expect } from 'vitest';
import { parseWmoCode } from './weatherService';

describe('parseWmoCode', () => {
  it('mapeia céu limpo (0) para sol', () => {
    expect(parseWmoCode(0)).toEqual({ icon: '☀️', text: 'Ensolarado' });
  });

  it('mapeia parcialmente nublado (1, 2)', () => {
    expect(parseWmoCode(1).text).toBe('Parcialmente Nublado');
    expect(parseWmoCode(2).text).toBe('Parcialmente Nublado');
  });

  it('mapeia nublado (3)', () => {
    expect(parseWmoCode(3).text).toBe('Nublado');
  });

  it('mapeia nevoeiro (45, 48)', () => {
    expect(parseWmoCode(45).text).toBe('Nevoeiro');
    expect(parseWmoCode(48).text).toBe('Nevoeiro');
  });

  it('mapeia garoa (51, 53, 55, 56, 57)', () => {
    for (const code of [51, 53, 55, 56, 57]) {
      expect(parseWmoCode(code).text).toBe('Garoa');
    }
  });

  it('mapeia chuva (61, 63, 65, 66, 67)', () => {
    for (const code of [61, 63, 65, 66, 67]) {
      expect(parseWmoCode(code).text).toBe('Chuva');
    }
  });

  it('mapeia neve (71, 73, 75, 77)', () => {
    for (const code of [71, 73, 75, 77]) {
      expect(parseWmoCode(code).text).toBe('Neve');
    }
  });

  it('mapeia pancadas de chuva (80, 81, 82)', () => {
    for (const code of [80, 81, 82]) {
      expect(parseWmoCode(code).text).toBe('Pancadas de Chuva');
    }
  });

  it('mapeia tempestade (95, 96, 99)', () => {
    for (const code of [95, 96, 99]) {
      expect(parseWmoCode(code).text).toBe('Tempestade');
    }
  });

  it('usa o texto padrão para um código WMO desconhecido', () => {
    expect(parseWmoCode(9999)).toEqual({ icon: '🌡️', text: 'Normal' });
  });
});
