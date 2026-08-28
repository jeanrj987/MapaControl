export type RegiaoId = 'norte' | 'leste' | 'oeste' | 'sorriso';

export interface Pessoa {
  nome: string;
}

export interface Equipe {
  consultor: Pessoa;
  comercial: Pessoa;
  atendentes: Pessoa[];
}

export interface Cliente {
  id: string;
  nome: string;
}

export interface Regiao {
  id: RegiaoId;
  nome: string;
  area?: string;
  cor: string;
  tipo: 'principal' | 'sub-regiao';
  regiaoPai?: RegiaoId;
  equipe: Equipe;
  clientes: Cliente[];
}

export interface GeometriaRegiao {
  id: RegiaoId;
  path: string;
  labelPos: { x: number; y: number };
  badgePos: { x: number; y: number };
  highlightRing?: { cx: number; cy: number; r: number };
}

export type VisualState = 'normal' | 'hover' | 'focus' | 'selected' | 'dimmed';
