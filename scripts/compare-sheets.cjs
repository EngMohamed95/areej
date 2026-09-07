const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Let's compare the hash or file contents of Meat_Port_Downloaded.xlsx and Meat Port 2_latest.xlsx
const crypto = require('crypto');
function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

console.log('Meat_Port_Downloaded:', hashFile('Meat_Port_Downloaded.xlsx'));
console.log('Meat Port 2_latest:   ', hashFile('Meat Port 2_latest.xlsx'));
console.log('Meat Port 2:          ', hashFile('Meat Port 2.xlsx'));
