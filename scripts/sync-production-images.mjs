import fs from 'node:fs';
import path from 'node:path';

const baseUrl = (process.argv[2] || 'https://areej-sa.net').replace(/\/$/, '');
const adminPin = process.env.ADMIN_PIN;
if (!adminPin) throw new Error('ADMIN_PIN is required.');

const seedPath = path.resolve('public', 'api', 'catalog.seed.json');
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
const imageByProductId = new Map(
  seed.products
    .filter((product) => product.imageUrl?.startsWith('/tenants/areej/products/'))
    .map((product) => [product.id, product.imageUrl])
);

if (imageByProductId.size < 73) {
  throw new Error(`Expected at least 73 product image mappings, found ${imageByProductId.size}.`);
}

const loginResponse = await fetch(`${baseUrl}/api/auth.php`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pin: adminPin })
});
if (!loginResponse.ok) throw new Error(`Production login failed: HTTP ${loginResponse.status}`);
const loginPayload = await loginResponse.json();
if (!loginPayload.success) throw new Error('Production login was rejected.');

const cookieHeader = loginResponse.headers.get('set-cookie');
const sessionCookie = cookieHeader?.split(';', 1)[0];
if (!sessionCookie) throw new Error('Production login did not return a session cookie.');

const catalogResponse = await fetch(`${baseUrl}/api/catalog.php?since=0`, {
  headers: { Cookie: sessionCookie }
});
if (!catalogResponse.ok) throw new Error(`Production catalog fetch failed: HTTP ${catalogResponse.status}`);
const catalog = await catalogResponse.json();
if (!catalog.success || !Array.isArray(catalog.products)) {
  throw new Error('Production catalog response is invalid.');
}

let changed = 0;
const products = catalog.products.map((product) => {
  const imageUrl = imageByProductId.get(product.id);
  if (!imageUrl || product.imageUrl === imageUrl) return product;
  changed += 1;
  return { ...product, imageUrl };
});

if (changed > 0) {
  const saveResponse = await fetch(`${baseUrl}/api/catalog.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: sessionCookie
    },
    body: JSON.stringify({ resource: 'products', records: products })
  });
  if (!saveResponse.ok) throw new Error(`Production catalog update failed: HTTP ${saveResponse.status}`);
  const savePayload = await saveResponse.json();
  if (!savePayload.success) throw new Error('Production catalog update was rejected.');
}

console.log(`Production product images synchronized: ${changed} changed, ${imageByProductId.size} mapped.`);
