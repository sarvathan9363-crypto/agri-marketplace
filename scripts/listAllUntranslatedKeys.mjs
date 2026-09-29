import fs from 'fs';
import path from 'path';

const en = JSON.parse(fs.readFileSync('frontend/src/i18n/locales/en/translation.json', 'utf8'));

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getAllKeys(obj[k], fullKey));
    } else {
      keys.push({ key: fullKey, value: obj[k] });
    }
  }
  return keys;
}

const allEnKeys = getAllKeys(en);
const locales = ['ta', 'hi', 'te', 'kn', 'ml'];
const missingMap = {};

allEnKeys.forEach(({ key, value }) => {
  if (typeof value !== 'string') return;

  locales.forEach(l => {
    const filePath = path.join('frontend/src/i18n/locales', l, 'translation.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const parts = key.split('.');
    let cur = data;
    for (const p of parts) cur = cur?.[p];

    if (!cur || cur === value) {
      if (!missingMap[key]) missingMap[key] = { en: value };
      missingMap[key][l] = null;
    }
  });
});

console.log(`Total keys requiring translation: ${Object.keys(missingMap).length}`);
fs.writeFileSync('scripts/untranslatedMap.json', JSON.stringify(missingMap, null, 2), 'utf8');
