import fs from 'fs';
import path from 'path';

const compDir = path.join(process.cwd(), 'frontend', 'src', 'components');

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

const files = getAllFiles(compDir);

files.forEach(filePath => {
  const relPath = path.relative(compDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n================ FILE: ${relPath} ================`);
  
  const regex = /t\s*\(\s*['"]([^'"]+)['"](?:\s*,\s*({[^}]+}))?\s*\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const options = match[2] || '';
    console.log(`t('${key}'${options ? ', ' + options : ''})`);
  }
});
