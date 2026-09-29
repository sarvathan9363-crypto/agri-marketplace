import fs from 'node:fs';
import path from 'node:path';
import { detectFile } from './lib/i18n-detect.js';
const root = path.resolve('src');
const output = [];
const ignored = new Set(['AgriBazaar', 'KG', 'FPO', 'Razorpay']);
const isUrl = (value) => /^(https?:|\/|#)|^[A-Z_]+$/.test(value);
const record = (node, kind, text) => {
  const value = text.trim();
  if (value.length < 2 || ignored.has(value) || isUrl(value) || !/[A-Za-z]{2}/.test(value)) return;
  output.push({ file: path.relative(process.cwd(), node.__file), line: node.loc.start.line, column: node.loc.start.column + 1, kind, text: value, interpolation: /\$\{|{{/.test(value) });
};
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
  const file = path.join(dir, entry.name);
  if (entry.isDirectory()) { if (!['i18n', '__tests__', 'test', 'tests'].includes(entry.name)) walk(file); return; }
  if (!/\.(jsx|tsx|js|ts)$/.test(entry.name) || /\.test\.|\.spec\./.test(entry.name)) return;
  try { output.push(...detectFile(file)); } catch { console.warn(`SKIP parse error: ${file}`); }
});
walk(root);
output.sort((a,b) => a.file.localeCompare(b.file) || a.line-b.line || a.column-b.column);
const report = { generatedAt: new Date().toISOString(), total: output.length, findings: output };
fs.writeFileSync('i18n-audit.json', JSON.stringify(report, null, 2) + '\n');
if (!fs.existsSync('i18n-audit-baseline.json')) fs.writeFileSync('i18n-audit-baseline.json', JSON.stringify(report, null, 2) + '\n');
console.log(`AST i18n audit: ${report.total} finding(s). Report: i18n-audit.json`);
process.exitCode = report.total ? 1 : 0;
