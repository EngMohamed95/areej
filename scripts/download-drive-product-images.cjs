const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outputDir = path.join(root, 'public', 'tenants', 'areej', 'products');
const manifestSource = fs.readFileSync(path.join(__dirname, 'import-drive-product-images.ps1'), 'utf8');
const entryPattern = /@\{ id='([^']+)'; products=@\(([^)]+)\); ext='([^']+)' \}/g;
const productPattern = /'([^']+)'/g;
const entries = [];
let match;

while ((match = entryPattern.exec(manifestSource))) {
  const products = [];
  let productMatch;
  while ((productMatch = productPattern.exec(match[2]))) products.push(productMatch[1]);
  entries.push({ id: match[1], products, ext: match[3] });
}

if (!entries.length) throw new Error('No Drive image entries found.');
fs.mkdirSync(outputDir, { recursive: true });

function extractLargestJpeg(data) {
  const candidates = [];
  for (let start = 0; start < data.length - 3; start += 1) {
    if (data[start] !== 0xff || data[start + 1] !== 0xd8 || data[start + 2] !== 0xff) continue;
    for (let end = start + 3; end < data.length - 1; end += 1) {
      if (data[end] === 0xff && data[end + 1] === 0xd9) {
        candidates.push({ start, end: end + 2 });
        start = end + 1;
        break;
      }
    }
  }
  if (!candidates.length) throw new Error('No embedded JPEG preview found.');
  candidates.sort((a, b) => (b.end - b.start) - (a.end - a.start));
  return data.subarray(candidates[0].start, candidates[0].end);
}

let completed = 0;
async function importEntry(entry) {
  const targets = entry.products.map((id) => path.join(outputDir, `${id}.jpg`));
  if (targets.every(fs.existsSync)) {
    completed += entry.products.length;
    console.log(`Already present ${completed}/${entries.flatMap((item) => item.products).length}: ${entry.products.join(', ')}`);
    return;
  }

  const url = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(entry.id)}&export=download&confirm=t`;
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Download ${entry.id} failed: HTTP ${response.status}`);
  const raw = Buffer.from(await response.arrayBuffer());
  const jpeg = entry.ext === 'cr3' ? extractLargestJpeg(raw) : raw;
  fs.writeFileSync(targets[0], jpeg);
  for (const target of targets.slice(1)) fs.copyFileSync(targets[0], target);
  completed += entry.products.length;
  console.log(`Downloaded ${completed}/${entries.flatMap((item) => item.products).length}: ${entry.products.join(', ')}`);
}

async function runPool(concurrency) {
  let next = 0;
  async function worker() {
    while (next < entries.length) {
      const index = next++;
      await importEntry(entries[index]);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
}

runPool(6).then(() => {
  console.log(`Downloaded/extracted ${entries.flatMap((item) => item.products).length} product images.`);
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
