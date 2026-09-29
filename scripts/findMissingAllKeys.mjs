import fs from 'fs';
import path from 'path';

const langs = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];
const data = {};

langs.forEach(l => {
  const filePath = path.join(process.cwd(), 'frontend', 'src', 'i18n', 'locales', l, 'translation.json');
  data[l] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

function getVal(obj, keyPath) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (const p of parts) {
    if (!curr || typeof curr !== 'object') return undefined;
    curr = curr[p];
  }
  return curr;
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const srcDir = path.join(process.cwd(), 'frontend', 'src');
const allFiles = getAllFiles(srcDir);

const missingReport = [];

allFiles.forEach(filePath => {
  const relPath = path.relative(srcDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Match t('key', ...) or t("key", ...)
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
    
    langs.forEach(l => {
      const val = getVal(data[l], key);
      if (val === undefined) {
        missingReport.push({
          file: relPath,
          key,
          defaultValue,
          lang: l
        });
      }
    });
  }
});

// Group by key
const grouped = {};
missingReport.forEach(item => {
  if (!grouped[item.key]) {
    grouped[item.key] = {
      files: new Set(),
      defaultValue: item.defaultValue,
      missingIn: []
    };
  }
  grouped[item.key].files.add(item.file);
  if (!grouped[item.key].missingIn.includes(item.lang)) {
    grouped[item.key].missingIn.push(item.lang);
  }
});

console.log(`TOTAL MISSING T() KEYS: ${Object.keys(grouped).length}`);
Object.keys(grouped).forEach(k => {
  const info = grouped[k];
  console.log(`KEY: "${k}" | Def: "${info.defaultValue}" | Missing in: [${info.missingIn.join(', ')}] | Used in: ${Array.from(info.files).join(', ')}`);
});
