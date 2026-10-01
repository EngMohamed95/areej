const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const productDir = path.join(root, 'public', 'tenants', 'areej', 'products');
const files = fs.readdirSync(productDir).filter((name) => /^areej-p-\d+\.jpg$/.test(name));

async function run() {
  for (const [index, name] of files.entries()) {
    const source = path.join(productDir, name);
    const target = path.join(productDir, name.replace(/\.jpg$/i, '.webp'));
    await sharp(source)
      .rotate()
      .webp({ quality: 82, effort: 5, smartSubsample: true })
      .toFile(target);
    console.log(`Converted ${index + 1}/${files.length}: ${path.basename(target)}`);
  }
  console.log(`Converted ${files.length} product images to WebP.`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
