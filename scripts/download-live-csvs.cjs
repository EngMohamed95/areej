const https = require('https');
const fs = require('fs');
const path = require('path');

async function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location).then(resolve, reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

const gids = [
  { gid: '7676758', name: 'STARTERS' },
  { gid: '968020545', name: 'HOT_APPETIZERS' },
  { gid: '1137079691', name: 'COLD_APPETIZERS' },
  { gid: '509289994', name: 'SALADS' },
  { gid: '1470434996', name: 'STEAKS' },
  { gid: '367451245', name: 'KEBAPS' },
  { gid: '1497685693', name: 'SPECIALS' },
  { gid: '756868308', name: 'MEATS' },
  { gid: '80513350', name: 'MEATBALLS' },
  { gid: '461264898', name: 'SHAWARMAS' },
  { gid: '941413501', name: 'BURGERS' },
  { gid: '783124797', name: 'SAUCES' },
  { gid: '0', name: 'DESSERTS' },
  { gid: '1912447811', name: 'DRINKS' }
];

async function main() {
  const outDir = path.join(__dirname, 'live_sheets');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const s of gids) {
    const url = `https://docs.google.com/spreadsheets/d/1u_h8aiW5bMIrntR5EkAHzC1DWu-HWEzmOcwKR0WCmwg/export?format=csv&gid=${s.gid}`;
    console.log(`Downloading ${s.name} (${s.gid})...`);
    const csv = await get(url);
    fs.writeFileSync(path.join(outDir, `${s.name}.csv`), csv, 'utf8');
  }
  console.log('All CSVs downloaded successfully to scripts/live_sheets/');
}

main().catch(console.error);
