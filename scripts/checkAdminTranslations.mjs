import fs from 'fs';
import path from 'path';

const langs = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];
const data = {};

langs.forEach(l => {
  const filePath = path.join(process.cwd(), 'frontend', 'src', 'i18n', 'locales', l, 'translation.json');
  data[l] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
});

function walk(enObj, pathArr = []) {
  for (const k in enObj) {
    const currentPath = [...pathArr, k];
    const enVal = enObj[k];
    if (typeof enVal === 'object' && enVal !== null) {
      walk(enVal, currentPath);
    } else if (typeof enVal === 'string') {
      const pathStr = currentPath.join('.');
      const untranslated = [];
      langs.slice(1).forEach(l => {
        let val = data[l];
        for (const p of currentPath) {
          val = val ? val[p] : undefined;
        }
        // Check if value is identical to English value, and contains English letters
        if (val === enVal && /[a-zA-Z]/.test(enVal) && enVal.length > 1) {
          untranslated.push(l);
        }
      });
      if (untranslated.length > 0 && (pathStr.startsWith('admin') || pathStr.includes('col') || pathStr.includes('Col') || pathStr.includes('table') || pathStr.includes('Table') || pathStr.includes('filter') || pathStr.includes('Filter'))) {
        console.log(`${pathStr} ("${enVal}") -> untranslated in: ${untranslated.join(', ')}`);
      }
    }
  }
}

walk(data.en);
