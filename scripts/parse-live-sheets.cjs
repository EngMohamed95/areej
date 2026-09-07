const fs = require('fs');
const path = require('path');

// Let's write a robust CSV parser for our live sheets
function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let current = '';

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      row.push(current.trim());
      current = '';
      if (row.some(cell => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
    } else {
      current += c;
    }
  }
  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some(cell => cell.length > 0)) {
      lines.push(row);
    }
  }
  return lines;
}

const dir = path.join(__dirname, 'live_sheets');
const files = [
  'STARTERS.csv',
  'HOT_APPETIZERS.csv',
  'COLD_APPETIZERS.csv',
  'SALADS.csv',
  'STEAKS.csv',
  'KEBAPS.csv',
  'SPECIALS.csv',
  'MEATS.csv',
  'MEATBALLS.csv',
  'SHAWARMAS.csv',
  'BURGERS.csv',
  'SAUCES.csv',
  'DESSERTS.csv',
  'DRINKS.csv'
];

const parsedData = {};

files.forEach(file => {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const rows = parseCSV(content);
  parsedData[file] = rows;
});

fs.writeFileSync(path.join(__dirname, 'parsed-live-sheets.json'), JSON.stringify(parsedData, null, 2), 'utf8');
console.log('Saved parsed-live-sheets.json');
