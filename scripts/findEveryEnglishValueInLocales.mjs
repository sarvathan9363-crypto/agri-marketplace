import fs from 'fs';
import path from 'path';

const langs = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];
const localesDir = path.join(process.cwd(), 'frontend', 'src', 'i18n', 'locales');

const data = {};
langs.forEach(l => {
  const filePath = path.join(localesDir, l, 'translation.json');
  data[l] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

// Check if string contains English text (more than 3 ASCII letters)
function isEnglishText(str) {
  if (typeof str !== 'string') return false;
  // Ignore technical constants like "Kava EVM", "RPC", "ID", "RAZORPAY_ROUTE_ENABLED=false", "0x...", "URL", "₹", "IFSC", "KYC"
  const cleanStr = str
    .replace(/Kava EVM/gi, '')
    .replace(/RPC/gi, '')
    .replace(/ID/gi, '')
    .replace(/RAZORPAY_ROUTE_ENABLED=false/gi, '')
    .replace(/Razorpay/gi, '')
    .replace(/AgriBazaar/gi, '')
    .replace(/FPO/gi, '')
    .replace(/KYC/gi, '')
    .replace(/PAN/gi, '')
    .replace(/GSTIN/gi, '')
    .replace(/IFSC/gi, '')
    .replace(/PM-KISAN/gi, '')
    .replace(/EVM/gi, '')
    .replace(/OTP/gi, '')
    .replace(/0x[0-9a-f]+/gi, '')
    .replace(/https?:\/\/\S+/gi, '');

  const asciiLetters = cleanStr.match(/[a-zA-Z]/g);
  return asciiLetters && asciiLetters.length > 2;
}

const englishKeys = [];

function walk(obj, pathArr = []) {
  for (const k in obj) {
    const currentPath = [...pathArr, k];
    const val = obj[k];
    if (typeof val === 'object' && val !== null) {
      walk(val, currentPath);
    } else if (typeof val === 'string') {
      const keyPath = currentPath.join('.');
      langs.slice(1).forEach(l => {
        let langVal = data[l];
        for (const p of currentPath) {
          langVal = langVal ? langVal[p] : undefined;
        }
        if (langVal && isEnglishText(langVal)) {
          englishKeys.push({
            keyPath,
            lang: l,
            val: langVal,
            enVal: val
          });
        }
      });
    }
  }
}

walk(data.en);

console.log(`TOTAL UNTRANSLATED ENGLISH KEYS IN NON-ENGLISH LOCALES: ${englishKeys.length}`);

// Group by keyPath
const grouped = {};
englishKeys.forEach(item => {
  if (!grouped[item.keyPath]) {
    grouped[item.keyPath] = {
      enVal: item.enVal,
      langs: {}
    };
  }
  grouped[item.keyPath].langs[item.lang] = item.val;
});

Object.keys(grouped).forEach(kp => {
  const item = grouped[kp];
  console.log(`KEY: "${kp}" | EN: "${item.enVal}"`);
  console.log(`   English in: ${Object.keys(item.langs).join(', ')}`);
});
