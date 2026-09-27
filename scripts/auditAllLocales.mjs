import fs from 'fs';
import path from 'path';

const locales = ['ta', 'hi', 'te', 'kn', 'ml'];
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
console.log(`Total key paths in en: ${allEnKeys.length}`);

let totalUntranslated = 0;

locales.forEach(l => {
  const filePath = path.join('frontend/src/i18n/locales', l, 'translation.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let langUntranslated = 0;

  allEnKeys.forEach(({ key, value }) => {
    if (typeof value !== 'string' || value.length < 3 || !/^[A-Za-z]/.test(value)) return;

    const parts = key.split('.');
    let cur = data;
    for (const p of parts) cur = cur?.[p];

    if (cur === value) {
      langUntranslated++;
      totalUntranslated++;
    }
  });

  console.log(`[${l}] Untranslated keys: ${langUntranslated} / ${allEnKeys.length}`);
});

console.log(`\nOverall untranslated keys across all 5 languages: ${totalUntranslated}`);
