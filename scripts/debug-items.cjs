const fs = require('fs');
const path = require('path');

const cat = fs.readFileSync(path.join(__dirname, '..', 'src', 'meatportCatalog.ts'), 'utf8');

const ids = [
  'mp-p-082', 'mp-p-083', 'mp-p-084', 'mp-p-085', 'mp-p-086'
];

ids.forEach(id => {
  const re = new RegExp(`id:\\s*'${id}'[\\s\\S]*?nameEn:\\s*'([^']+)'[\\s\\S]*?nameAr:\\s*'([^']+)'[\\s\\S]*?price:\\s*([\\d.]+)`);
  const m = cat.match(re);
  if (m) {
    console.log(`${id}: nameEn='${m[1]}', nameAr='${m[2]}', price=${m[3]}`);
  } else {
    console.log(`${id}: NOT FOUND`);
  }
});
