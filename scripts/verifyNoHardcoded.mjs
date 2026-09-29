/**
 * Pre-build check: Fails the build automatically if any NEW hardcoded string
 * is added to frontend source files.
 */
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve(process.cwd().endsWith('frontend') ? 'src' : 'frontend/src');

function getFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.next', 'locales'].includes(entry.name)) continue;
      results = results.concat(getFiles(full));
    } else if (['.jsx', '.tsx'].some(ext => full.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

let hardcodedCount = 0;
const violations = [];

const files = getFiles(SRC_DIR);

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (/^\s*(import |const \w+ = require|\/\/|\/\*|\*)/.test(line)) continue;
    if (/console\.(log|warn|error)/.test(line)) continue;

    // Detect raw JSX text: >Text< that does NOT use t('key')
    const matches = [...line.matchAll(/>\s*([A-Za-z][A-Za-z0-9\s,'".\?!/:\-—()]+?)\s*</g)];
    for (const m of matches) {
      const text = m[1].trim();
      if (text.length < 3) continue;
      if (['div', 'span', 'br', 'hr', 'img', 'svg', 'path', 'button', 'input', 'code'].includes(text.toLowerCase())) continue;
      if (text.startsWith('http') || text.startsWith('//') || text.startsWith('www.')) continue;
      if (/^\d+$/.test(text)) continue;
      if (/^[{(]/.test(text) || /^t\s*\(/.test(text)) continue;
      if (line.includes("t('") || line.includes('t("') || line.includes('t(`')) continue;

      hardcodedCount++;
      violations.push({ file: path.relative(process.cwd(), file), line: lineNum, text });
    }
  }
}

if (violations.length > 0) {
  console.error('\n❌ BUILD FAILED: Hardcoded string check failed! New un-translated JSX string(s) detected:');
  violations.forEach(v => {
    console.error(`  - ${v.file}:${v.line} -> "${v.text}"`);
  });
  console.error('\nPlease wrap user-facing text in t(\'key\') and add keys to translation.json locale files.\n');
  process.exit(1);
} else {
  console.log('✓ Pre-build check PASSED: 0 hardcoded strings found.');
  process.exit(0);
}
