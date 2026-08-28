const fs = require('fs');
const { geoMercator, geoPath } = require('d3-geo');

const raw = JSON.parse(fs.readFileSync('br-states.json'));
const proj = geoMercator().fitExtent([[35, 35], [865, 865]], raw);
const pathGenerator = geoPath().projection(proj);

let paths = [];
for (const f of raw.features) {
  const p = pathGenerator(f);
  const fill = ['BA', 'MG', 'GO', 'TO', 'DF'].includes(f.id) ? '#fed7aa' : '#ffffff';
  const stroke = ['BA', 'MG', 'GO', 'TO', 'DF'].includes(f.id) ? '#ea580c' : '#475569';
  const sw = ['BA', 'MG', 'GO', 'TO', 'DF'].includes(f.id) ? '3.2' : '1.5';
  paths.push(`<path id="${f.id}" d="${p}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" />`);
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="900" height="900">
${paths.join('\n')}
</svg>`;

fs.writeFileSync('test_map.svg', svg);
console.log('Saved test_map.svg');
