/* Development-only heuristic: reports likely visible string literals for review. */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const files = [];
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
  const full = path.join(directory, entry.name);
  if (entry.isDirectory()) walk(full);
  else if (/\.(jsx|tsx|js|ts)$/.test(entry.name) && !full.includes(`${path.sep}i18n${path.sep}`)) files.push(full);
});
walk(root);

let found = 0;
for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.trim().startsWith('//') || /className=|import |from ['"]|https?:\/\/|console\.|testid|\.json/.test(line)) return;
    const matches = [...line.matchAll(/(?:>|placeholder=|title=|aria-label=|toast\.(?:success|error|loading)\(|alert\(|confirm\()\s*['"`]([^'"`{}]{3,})/g)];
    matches.forEach((match) => {
      const value = match[1].trim();
      if (/[A-Za-z]{2}/.test(value) && !/^(GET|POST|PUT|DELETE|ACTIVE|PENDING|VERIFIED)$/.test(value)) {
        found += 1;
        console.log(`FOUND: ${path.relative(process.cwd(), file)}:${index + 1}: "${value}"`);
      }
    });
  });
}
console.log(`\n${found} likely user-facing string(s) require review.`);
process.exitCode = found ? 1 : 0;
