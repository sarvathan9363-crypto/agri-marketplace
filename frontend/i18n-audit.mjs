// i18n-audit.mjs — find hardcoded user-visible text in JSX files
import { readdir, readFile, stat } from 'fs/promises';
import { join, relative, extname } from 'path';

const SRC = join(process.cwd(), 'src');
const SKIP_DIRS = ['node_modules', '.git', 'i18n', 'services', 'context', 'hooks', 'assets', 'utils'];
const JSX_EXT = ['.jsx', '.tsx', '.js'];

// Files that are NOT components (services, configs, etc.)
const SKIP_FILES = ['main.jsx', 'App.jsx', 'vite.config.js'];

async function* walk(dir) {
  for (const d of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, d.name);
    if (d.isDirectory()) {
      if (!SKIP_DIRS.includes(d.name)) yield* walk(full);
    } else if (JSX_EXT.includes(extname(d.name)) && !SKIP_FILES.includes(d.name)) {
      yield full;
    }
  }
}

// Patterns that indicate hardcoded user-visible text in JSX
const HARDCODED_PATTERNS = [
  // JSX text content: >Some text<
  { regex: />([A-Z][A-Za-z0-9\s',/&—\-\.!?:()]+)</g, type: 'JSX_TEXT' },
  // String props: title="Some text", placeholder="Some text", label="Some text"
  { regex: /(?:title|placeholder|label|aria-label|alt|header|subtitle|emptyTitle|emptyDescription)="([^"]+)"/g, type: 'PROP' },
  // toast.error/success/info('Some text')
  { regex: /toast\.\w+\(\s*['"]([^'"]+)['"]\s*\)/g, type: 'TOAST' },
  // toast.error(err... || 'Some text')
  { regex: /\|\|\s*['"]([A-Z][^'"]+)['"]/g, type: 'FALLBACK_MSG' },
];

// Strings to exclude (brand names, CSS classes, technical tokens)
const EXCLUDES = [
  /^AgriBazaar$/i,
  /^[A-Z_]+$/, // constants
  /^\d/, // numbers
  /^#/, // hex colors
  /^[a-z]/, // camelCase (likely variable names or CSS)
  /^http/, // URLs
  /^\s*$/, // whitespace only
  /^[A-Z]{1,5}$/, // Short abbreviations like KG, FPO
  /^[^a-zA-Z]*$/, // no letters at all
];

function shouldExclude(str) {
  const trimmed = str.trim();
  if (trimmed.length < 3) return true;
  return EXCLUDES.some(re => re.test(trimmed));
}

let totalFiles = 0;
let filesWithHardcoded = 0;
let totalStrings = 0;
const results = {};

for await (const file of walk(SRC)) {
  const content = await readFile(file, 'utf8');
  const rel = relative(SRC, file);
  
  // Check if file imports useTranslation
  const hasI18n = content.includes('useTranslation');
  
  const found = [];
  for (const pattern of HARDCODED_PATTERNS) {
    let match;
    const re = new RegExp(pattern.regex.source, pattern.regex.flags);
    while ((match = re.exec(content)) !== null) {
      const text = match[1]?.trim();
      if (text && !shouldExclude(text)) {
        // Get line number
        const lineNum = content.substring(0, match.index).split('\n').length;
        found.push({ line: lineNum, text, type: pattern.type });
      }
    }
  }
  
  totalFiles++;
  if (found.length > 0) {
    filesWithHardcoded++;
    totalStrings += found.length;
    results[rel] = { hasI18n, count: found.length, strings: found };
  }
}

console.log(`\n========== I18N AUDIT REPORT ==========`);
console.log(`Total component files scanned: ${totalFiles}`);
console.log(`Files with hardcoded text: ${filesWithHardcoded}`);
console.log(`Total hardcoded strings found: ${totalStrings}\n`);

for (const [file, info] of Object.entries(results).sort((a,b) => b[1].count - a[1].count)) {
  console.log(`\n--- ${file} (${info.count} strings, i18n: ${info.hasI18n ? 'YES' : 'NO'}) ---`);
  for (const s of info.strings) {
    console.log(`  L${s.line} [${s.type}]: "${s.text.substring(0, 80)}${s.text.length > 80 ? '...' : ''}"`);
  }
}
