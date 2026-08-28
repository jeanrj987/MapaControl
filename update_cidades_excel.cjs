const fs = require('fs');

let content = fs.readFileSync('src/data/cidadesExcel.ts', 'utf8');

// Mapping of city names or IDs to correct regionId and consultor/corConsultor
const cityFixes = {
  'Nova Mutum': { regionId: 'oeste', consultor: 'André', corConsultor: '#22B14C' },
  'Nova Maringá': { regionId: 'oeste', consultor: 'André', corConsultor: '#22B14C' },
  'São José do Rio Claro': { regionId: 'oeste', consultor: 'André', corConsultor: '#22B14C' },
  'Santa Rita do Trivelato': { regionId: 'leste', consultor: 'André', corConsultor: '#FF7F27' },
  'Campos de Júlio': { regionId: 'oeste', consultor: 'André', corConsultor: '#22B14C' },
};

Object.entries(cityFixes).forEach(([cityName, fix]) => {
  const regex = new RegExp(`(nome:\\s*["']${cityName}["'][\\s\\S]*?regionId:\\s*["'])[a-z]+(["'][\\s\\S]*?consultor:\\s*["'])[^"']+([^"']*corConsultor:\\s*["'])[^"']+`, 'g');
  content = content.replace(regex, `$1${fix.regionId}$2${fix.consultor}$3${fix.corConsultor}`);
});

fs.writeFileSync('src/data/cidadesExcel.ts', content);
console.log('src/data/cidadesExcel.ts updated successfully!');
