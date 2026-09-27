import fs from 'fs';
import path from 'path';

const locales = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];
const data = {};
locales.forEach(l => {
  const filePath = path.join('frontend/src/i18n/locales', l, 'translation.json');
  data[l] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

const transporterPrefixes = [
  'transporterProfile',
  'transport',
  'transporter',
  'transporterVerification',
  'transporterVerificationWizard',
  'register'
];

transporterPrefixes.forEach(prefix => {
  console.log(`\n=== PREFIX: ${prefix} ===`);
  const keys = Object.keys(data['en'][prefix] || {});
  console.log(`Total keys in en.${prefix}: ${keys.length}`);
  keys.slice(0, 8).forEach(k => {
    console.log(`Key: ${prefix}.${k}`);
    locales.forEach(l => {
      console.log(`  ${l}: ${data[l]?.[prefix]?.[k]}`);
    });
  });
});
