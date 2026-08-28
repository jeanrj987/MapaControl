const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('Cidades/cidades_unicas.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

// Agrupar cidades por regiao e estado
const norteCidades = {};
const lesteCidades = {};
const oesteCidades = {};
const sorrisoCidades = {};

const coordsMap = {
  "Água Boa - MT": { uf: "MT", regionId: "leste" },
  "Alta Floresta - MT": { uf: "MT", regionId: "norte" },
  "Altamira - PA": { uf: "PA", regionId: "norte" },
  "ARAGUARI - MG": { uf: "MG", regionId: "leste" },
  "Bandeirantes - MT": { uf: "MT", regionId: "norte" },
  "Boa Esperança - MT": { uf: "MT", regionId: "sorriso" },
  "Boa Vista PR": { uf: "RR", regionId: "norte" },
  "BOM JESUS DO ARAGUAIA - MT": { uf: "MT", regionId: "leste" },
  "Bom Despacho": { uf: "MG", regionId: "leste" },
  "Bom Jesus de Goias - GO": { uf: "GO", regionId: "leste" },
  "Cabixi - RO": { uf: "RO", regionId: "oeste" },
  "Cacoal - RO": { uf: "RO", regionId: "oeste" },
  "Campinápolis - MT": { uf: "MT", regionId: "leste" },
  "Campo Verde - MT": { uf: "MT", regionId: "leste" },
  "Canarana - MT": { uf: "MT", regionId: "leste" },
  "Candeias do Jamari - RO": { uf: "RO", regionId: "oeste" },
  "CARACARAÍ - RR": { uf: "RR", regionId: "norte" },
  "Carlinda - MT": { uf: "MT", regionId: "norte" },
  "Cerejeiras - RO": { uf: "RO", regionId: "oeste" },
  "Chupinguaia - RO": { uf: "RO", regionId: "oeste" },
  "Claudia - MT": { uf: "MT", regionId: "sorriso" },
  "Colorado do Oeste - RO": { uf: "RO", regionId: "oeste" },
  "Conceição do Araguaia - PA": { uf: "PA", regionId: "norte" },
  "Confresa - MT": { uf: "MT", regionId: "norte" },
  "Corumbiara - RO": { uf: "RO", regionId: "oeste" },
  "Cuiabá - MT": { uf: "MT", regionId: "leste" },
  "Feliz Natal - MT": { uf: "MT", regionId: "sorriso" },
  "Formiga - MG": { uf: "MG", regionId: "leste" },
  "GOIATUBA GO": { uf: "GO", regionId: "leste" },
  "Guarda Mor": { uf: "MG", regionId: "leste" },
  "Guarantã do Norte - MT": { uf: "MT", regionId: "norte" },
  "Ibiá - MG": { uf: "MG", regionId: "leste" },
  "INACIOLÂNDIA - GO": { uf: "GO", regionId: "leste" },
  "Ipiranga do Norte - MT": { uf: "MT", regionId: "sorriso" },
  "Itaituba - PA": { uf: "PA", regionId: "norte" },
  "Itanhangá - MT": { uf: "MT", regionId: "sorriso" },
  "Itapuã do Oeste - RO": { uf: "RO", regionId: "oeste" },
  "Juara - MT": { uf: "MT", regionId: "oeste" },
  "Juina - MT": { uf: "MT", regionId: "oeste" },
  "Lagoa da Confusão TO": { uf: "TO", regionId: "leste" },
  "Luis Eduardo Magalhães - BA": { uf: "BA", regionId: "leste" },
  "Lucas do Rio Verde - MT": { uf: "MT", regionId: "sorriso" },
  "Mara Rosa - GO": { uf: "GO", regionId: "leste" },
  "Marcelândia - MT": { uf: "MT", regionId: "norte" },
  "Marianópolis do Tocantins - TO": { uf: "TO", regionId: "leste" },
  "Matupá - MT": { uf: "MT", regionId: "norte" },
  "Moju - PA": { uf: "PA", regionId: "norte" },
  "Nova Canaã do Norte - MT": { uf: "MT", regionId: "norte" },
  "Nova Guarita - MT": { uf: "MT", regionId: "norte" },
  "Nova Mamoré - RO": { uf: "RO", regionId: "oeste" },
  "Nova Maringá - MT": { uf: "MT", regionId: "sorriso" },
  "Nova Monte Verde - MT": { uf: "MT", regionId: "norte" },
  "Nova Mutum - MT": { uf: "MT", regionId: "sorriso" },
  "Nova Ubiratã - MT": { uf: "MT", regionId: "sorriso" },
  "Nova Xavantina - MT": { uf: "MT", regionId: "leste" },
  "Novo Acordo - TO": { uf: "TO", regionId: "leste" },
  "Novo Horizonte do Norte - MT": { uf: "MT", regionId: "sorriso" },
  "Novo Mundo - MT": { uf: "MT", regionId: "norte" },
  "Novo Progresso - TO": { uf: "PA", regionId: "norte" },
  "Paranaíta - MT": { uf: "MT", regionId: "norte" },
  "PARAÍSO DO TOCANTINS - TO": { uf: "TO", regionId: "leste" },
  "Paranatinga - MT": { uf: "MT", regionId: "leste" },
  "Paraúna - GO": { uf: "GO", regionId: "leste" },
  "Peixoto de Azevedo - MT": { uf: "MT", regionId: "norte" },
  "Pimenteira do Oeste - RO": { uf: "RO", regionId: "oeste" },
  "Piranhas - GO": { uf: "GO", regionId: "leste" },
  "Portelândia - GO": { uf: "GO", regionId: "leste" },
  "Porto dos Gaúchos - MT": { uf: "MT", regionId: "oeste" },
  "Porto Nacional - TO": { uf: "TO", regionId: "leste" },
  "Porto Velho - RO": { uf: "RO", regionId: "oeste" },
  "Primavera do Leste - MT": { uf: "MT", regionId: "leste" },
  "Querência - MT": { uf: "MT", regionId: "leste" },
  "Redenção - PA": { uf: "PA", regionId: "norte" },
  "Rio Crespo - RO": { uf: "RO", regionId: "oeste" },
  "Rolim de Moura - RO": { uf: "RO", regionId: "oeste" },
  "Rosario Oeste - MT": { uf: "MT", regionId: "oeste" },
  "Rondonopolis - MT": { uf: "MT", regionId: "leste" },
  "SANTA HELENA DE GOIÁS - GO": { uf: "GO", regionId: "leste" },
  "Santa Maria das Barreiras - PA": { uf: "PA", regionId: "norte" },
  "Santa Maria do Tocantins - TO": { uf: "TO", regionId: "leste" },
  "Santa Rita do Trivelato - MT": { uf: "MT", regionId: "sorriso" },
  "Santa Rosa do Tocantins - TO": { uf: "TO", regionId: "leste" },
  "Santarém - PA": { uf: "PA", regionId: "norte" },
  "Sapezal - MT": { uf: "MT", regionId: "oeste" },
  "Senador Giomard - AC": { uf: "AC", regionId: "oeste" },
  "Seringueiras - RO": { uf: "RO", regionId: "oeste" },
  "Silvanópolis - TO": { uf: "TO", regionId: "leste" },
  "Sinop - MT": { uf: "MT", regionId: "sorriso" },
  "São José do Rio Claro - MT": { uf: "MT", regionId: "sorriso" },
  "São Miguel do Guaporé - RO": { uf: "RO", regionId: "oeste" },
  "Sorriso - MT": { uf: "MT", regionId: "sorriso" },
  "Tabaporã - MT": { uf: "MT", regionId: "oeste" },
  "Tapurah - MT": { uf: "MT", regionId: "sorriso" },
  "Terra Nova do Norte - MT": { uf: "MT", regionId: "norte" },
  "Vera - MT": { uf: "MT", regionId: "sorriso" },
  "Vila Rica - MT": { uf: "MT", regionId: "norte" },
  "Vilhena - RO": { uf: "RO", regionId: "oeste" }
};

data.forEach(r => {
  const raw = r['Cidade - Estado'] || '';
  const item = coordsMap[raw] || { uf: "MT", regionId: "norte" };
  const clean = raw.replace(/ - (MT|PA|MG|GO|RO|TO|BA|AC|RR|PR)$/i, '').replace(/ (MT|PA|MG|GO|RO|TO|BA|AC|RR|PR)$/i, '').trim();

  let target = norteCidades;
  if (item.regionId === 'leste') target = lesteCidades;
  else if (item.regionId === 'oeste') target = oesteCidades;
  else if (item.regionId === 'sorriso') target = sorrisoCidades;

  if (!target[item.uf]) target[item.uf] = [];
  if (!target[item.uf].includes(clean)) target[item.uf].push(clean);
});

const regionsCode = `import { Regiao } from '../types/region';

export interface CidadeCliente {
  nome: string;
  estado: string;
  consultor: string;
  corConsultor: string;
  x?: number;
  y?: number;
}

export interface RegiaoCompleta extends Regiao {
  cidadesPorEstado: Record<string, string[]>;
}

export const REGIONS_DATA: Record<string, RegiaoCompleta> = {
  norte: {
    id: 'norte',
    nome: 'Norte',
    area: 'MT a PA/RR',
    cor: '#0091FF',
    tipo: 'principal',
    equipe: {
      consultor: { nome: 'Wanderson' },
      comercial: { nome: 'Sidnei' },
      atendentes: [
        { nome: 'Marcos' },
        { nome: 'Cauê' }
      ]
    },
    clientes: [],
    cidadesPorEstado: ${JSON.stringify(norteCidades, null, 6)}
  },
  leste: {
    id: 'leste',
    nome: 'Leste',
    area: 'MT a TO/GO/MG',
    cor: '#FF7F27',
    tipo: 'principal',
    equipe: {
      consultor: { nome: 'André' },
      comercial: { nome: 'Gilberto' },
      atendentes: [
        { nome: 'Jéssica' },
        { nome: 'Samuel' }
      ]
    },
    clientes: [],
    cidadesPorEstado: ${JSON.stringify(lesteCidades, null, 6)}
  },
  oeste: {
    id: 'oeste',
    nome: 'Oeste',
    area: 'MT a RO/AC',
    cor: '#22B14C',
    tipo: 'principal',
    equipe: {
      consultor: { nome: 'André' },
      comercial: { nome: 'Pablo' },
      atendentes: [
        { nome: 'Gabriel' },
        { nome: 'Jean' }
      ]
    },
    clientes: [],
    cidadesPorEstado: ${JSON.stringify(oesteCidades, null, 6)}
  },
  sorriso: {
    id: 'sorriso',
    nome: 'Sorriso e Região',
    cor: '#FFF200',
    tipo: 'sub-regiao',
    regiaoPai: 'norte',
    equipe: {
      consultor: { nome: 'Cledinei' },
      comercial: { nome: 'Sidnei' },
      atendentes: [
        { nome: 'Amanda' },
        { nome: 'Maria' }
      ]
    },
    clientes: [],
    cidadesPorEstado: ${JSON.stringify(sorrisoCidades, null, 6)}
  }
};

export const REGIONS_LIST = [
  REGIONS_DATA.norte,
  REGIONS_DATA.leste,
  REGIONS_DATA.oeste,
  REGIONS_DATA.sorriso
];

export const getTeamMemberCount = (regiao: Regiao): number => {
  return 1 + 1 + regiao.equipe.atendentes.length;
};

// Legenda de Consultores
export const CONSULTORES_LEGENDA = [
  { nome: 'André (Leste)', cor: '#8B4513', cargo: 'Consultor Leste' },
  { nome: 'André (Oeste)', cor: '#00C0FF', cargo: 'Consultor Oeste' },
  { nome: 'Wanderson', cor: '#000000', cargo: 'Consultor Norte' },
  { nome: 'Cledinei', cor: '#FFF200', cargo: 'Consultor Sorriso' },
];
`;

fs.writeFileSync('src/data/regions.ts', regionsCode);
console.log('Successfully updated src/data/regions.ts with all Excel cities grouped by state!');
