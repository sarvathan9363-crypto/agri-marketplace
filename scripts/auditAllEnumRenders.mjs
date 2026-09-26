import fs from 'fs';
import path from 'path';

const rootDir = 'c:/Volume D/projects/temp/agri/frontend/src';
const localesDir = 'c:/Volume D/projects/temp/agri/frontend/src/i18n/locales';

const locales = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];
const localeData = {};

locales.forEach(loc => {
  const filePath = path.join(localesDir, loc, 'translation.json');
  if (fs.existsSync(filePath)) {
    localeData[loc] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
});

// Check non-English locale files for values that are identical to EN or contain pure English text
console.log('=== AUDITING LOCALE FILES FOR ENGLISH FALLBACK VALUES ===');

function checkKeys(objEn, prefix = '') {
  let count = 0;
  for (const key in objEn) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const valEn = objEn[key];
    if (typeof valEn === 'object' && valEn !== null) {
      count += checkKeys(valEn, fullKey);
    } else if (typeof valEn === 'string') {
      for (const loc of ['ta', 'hi', 'te', 'kn', 'ml']) {
        const valLoc = getNestedValue(localeData[loc], fullKey);
        if (!valLoc || valLoc === valEn) {
          // If it's a brand name or short code, ignore
          if (!/^(AgriBazaar|Razorpay|FPO|FPC|SMS|GST|PIN|ID|ISO|KG|TON|QR|URL|UI|PDF|CSV|INR|₹|\d+|\W+)+$/i.test(valEn.trim())) {
            console.log(`[${loc.toUpperCase()}] Key "${fullKey}" is untranslated English: "${valEn}"`);
            count++;
          }
        }
      }
    }
  }
  return count;
}

function getNestedValue(obj, pathStr) {
  if (!obj) return undefined;
  const parts = pathStr.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr && typeof curr === 'object' && p in curr) {
      curr = curr[p];
    } else {
      return undefined;
    }
  }
  return curr;
}

const totalUntranslatedInLocales = checkKeys(localeData.en);
console.log(`Total untranslated keys across non-English locale files: ${totalUntranslatedInLocales}`);

// Scan JSX files for subtitle="..." or description="..." with string literals
console.log('\n=== AUDITING JSX FILES FOR HARDCODED SUBTITLE/DESCRIPTION PROPS ===');
function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        // match subtitle="Something" or description="Something" or title="Something"
        const propMatch = line.match(/(subtitle|description|title|label|placeholder|emptyTitle|emptyDescription)=["']([^"']+)["']/g);
        if (propMatch) {
          propMatch.forEach(m => {
            if (!m.includes('t(')) {
              console.log(`${fullPath}:${idx + 1} -> ${m}`);
            }
          });
        }
      });
    }
  }
}
scanDir(rootDir);
