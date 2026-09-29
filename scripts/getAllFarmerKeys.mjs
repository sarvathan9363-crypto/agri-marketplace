import fs from 'fs';
import path from 'path';

const en = JSON.parse(fs.readFileSync('frontend/src/i18n/locales/en/translation.json', 'utf8'));

const sections = [
  'farmerDashboard',
  'paymentSettlementCard',
  'farmerProducts',
  'farmerAddProduct',
  'farmerOrders',
  'farmerProfile',
  'farmerVerification',
  'farmerSales',
  'wizard',
  'farmerVerificationWizard'
];

const extracted = {};

sections.forEach(sec => {
  if (en[sec]) {
    extracted[sec] = en[sec];
  }
});

console.log('Extracted sections count:', Object.keys(extracted).length);
fs.writeFileSync('scripts/farmerKeysDump.json', JSON.stringify(extracted, null, 2));
console.log('Saved to scripts/farmerKeysDump.json');
