const fs = require('fs');
const path = require('path');

// Manually load backend/.env
const envPath = path.join(__dirname, '../backend/.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valParts] = trimmed.split('=');
      const val = valParts.join('=').trim().replace(/^["']|["']$/g, '');
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const { translateText } = require('../backend/services/translationService');

const LOCALES_DIR = path.join(__dirname, '../frontend/src/i18n/locales');
const EN_PATH = path.join(LOCALES_DIR, 'en/translation.json');

const LANG_MAPPING = {
  ta: 'ta-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
};

// Protect {{placeholder}} tokens during translation
function protectPlaceholders(str) {
  const placeholders = [];
  const protectedText = str.replace(/\{\{([^}]+)\}\}/g, (match) => {
    const idx = placeholders.length;
    placeholders.push(match);
    return `__PH_${idx}__`;
  });
  return { protectedText, placeholders };
}

function restorePlaceholders(translatedText, placeholders) {
  let restored = translatedText;
  placeholders.forEach((ph, idx) => {
    const regex = new RegExp(`__\\s*PH\\s*_\\s*${idx}\\s*__`, 'g');
    restored = restored.replace(regex, ph);
  });
  return restored;
}

// Flatten object to key-value pairs
function flattenObj(obj, prefix = '') {
  let res = {};
  for (const k of Object.keys(obj)) {
    const val = obj[k];
    const keyPath = prefix ? `${prefix}.${k}` : k;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      Object.assign(res, flattenObj(val, keyPath));
    } else {
      res[keyPath] = val;
    }
  }
  return res;
}

// Unflatten key-value pairs back to nested object
function unflattenObj(flat) {
  const res = {};
  for (const keyPath of Object.keys(flat)) {
    const parts = keyPath.split('.');
    let curr = res;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!curr[p] || typeof curr[p] !== 'object') curr[p] = {};
      curr = curr[p];
    }
    curr[parts[parts.length - 1]] = flat[keyPath];
  }
  return res;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Concurrency helper with rate limit backoff
async function mapConcurrent(items, limit, fn) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
      await sleep(100); // 100ms delay between requests to avoid rate-limiting
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function run() {
  console.log('Reading English base translation file...');
  const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf8'));
  const flatEn = flattenObj(enData);
  const keys = Object.keys(flatEn);

  for (const [lang, targetLanguageCode] of Object.entries(LANG_MAPPING)) {
    const targetPath = path.join(LOCALES_DIR, `${lang}/translation.json`);
    console.log(`\n========================================`);
    console.log(`Translating locale: ${lang} (${targetLanguageCode}) - ${keys.length} keys total`);

    let existingData = {};
    if (fs.existsSync(targetPath)) {
      try {
        existingData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      } catch {}
    }
    const flatTarget = flattenObj(existingData);

    const flatResult = {};
    let newlyTranslated = 0;

    await mapConcurrent(keys, 2, async (key) => {
      const val = flatEn[key];
      const existingVal = flatTarget[key];

      if (typeof val !== 'string') {
        flatResult[key] = val;
        return;
      }

      // Keep existing valid translation if available and different from English
      if (typeof existingVal === 'string' && existingVal.trim().length > 0 && existingVal !== val) {
        flatResult[key] = existingVal;
        return;
      }

      let attempts = 0;
      let translated = null;

      while (attempts < 4) {
        try {
          const { protectedText, placeholders } = protectPlaceholders(val);
          const raw = await translateText({ text: protectedText, targetLanguage: targetLanguageCode });
          translated = restorePlaceholders(raw, placeholders);
          newlyTranslated++;
          break;
        } catch (err) {
          attempts++;
          if (err.message.includes('429') || err.code === 'TRANSLATION_RATE_LIMITED') {
            await sleep(1000 * attempts);
          } else {
            console.error(`[${targetLanguageCode}] Error translating key "${key}": ${err.message}`);
            translated = val;
            break;
          }
        }
      }

      flatResult[key] = translated || val;
    });

    const translatedObj = unflattenObj(flatResult);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, JSON.stringify(translatedObj, null, 2), 'utf8');
    console.log(`✅ Saved translated locale file for ${lang}! (${newlyTranslated} new keys translated)`);
  }

  console.log('\n🎉 All 5 language translation files updated successfully!');
}

run().catch((err) => {
  console.error('Fatal error during batch translation:', err);
  process.exit(1);
});
