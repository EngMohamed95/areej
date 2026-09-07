const fs = require('fs');
const path = require('path');

// Read meatportCatalog.ts and parse existing products
const catalogContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'meatportCatalog.ts'), 'utf8');

// Extract products array using eval or regex/ast
// Or write a small node script that imports or matches the products
const prodBlocks = catalogContent.split(/{\s*id:\s*'mp-p-/).slice(1);
const existingProducts = prodBlocks.map(block => {
  const full = "{ id: 'mp-p-" + block;
  const id = full.match(/id:\s*'([^']+)'/)?.[1];
  const catId = full.match(/categoryId:\s*'([^']+)'/)?.[1];
  const nameEn = full.match(/nameEn:\s*'([^']+)'/)?.[1];
  const nameAr = full.match(/nameAr:\s*'([^']+)'/)?.[1];
  const price = parseFloat(full.match(/price:\s*([\d.]+)/)?.[1] || 0);
  const calories = parseInt(full.match(/calories:\s*([\d]+)/)?.[1] || 0, 10);
  const descEn = full.match(/descriptionEn:\s*'([^']*)'/)?.[1];
  const descAr = full.match(/descriptionAr:\s*'([^']*)'/)?.[1];
  return { id, catId, nameEn, nameAr, price, calories, descEn, descAr };
});

console.log(`Existing products count: ${existingProducts.length}`);

// Read extracted live items
const liveItems = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted-live-items.json'), 'utf8'));
console.log(`Live items count: ${liveItems.length}`);

console.log('\n=== CHECKING STEAKS (gid=1470434996) ===');
const liveSteaks = liveItems.filter(i => i.sheet === 'STEAKS');
const existingSteaks = existingProducts.filter(p => p.catId === 'c-mp-steaks');

console.log(`Live steaks: ${liveSteaks.length}, Existing steaks: ${existingSteaks.length}`);
liveSteaks.forEach((ls, i) => {
  const es = existingSteaks[i];
  const matchName = existingSteaks.find(e => e.nameEn.toLowerCase() === ls.cleanName.toLowerCase() || ls.cleanName.toLowerCase().includes(e.nameEn.toLowerCase()));
  console.log(`[${i+1}] Live: "${ls.cleanName}" (${ls.price} SAR, ${ls.calories} cal) | Catalog: "${es?.nameEn}" (${es?.price} SAR, ${es?.calories} cal) | PriceDiff: ${es ? ls.price - es.price : 'NEW'}`);
});

console.log('\n=== ALL ITEMS PRICE/ATTRIBUTE COMPARISON ACROSS ALL CATEGORIES ===');
let diffCount = 0;
let newCount = 0;

for (const item of liveItems) {
  if (item.price === 0 && !item.cleanName) continue;
  // find in existingProducts
  const exact = existingProducts.find(p => p.nameEn.toLowerCase() === item.cleanName.toLowerCase());
  const partial = existingProducts.find(p => 
    p.nameEn.toLowerCase().includes(item.cleanName.toLowerCase()) || 
    item.cleanName.toLowerCase().includes(p.nameEn.toLowerCase())
  );
  const match = exact || partial;

  if (!match) {
    console.log(`[NEW ITEM in ${item.sheet}] "${item.cleanName}" | Price: ${item.price} SAR`);
    newCount++;
  } else {
    const pDiff = item.price - match.price;
    if (Math.abs(pDiff) > 0.01) {
      console.log(`[PRICE CHANGE in ${item.sheet}] "${match.nameEn}" | Old: ${match.price} SAR -> New: ${item.price} SAR (diff: ${pDiff})`);
      diffCount++;
    }
  }
}

console.log(`\nSummary: ${diffCount} price changes, ${newCount} new items.`);
