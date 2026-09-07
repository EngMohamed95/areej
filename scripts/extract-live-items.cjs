const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'parsed-live-sheets.json'), 'utf8'));

function parsePrice(cells) {
  for (let i = cells.length - 1; i >= 0; i--) {
    const text = cells[i];
    if (!text) continue;
    const m = text.match(/(\d+(?:\.\d+)?)\s*SAR/i);
    if (m) return parseFloat(m[1]);
    const m2 = text.match(/(\d+(?:\.\d+)?)\s*Sar/);
    if (m2) return parseFloat(m2[1]);
    // check for pattern like (43 SAR)
    const m3 = text.match(/\((\d+(?:\.\d+)?)\s*SAR\)/i);
    if (m3) return parseFloat(m3[1]);
  }
  return 0;
}

function parseCalories(text) {
  if (!text) return null;
  const m = text.match(/(?:calori|callori|calories|kcal)[^\d]*(\d+)/i) || text.match(/(\d+)\s*(?:calori|kcal)/i);
  return m ? parseInt(m[1], 10) : null;
}

function parseAllergens(text) {
  if (!text) return [];
  const m = text.match(/(?:allergen|allerjen)[:;.\s]*([^,]+(?:,[^,]+)*)/i);
  if (!m) return [];
  const raw = m[1].replace(/\bfree\b/ig, '');
  return raw.split(/[,./-]/).map(s => s.trim()).filter(s => s && !/^\d+$/.test(s));
}

function cleanName(raw) {
  if (!raw) return '';
  let clean = raw.replace(/^\s*\d+\s*-\s*/, '');
  clean = clean.replace(/\s*\(?\s*\d+(?:[.,]\d+)?\s*SAR\s*\)?\s*$/i, '');
  clean = clean.replace(/\s*(?:\d+(?:\/\d+)?\s*(?:gr|grams|ml|meter)|calori.*|callori.*|calories.*|kcal.*|allergen.*|allerjen.*).*$/i, '');
  clean = clean.replace(/\s+/g, ' ');
  return clean.replace(/^[:;\s,]+|[:;\s,]+$/g, '');
}

console.log('=== EXTRACTING ALL PRODUCTS FROM LIVE GOOGLE SHEETS ===\n');

const allItems = [];

for (const [sheetFile, rows] of Object.entries(data)) {
  const sheetName = sheetFile.replace('.csv', '');
  console.log(`\n================ Sheet: ${sheetName} (${rows.length} rows) ================`);

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const marker = row[0] || '';
    let rawName = row[1] || '';
    const allCells = row;

    if (/^\s*\d+\s*-/.test(marker) && !rawName) {
      rawName = marker;
    }

    const price = parsePrice(allCells);
    const isItemRow = (['Food', 'Product', 'Drink'].includes(marker) && rawName) ||
                      (price > 0 && (/^\s*\d+\s*-/.test(marker) || /^\s*\d+\s*-/.test(rawName)));

    if (!isItemRow) {
      // Special cases like Shawarmas, Meatballs, etc.
      if (sheetName === 'MEATBALLS' && (marker.includes('MEAT BALLS') || marker.includes('Meatballs'))) {
        // Meatballs special
      } else if (sheetName === 'DESSERTS' && marker.includes('OVEN RICE PUDING')) {
        // Oven rice puding
      } else {
        continue;
      }
    }

    let content = '';
    if (r + 1 < rows.length) {
      const nextRow = rows[r + 1];
      const nextMarker = nextRow[0] || '';
      const nextName = nextRow[1] || '';
      const nextPrice = parsePrice(nextRow);
      if (nextMarker === 'Content') {
        content = nextName || nextRow.find(c => c && c !== 'Content') || '';
      } else if (nextPrice === 0 && !(['Food', 'Product', 'Drink'].includes(nextMarker))) {
        content = nextRow.find(c => c && c.length > 3) || '';
      }
    }

    const name = cleanName(rawName || marker);
    const calories = parseCalories(rawName || marker);
    const allergens = parseAllergens(rawName || marker);

    allItems.push({
      sheet: sheetName,
      marker,
      rawName: rawName || marker,
      cleanName: name,
      price,
      calories,
      allergens,
      content
    });

    console.log(`[${sheetName}] "${name}" | Price: ${price} SAR | Cal: ${calories} | Allergens: ${allergens.join(', ')} | Desc: ${content.slice(0, 60)}`);
  }
}

console.log(`\nTotal items extracted: ${allItems.length}`);
fs.writeFileSync(path.join(__dirname, 'extracted-live-items.json'), JSON.stringify(allItems, null, 2), 'utf8');
