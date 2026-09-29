import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const LOCALES_DIR = 'frontend/src/i18n/locales';
const LOCALES = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

const localeData = {};
LOCALES.forEach(l => {
  const p = path.resolve(LOCALES_DIR, l, 'translation.json');
  localeData[l] = JSON.parse(fs.readFileSync(p, 'utf8'));
});

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
  const rel = file.toLowerCase();
  if (rel.includes('footer')) return 'footer';
  if (rel.includes('navbar')) return 'navigation';
  if (rel.includes('sidebar')) return 'navigation';
  if (rel.includes('register')) return 'register';
  if (rel.includes('login')) return 'auth';
  if (rel.includes('about')) return 'about';
  if (rel.includes('settings')) return 'settings';
  if (rel.includes('checkout')) return 'checkout';
  if (rel.includes('cart')) return 'cart';
  if (rel.includes('productdetails')) return 'marketplace';
  if (rel.includes('addproduct')) return 'farmerAddProduct';
  if (rel.includes('myproducts')) return 'farmerProducts';
  if (rel.includes('sales')) return 'farmerSales';
  if (rel.includes('settlements')) return 'admin';
  if (rel.includes('users')) return 'admin';
  if (rel.includes('analytics')) return 'admin';
  if (rel.includes('blockchainaudit')) return 'blockchain';
  if (rel.includes('paymentsettlementcard')) return 'paymentSettlementCard';
  if (rel.includes('buyer/dashboard')) return 'buyerDashboard';
  if (rel.includes('buyer/orders')) return 'buyerOrders';
  if (rel.includes('buyer/profile')) return 'buyerProfile';
  if (rel.includes('buyer/verification')) return 'buyerVerification';
  if (rel.includes('farmer/dashboard')) return 'farmerDashboard';
  if (rel.includes('farmer/orders')) return 'farmerOrders';
  if (rel.includes('farmer/profile')) return 'farmerProfile';
  if (rel.includes('farmer/verification')) return 'farmerVerification';
  return 'common';
}

const dict = {
  "Demo Credentials": { ta: "டெமோ சான்றுகள்", hi: "डेमो क्रेडेंशियल", te: "డెమో ఆధారాలు", kn: "ಡೆಮೊ రుజువుగళు", ml: "ഡെമോ ക്രെഡൻഷ്യലുകൾ" },
  "Join AgriBazaar": { ta: "AgriBazaar இல் இணையுங்கள்", hi: "AgriBazaar में शामिल हों", te: "AgriBazaar లో చేరండి", kn: "AgriBazaar ಸೇರಿರಿ", ml: "AgriBazaar-ൽ ചേരുക" },
  "Farmer Registration": { ta: "விவசாயி பதிவு", hi: "किसान पंजीकरण", te: "రైతు రిజిస్ట్రేషన్", kn: "ರೈತ ನೋಂದಣಿ", ml: "കർഷക രജിസ്ട്രേഷൻ" },
  "Buyer Registration": { ta: "வாங்குபவர் பதிவு", hi: "खरीदार पंजीकरण", te: "కొనుగోలుదారు రిజిస్ట్రేషన్", kn: "ಖರೀದಿದಾರರ ನೋಂದಣಿ", ml: "വാങ്ങുന്നയാളുടെ രജിസ്ട്രേഷൻ" },
  "Sign In": { ta: "உள்நுழைக", hi: "साइन इन करें", te: "సైన్ ఇన్ చేయండి", kn: "ಸೈನ್ ಇನ್ ಮಾಡಿ", ml: "സൈൻ ഇൻ ചെയ്യുക" },
  "Delivery Address": { ta: "விநியோக முகவரி", hi: "वितरण का पता", te: "డెలివరీ చిరునామా", kn: "ಡೆಲಿವರಿ ವಿಳಾಸ", ml: "ഡെലിവറി വിലാസം" },
  "Full Name": { ta: "முழு பெயர்", hi: "पूरा नाम", te: "పూర్తి పేరు", kn: "ಪೂರ್ಣ ಹೆಸರು", ml: "പൂർണ്ണ പേര്" },
  "Email Address": { ta: "மின்னஞ்சல் முகவரி", hi: "ईमेल पता", te: "ఈమెయిల్ చిరునామా", kn: "ಇಮೇಲ್ ವಿಳಾಸ", ml: "ഇമെയിൽ വിലാസം" },
  "Mobile Number": { ta: "மொபைல் எண்", hi: "मोबाइल नंबर", te: "మొబైల్ సంఖ్య", kn: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", ml: "മൊബൈൽ നമ്പർ" },
  "Pincode": { ta: "அஞ்சல் குறியீடு", hi: "पिनकोड", te: "పిన్‌కోడ్", kn: "ಪಿನ್‌ಕೋಡ್", ml: "പിൻകോഡ്" },
  "City": { ta: "நகரம்", hi: "शहर", te: "నగరం", kn: "ನಗರ", ml: "നഗരം" },
  "State": { ta: "மாநிலம்", hi: "राज्य", te: "రాష్ట్రం", kn: "ರಾಜ್ಯ", ml: "സംസ്ഥാനം" }
};

// Extract violations by running node scripts/verifyNoHardcoded.mjs
let processOutput = '';
try {
  processOutput = execSync('node scripts/verifyNoHardcoded.mjs', { encoding: 'utf8' });
} catch (err) {
  processOutput = err.stdout + err.stderr;
}

const lines = processOutput.split('\n');
const violationLines = lines.filter(l => l.includes(' -> '));

const byFile = {};
for (const vLine of violationLines) {
  const match = vLine.match(/^\s*-\s*([^\:]+):(\d+)\s*->\s*"([^"]+)"/);
  if (match) {
    const [, file, lineStr, text] = match;
    const normFile = file.replace(/\\/g, '/');
    if (!byFile[normFile]) byFile[normFile] = [];
    byFile[normFile].push({ line: parseInt(lineStr, 10), text });
  }
}

console.log('Files needing final cleanup:', Object.keys(byFile).length);

for (const [filePath, items] of Object.entries(byFile)) {
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

  for (const { text } of items) {
    if (!text || text.length < 2) continue;
    if (text.startsWith('/') || text.startsWith('bg-') || text.startsWith('text-')) continue;

    let key = null;
    for (const [k, v] of Object.entries(localeData.en[ns])) {
      if (v === text) {
        key = k;
        break;
      }
    }

    if (!key) {
      key = textToKey(text);
      localeData.en[ns][key] = text;
      LOCALES.filter(l => l !== 'en').forEach(l => {
        localeData[l][ns][key] = dict[text]?.[l] || text;
      });
    }

    const fullKey = `${ns}.${key}`;
    const jsxPat = new RegExp(`>\\s*${escapeRegExp(text)}\\s*<`, 'g');
    if (jsxPat.test(content)) {
      content = content.replace(jsxPat, `>{t('${fullKey}')}<`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');

  LOCALES.forEach(l => {
    const p = path.resolve(LOCALES_DIR, l, 'translation.json');
    fs.writeFileSync(p, JSON.stringify(localeData[l], null, 2) + '\n', 'utf8');
  });

  try {
    execSync('npm run build', { cwd: 'frontend', stdio: 'pipe' });
    console.log(`[${filePath}]: clean build OK`);
  } catch (err) {
    console.error(`Build error on ${filePath}:`, err.message);
  }
}
