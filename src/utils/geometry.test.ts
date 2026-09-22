import { describe, it, expect } from 'vitest';
import { findClosestPointIndex, getNextInRotation } from './geometry';

describe('findClosestPointIndex', () => {
  it('retorna o índice do ponto exatamente sobre o alvo', () => {
    const points = [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 20, y: 20 }];
    expect(findClosestPointIndex(points, { x: 10, y: 10 })).toBe(1);
  });

  it('retorna o índice do ponto mais próximo quando nenhum é exato', () => {
    const points = [{ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 12, y: 9 }];
    expect(findClosestPointIndex(points, { x: 10, y: 10 })).toBe(2);
  });

  it('desempata para o primeiro ponto encontrado em caso de distâncias iguais', () => {
    const points = [{ x: -5, y: 0 }, { x: 5, y: 0 }];
    expect(findClosestPointIndex(points, { x: 0, y: 0 })).toBe(0);
  });

  it('retorna 0 para uma lista com um único ponto', () => {
    const points = [{ x: 42, y: 7 }];
    expect(findClosestPointIndex(points, { x: 0, y: 0 })).toBe(0);
  });
});

describe('getNextInRotation (avanço do Modo TV)', () => {
  const sequence = ['norte', 'sorriso', 'oeste', 'leste', null] as const;

  it('avança para o próximo item da sequência', () => {
    expect(getNextInRotation(sequence, 'norte')).toBe('sorriso');
    expect(getNextInRotation(sequence, 'sorriso')).toBe('oeste');
    expect(getNextInRotation(sequence, 'oeste')).toBe('leste');
  });

  it('volta para o primeiro item ao passar do último (ciclo fechado)', () => {
    expect(getNextInRotation(sequence, null)).toBe('norte');
  });

  it('começa do primeiro item quando o valor atual não está na sequência', () => {
    expect(getNextInRotation(sequence, 'inexistente' as (typeof sequence)[number])).toBe('norte');
  });
});
