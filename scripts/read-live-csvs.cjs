const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'live_sheets');
const files = fs.readdirSync(dir);

for (const file of files) {
  if (!file.endsWith('.csv')) continue;
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
  console.log(`\n================== ${file} (${lines.length} lines) ==================`);
  lines.forEach((line, idx) => {
    console.log(`[${idx + 1}] ${line}`);
  });
}
