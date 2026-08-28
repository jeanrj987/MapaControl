import { geoMercator, geoPath } from 'd3-geo';
import brStatesRaw from '../../br-states.json';
import { RegiaoId } from '../types/region';
import { EXCEL_CITIES, ExcelCity } from './cidadesExcel';

export interface StateRenderData {
  id: string;
  name: string;
  uf: string;
  path: string;
  centroid: [number, number];
  regionId?: RegiaoId;
}

export interface ProjectedCity extends ExcelCity {
  x: number;
  y: number;
}

export const MAP_VIEWBOX_WIDTH = 900;
export const MAP_VIEWBOX_HEIGHT = 900;
export const MAP_PADDING = 35;

export const STATE_NAMES: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá', BA: 'Bahia',
  CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul', MT: 'Mato Grosso',
  PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco', PI: 'Piauí', PR: 'Paraná',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RO: 'Rondônia', RR: 'Roraima',
  RS: 'Rio Grande do Sul', SC: 'Santa Catarina', SE: 'Sergipe', SP: 'São Paulo',
  TO: 'Tocantins'
};

const projection = geoMercator().fitExtent(
  [
    [MAP_PADDING, MAP_PADDING],
    [MAP_VIEWBOX_WIDTH - MAP_PADDING, MAP_VIEWBOX_HEIGHT - MAP_PADDING]
  ],
  brStatesRaw as any
);

const pathGenerator = geoPath().projection(projection);

export const projectCoordinates = (lon: number, lat: number): [number, number] => {
  const pt = projection([lon, lat]);
  return pt ? [Math.round(pt[0] * 10) / 10, Math.round(pt[1] * 10) / 10] : [450, 450];
};

export const getAllBrazilStates = (): StateRenderData[] => {
  const states: StateRenderData[] = [];

  for (const feature of (brStatesRaw as any).features) {
    const uf = feature.id as string;
    const name = STATE_NAMES[uf] || uf;
    const pathStr = pathGenerator(feature) || '';
    const rawCentroid = pathGenerator.centroid(feature);
    let cx = isNaN(rawCentroid[0]) ? 400 : rawCentroid[0];
    let cy = isNaN(rawCentroid[1]) ? 400 : rawCentroid[1];

    // Ajustes estratégicos para posicionar a sigla do estado em áreas 100% LIVRES de bolinhas/cidades:
    if (uf === 'MT') { cx -= 55; cy += 52; } // Move MT para o Sudoeste do estado (área livre do Pantanal)
    if (uf === 'GO') { cx += 45; cy += 18; } // Move GO para o Leste/Sudeste de Goiás (área livre sem cidades)
    if (uf === 'TO') { cx += 8; cy -= 58; }  // Move TO para o extremo Norte do Tocantins (Bico do Papagaio - 100% livre)
    if (uf === 'RO') { cx -= 22; cy += 12; } // Move RO para o Sudoeste de Rondônia (área de fronteira livre)
    if (uf === 'PA') { cx += 40; cy -= 45; } // Move PA para o Nordeste do Pará (área livre)
    if (uf === 'MG') { cx += 45; cy += 25; } // Move MG para o Centro/Leste de Minas Gerais (área livre sem cidades)
    if (uf === 'BA') { cx += 40; cy += 10; } // Move BA para o Centro/Leste da Bahia (área livre sem cidades)
    if (uf === 'RR') { cx -= 28; cy += 8; }  // Move RR para o Oeste de Roraima (área livre)

    // Ajustes finos adicionais para estados costeiros pequenos
    if (uf === 'DF') { cx += 1; cy += 1; }
    if (uf === 'RN') { cx -= 2; cy += 2; }
    if (uf === 'PB') { cx -= 2; cy += 2; }
    if (uf === 'PE') { cx -= 5; cy += 2; }
    if (uf === 'AL') { cx -= 2; cy += 2; }
    if (uf === 'SE') { cx -= 2; cy += 2; }
    if (uf === 'ES') { cx -= 2; }
    if (uf === 'RJ') { cx -= 2; cy += 2; }

    let regionId: RegiaoId | undefined = undefined;
    if (['RR', 'PA'].includes(uf)) regionId = 'norte';
    else if (['AC', 'RO'].includes(uf)) regionId = 'oeste';
    else if (['TO', 'BA', 'GO', 'DF', 'MG'].includes(uf)) regionId = 'leste';
    else if (uf === 'MT') regionId = 'sorriso';

    states.push({
      id: uf,
      name,
      uf,
      path: pathStr,
      centroid: [Math.round(cx * 10) / 10, Math.round(cy * 10) / 10],
      regionId
    });
  }

  return states;
};

export const getProjectedCities = (): ProjectedCity[] => {
  return EXCEL_CITIES.map((c) => {
    const [x, y] = projectCoordinates(c.lon, c.lat);
    return {
      ...c,
      x,
      y
    };
  });
};
