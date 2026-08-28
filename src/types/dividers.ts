export interface ControlPoint {
  id: string;
  x: number;
  y: number;
}

export const DEFAULT_DIV_NORTE: ControlPoint[] = [
  { id: 'n0', x: 240, y: 342 },
  { id: 'n1', x: 280, y: 343 },
  { id: 'n2', x: 320, y: 344 },
  { id: 'n3', x: 350, y: 345 },
  { id: 'n4', x: 363, y: 345 },
  { id: 'n5', x: 363, y: 355 },
  { id: 'n6', x: 363, y: 365 },
  { id: 'n7', x: 369, y: 372 },
  { id: 'n8', x: 375, y: 380 },
  { id: 'n9', x: 378, y: 392 },
  { id: 'n10', x: 380, y: 405 },
  { id: 'n11', x: 392, y: 408 },
  { id: 'n12', x: 405, y: 410 },
  { id: 'n13', x: 410, y: 411 },
  { id: 'n14', x: 415, y: 412 },
  { id: 'n15', x: 420, y: 411 },
  { id: 'n16', x: 425, y: 410 },
  { id: 'n17', x: 435, y: 398 },
  { id: 'n18', x: 445, y: 385 },
  { id: 'n19', x: 455, y: 376 },
  { id: 'n20', x: 465, y: 368 },
  { id: 'n21', x: 490, y: 367 },
  { id: 'n22', x: 520, y: 366 },
  { id: 'n23', x: 550, y: 365 },
];

export const DEFAULT_DIV_OESTE_LESTE: ControlPoint[] = [
  { id: 'ol0', x: 405, y: 410 },
  { id: 'ol1', x: 403, y: 415 },
  { id: 'ol2', x: 400, y: 420 },
  { id: 'ol3', x: 397, y: 432 },
  { id: 'ol4', x: 393, y: 445 },
  { id: 'ol5', x: 394, y: 475 },
  { id: 'ol6', x: 395, y: 510 },
  { id: 'ol7', x: 395, y: 550 },
];
