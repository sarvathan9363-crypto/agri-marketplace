/**
 * AgriBazaar — Complete Content Inventory Scanner
 * Scans every frontend source file and extracts ALL user-facing English strings.
 * Outputs: content-inventory.json and content-inventory.md
 */
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.resolve('c:/Volume D/projects/temp/agri/frontend/src');
const OUT_JSON = path.resolve('c:/Volume D/projects/temp/agri/content-inventory.json');
const OUT_MD = path.resolve('c:/Volume D/projects/temp/agri/content-inventory.md');

// ---- helpers ----
function getFiles(dir, exts = ['.jsx', '.tsx', '.js', '.ts', '.json']) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.next', 'locales'].includes(entry.name)) continue;
      results = results.concat(getFiles(full, exts));
    } else if (exts.some(e => full.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

function relPath(f) {
  return f.replace(SRC_DIR + path.sep, '').replace(/\\/g, '/');
}

function componentName(f) {
  const base = path.basename(f, path.extname(f));
  return base;
}

function guessRoute(f) {
  const rel = relPath(f).toLowerCase();
  if (rel.includes('landing')) return '/';
  if (rel.includes('login')) return '/login';
  if (rel.includes('register')) return '/register';
  if (rel.includes('marketplace') && !rel.includes('product')) return '/marketplace';
  if (rel.includes('productdetails')) return '/marketplace/:id';
  if (rel.includes('about')) return '/about';
  if (rel.includes('settings')) return '/settings';
  if (rel.includes('pages/buyer/cart')) return '/buyer/cart';
  if (rel.includes('pages/buyer/checkout')) return '/buyer/checkout';
  if (rel.includes('pages/buyer/orders')) return '/buyer/orders';
  if (rel.includes('pages/buyer/dashboard')) return '/buyer/dashboard';
  if (rel.includes('pages/buyer/profile')) return '/buyer/profile';
  if (rel.includes('pages/buyer/verification') && rel.includes('wizard')) return '/buyer/verification/wizard';
  if (rel.includes('pages/buyer/verification')) return '/buyer/verification';
  if (rel.includes('pages/farmer/dashboard')) return '/farmer/dashboard';
  if (rel.includes('pages/farmer/addproduct')) return '/farmer/products/add';
  if (rel.includes('pages/farmer/myproducts')) return '/farmer/products';
  if (rel.includes('pages/farmer/orders')) return '/farmer/orders';
  if (rel.includes('pages/farmer/sales')) return '/farmer/sales';
  if (rel.includes('pages/farmer/profile')) return '/farmer/profile';
  if (rel.includes('pages/farmer/verification') && rel.includes('wizard')) return '/farmer/verification/wizard';
  if (rel.includes('pages/farmer/verification')) return '/farmer/verification';
  if (rel.includes('pages/admin/dashboard')) return '/admin/dashboard';
  if (rel.includes('pages/admin/orders')) return '/admin/orders';
  if (rel.includes('pages/admin/products')) return '/admin/products';
  if (rel.includes('pages/admin/farmers')) return '/admin/farmers';
  if (rel.includes('pages/admin/users')) return '/admin/users';
  if (rel.includes('pages/admin/payments')) return '/admin/payments';
  if (rel.includes('pages/admin/settlements')) return '/admin/settlements';
  if (rel.includes('pages/admin/disputes')) return '/admin/disputes';
  if (rel.includes('pages/admin/analytics')) return '/admin/analytics';
  if (rel.includes('pages/admin/blockchain')) return '/admin/blockchain-audit';
  if (rel.includes('navbar')) return '(global)';
  if (rel.includes('footer')) return '(global)';
  if (rel.includes('sidebar')) return '(global)';
  if (rel.includes('layout')) return '(layout)';
  return '(component)';
}

function guessCategory(f) {
  const rel = relPath(f).toLowerCase();
  if (rel.includes('navbar')) return 'Navbar';
  if (rel.includes('footer')) return 'Footer';
  if (rel.includes('sidebar')) return 'Navbar';
  if (rel.includes('landing')) return 'Home';
  if (rel.includes('login') || rel.includes('register') || rel.includes('auth')) return 'Authentication';
  if (rel.includes('marketplace') && !rel.includes('product')) return 'Marketplace';
  if (rel.includes('productdetails')) return 'Product Details';
  if (rel.includes('productcard')) return 'Products';
  if (rel.includes('cart')) return 'Cart';
  if (rel.includes('checkout')) return 'Checkout';
  if (rel.includes('orders')) return 'Orders';
  if (rel.includes('buyer/dashboard')) return 'Buyer';
  if (rel.includes('buyer/profile')) return 'Profile';
  if (rel.includes('buyer/verification')) return 'Verification';
  if (rel.includes('farmer/dashboard')) return 'Farmer';
  if (rel.includes('farmer/addproduct')) return 'Farmer';
  if (rel.includes('farmer/myproducts')) return 'Farmer';
  if (rel.includes('farmer/sales')) return 'Farmer';
  if (rel.includes('farmer/profile')) return 'Profile';
  if (rel.includes('farmer/verification')) return 'Verification';
  if (rel.includes('admin/')) return 'Admin';
  if (rel.includes('settings')) return 'Settings';
  if (rel.includes('about')) return 'Other';
  if (rel.includes('layout')) return 'Global';
  if (rel.includes('components/ui/')) return 'Global';
  if (rel.includes('blockchain')) return 'Admin';
  if (rel.includes('payment')) return 'Checkout';
  if (rel.includes('fileupload') || rel.includes('securefileupload')) return 'Forms';
  if (rel.includes('config/')) return 'Verification';
  if (rel.includes('context/')) return 'Global';
  if (rel.includes('services/')) return 'Global';
  return 'Other';
}

// ---- String extraction ----

let nextId = 1;
function makeId() {
  return `CONTENT-${String(nextId++).padStart(4, '0')}`;
}

function extractFromJSX(content, filePath) {
  const items = [];
  const lines = content.split('\n');
  const comp = componentName(filePath);
  const route = guessRoute(filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Skip pure import/require lines
    if (/^\s*(import |const \w+ = require)/.test(line)) continue;
    // Skip comments
    if (/^\s*\/\//.test(line)) continue;
    if (/^\s*\/\*/.test(line)) continue;
    if (/^\s*\*/.test(line)) continue;
    // Skip console.log/warn/error (developer only)
    if (/console\.(log|warn|error|info|debug)/.test(line)) continue;

    // 1. JSX text content: >Text< (exclude lines that only use t())
    const jsxTextMatches = [...line.matchAll(/>\s*([^<>{}\n]+?)\s*</g)];
    for (const m of jsxTextMatches) {
      const text = m[1].trim();
      if (text.length < 2) continue;
      if (['div', 'span', 'br', 'hr', 'img', 'svg', 'path', 'button', 'input', 'code', 'pre', 'script', 'style'].includes(text.toLowerCase())) continue;
      if (text.startsWith('http') || text.startsWith('//') || text.startsWith('www.') || text.startsWith('file://')) continue;
      if (/^\d+$/.test(text)) continue;
      if (/^[{(]/.test(text) || /^t\s*\(/.test(text)) continue;
      // Must contain at least one letter character
      if (!/[a-zA-Z\u0900-\u0D7F]/.test(text)) continue;
      // Skip code symbols or css classes
      if (/^(flex|grid|hidden|block|relative|absolute|px-\d|py-\d|w-\d|h-\d|bg-|text-|font-|rounded)/.test(text)) continue;
      
      const isI18n = line.includes("t('") || line.includes('t("') || line.includes('t(`') || text.includes("t('") || text.includes('t("') || text.includes('t(`');
      items.push({
        id: makeId(),
        file: 'frontend/src/' + relPath(filePath),
        line: lineNum,
        component: comp,
        route,
        type: 'jsx-text',
        source: 'static',
        originalText: text,
        context: '',
        translationRequired: true,
        currentlyI18n: isI18n,
      });
    }

    // 2. String props: placeholder="...", title="...", aria-label="...", alt="...", label="...", description="...", helperText="..."
    const propPatterns = [
      /placeholder="([^"]+)"/g,
      /title="([^"]+)"/g,
      /aria-label="([^"]+)"/g,
      /alt="([^"]+)"/g,
      /label="([^"]+)"/g,
      /description="([^"]+)"/g,
      /helperText="([^"]+)"/g,
      /tooltip="([^"]+)"/g,
      /emptyTitle="([^"]+)"/g,
      /emptyDescription="([^"]+)"/g,
    ];
    for (const pat of propPatterns) {
      pat.lastIndex = 0;
      let pm;
      while ((pm = pat.exec(line)) !== null) {
        const text = pm[1].trim();
        if (text.length < 2) continue;
        if (text.startsWith('http') || text.startsWith('{') || text.startsWith('//')) continue;
        if (!text.includes(' ') && /^[A-Z_0-9]+$/.test(text) && text.length < 15) continue; // single short enum constant without spaces
        const propName = pat.source.match(/(\w+)="/)?.[1] || 'prop';
        const isI18n = line.includes("t('") || line.includes('t("') || line.includes('t(`');
        items.push({
          id: makeId(),
          file: 'frontend/src/' + relPath(filePath),
          line: lineNum,
          component: comp,
          route,
          type: `prop:${propName}`,
          source: 'static',
          originalText: text,
          context: '',
          translationRequired: true,
          currentlyI18n: isI18n,
        });
      }
    }

    // 3. toast.success/error/warning/info("...")
    const toastPatterns = [
      /toast\.(success|error|warning|info)\(\s*["'`]([^"'`]+)["'`]/g,
      /toast\.(success|error|warning|info)\(\s*t\(\s*["'`]([^"'`]+)["'`]/g,
    ];
    for (const pat of toastPatterns) {
      pat.lastIndex = 0;
      let pm;
      while ((pm = pat.exec(line)) !== null) {
        const isI18n = pm[0].includes("t('") || pm[0].includes('t("');
        if (isI18n) {
          items.push({
            id: makeId(),
            file: 'frontend/src/' + relPath(filePath),
            line: lineNum,
            component: comp,
            route,
            type: `toast:${pm[1]}`,
            source: 'static',
            originalText: `[i18n key: ${pm[2]}]`,
            context: `toast.${pm[1]}`,
            translationRequired: true,
            currentlyI18n: true,
          });
        } else {
          items.push({
            id: makeId(),
            file: 'frontend/src/' + relPath(filePath),
            line: lineNum,
            component: comp,
            route,
            type: `toast:${pm[1]}`,
            source: 'static',
            originalText: pm[2],
            context: `toast.${pm[1]}`,
            translationRequired: true,
            currentlyI18n: false,
          });
        }
      }
    }

    // 4. t('key') or t("key") or t('key', { defaultValue: '...' })
    const i18nMatches = [...line.matchAll(/t\(\s*['"]([^'"]+)['"]/g)];
    for (const m of i18nMatches) {
      const key = m[1];
      const dvMatch = line.match(new RegExp(`t\\(['"]${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]\\s*,\\s*\\{[^}]*defaultValue:\\s*['"]([^'"]+)['"]`));
      const defaultVal = dvMatch ? dvMatch[1] : null;
      if (line.includes('toast.') && items.some(it => it.line === lineNum && it.type.startsWith('toast:'))) continue;
      items.push({
        id: makeId(),
        file: 'frontend/src/' + relPath(filePath),
        line: lineNum,
        component: comp,
        route,
        type: 'i18n-key',
        source: 'static',
        originalText: defaultVal || `[i18n key: ${key}]`,
        i18nKey: key,
        context: '',
        translationRequired: true,
        currentlyI18n: true,
      });
    }

    // 5. Ternary text: condition ? "Yes" : "No"  or  loading ? "Loading..." : "Done"
    const ternaryMatches = [...line.matchAll(/\?\s*["'`]([^"'`]+)["'`]\s*:\s*["'`]([^"'`]+)["'`]/g)];
    for (const m of ternaryMatches) {
      for (const text of [m[1], m[2]]) {
        if (text.length < 2) continue;
        if (/^\d+$/.test(text)) continue;
        if (text.startsWith('http') || text.startsWith('{')) continue;
        const isI18n = line.includes("t('") || line.includes('t("');
        items.push({
          id: makeId(),
          file: 'frontend/src/' + relPath(filePath),
          line: lineNum,
          component: comp,
          route,
          type: 'ternary',
          source: 'static',
          originalText: text,
          context: '',
          translationRequired: true,
          currentlyI18n: isI18n,
        });
      }
    }

    // 6. String literal in arrays/objects: "Label", label: "...", title: "..."
    const objLabelMatches = [...line.matchAll(/(?:label|header|title|name|description|text|message|heading|subheading|subtitle|content|placeholder|helperText|buttonText|badgeText|headline|emptyText|emptyTitle|statusText|badge|navLabel|menuLabel):\s*["'`]([^"'`]+)["'`]/g)];
    for (const m of objLabelMatches) {
      const text = m[1].trim();
      if (text.length < 2) continue;
      if (!text.includes(' ') && /^[A-Z_0-9]+$/.test(text) && text.length < 15) continue; // single short enum constant
      if (text.startsWith('http') || text.startsWith('{') || text.startsWith('/api')) continue;
      const isNativeLang = ['English', 'தமிழ்', 'ஹிந்தி', 'हिन्दी', 'తెలుగు', 'கன்னடம்', 'ಕನ್ನಡ', 'மலയാളம்'].includes(text);
      const isI18n = line.includes("t('") || line.includes('t("') || line.includes('t(`') || line.includes("t(") || line.includes("translate(") || text.startsWith('[i18n') || isNativeLang;
      items.push({
        id: makeId(),
        file: 'frontend/src/' + relPath(filePath),
        line: lineNum,
        component: comp,
        route,
        type: 'object-label',
        source: 'static',
        originalText: text,
        context: '',
        translationRequired: true,
        currentlyI18n: isI18n,
      });
    }

    // 7. Dynamic content patterns: {product.name}, {farmer.fullName}, {user.email} etc
    const dynamicMatches = [...line.matchAll(/\{(\w+)\.(name|productName|fullName|farmName|farmerName|location|description|email|phone|address|category|unit|status|role|farmerType|city|state|district|message|title|subject)\}/g)];
    for (const m of dynamicMatches) {
      const isI18n = line.includes('statusLabel') || line.includes('categoryLabel') || line.includes('roleLabel') || line.includes('t(');
      items.push({
        id: makeId(),
        file: 'frontend/src/' + relPath(filePath),
        line: lineNum,
        component: comp,
        route,
        type: 'dynamic',
        source: `${m[1]}.${m[2]}`,
        originalText: `{{${m[1]}.${m[2]}}}`,
        context: `Dynamic field from ${m[1]}`,
        translationRequired: m[2] === 'status' || m[2] === 'category' || m[2] === 'role' || m[2] === 'farmerType',
        currentlyI18n: isI18n,
      });
    }
  }

  return items;
}

function extractFromConfig(content, filePath) {
  const items = [];
  const lines = content.split('\n');
  const comp = componentName(filePath);
  const route = guessRoute(filePath);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Look for object properties with string values that look user-facing
    const propMatches = [...line.matchAll(/(?:label|header|title|name|description|text|message|heading|subheading|subtitle|stepTitle|stepDescription|placeholder|helperText|badge|badgeText|headline|eyebrow|emptyTitle|emptyText|buttonLabel|buttonText|info):\s*["'`]([^"'`]{2,})["'`]/g)];
    for (const m of propMatches) {
      const text = m[1].trim();
      if (!text.includes(' ') && /^[A-Z_0-9]+$/.test(text) && text.length < 15) continue;
      if (text.startsWith('http') || text.startsWith('/api') || text.startsWith('{')) continue;
      const isI18n = line.includes("t('") || line.includes('t("') || line.includes('t(`') || line.includes("translate('") || line.includes('translate("');
      items.push({
        id: makeId(),
        file: 'frontend/src/' + relPath(filePath),
        line: lineNum,
        component: comp,
        route,
        type: 'config-label',
        source: 'static',
        originalText: text,
        context: 'Configuration file',
        translationRequired: true,
        currentlyI18n: isI18n,
      });
    }
  }
  return items;
}

// ---- MAIN ----
const allFiles = getFiles(SRC_DIR);
const allItems = [];
let totalExcluded = 0;

for (const f of allFiles) {
  const ext = path.extname(f);
  const content = fs.readFileSync(f, 'utf8');

  if (ext === '.json') {
    // Skip locale JSON (they are the translations themselves)
    continue;
  }

  if (ext === '.jsx' || ext === '.tsx') {
    allItems.push(...extractFromJSX(content, f));
  } else if (ext === '.js' || ext === '.ts') {
    if (relPath(f).includes('config/')) {
      allItems.push(...extractFromConfig(content, f));
    } else {
      // Services, context etc — check for user-facing strings
      allItems.push(...extractFromJSX(content, f));
    }
  }
}

// Deduplicate: same file + same line + same originalText = keep one
const seen = new Set();
const deduped = [];
for (const item of allItems) {
  const key = `${item.file}:${item.line}:${item.originalText}`;
  if (seen.has(key)) {
    totalExcluded++;
    continue;
  }
  seen.add(key);
  deduped.push(item);
}

// Re-number
deduped.forEach((item, idx) => {
  item.id = `CONTENT-${String(idx + 1).padStart(4, '0')}`;
});

// Stats
const staticCount = deduped.filter(i => i.source === 'static').length;
const dynamicCount = deduped.filter(i => i.type === 'dynamic').length;
const i18nControlled = deduped.filter(i => i.currentlyI18n).length;
const hardcoded = deduped.filter(i => !i.currentlyI18n && i.source === 'static').length;
const needsTranslation = deduped.filter(i => i.translationRequired).length;

// --- Write JSON ---
fs.writeFileSync(OUT_JSON, JSON.stringify(deduped, null, 2), 'utf8');

// --- Write Markdown ---
const categories = [
  'Global', 'Navbar', 'Home', 'Marketplace', 'Products', 'Product Details',
  'Cart', 'Checkout', 'Orders', 'Farmer', 'Buyer', 'Verification',
  'Admin', 'Authentication', 'Profile', 'Settings', 'Forms',
  'Other', 'Footer',
];

let md = `# AgriBazaar — Complete Content Inventory\n\n`;
md += `> Generated: ${new Date().toISOString()}\n`;
md += `> Analysis-only — no code was modified.\n\n`;
md += `## Summary\n\n`;
md += `| Metric | Count |\n|---|---|\n`;
md += `| Total files scanned | ${allFiles.length} |\n`;
md += `| Total content items | ${deduped.length} |\n`;
md += `| Static content | ${staticCount} |\n`;
md += `| Dynamic content | ${dynamicCount} |\n`;
md += `| Currently i18n-controlled | ${i18nControlled} |\n`;
md += `| Hardcoded (not i18n) | ${hardcoded} |\n`;
md += `| Requiring translation | ${needsTranslation} |\n`;
md += `| Duplicates excluded | ${totalExcluded} |\n\n`;

// Group by category
for (const cat of categories) {
  const items = deduped.filter(i => guessCategory(SRC_DIR + '/' + i.file.replace('frontend/src/', '').replace(/\//g, '/')) === cat ||
    // fallback: check relPath
    guessCategory(i.file.replace('frontend/src/', '')) === cat
  );
  if (items.length === 0) continue;

  md += `## ${cat}\n\n`;
  md += `| ID | File | Line | Type | Original Text | i18n? |\n`;
  md += `|---|---|---|---|---|---|\n`;
  for (const item of items) {
    const shortFile = item.file.replace('frontend/src/', '');
    const escaped = item.originalText.replace(/\|/g, '\\|').replace(/\n/g, ' ').substring(0, 80);
    md += `| ${item.id} | ${shortFile} | ${item.line} | ${item.type} | ${escaped} | ${item.currentlyI18n ? '✅' : '❌'} |\n`;
  }
  md += `\n`;
}

// Unassigned items
const assignedIds = new Set();
for (const cat of categories) {
  const items = deduped.filter(i => {
    const catCheck = guessCategory(i.file.replace('frontend/src/', ''));
    return catCheck === cat;
  });
  items.forEach(i => assignedIds.add(i.id));
}
const unassigned = deduped.filter(i => !assignedIds.has(i.id));
if (unassigned.length > 0) {
  md += `## Uncategorized\n\n`;
  md += `| ID | File | Line | Type | Original Text | i18n? |\n`;
  md += `|---|---|---|---|---|---|\n`;
  for (const item of unassigned) {
    const shortFile = item.file.replace('frontend/src/', '');
    const escaped = item.originalText.replace(/\|/g, '\\|').replace(/\n/g, ' ').substring(0, 80);
    md += `| ${item.id} | ${shortFile} | ${item.line} | ${item.type} | ${escaped} | ${item.currentlyI18n ? '✅' : '❌'} |\n`;
  }
  md += `\n`;
}

fs.writeFileSync(OUT_MD, md, 'utf8');

console.log(`\n========================================`);
console.log(`AgriBazaar Content Inventory — Complete`);
console.log(`========================================`);
console.log(`Total files scanned:         ${allFiles.length}`);
console.log(`Total content items:         ${deduped.length}`);
console.log(`  Static content:            ${staticCount}`);
console.log(`  Dynamic content:           ${dynamicCount}`);
console.log(`  Currently i18n-controlled: ${i18nControlled}`);
console.log(`  Hardcoded (not i18n):      ${hardcoded}`);
console.log(`  Requiring translation:     ${needsTranslation}`);
console.log(`  Duplicates excluded:       ${totalExcluded}`);
console.log(`\nOutput files:`);
console.log(`  JSON: ${OUT_JSON}`);
console.log(`  MD:   ${OUT_MD}`);
console.log(`========================================\n`);
