const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const productDir = path.join(root, 'public', 'tenants', 'areej', 'products');
const initialDataPath = path.join(root, 'src', 'initialData.ts');

const availableIds = new Set(
  fs.readdirSync(productDir)
    .filter((name) => /^areej-p-\d+\.webp$/.test(name))
    .map((name) => path.basename(name, '.webp'))
);

let source = fs.readFileSync(initialDataPath, 'utf8');
for (const id of availableIds) {
  const escapedId = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const productPattern = new RegExp(`("id": "${escapedId}"[\\s\\S]*?"imageUrl": )"[^"]*"`);
  if (!productPattern.test(source)) {
    throw new Error(`Could not find imageUrl for ${id}`);
  }
  source = source.replace(productPattern, `$1"/tenants/areej/products/${id}.webp"`);
}

fs.writeFileSync(initialDataPath, source, 'utf8');
console.log(`Linked ${availableIds.size} local product images in src/initialData.ts.`);
