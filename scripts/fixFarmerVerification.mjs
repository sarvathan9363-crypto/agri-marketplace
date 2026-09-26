import fs from 'fs';
import path from 'path';

const TARGET_FILE = 'frontend/src/pages/farmer/Verification.jsx';
const LOCALES_DIR = 'frontend/src/i18n/locales';
const LOCALES = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

const dict = {
  "Identity Verification (Aadhaar)": {
    ta: "அடையாள சரிபார்ப்பு (ஆதார்)",
    hi: "पहचान सत्यापन (आधार)",
    te: "గుర్తింపు సరిచూసే ప్రక్రియ (ఆధార్)",
    kn: "ಗುರುತು ಪರಿಶೀಲನೆ (ಆಧಾರ್)",
    ml: "വ്യക്തിത്വ സ്ഥിരീകരണം (ആധാർ)"
  },
  "Authorized UIDAI identity verification": {
    ta: "அங்கீகரிக்கப்பட்ட UIDAI அடையாள சரிபார்ப்பு",
    hi: "अधिकृत UIDAI पहचान सत्यापन",
    te: "అధికారిక UIDAI గుర్తింపు సరిచూసే ప్రక్రియ",
    kn: "ಅಧಿಕೃತ UIDAI ಗುರುತು ಪರಿಶೀಲನೆ",
    ml: "അധികാരപ്പെടുത്തിയ UIDAI വ്യക്തിത്വ പരിശോധന"
  },
  "Farmer ID / Registry": {
    ta: "விவசாயி அடையாள எண் / பதிவு",
    hi: "किसान आईडी / रजिस्ट्री",
    te: "రైతు ఐడీ / రిజిస్ట్రీ",
    kn: "ರೈತ ಐಡಿ / ನೋಂದಣಿ",
    ml: "കർഷക ഐഡി / രജിസ്ട്രി"
  },
  "State / National Farmer Agristack database record": {
    ta: "மாநில / தேசிய விவசாயி அக்ரிஸ்டாக் தரவுத்தள பதிவு",
    hi: "राज्य / राष्ट्रीय किसान एग्रीस्टैक डेटाबेस रिकॉर्ड",
    te: "రాష్ట్ర / జాతీయ రైతు అగ్రిస్టాక్ డేటాబేస్ రికార్డు",
    kn: "ರಾಜ್ಯ / ರಾಷ್ಟ್ರೀಯ ರೈತ ಅಗ್ರಿಸ್ಟಾಕ್ ಡೇಟಾಬೇಸ್ ದಾಖಲೆ",
    ml: "സംസ്ഥാന / ദേശീയ കർഷക അഗ്രിസ്റ്റാക്ക് ഡാറ്റാബേസ് രേഖ"
  },
  "Land Record / Patta": {
    ta: "நிலப் பதிவு / பட்டா",
    hi: "भूमि रिकॉर्ड / पट्टा",
    te: "భూమి రికార్డు / పట్టా",
    kn: "ಜಮೀನು ದಾಖಲೆ / ಪಟ್ಟಾ",
    ml: "ഭൂമി രേഖ / പട്ടാ"
  },
  "Agricultural land holding or cultivation record": {
    ta: "வேளாண் நில உடைமை அல்லது சாகுபடி பதிவு",
    hi: "कृषि भूमि जोत या खेती रिकॉर्ड",
    te: "వ్యవసాయ భూమి కలిగివున్న లేదా సాగు రికార్డు",
    kn: "ಕೃಷಿ ಜಮೀನು ಹಿಡುವಳಿ ಅಥವಾ ಸಾಗುವಳಿ ದಾಖಲೆ",
    ml: "കാർഷിക ഭൂമി കൈവശം അല്ലെങ്കിൽ കൃഷി രേഖ"
  },
  "Bank Account Verification": {
    ta: "வங்கி கணக்கு சரிபார்ப்பு",
    hi: "बैंक खाता सत्यापन",
    te: "బ్యాంక్ ఖాతా సరిచూసే ప్రక్రియ",
    kn: "ಬ್ಯಾಂಕ್ ಖಾತೆ ಪರಿಶೀಲನೆ",
    ml: "ബാങ്ക് അക്കൗണ്ട് സ്ഥിരീകരണം"
  },
  "Settlement bank account for direct payments": {
    ta: "நேரடி செலுத்துதல்களுக்கான தீர்வு வங்கி கணக்கு",
    hi: "प्रत्यक्ष भुगतान के लिए निपटान बैंक खाता",
    te: "నేరుగా చెల్లింపుల కోసం బ్యాంక్ ఖాతా",
    kn: "ನೇರ ಪಾವತಿಗಳಿಗಾಗಿ ಇತ್ಯರ್ಥ ಬ್ಯಾಂಕ್ ಖಾತೆ",
    ml: "നേരിട്ടുള്ള പണമടയ്ക്കലുകൾക്കുള്ള ബാങ്ക് അക്കൗണ്ട്"
  },
  "PAN Card Verification": {
    ta: "பான் கார்டு சரிபார்ப்பு",
    hi: "पैन कार्ड सत्यापन",
    te: "పాన్ కార్డ్ సరిచూసే ప్రక్రియ",
    kn: "ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಪರಿಶೀಲನೆ",
    ml: "പാൻ കാർഡ് സ്ഥിരീകരണം"
  },
  "Permanent Account Number for identity & payouts": {
    ta: "அடையாளம் மற்றும் செலுத்துதல்களுக்கான பான் எண்",
    hi: "पहचान और भुगतान के लिए स्थायी खाता संख्या",
    te: "గుర్తింపు మరియు చెల్లింపుల కోసం పాన్ సంఖ్య",
    kn: "ಗುರುತು ಮತ್ತು ಪಾವತಿಗಳಿಗಾಗಿ ಕಾಯಂ ಖಾತೆ ಸಂಖ್ಯೆ",
    ml: "വ്യക്തിത്വത്തിനും പണമടയ്ക്കലിനുമുള്ള പാൻ നമ്പർ"
  },
  "PM-KISAN Verification (Optional)": {
    ta: "PM-KISAN சரிபார்ப்பு (விருப்பமானது)",
    hi: "PM-KISAN सत्यापन (वैकल्पिक)",
    te: "PM-KISAN సరిచూసే ప్రక్రియ (ఐచ్ఛికం)",
    kn: "PM-KISAN ಪರಿಶೀಲನೆ (ಐಚ್ಛಿಕ)",
    ml: "PM-KISAN സ്ഥിരീകരണം (ഓപ്ഷണൽ)"
  },
  "PM-KISAN beneficiary registration reference": {
    ta: "PM-KISAN பயனாளிகள் பதிவு குறிப்பு",
    hi: "PM-KISAN लाभार्थी पंजीकरण संदर्भ",
    te: "PM-KISAN లబ్ధిదారుల రిజిస్ట్రేషన్ సూచన",
    kn: "PM-KISAN ಫಲಾನುಭವಿ ನೋಂದಣಿ ಉಲ್ಲೇಖ",
    ml: "PM-KISAN ഗുണഭോക്തൃ രജിസ്ട്രേഷൻ റഫറൻസ്"
  },
  "Verify Your Organization": {
    ta: "உங்கள் நிறுவனத்தை சரிபார்க்கவும்",
    hi: "अपने संगठन को सत्यापित करें",
    te: "మీ సంస్థను సరిచూడండి",
    kn: "ನಿಮ್ಮ ಸಂಸ್ಥೆಯನ್ನು ಪರಿಶೀಲಿಸಿ",
    ml: "നിങ്ങളുടെ ഓർഗനൈസേഷൻ പരിശോധിക്കുക"
  },
  "Legal organization registration, CIN, and state address": {
    ta: "சட்டப்பூர்வ நிறுவன பதிவு, CIN மற்றும் மாநில முகவரி",
    hi: "कानूनी संगठन पंजीकरण, सीआईएन और राज्य का पता",
    te: "చట్టపరమైన సంస్థ రిజిస్ట్రేషన్, CIN మరియు రాష్ట్ర చిరునామా",
    kn: "ಕಾನೂನುಬದ್ಧ ಸಂಸ್ಥೆಯ ನೋಂದಣಿ, CIN ಮತ್ತು ರಾಜ್ಯದ ವಿಳಾಸ",
    ml: "നിയമപരമായ ഓർഗനൈസേഷൻ രജിസ്ട്രേഷൻ, CIN, വിലാസം"
  },
  "Verify Organization PAN": {
    ta: "நிறுவன பான் சரிபார்க்கவும்",
    hi: "संगठन पैन सत्यापित करें",
    te: "సంస్థ పాన్ సరిచూడండి",
    kn: "ಸಂಸ್ಥೆಯ ಪ್ಯಾನ್ ಪರಿಶೀಲಿಸಿ",
    ml: "ഓർഗനൈസേഷൻ പാൻ പരിശോധിക്കുക"
  },
  "Permanent Account Number issued in legal org name": {
    ta: "சட்டப்பூர்வ நிறுவன பெயரில் வழங்கப்பட்ட பான் எண்",
    hi: "कानूनी संगठन के नाम पर जारी स्थायी खाता संख्या",
    te: "చట్టపరమైన సంస్థ పేరుతో జారీ చేయబడిన పాన్ సంఖ్య",
    kn: "ಕಾನೂನುಬದ್ಧ ಸಂಸ್ಥೆಯ ಹೆಸರಿನಲ್ಲಿ ನೀಡಲಾದ ಕಾಯಂ ಖಾತೆ ಸಂಖ್ಯೆ",
    ml: "നിയമപരമായ പേരിൽ നൽകിയ പാൻ നമ്പർ"
  },
  "Verify Business Details (GSTIN)": {
    ta: "வணிக விவரங்களை சரிபார்க்கவும் (GSTIN)",
    hi: "व्यावसायिक विवरण सत्यापित करें (GSTIN)",
    te: "వ్యాపార వివరాలను సరిచూడండి (GSTIN)",
    kn: "ವಹಿವಾಟಿನ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ (GSTIN)",
    ml: "ബിസിനസ്സ് വിവരങ്ങൾ പരിശോധിക്കുക (GSTIN)"
  },
  "GSTIN registration (optional / conditional)": {
    ta: "GSTIN பதிவு (விருப்பமானது / நிபந்தனைக்குட்பட்டது)",
    hi: "जीएसटीआईएन पंजीकरण (वैकल्पिक / सशर्त)",
    te: "GSTIN రిజిస్ట్రేషన్ (ఐచ్ఛికం / షరతులతో)",
    kn: "GSTIN ನೋಂದಣಿ (ಐಚ್ಛಿಕ / ಸಷರತ್ತು)",
    ml: "GSTIN രജിസ്ട്രേഷൻ (ഓപ്ഷണൽ / നിബന്ധനകളോടെ)"
  },
  "Verify Authorized Representative": {
    ta: "அங்கீகரிக்கப்பட்ட பிரதிநிதியை சரிபார்க்கவும்",
    hi: "अधिकृत प्रतिनिधि को सत्यापित करें",
    te: "అధికారిక ప్రతినిధిని సరిచూడండి",
    kn: "ಅಧಿಕೃತ ಪ್ರತಿನಿಧಿಯನ್ನು ಪರಿಶೀಲಿಸಿ",
    ml: "അധികാരപ്പെടുത്തിയ പ്രതിനിധിയെ പരിശോധിക്കുക"
  },
  "Identity & designation of managing official": {
    ta: "நிர்வாக அதிகாரியின் அடையாளம் மற்றும் பதவி",
    hi: "प्रबंध अधिकारी की पहचान और पद",
    te: "నిర్వహణ అధికారి గుర్తింపు మరియు హోదా",
    kn: "ನಿರ್ವಹಣಾ ಅಧಿಕಾರಿಯ ಗುರುತು ಮತ್ತು ಹುದ್ದೆ",
    ml: "മാനേജിംഗ് ഉദ്യോഗസ്ഥന്റെ വ്യക്തിത്വവും തസ്തികയും"
  },
  "Verify Organization Bank Account": {
    ta: "நிறுவன வங்கி கணக்கை சரிபார்க்கவும்",
    hi: "संगठन बैंक खाता सत्यापित करें",
    te: "సంస్థ బ్యాంక్ ఖాతాను సరిచూడండి",
    kn: "ಸಂಸ್ಥೆಯ ಬ್ಯಾಂಕ್ ಖಾತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ",
    ml: "ഓർഗനൈസേഷൻ ബാങ്ക് അക്കൗണ്ട് പരിശോധിക്കുക"
  },
  "Bank account belonging to organization for settlements": {
    ta: "தீர்வுகளுக்கான நிறுவனத்திற்கு சொந்தமான வங்கி கணக்கு",
    hi: "निपटान के लिए संगठन का बैंक खाता",
    te: "చెల్లింపుల కోసం సంస్థకు చెందిన బ్యాంక్ ఖాతా",
    kn: "ಇತ್ಯರ್ಥಗಳಿಗಾಗಿ ಸಂಸ್ಥೆಗೆ ಸೇರಿದ ಬ್ಯಾಂಕ್ ಖಾತೆ",
    ml: "സെറ്റിൽമെന്റുകൾക്കുള്ള ബാങ്ക് അക്കൗണ്ട്"
  },
  "Organization Documents": {
    ta: "நிறுவனத்தின் ஆவணங்கள்",
    hi: "संगठन के दस्तावेज",
    te: "సంస్థ పత్రాలు",
    kn: "ಸಂಸ್ಥೆಯ ದಾಖಲೆಗಳು",
    ml: "ഓർഗനൈസേഷൻ രേഖകൾ"
  },
  "Upload registration cert, PAN doc, bank proof, and auth letter": {
    ta: "பதிவு சான்றிதழ், பான் ஆவணம், வங்கி ஆதாரம் மற்றும் அதிகாரக் கடிதத்தை பதிவேற்றவும்",
    hi: "पंजीकरण प्रमाण पत्र, पैन दस्तावेज, बैंक प्रमाण और प्राधिकरण पत्र अपलोड करें",
    te: "రిజిస్ట్రేషన్ సర్టిఫికేట్, పాన్ పత్రం, బ్యాంక్ రుజువు మరియు అధికార లేఖను అప్‌లోడ్ చేయండి",
    kn: "ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ, ಪ್ಯಾನ್ ದಾಖಲೆ, ಬ್ಯಾಂಕ್ ಪುರಾವೆ ಮತ್ತು ಅಧಿಕಾರ ಪತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    ml: "രജിസ്ട്രേഷൻ സർട്ടിഫിക്കറ്റ്, പാൻ രേഖ, ബാങ്ക് തെളിവ്, അധികാരപത്രം എന്നിവ അപ്‌ലോഡ് ചെയ്യുക"
  },
  "✓ VERIFIED FPO": {
    ta: "✓ சரிபார்க்கப்பட்ட FPO",
    hi: "✓ सत्यापित FPO",
    te: "✓ సరిచూడబడిన FPO",
    kn: "✓ ಪರಿಶೀಲಿಸಿದ FPO",
    ml: "✓ സ്ഥിരീകരിച്ച FPO"
  },
  "✓ VERIFIED FARMER": {
    ta: "✓ சரிபார்க்கப்பட்ட விவசாயி",
    hi: "✓ सत्यापित किसान",
    te: "✓ సరిచూడబడిన రైతు",
    kn: "✓ ಪರಿಶೀಲಿಸಿದ ರೈತ",
    ml: "✓ സ്ഥിരീകരിച്ച കർഷകൻ"
  }
};

