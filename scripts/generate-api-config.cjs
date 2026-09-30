const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'ADMIN_PIN'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.warn(`Skipping api/config.php: missing ${missing.join(', ')}.`);
  process.exit(0);
}

const phpString = value => String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const adminPinHash = crypto.createHash('sha256').update(process.env.ADMIN_PIN).digest('hex');
const config = `<?php
declare(strict_types=1);

// Generated during deployment. Do not commit this file.
return [
    'db_host' => '${phpString(process.env.DB_HOST)}',
    'db_port' => ${Number(process.env.DB_PORT || 3306)},
    'db_name' => '${phpString(process.env.DB_NAME)}',
    'db_user' => '${phpString(process.env.DB_USER)}',
    'db_password' => '${phpString(process.env.DB_PASSWORD)}',
    'admin_pin_sha256' => '${adminPinHash}',
];
`;

const target = path.resolve(process.cwd(), 'public', 'api', 'config.php');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, config, { encoding: 'utf8', mode: 0o600 });
console.log('Generated server-only api/config.php.');
