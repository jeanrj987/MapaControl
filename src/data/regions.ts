import { Regiao } from '../types/region';

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
    nome: 'Norte MT a PA/RR',
    area: 'MT a PA/RR',
    cor: '#0091FF',
    tipo: 'principal',
    equipe: {
      consultor: { nome: 'Wanderson' },
      comercial: { nome: 'Sidnei' },
      atendentes: [
        { nome: 'Jéssica' },
        { nome: 'Marcos' }
      ]
    },
    clientes: [],
    cidadesPorEstado: {
      "MT": [
        "Alta Floresta",
        "Bandeirantes",
        "Carlinda",
        "Confresa",
        "Guarantã do Norte",
        "Marcelândia",
        "Matupá",
        "Nova Canaã do Norte",
        "Nova Guarita",
        "Nova Monte Verde",
        "Novo Mundo",
        "Paranaíta",
        "Peixoto de Azevedo",
        "Terra Nova do Norte",
        "Vila Rica"
      ],
      "PA": [
        "Altamira",
        "Conceição do Araguaia",
        "Itaituba",
        "Moju",
        "Novo Progresso",
        "Redenção",
        "Santana do Araguaia",
        "Santa Maria das Barreiras",
        "Santarém"
      ],
      "RR": [
        "Boa Vista",
        "Caracaraí"
      ]
    }
  },
  leste: {
    id: 'leste',
    nome: 'Leste MT a TO/GO/MG',
    area: 'MT a TO/GO/MG',
    cor: '#FF7F27',
    tipo: 'principal',
    equipe: {
      consultor: { nome: 'André' },
      comercial: { nome: 'Gilberto' },
      atendentes: [
        { nome: 'Gabriel' },
        { nome: 'Samuel' }
      ]
    },
    clientes: [],
    cidadesPorEstado: {
      "MT": [
        "Água Boa",
        "Bom Jesus do Araguaia",
        "Campinápolis",
        "Campo Verde",
        "Canarana",
        "Cuiabá",
        "Nova Xavantina",
        "Paranatinga",
        "Primavera do Leste",
        "Querência",
        "Rondonópolis",
        "Santa Rita do Trivelato"
      ],
      "MG": [
        "Araguari",
        "Bom Despacho",
        "Formiga",
        "Guarda-Mor",
        "Ibiá"
      ],
      "GO": [
        "Bom Jesus de Goiás",
        "Goiatuba",
        "Inaciolândia",
        "Mara Rosa",
        "Paraúna",
        "Piranhas",
        "Portelândia",
        "Santa Helena de Goiás",
        "Uruaçu"
      ],
      "TO": [
        "Crixás do Tocantins",
        "Lagoa da Confusão",
        "Marianópolis do Tocantins",
        "Novo Acordo",
        "Paraíso do Tocantins",
        "Porto Nacional",
        "Santa Maria do Tocantins",
        "Santa Rosa do Tocantins",
        "Silvanópolis"
      ],
      "BA": [
        "Luís Eduardo Magalhães"
      ]
    }
  },
  oeste: {
    id: 'oeste',
    nome: 'Oeste MT a RO/AC',
    area: 'MT a RO/AC',
    cor: '#22B14C',
    tipo: 'principal',
    equipe: {
      consultor: { nome: 'André' },
      comercial: { nome: 'Pablo' },
      atendentes: [
        { nome: 'Amanda' },
        { nome: 'Cauê' }
      ]
    },
    clientes: [],
    cidadesPorEstado: {
      "RO": [
        "Cabixi",
        "Cacoal",
        "Candeias do Jamari",
        "Cerejeiras",
        "Chupinguaia",
        "Colorado do Oeste",
        "Corumbiara",
        "Itapuã do Oeste",
        "Nova Mamoré",
        "Pimenteiras do Oeste",
        "Porto Velho",
        "Rio Crespo",
        "Rolim de Moura",
        "Seringueiras",
        "São Miguel do Guaporé",
        "Vilhena"
      ],
      "MT": [
        "Campos de Júlio",
        "Juara",
        "Juína",
        "Nova Maringá",
        "Nova Mutum",
        "Novo Horizonte do Norte",
        "Porto dos Gaúchos",
        "Rosário Oeste",
        "Sapezal",
        "São José do Rio Claro"
      ],
      "AC": [
        "Senador Guiomard"
      ]
    }
  },
  sorriso: {
    id: 'sorriso',
    nome: 'Sorriso e Região',
    area: 'Polo Central MT',
    cor: '#FFF200',
    tipo: 'sub-regiao',
    regiaoPai: 'norte',
    equipe: {
      consultor: { nome: 'Cledinei' },
      comercial: { nome: 'Sidnei' },
      atendentes: [
        { nome: 'Maria' },
        { nome: 'Jean' }
      ]
    },
    clientes: [],
    cidadesPorEstado: {
      "MT": [
        "Boa Esperança do Norte",
        "Cláudia",
        "Feliz Natal",
        "Ipiranga do Norte",
        "Itanhangá",
        "Lucas do Rio Verde",
        "Nova Ubiratã",
        "Sinop",
        "Sorriso",
        "Tabaporã",
        "Tapurah",
        "Vera"
      ]
    }
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

export const CONSULTORES_LEGENDA = [
  { nome: 'Wanderson', cor: '#0091FF', cargo: 'Consultor Norte' },
  { nome: 'Cledinei', cor: '#FFF200', cargo: 'Consultor Sorriso' },
  { nome: 'André', cor: '#22B14C', cargo: 'Consultor Oeste / Leste' },
];