const keysMap = {
  "Identity Verification (Aadhaar)": "aadhaarTitle",
  "Authorized UIDAI identity verification": "aadhaarDesc",
  "Farmer ID / Registry": "farmerRegistryTitle",
  "State / National Farmer Agristack database record": "farmerRegistryDesc",
  "Land Record / Patta": "landRecordTitle",
  "Agricultural land holding or cultivation record": "landRecordDesc",
  "Bank Account Verification": "bankAccountTitle",
  "Settlement bank account for direct payments": "bankAccountDesc",
  "PAN Card Verification": "panTitle",
  "Permanent Account Number for identity & payouts": "panDesc",
  "PM-KISAN Verification (Optional)": "pmKisanTitle",
  "PM-KISAN beneficiary registration reference": "pmKisanDesc",
  "Verify Your Organization": "orgIdentityTitle",
  "Legal organization registration, CIN, and state address": "orgIdentityDesc",
  "Verify Organization PAN": "orgPanTitle",
  "Permanent Account Number issued in legal org name": "orgPanDesc",
  "Verify Business Details (GSTIN)": "gstinTitle",
  "GSTIN registration (optional / conditional)": "gstinDesc",
  "Verify Authorized Representative": "representativeTitle",
  "Identity & designation of managing official": "representativeDesc",
  "Verify Organization Bank Account": "orgBankTitle",
  "Bank account belonging to organization for settlements": "orgBankDesc",
  "Organization Documents": "orgDocumentsTitle",
  "Upload registration cert, PAN doc, bank proof, and auth letter": "orgDocumentsDesc",
  "✓ VERIFIED FPO": "verifiedFpoBadge",
  "✓ VERIFIED FARMER": "verifiedFarmerBadge"
};

