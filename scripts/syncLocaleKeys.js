const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../frontend/src/i18n/locales');
const EN_PATH = path.join(LOCALES_DIR, 'en/translation.json');
const TARGET_LANGS = ['ta', 'hi', 'te', 'kn', 'ml'];

function syncKeys(sourceObj, targetObj = {}) {
  const result = Array.isArray(sourceObj) ? [] : {};

  for (const key of Object.keys(sourceObj)) {
    const sourceVal = sourceObj[key];
    const targetVal = targetObj?.[key];

    if (typeof sourceVal === 'object' && sourceVal !== null && !Array.isArray(sourceVal)) {
      result[key] = syncKeys(sourceVal, typeof targetVal === 'object' ? targetVal : {});
    } else {
      if (typeof targetVal === 'string' && targetVal.trim().length > 0) {
        result[key] = targetVal;
      } else {
        result[key] = sourceVal; // Default to English base text if missing
      }
    }
  }

  return result;
}

const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));

for (const lang of TARGET_LANGS) {
  const targetPath = path.join(LOCALES_DIR, `${lang}/translation.json`);
  let targetData = {};
  if (fs.existsSync(targetPath)) {
    try {
      targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    } catch {}
  }

  const synced = syncKeys(enData, targetData);
  fs.writeFileSync(targetPath, JSON.stringify(synced, null, 2), 'utf8');
  console.log(`Synced key structure for locale: ${lang}`);
}

console.log('✅ All locale translation files synchronized cleanly with 100% key coverage!');
