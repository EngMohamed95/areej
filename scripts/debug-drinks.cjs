const fs = require('fs');
const path = require('path');

const cat = fs.readFileSync(path.join(__dirname, '..', 'src', 'meatportCatalog.ts'), 'utf8');

const regex = /{\s*id:\s*'(mp-p-\d+)'[\s\S]*?categoryId:\s*'c-mp-drinks'[\s\S]*?nameEn:\s*'([^']+)'[\s\S]*?nameAr:\s*'([^']+)'[\s\S]*?price:\s*([\d.]+)/g;

let m;
console.log('=== DRINKS IN CATALOG ===');
while ((m = regex.exec(cat)) !== null) {
  console.log(`${m[1]}: ${m[2]} / ${m[3]} = ${m[4]} SAR`);
}
