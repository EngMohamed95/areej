const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'live_sheets');
const files = fs.readdirSync(dir);

function parsePrice(str) {
  if (!str) return 0;
  const m = str.match(/(\d+(?:[.,]\d+)?)\s*SAR/i) || str.match(/(\d+(?:[.,]\d+)?)/);
  return m ? parseFloat(m[1].replace(',', '.')) : 0;
}

function parseCalories(str) {
  if (!str) return null;
  const m = str.match(/(?:calori|callori|calories|kcal)[^\d]*(\d+)/i) || str.match(/(\d+)\s*(?:calori|kcal)/i);
  return m ? parseInt(m[1], 10) : null;
}

function parseAllergens(str) {
  if (!str) return [];
  const m = str.match(/(?:allergen|allerjen)[:;.\s]*([^,]+(?:,[^,]+)*)/i);
  if (!m) return [];
  const raw = m[1].replace(/\bfree\b/ig, '');
  return raw.split(/[,./-]/).map(s => s.trim()).filter(s => s && !/^\d+$/.test(s));
}

function cleanName(str) {
  if (!str) return '';
  let clean = str.replace(/^\s*\d+\s*-\s*/, '');
  clean = clean.replace(/\s*\(?\s*\d+(?:[.,]\d+)?\s*SAR\s*\)?\s*$/i, '');
  clean = clean.replace(/(?:calori|callori|calories|kcal|allergen|allerjen).*$/i, '');
  clean = clean.replace(/\s*\d+\s*(?:gr|grams|ml|meter)\b.*$/i, '');
  return clean.replace(/\s+/g, ' ').replace(/^[:;\s,]+|[:;\s,]+$/g, '');
}

console.log('--- Analyzing live sheets ---');
for (const f of files) {
  if (!f.endsWith('.csv')) continue;
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  const category = f.replace('.csv', '');
  console.log(`\nCategory: ${category} (${lines.length} lines)`);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if line contains SAR or item pattern
    if (/SAR/i.test(line) || /Food|Product|Drink/i.test(line) || /^\d+-/.test(line)) {
      console.log(`  L${i+1}: ${line.slice(0, 100)}`);
    }
  }
}
