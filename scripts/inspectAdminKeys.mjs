import fs from 'fs';
import path from 'path';

const adminDir = path.join(process.cwd(), 'frontend', 'src', 'pages', 'admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(adminDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n================ FILE: ${file} ================`);
  
  // Find all t('key', { defaultValue: '...' }) or t('key')
  const regex = /t\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*({[^}]+}))?\s*\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const options = match[2] || '';
    console.log(`t('${key}'${options ? ', ' + options : ''})`);
  }
});