const localeData = {};
LOCALES.forEach(l => {
  const p = path.resolve(LOCALES_DIR, l, 'translation.json');
  localeData[l] = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!localeData[l].farmerVerification) {
    localeData[l].farmerVerification = {};
  }
});

for (const [orig, k] of Object.entries(keysMap)) {
  localeData.en.farmerVerification[k] = orig;
  LOCALES.filter(l => l !== 'en').forEach(l => {
    localeData[l].farmerVerification[k] = dict[orig]?.[l] || orig;
  });
}

LOCALES.forEach(l => {
  const p = path.resolve(LOCALES_DIR, l, 'translation.json');
  fs.writeFileSync(p, JSON.stringify(localeData[l], null, 2) + '\n', 'utf8');
});

let content = fs.readFileSync(TARGET_FILE, 'utf8');

for (const [orig, k] of Object.entries(keysMap)) {
  content = content.replaceAll(`title: '${orig}'`, `title: t('farmerVerification.${k}')`);
  content = content.replaceAll(`description: '${orig}'`, `description: t('farmerVerification.${k}')`);
  content = content.replaceAll(`'${orig}'`, `t('farmerVerification.${k}')`);
}

fs.writeFileSync(TARGET_FILE, content, 'utf8');
console.log('Done processing farmer/Verification.jsx');
