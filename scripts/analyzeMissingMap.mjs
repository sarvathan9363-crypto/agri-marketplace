import fs from 'fs';

const map = JSON.parse(fs.readFileSync('scripts/untranslatedMap.json', 'utf8'));

const sections = {};

Object.keys(map).forEach(key => {
  const sec = key.split('.')[0];
  sections[sec] = (sections[sec] || 0) + 1;
});

console.log('Missing keys per section:', JSON.stringify(sections, null, 2));
