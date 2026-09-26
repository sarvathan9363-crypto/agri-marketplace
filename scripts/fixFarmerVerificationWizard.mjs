import fs from 'fs';
import path from 'path';

const TARGET_FILE = 'frontend/src/pages/farmer/VerificationWizard.jsx';
const LOCALES_DIR = 'frontend/src/i18n/locales';
const LOCALES = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

const inv = JSON.parse(fs.readFileSync('content-inventory.json', 'utf8'));
const fileItems = inv.filter(i => i.file === TARGET_FILE && !i.currentlyI18n && i.translationRequired !== false);

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

const localeData = {};
LOCALES.forEach(l => {
  const p = path.resolve(LOCALES_DIR, l, 'translation.json');
  localeData[l] = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!localeData[l].farmerVerificationWizard) {
    localeData[l].farmerVerificationWizard = {};
  }
});

let content = fs.readFileSync(TARGET_FILE, 'utf8');

const IGNORE_PROPS = ['className', 'type', 'id', 'key', 'onClick', 'onChange', 'src', 'href', 'ref', 'disabled', 'value'];

for (const item of fileItems) {
  const orig = item.originalText;
  if (!orig || orig.length < 2) continue;

  let key = null;
  for (const [k, v] of Object.entries(localeData.en.farmerVerificationWizard)) {
    if (v === orig) {
      key = k;
      break;
    }
  }

  if (!key) {
    key = textToKey(orig);
    localeData.en.farmerVerificationWizard[key] = orig;
    LOCALES.filter(l => l !== 'en').forEach(l => {
      localeData[l].farmerVerificationWizard[key] = orig;
    });
  }

  const fullKey = `farmerVerificationWizard.${key}`;
  
  if (item.type.startsWith('toast:')) {
    const p = item.type.split(':')[1];
    content = content.replaceAll(`toast.${p}('${orig}')`, `toast.${p}(t('${fullKey}'))`);
    content = content.replaceAll(`toast.${p}("${orig}")`, `toast.${p}(t('${fullKey}'))`);
  } else if (item.type.startsWith('prop:')) {
    const propName = item.type.split(':')[1];
    if (IGNORE_PROPS.includes(propName)) continue;
    content = content.replaceAll(`${propName}="${orig}"`, `${propName}={t('${fullKey}')}`);
    content = content.replaceAll(`${propName}='${orig}'`, `${propName}={t('${fullKey}')}`);
  } else if (item.type === 'jsx-text') {
    content = content.replaceAll(`>${orig}<`, `>{t('${fullKey}')}<`);
    content = content.replaceAll(`> ${orig} <`, `>{t('${fullKey}')}<`);
  } else if (item.type === 'ternary') {
    if (orig.includes(' ') && !orig.startsWith('text-') && !orig.startsWith('bg-') && !content.includes(`value="${orig}"`)) {
      content = content.replaceAll(`'${orig}'`, `t('${fullKey}')`);
      content = content.replaceAll(`"${orig}"`, `t('${fullKey}')`);
    }
  }
}

LOCALES.forEach(l => {
  const p = path.resolve(LOCALES_DIR, l, 'translation.json');
  fs.writeFileSync(p, JSON.stringify(localeData[l], null, 2) + '\n', 'utf8');
});

fs.writeFileSync(TARGET_FILE, content, 'utf8');
console.log('Done processing farmer/VerificationWizard.jsx cleanly');
