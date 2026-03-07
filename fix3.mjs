import fs from 'fs';
const file = 'c:/Users/pedro/OneDrive/Github/Sueste/src/pages/servicos.astro';
let d = fs.readFileSync(file, 'utf8');
d = d.replace('label: "Sound Design",', 'label: "Edição Profissional",');
d = d.replace('val: "Edição profissional (Movie-like)",', 'val: "Movie-Like",');
fs.writeFileSync(file, d);
console.log('done');
