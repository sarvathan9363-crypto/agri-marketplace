import fs from 'fs';
import path from 'path';

const langs = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];
const data = {};

langs.forEach(l => {
  const filePath = path.join(process.cwd(), 'frontend', 'src', 'i18n', 'locales', l, 'translation.json');
  data[l] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

// Helper to get nested value
function getVal(obj, keyPath) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (const p of parts) {
    if (!curr || typeof curr !== 'object') return undefined;
    curr = curr[p];
  }
  return curr;
}

// Find all t('key', ...) in admin files
const adminDir = path.join(process.cwd(), 'frontend', 'src', 'pages', 'admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.jsx'));

console.log('=== ADMIN T() KEYS CHECK ===');

const foundKeys = new Set();

files.forEach(file => {
  const filePath = path.join(adminDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Match t('key' ...) or t("key" ...)
  const regex = /t\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*({[^}]+}))?\s*\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const optionsStr = match[2] || '';
    let defaultValue = '';
    const defMatch = optionsStr.match(/defaultValue\s*:\s*['"]([^'"]+)['"]/);
    if (defMatch) {
      defaultValue = defMatch[1];
    }
    
    foundKeys.add(JSON.stringify({ file, key, defaultValue }));
  }
});

Array.from(foundKeys).forEach(itemStr => {
  const { file, key, defaultValue } = JSON.parse(itemStr);
  const enVal = getVal(data.en, key);
  const missingLangs = [];
  
  langs.forEach(l => {
    const val = getVal(data[l], key);
    if (!val) {
      missingLangs.push(l);
    }
  });

  if (missingLangs.length > 0) {
    console.log(`[${file}] Key "${key}" (def: "${defaultValue}") MISSING in: ${missingLangs.join(', ')}`);
  }
});
