const https = require('https');

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

async function main() {
  const html = await get('https://docs.google.com/spreadsheets/d/1u_h8aiW5bMIrntR5EkAHzC1DWu-HWEzmOcwKR0WCmwg/htmlview');
  const gids = [...new Set([...html.matchAll(/gid=([0-9]+)/g)].map(m => m[1]))];
  console.log('Found GIDs:', gids);

  for (const gid of gids) {
    try {
      const csv = await get(`https://docs.google.com/spreadsheets/d/1u_h8aiW5bMIrntR5EkAHzC1DWu-HWEzmOcwKR0WCmwg/export?format=csv&gid=${gid}`);
      const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);
      console.log(`\n=== GID ${gid} (${lines.length} lines) ===`);
      console.log(lines.slice(0, 4).join('\n'));
    } catch (e) {
      console.error(`Error fetching gid ${gid}:`, e.message);
    }
  }
}

main().catch(console.error);
