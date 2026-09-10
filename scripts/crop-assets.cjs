const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '..', 'public', 'tenants', 'areej', 'assets');
if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

const crops = [
  { name: 'cat-salads.jpg', src: 'menu_pages/page_03.jpg', filter: 'crop=2481:1150:0:2358,scale=800:-1' },
  { name: 'cat-soup.jpg', src: 'menu_pages/page_04.jpg', filter: 'crop=1700:1550:450:1750,scale=800:-1' },
  { name: 'cat-appetizers.jpg', src: 'menu_pages/page_05.jpg', filter: 'crop=2481:720:0:0,scale=800:-1' },
  { name: 'cat-pizza.jpg', src: 'menu_pages/page_06.jpg', filter: 'crop=1231:750:1250:0,scale=800:-1' },
  { name: 'cat-sandwiches.jpg', src: 'menu_pages/page_07.jpg', filter: 'crop=2100:858:200:2650,scale=800:-1' },
  { name: 'cat-pasta.jpg', src: 'menu_pages/page_08.jpg', filter: 'crop=2000:1058:300:2450,scale=800:-1' },
  { name: 'cat-main.jpg', src: 'menu_pages/page_09.jpg', filter: 'crop=1800:1300:350:2208,scale=800:-1' },
  { name: 'cat-dessert.jpg', src: 'menu_pages/page_10.jpg', filter: 'crop=2481:1058:0:2450,scale=800:-1' },
  { name: 'cat-hot-drinks.jpg', src: 'menu_pages/page_11.jpg', filter: 'crop=1700:700:400:0,scale=800:-1' },
  { name: 'cat-cold-drinks.jpg', src: 'menu_pages/page_12.jpg', filter: 'crop=1281:858:1200:2650,scale=800:-1' }
];

for (const c of crops) {
  const srcPath = path.join(__dirname, '..', c.src);
  const outPath = path.join(targetDir, c.name);
  const cmd = `ffmpeg -y -i "${srcPath}" -vf "${c.filter}" -q:v 2 "${outPath}"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('Generated:', c.name);
  } catch (err) {
    console.error('Failed to generate', c.name, err.message);
  }
}
console.log('All crops finished!');
