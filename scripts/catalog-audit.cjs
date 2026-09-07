const fs = require('fs');
const path = require('path');

const catalogTs = fs.readFileSync(path.join(__dirname, '..', 'src', 'meatportCatalog.ts'), 'utf8');
const arDesc = JSON.parse(fs.readFileSync(path.join(__dirname, 'product-descriptions-ar.json'), 'utf8'));
const images = JSON.parse(fs.readFileSync(path.join(__dirname, 'product-images.json'), 'utf8'));
const liveItems = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted-live-items.json'), 'utf8'));

// Parse all products currently in meatportCatalog.ts
const blocks = catalogTs.split(/\{\s*id:\s*'mp-p-/).slice(1);
const catalogProducts = blocks.map(b => {
  const text = "{ id: 'mp-p-" + b;
  const id = text.match(/id:\s*'([^']+)'/)?.[1];
  const categoryId = text.match(/categoryId:\s*'([^']+)'/)?.[1];
  const nameEn = text.match(/nameEn:\s*'([^']+)'/)?.[1];
  const nameAr = text.match(/nameAr:\s*'([^']+)'/)?.[1];
  const price = parseFloat(text.match(/price:\s*([\d.]+)/)?.[1] || 0);
  const calories = parseInt(text.match(/calories:\s*([\d]+)/)?.[1] || 0, 10);
  const allergensMatch = text.match(/allergens:\s*\[([\s\S]*?)\]/);
  const allergens = allergensMatch ? allergensMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean) : [];
  const descEn = text.match(/descriptionEn:\s*'([^']*)'/)?.[1];
  const descAr = text.match(/descriptionAr:\s*'([^']*)'/)?.[1];
  const imageUrl = text.match(/imageUrl:\s*('[^']+'|null)/)?.[1]?.replace(/'/g, '');
  return { id, categoryId, nameEn, nameAr, price, calories, allergens, descEn, descAr, imageUrl };
});

console.log('Total catalog products:', catalogProducts.length);

// Let's create a detailed map of sheets to categoryIds
const sheetToCatId = {
  'STARTERS': 'c-mp-meat-port-menu', // or c-mp-starters
  'HOT_APPETIZERS': 'c-mp-hot-appetizers',
  'COLD_APPETIZERS': 'c-mp-mezes',
  'SALADS': 'c-mp-salads',
  'STEAKS': 'c-mp-steaks',
  'KEBAPS': 'c-mp-kebabs',
  'SPECIALS': 'c-mp-specials',
  'MEATS': 'c-mp-meats',
  'MEATBALLS': 'c-mp-meatballs',
  'SHAWARMAS': 'c-mp-shawarmas',
  'BURGERS': 'c-mp-burgers',
  'SAUCES': 'c-mp-sauces',
  'DESSERTS': 'c-mp-desserts',
  'DRINKS': 'c-mp-drinks'
};

const auditReport = [];

for (const item of liveItems) {
  if (item.price === 0 && !item.cleanName) continue;
  const targetCatId = sheetToCatId[item.sheet];
  
  // Find in existing catalog
  // Try matching by cleanName, or nameEn
  let match = catalogProducts.find(p => p.categoryId === targetCatId && p.nameEn.toLowerCase() === item.cleanName.toLowerCase());
  if (!match) {
    match = catalogProducts.find(p => p.nameEn.toLowerCase() === item.cleanName.toLowerCase());
  }
  if (!match) {
    // try fuzzy / partial match
    match = catalogProducts.find(p => p.categoryId === targetCatId && (
      p.nameEn.toLowerCase().includes(item.cleanName.toLowerCase()) ||
      item.cleanName.toLowerCase().includes(p.nameEn.toLowerCase())
    ));
  }
  if (!match) {
    match = catalogProducts.find(p => 
      p.nameEn.toLowerCase().includes(item.cleanName.toLowerCase()) ||
      item.cleanName.toLowerCase().includes(p.nameEn.toLowerCase())
    );
  }

  auditReport.push({
    sheet: item.sheet,
    cleanName: item.cleanName,
    rawName: item.rawName,
    livePrice: item.price,
    liveCalories: item.calories,
    liveAllergens: item.allergens,
    liveContent: item.content,
    matchedId: match?.id || null,
    matchedNameEn: match?.nameEn || null,
    matchedNameAr: match?.nameAr || null,
    oldPrice: match?.price ?? null,
    oldCalories: match?.calories ?? null,
    status: match ? (Math.abs(match.price - item.price) > 0.01 ? 'PRICE_CHANGED' : 'MATCHED') : 'NEW'
  });
}

fs.writeFileSync(path.join(__dirname, 'catalog-audit-report.json'), JSON.stringify(auditReport, null, 2), 'utf8');

const newItems = auditReport.filter(r => r.status === 'NEW');
const priceChanged = auditReport.filter(r => r.status === 'PRICE_CHANGED');
const matched = auditReport.filter(r => r.status === 'MATCHED');

console.log(`Matched: ${matched.length}`);
console.log(`Price Changed: ${priceChanged.length}`);
console.log(`New Items: ${newItems.length}`);

console.log('\n--- NEW ITEMS ---');
newItems.forEach(ni => console.log(`[${ni.sheet}] "${ni.cleanName}" | ${ni.livePrice} SAR | Desc: ${ni.liveContent.slice(0, 40)}`));

console.log('\n--- PRICE CHANGED ITEMS ---');
priceChanged.forEach(pc => console.log(`[${pc.sheet}] "${pc.matchedNameEn}" (${pc.matchedId}): ${pc.oldPrice} -> ${pc.livePrice} SAR`));
