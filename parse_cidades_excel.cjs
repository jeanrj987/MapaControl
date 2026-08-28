const fs = require('fs');
const xlsx = require('xlsx');

const wb = xlsx.readFile('Cidades/cidades_unicas.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

function formatCityName(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (['do', 'da', 'de', 'dos', 'das', 'e'].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Coordenadas e mapeamento das 97 cidades
const coordsMap = {
  "Água Boa - MT": { name: "Água Boa", uf: "MT", lon: -52.16, lat: -14.05, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Alta Floresta - MT": { name: "Alta Floresta", uf: "MT", lon: -56.09, lat: -9.87, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Altamira - PA": { name: "Altamira", uf: "PA", lon: -52.21, lat: -3.20, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "ARAGUARI - MG": { name: "Araguari", uf: "MG", lon: -48.18, lat: -18.64, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Bandeirantes - MT": { name: "Nova Bandeirantes", uf: "MT", lon: -56.08, lat: -10.05, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Boa Esperança - MT": { name: "Boa Esperança do Norte", uf: "MT", lon: -55.35, lat: -12.45, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Boa Vista PR": { name: "Boa Vista", uf: "RR", lon: -60.67, lat: 2.82, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "BOM JESUS DO ARAGUAIA - MT": { name: "Bom Jesus do Araguaia", uf: "MT", lon: -51.56, lat: -12.17, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Bom Despacho": { name: "Bom Despacho", uf: "MG", lon: -45.25, lat: -19.73, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Bom Jesus de Goias - GO": { name: "Bom Jesus de Goiás", uf: "GO", lon: -49.95, lat: -18.21, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Cabixi - RO": { name: "Cabixi", uf: "RO", lon: -60.54, lat: -13.49, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Cacoal - RO": { name: "Cacoal", uf: "RO", lon: -61.44, lat: -11.43, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Campinápolis - MT": { name: "Campinápolis", uf: "MT", lon: -52.88, lat: -14.50, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Campo Verde - MT": { name: "Campo Verde", uf: "MT", lon: -55.16, lat: -15.54, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Canarana - MT": { name: "Canarana", uf: "MT", lon: -52.27, lat: -13.55, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Candeias do Jamari - RO": { name: "Candeias do Jamari", uf: "RO", lon: -63.70, lat: -8.81, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "CARACARAÍ - RR": { name: "Caracaraí", uf: "RR", lon: -61.13, lat: 1.82, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Carlinda - MT": { name: "Carlinda", uf: "MT", lon: -55.83, lat: -9.96, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Cerejeiras - RO": { name: "Cerejeiras", uf: "RO", lon: -60.81, lat: -13.18, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Chupinguaia - RO": { name: "Chupinguaia", uf: "RO", lon: -60.89, lat: -12.55, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Claudia - MT": { name: "Cláudia", uf: "MT", lon: -54.88, lat: -11.50, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Colorado do Oeste - RO": { name: "Colorado do Oeste", uf: "RO", lon: -60.54, lat: -13.11, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Conceição do Araguaia - PA": { name: "Conceição do Araguaia", uf: "PA", lon: -49.26, lat: -8.26, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Confresa - MT": { name: "Confresa", uf: "MT", lon: -51.56, lat: -10.64, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Corumbiara - RO": { name: "Corumbiara", uf: "RO", lon: -60.94, lat: -12.96, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Cuiabá - MT": { name: "Cuiabá", uf: "MT", lon: -56.09, lat: -15.60, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Feliz Natal - MT": { name: "Feliz Natal", uf: "MT", lon: -54.90, lat: -12.37, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Formiga - MG": { name: "Formiga", uf: "MG", lon: -45.42, lat: -20.46, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "GOIATUBA GO": { name: "Goiatuba", uf: "GO", lon: -49.35, lat: -18.01, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Guarda Mor": { name: "Guarda-Mor", uf: "MG", lon: -47.10, lat: -17.77, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Guarantã do Norte - MT": { name: "Guarantã do Norte", uf: "MT", lon: -54.90, lat: -9.79, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Ibiá - MG": { name: "Ibiá", uf: "MG", lon: -46.53, lat: -19.47, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "INACIOLÂNDIA - GO": { name: "Inaciolândia", uf: "GO", lon: -50.06, lat: -18.49, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Ipiranga do Norte - MT": { name: "Ipiranga do Norte", uf: "MT", lon: -56.16, lat: -12.24, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Itaituba - PA": { name: "Itaituba", uf: "PA", lon: -55.99, lat: -4.27, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Itanhangá - MT": { name: "Itanhangá", uf: "MT", lon: -56.59, lat: -12.21, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Itapuã do Oeste - RO": { name: "Itapuã do Oeste", uf: "RO", lon: -63.18, lat: -9.19, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Juara - MT": { name: "Juara", uf: "MT", lon: -57.52, lat: -11.25, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Juina - MT": { name: "Juína", uf: "MT", lon: -58.74, lat: -11.37, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Lagoa da Confusão TO": { name: "Lagoa da Confusão", uf: "TO", lon: -49.62, lat: -10.79, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Luis Eduardo Magalhães - BA": { name: "Luís Eduardo Magalhães", uf: "BA", lon: -45.80, lat: -12.09, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Lucas do Rio Verde - MT": { name: "Lucas do Rio Verde", uf: "MT", lon: -55.91, lat: -13.05, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Mara Rosa - GO": { name: "Mara Rosa", uf: "GO", lon: -49.17, lat: -14.01, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Marcelândia - MT": { name: "Marcelândia", uf: "MT", lon: -54.45, lat: -11.08, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Marianópolis do Tocantins - TO": { name: "Marianópolis do Tocantins", uf: "TO", lon: -49.65, lat: -9.79, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Matupá - MT": { name: "Matupá", uf: "MT", lon: -54.93, lat: -10.18, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Moju - PA": { name: "Moju", uf: "PA", lon: -48.77, lat: -1.88, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Nova Canaã do Norte - MT": { name: "Nova Canaã do Norte", uf: "MT", lon: -55.95, lat: -10.62, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Nova Guarita - MT": { name: "Nova Guarita", uf: "MT", lon: -55.43, lat: -10.31, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Nova Mamoré - RO": { name: "Nova Mamoré", uf: "RO", lon: -65.33, lat: -10.40, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Nova Maringá - MT": { name: "Nova Maringá", uf: "MT", lon: -57.07, lat: -13.01, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Nova Monte Verde - MT": { name: "Nova Monte Verde", uf: "MT", lon: -57.48, lat: -9.97, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Nova Mutum - MT": { name: "Nova Mutum", uf: "MT", lon: -56.08, lat: -13.83, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Nova Ubiratã - MT": { name: "Nova Ubiratã", uf: "MT", lon: -55.25, lat: -12.98, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Nova Xavantina - MT": { name: "Nova Xavantina", uf: "MT", lon: -52.35, lat: -14.67, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Novo Acordo - TO": { name: "Novo Acordo", uf: "TO", lon: -47.67, lat: -9.96, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Novo Horizonte do Norte - MT": { name: "Novo Horizonte do Norte", uf: "MT", lon: -57.35, lat: -11.41, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Novo Mundo - MT": { name: "Novo Mundo", uf: "MT", lon: -55.19, lat: -9.95, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Novo Progresso - TO": { name: "Novo Progresso", uf: "PA", lon: -55.42, lat: -7.14, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Paranaíta - MT": { name: "Paranaíta", uf: "MT", lon: -56.47, lat: -9.66, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "PARAÍSO DO TOCANTINS - TO": { name: "Paraíso do Tocantins", uf: "TO", lon: -48.88, lat: -10.17, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Paranatinga - MT": { name: "Paranatinga", uf: "MT", lon: -54.04, lat: -14.43, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Paraúna - GO": { name: "Paraúna", uf: "GO", lon: -50.44, lat: -16.94, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Peixoto de Azevedo - MT": { name: "Peixoto de Azevedo", uf: "MT", lon: -54.97, lat: -10.22, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Pimenteira do Oeste - RO": { name: "Pimenteiras do Oeste", uf: "RO", lon: -61.04, lat: -13.48, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Piranhas - GO": { name: "Piranhas", uf: "GO", lon: -51.82, lat: -16.42, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Portelândia - GO": { name: "Portelândia", uf: "GO", lon: -52.53, lat: -17.35, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Porto dos Gaúchos - MT": { name: "Porto dos Gaúchos", uf: "MT", lon: -57.41, lat: -11.53, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Porto Nacional - TO": { name: "Porto Nacional", uf: "TO", lon: -48.33, lat: -10.70, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Porto Velho - RO": { name: "Porto Velho", uf: "RO", lon: -63.90, lat: -8.76, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Primavera do Leste - MT": { name: "Primavera do Leste", uf: "MT", lon: -54.29, lat: -15.55, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Querência - MT": { name: "Querência", uf: "MT", lon: -52.19, lat: -11.79, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Redenção - PA": { name: "Redenção", uf: "PA", lon: -50.03, lat: -8.02, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Rio Crespo - RO": { name: "Rio Crespo", uf: "RO", lon: -62.90, lat: -9.70, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Rolim de Moura - RO": { name: "Rolim de Moura", uf: "RO", lon: -61.77, lat: -11.72, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Rosario Oeste - MT": { name: "Rosário Oeste", uf: "MT", lon: -56.42, lat: -14.83, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Rondonopolis - MT": { name: "Rondonópolis", uf: "MT", lon: -54.63, lat: -16.47, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "SANTA HELENA DE GOIÁS - GO": { name: "Santa Helena de Goiás", uf: "GO", lon: -50.59, lat: -17.81, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Santa Maria das Barreiras - PA": { name: "Santa Maria das Barreiras", uf: "PA", lon: -49.72, lat: -8.86, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Santa Maria do Tocantins - TO": { name: "Santa Maria do Tocantins", uf: "TO", lon: -47.79, lat: -8.91, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Santa Rita do Trivelato - MT": { name: "Santa Rita do Trivelato", uf: "MT", lon: -55.26, lat: -13.81, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Santa Rosa do Tocantins - TO": { name: "Santa Rosa do Tocantins", uf: "TO", lon: -48.12, lat: -11.44, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Santarém - PA": { name: "Santarém", uf: "PA", lon: -54.71, lat: -2.44, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Sapezal - MT": { name: "Sapezal", uf: "MT", lon: -58.76, lat: -13.54, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Senador Giomard - AC": { name: "Senador Guiomard", uf: "AC", lon: -67.74, lat: -10.15, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Seringueiras - RO": { name: "Seringueiras", uf: "RO", lon: -63.01, lat: -11.79, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Silvanópolis - TO": { name: "Silvanópolis", uf: "TO", lon: -48.16, lat: -11.14, regionId: "leste", consultor: "André", comercial: "Gilberto" },
  "Sinop - MT": { name: "Sinop", uf: "MT", lon: -55.51, lat: -11.86, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "São José do Rio Claro - MT": { name: "São José do Rio Claro", uf: "MT", lon: -56.72, lat: -13.44, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "São Miguel do Guaporé - RO": { name: "São Miguel do Guaporé", uf: "RO", lon: -62.71, lat: -11.69, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Sorriso - MT": { name: "Sorriso", uf: "MT", lon: -55.71, lat: -12.54, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Tabaporã - MT": { name: "Tabaporã", uf: "MT", lon: -56.81, lat: -11.31, regionId: "oeste", consultor: "André", comercial: "Pablo" },
  "Tapurah - MT": { name: "Tapurah", uf: "MT", lon: -56.50, lat: -12.78, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Terra Nova do Norte - MT": { name: "Terra Nova do Norte", uf: "MT", lon: -55.23, lat: -10.51, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Vera - MT": { name: "Vera", uf: "MT", lon: -55.32, lat: -12.30, regionId: "sorriso", consultor: "Cledinei", comercial: "Sidnei" },
  "Vila Rica - MT": { name: "Vila Rica", uf: "MT", lon: -51.11, lat: -10.01, regionId: "norte", consultor: "Wanderson", comercial: "Sidnei" },
  "Vilhena - RO": { name: "Vilhena", uf: "RO", lon: -60.14, lat: -12.74, regionId: "oeste", consultor: "André", comercial: "Pablo" }
};

const citiesList = data.map((row, idx) => {
  const rawName = row['Cidade - Estado'] || '';
  const info = coordsMap[rawName] || { 
    name: formatCityName(rawName), 
    uf: "MT", 
    lon: -55.5, 
    lat: -13.0, 
    regionId: "norte", 
    consultor: "Wanderson", 
    comercial: "Sidnei" 
  };
  
  return {
    id: `city_${idx}`,
    rawName,
    name: info.name,
    uf: info.uf,
    lon: info.lon,
    lat: info.lat,
    regionId: info.regionId,
    consultor: info.consultor,
    comercial: info.comercial
  };
});

const tsCode = `import { RegiaoId } from '../types/region';

export interface ExcelCity {
  id: string;
  rawName: string;
  name: string;
  uf: string;
  lon: number;
  lat: number;
  regionId: RegiaoId;
  consultor: string;
  comercial: string;
}

export const EXCEL_CITIES: ExcelCity[] = ${JSON.stringify(citiesList, null, 2)};
`;

fs.writeFileSync('src/data/cidadesExcel.ts', tsCode);
console.log('Successfully regenerated src/data/cidadesExcel.ts with 97 clean city names!');
