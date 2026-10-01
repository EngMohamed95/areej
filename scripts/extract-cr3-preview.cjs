const fs = require('fs');

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error('Usage: node scripts/extract-cr3-preview.cjs <input.cr3> <output.jpg>');
  process.exit(1);
}

const data = fs.readFileSync(inputPath);
const candidates = [];

for (let start = 0; start < data.length - 3; start += 1) {
  if (data[start] !== 0xff || data[start + 1] !== 0xd8 || data[start + 2] !== 0xff) continue;

  for (let end = start + 3; end < data.length - 1; end += 1) {
    if (data[end] === 0xff && data[end + 1] === 0xd9) {
      candidates.push({ start, end: end + 2, size: end + 2 - start });
      start = end + 1;
      break;
    }
  }
}

if (!candidates.length) {
  console.error(`No embedded JPEG preview found in ${inputPath}`);
  process.exit(2);
}

const preview = candidates.sort((a, b) => b.size - a.size)[0];
fs.writeFileSync(outputPath, data.subarray(preview.start, preview.end));
console.log(JSON.stringify({ inputPath, outputPath, previewBytes: preview.size, previewsFound: candidates.length }));
