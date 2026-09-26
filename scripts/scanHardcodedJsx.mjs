import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('c:/Volume D/projects/temp/agri/frontend/src');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (fullPath.endsWith('.jsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles(srcDir);

console.log('--- SCANNING JSX FILES FOR UNTRANSLATED TEXT ---');
let totalFound = 0;

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(srcDir, file);
  const matches = [];

  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('t(') || line.includes('import ') || line.trim().startsWith('//') || line.trim().startsWith('/*') || line.includes('console.')) {
      return;
    }
    
    const matchLine = line.match(/>\s*([A-Za-z][A-Za-z0-9\s,'".\?!/:\-()]{2,})\s*</);
    if (matchLine) {
      const text = matchLine[1].trim();
      if (text.length > 2 && !['div', 'span', 'path', 'svg', 'button', 'input', 'code', 'Agri', 'Bazaar', '₹'].includes(text) && !text.startsWith('http')) {
        matches.push({ line: index + 1, text });
      }
    }
  });

  if (matches.length > 0) {
    console.log(`\nFile: ${relPath}`);
    matches.forEach(m => {
      console.log(`  Line ${m.line}: "${m.text}"`);
      totalFound++;
    });
  }
});

console.log(`\nTotal potential hardcoded strings found: ${totalFound}`);
