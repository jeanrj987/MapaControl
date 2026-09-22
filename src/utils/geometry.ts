export interface Point2D {
  x: number;
  y: number;
}

/**
 * Índice do ponto em `points` mais próximo de `target` (distância euclidiana).
 * Usado para achar o vértice de junção entre divisórias e para o "snap" magnético
 * do editor de divisas do mapa.
 */
export function findClosestPointIndex(points: Point2D[], target: Point2D): number {
  let bestIdx = 0;
  let minDistance = Infinity;
  for (let i = 0; i < points.length; i++) {
    const distance = Math.hypot(points[i].x - target.x, points[i].y - target.y);
    if (distance < minDistance) {
      minDistance = distance;
      bestIdx = i;
    }
  }
  return bestIdx;
}

/**
 * Próximo item de `sequence` depois de `current`, voltando ao início ao chegar no fim.
 * Se `current` não estiver na sequência, começa do primeiro item.
 * Usado pelo Modo TV para avançar de região a cada ciclo.
 */
export function getNextInRotation<T>(sequence: readonly T[], current: T): T {
  const currentIdx = sequence.indexOf(current);
  const nextIdx = (currentIdx + 1) % sequence.length;
  return sequence[nextIdx];
}
