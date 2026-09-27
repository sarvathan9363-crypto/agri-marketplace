import fs from 'fs';
import path from 'path';

const locales = ['ta', 'hi', 'te', 'kn', 'ml'];
const en = JSON.parse(fs.readFileSync('frontend/src/i18n/locales/en/translation.json', 'utf8'));

const sections = [
  'farmerDashboard',
  'paymentSettlementCard',
  'farmerProducts',
  'farmerAddProduct',
  'farmerOrders',
  'farmerProfile',
  'farmerVerification',
  'farmerSales'
];

let untranslatedCount = 0;

locales.forEach(l => {
  const filePath = path.join('frontend/src/i18n/locales', l, 'translation.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  sections.forEach(s => {
    if (!en[s]) return;
    Object.keys(en[s]).forEach(k => {
      const enVal = en[s][k];
      const targetVal = data[s]?.[k];
      if (typeof enVal === 'string' && enVal.length > 2 && /^[A-Za-z]/.test(enVal)) {
        if (targetVal === enVal) {
          console.log(`[${l}] ${s}.${k} is still English: "${enVal}"`);
          untranslatedCount++;
        }
      }
    });
  });
});

console.log(`\nTotal untranslated keys in Farmer sections across 5 non-English languages: ${untranslatedCount}`);
