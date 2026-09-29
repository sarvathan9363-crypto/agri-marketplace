import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'frontend', 'src', 'i18n', 'locales');
const langs = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

const data = {};
langs.forEach(l => {
  data[l] = JSON.parse(fs.readFileSync(path.join(localesDir, l, 'translation.json'), 'utf8'));
});

function hasEnglish(item) {
  if (typeof item === 'string') {
    const clean = item.replace(/Kava EVM|RPC|ID|Razorpay|AgriBazaar|FPO|FPC|KYC|PAN|GSTIN|IFSC|UPI|2026/gi, '');
    return (clean.match(/[a-zA-Z]/g) || []).length > 2;
  }
  if (Array.isArray(item)) {
    return item.some(hasEnglish);
  }
  if (typeof item === 'object' && item !== null) {
    return Object.values(item).some(hasEnglish);
  }
  return false;
}

function walk(enObj, pathArr = []) {
  for (const k in enObj) {
    const currentPath = [...pathArr, k];
    const enVal = enObj[k];
    const keyPath = currentPath.join('.');

    langs.slice(1).forEach(l => {
      let langVal = data[l];
      for (const p of currentPath) {
        langVal = langVal ? langVal[p] : undefined;
      }
      if (!langVal || hasEnglish(langVal)) {
        console.log(`KEY: "${keyPath}" in [${l}] HAS UNTRANSLATED ENGLISH:`, JSON.stringify(langVal));
      }
    });
  }
}

walk(data.en);
