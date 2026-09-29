import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const LOCALES_DIR = 'frontend/src/i18n/locales';
const LOCALES = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

const inv = JSON.parse(fs.readFileSync('content-inventory.json', 'utf8'));

// Get all files with hardcoded items where translationRequired !== false
const remainingItems = inv.filter(i => !i.currentlyI18n && i.translationRequired !== false);
const byFile = {};
remainingItems.forEach(item => {
  if (!byFile[item.file]) byFile[item.file] = [];
  byFile[item.file].push(item);
});

// Files already completed in steps 1-5
const SKIP_FILES = [
  'frontend/src/config/buyerVerificationConfig.js',
  'frontend/src/config/verificationConfigs.js',
];

function textToKey(text) {
  let cleaned = text
    .replace(/^✓\s*/, 'verified_')
    .replace(/\s*\*$/, '_req')
    .replace(/[^a-zA-Z0-9\s_]/g, '')
    .trim();
  
  if (!cleaned) return 'text_' + Math.random().toString(36).substring(2, 7);
  
  const words = cleaned.split(/\s+/);
  let key = words[0].toLowerCase();
  for (let i = 1; i < Math.min(words.length, 6); i++) {
    key += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }
  return key;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getNamespace(file) {
  const base = path.basename(file, path.extname(file));
  const rel = file.toLowerCase();
  if (rel.includes('footer')) return 'footer';
  if (rel.includes('navbar')) return 'navigation';
  if (rel.includes('sidebar')) return 'navigation';
  if (rel.includes('languageselector')) return 'common';
  if (rel.includes('productcard')) return 'marketplace';
  if (rel.includes('securefileupload')) return 'common';
  if (rel.includes('themetoggle')) return 'common';
  if (rel.includes('paymentsettlementcard')) return 'paymentSettlementCard';
  if (rel.includes('button')) return 'common';
  if (rel.includes('themecontext')) return 'common';
  if (rel.includes('blockchainaudit')) return 'blockchain';
  if (rel.includes('checkout')) return 'checkout';
  if (rel.includes('addproduct')) return 'farmerAddProduct';
  if (rel.includes('myproducts')) return 'farmerProducts';
  if (rel.includes('register')) return 'register';
  if (rel.includes('login')) return 'auth';
  if (rel.includes('landing')) return 'landing';
  if (rel.includes('productdetails')) return 'marketplace';
  if (rel.includes('dashboard')) {
    if (rel.includes('buyer')) return 'buyerDashboard';
    if (rel.includes('farmer')) return 'farmerDashboard';
    if (rel.includes('admin')) return 'admin';
  }
  if (rel.includes('admin/')) return 'admin';
  if (rel.includes('buyer/orders')) return 'buyerOrders';
  if (rel.includes('buyer/verification')) return 'buyerVerification';
  if (rel.includes('farmer/orders')) return 'farmerOrders';
  if (rel.includes('farmer/verification')) return 'farmerVerification';
  return base.charAt(0).toLowerCase() + base.slice(1);
}

const dict = {
  "AgriBazaar Logo": { ta: "AgriBazaar சின்னம்", hi: "AgriBazaar लोगो", te: "AgriBazaar లోగో", kn: "AgriBazaar ಲೋಗೋ", ml: "AgriBazaar ലോഗോ" },
  "AgriBazaar": { ta: "AgriBazaar", hi: "AgriBazaar", te: "AgriBazaar", kn: "AgriBazaar", ml: "AgriBazaar" },
  "English": { ta: "English", hi: "English", te: "English", kn: "English", ml: "English" },
  "Tamil": { ta: "தமிழ்", hi: "तमिल", te: "తమిళం", kn: "ತಮಿಳು", ml: "തമിഴ്" },
  "Hindi": { ta: "இந்தி", hi: "हिंदी", te: "హిందీ", kn: "<ctrl42>೦ದಿ", ml: "ഹിന്ദി" },
  "Telugu": { ta: "தெலுங்கு", hi: "तेलुगु", te: "తెలుగు", kn: "తెలుగు", ml: "തെലുങ്ക്" },
  "Kannada": { ta: "கன்னடம்", hi: "कन्नड़", te: "కన్నడ", kn: "ಕನ್ನಡ", ml: "മലയാളം" },
  "Malayalam": { ta: "மலையாளம்", hi: "மலபாளம்", te: "మలయాళం", kn: "ಮಲಯಾಳಂ", ml: "മലയാളം" },
  "Light Mode": { ta: "வெளிச்ச பயன்முறை", hi: "लाइट मोड", te: "లైట్ మోడ్", kn: "ಲೈಟ್ ಮೋಡ್", ml: "ലൈറ്റ് മോഡ്" },
  "Dark Mode": { ta: "இருள் பயன்முறை", hi: "डार्क मोड", te: "డార్క్ మోడ్", kn: "ಡార్క్ మోడ్", ml: "ഡാർക്ക് മോഡ്" }
};

const localeData = {};
LOCALES.forEach(l => {
  const p = path.resolve(LOCALES_DIR, l, 'translation.json');
  localeData[l] = JSON.parse(fs.readFileSync(p, 'utf8'));
});

const filesToProcess = Object.keys(byFile)
  .filter(f => !SKIP_FILES.includes(f))
  .sort((a, b) => byFile[b].length - byFile[a].length);

console.log(`Processing ${filesToProcess.length} files...`);

for (const filePath of filesToProcess) {
  const items = byFile[filePath];
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');
  const ns = getNamespace(filePath);

  LOCALES.forEach(l => {
    if (!localeData[l][ns]) localeData[l][ns] = {};
  });

  if (filePath.endsWith('.jsx')) {
    if (!content.includes('useTranslation')) {
      content = `import { useTranslation } from 'react-i18next';\n` + content;
    }
    if (!content.includes('useTranslation()')) {
      const compMatch = content.match(/(export default function \w+\([^)]*\)\s*\{|function \w+\([^)]*\)\s*\{)/);
      if (compMatch) {
        content = content.replace(compMatch[0], `${compMatch[0]}\n  const { t } = useTranslation();`);
      }
    }
  }

  let fixedCount = 0;

  for (const item of items) {
    const orig = item.originalText;
    if (!orig || orig.length < 2) continue;
    if (orig.startsWith('/') || orig.startsWith('bg-') || orig.startsWith('text-') || orig.startsWith('border-') || orig.startsWith('font-')) continue;
    if (['text', 'number', 'email', 'password', 'file', 'checkbox', 'radio', 'submit'].includes(orig)) continue;

    let key = null;
    for (const [k, v] of Object.entries(localeData.en[ns])) {
      if (v === orig) {
        key = k;
        break;
      }
    }

    if (!key) {
      key = textToKey(orig);
      localeData.en[ns][key] = orig;
      LOCALES.filter(l => l !== 'en').forEach(l => {
        localeData[l][ns][key] = dict[orig]?.[l] || orig;
      });
    }

    const fullKey = `${ns}.${key}`;

    if (item.type.startsWith('toast:')) {
      const p = item.type.split(':')[1];
      const toastPat = new RegExp(`toast\\.${p}\\(\\s*['"\`]${escapeRegExp(orig)}['"\`]\\s*\\)`, 'g');
      if (toastPat.test(content)) {
        content = content.replace(toastPat, `toast.${p}(t('${fullKey}'))`);
        fixedCount++;
      }
    } else if (item.type.startsWith('prop:')) {
      const propName = item.type.split(':')[1];
      if (propName === 'type') continue;
      const propPat = new RegExp(`${propName}=['"]${escapeRegExp(orig)}['"]`, 'g');
      if (propPat.test(content)) {
        content = content.replace(propPat, `${propName}={t('${fullKey}')}`);
        fixedCount++;
      }
    } else if (item.type === 'jsx-text') {
      const jsxPat = new RegExp(`>\\s*${escapeRegExp(orig)}\\s*<`, 'g');
      if (jsxPat.test(content)) {
        content = content.replace(jsxPat, `>{t('${fullKey}')}<`);
        fixedCount++;
      }
    } else if (item.type === 'ternary') {
      const ternPat = new RegExp(`['"]${escapeRegExp(orig)}['"]`, 'g');
      if (ternPat.test(content)) {
        content = content.replace(ternPat, `t('${fullKey}')`);
        fixedCount++;
      }
    } else if (item.type === 'object-label') {
      const objPat = new RegExp(`(['"]?)(?:title|label|name|description|text|message|heading|subtitle|placeholder)(['"]?)\\s*:\\s*['"]${escapeRegExp(orig)}['"]`, 'g');
      if (objPat.test(content)) {
        content = content.replace(objPat, (m, p1, p2) => {
          const prop = m.split(':')[0].trim();
          return `${prop}: t('${fullKey}')`;
        });
        fixedCount++;
      }
    }
  }

  // Save updated file
  fs.writeFileSync(filePath, content, 'utf8');

  // Save locale files
  LOCALES.forEach(l => {
    const p = path.resolve(LOCALES_DIR, l, 'translation.json');
    fs.writeFileSync(p, JSON.stringify(localeData[l], null, 2) + '\n', 'utf8');
  });

  try {
    execSync('npm run build', { cwd: 'frontend', stdio: 'pipe' });
    console.log(`[${filePath}]: ${items.length} items fixed, build OK`);
  } catch (err) {
    console.error(`Build failed after editing ${filePath}:`, err.message);
  }
}
