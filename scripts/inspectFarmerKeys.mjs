import fs from 'fs';
import path from 'path';

const locales = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];
const data = {};
locales.forEach(l => {
  const filePath = path.join('frontend/src/i18n/locales', l, 'translation.json');
  data[l] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

const farmerPrefixes = [
  'farmerDashboard',
  'paymentSettlementCard',
  'farmerProducts',
  'farmerAddProduct',
  'farmerOrders',
  'farmerProfile',
  'farmerVerification',
  'farmerSales'
];

farmerPrefixes.forEach(prefix => {
  console.log(`\n=== PREFIX: ${prefix} ===`);
  const keys = Object.keys(data['en'][prefix] || {});
  console.log(`Total keys in en.${prefix}: ${keys.length}`);
  keys.slice(0, 5).forEach(k => {
    console.log(`Key: ${prefix}.${k}`);
    locales.forEach(l => {
      console.log(`  ${l}: ${data[l]?.[prefix]?.[k]}`);
    });
  });
});
