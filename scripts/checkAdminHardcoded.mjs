import fs from 'fs';
import path from 'path';

const inventoryPath = path.join(process.cwd(), 'content-inventory.json');
const raw = fs.readFileSync(inventoryPath, 'utf8');

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error('Failed to parse content-inventory.json', e);
  process.exit(1);
}

const items = Array.isArray(data) ? data : (data.items || data.inventory || []);

const adminHardcoded = items.filter(i => {
  const isHardcoded = i.currentlyI18n === false || i.i18n === false;
  const isAdminFile = (i.file || i.filePath || '').toLowerCase().includes('admin');
  return isHardcoded && isAdminFile;
});

console.log(`HARDCODED ADMIN ITEMS COUNT: ${adminHardcoded.length}`);
adminHardcoded.forEach(item => {
  console.log(`${item.file || item.filePath}: "${item.text || item.content}"`);
});
