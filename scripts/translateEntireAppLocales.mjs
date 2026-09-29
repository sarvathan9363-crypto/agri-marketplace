import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Volume D/projects/temp/agri/frontend/src/i18n/locales';

const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en', 'translation.json'), 'utf8'));

// Common term maps for automated natural fallback translation if not explicitly in dict
const termMaps = {
  ta: {
    "Producer Name:": "உற்பத்தியாளர் பெயர்:",
    "Farm / FPO Name:": "பண்ணை / FPO பெயர்:",
    "Type:": "வகை:",
    "Location:": "இருப்பிடம்:",
    "Items Summary": "பொருட்களின் சுருக்கம்",
    "Subtotal": "இடைக்கூட்டுத் தொகை",
    "Delivery": "விநியோகம்",
    "Free": "இலவசம்",
    "Razorpay Test Mode": "ரேஸர்பே சோதனை முறைமை",
    "Checkout Bag": "கட்டணக் கூடை",
    "Items Subtotal": "பொருட்களின் இடைக்கூட்டுத்தொகை",
    "Estimated Shipping": "மதிப்பிடப்பட்ட அனுப்புகை",
    "Free Direct Delivery": "இலவச நேரடி விநியோகம்",
    "Total Amount": "மொத்தத் தொகை",
    "Failed to update.": "புதுப்பிக்க முடியவில்லை.",
    "Failed to remove.": "அகற்ற முடியவில்லை.",
    "Verified on": "சரிபார்க்கப்பட்டது",
    "Blockchain Network": "பிளாக்செயின் நெட்வொர்க்",
    "Smart Contract Address": "ஸ்மார்ட் காண்ட்ராக்ட் முகவரி",
    "On-Chain Payment Audits": "ஆன்-செயின் கட்டணத் தணிக்கை",
    "On-Chain Settlement Audits": "ஆன்-செயின் தீர்வுத் தணிக்கை",
    "Smart Contract Event Verifier": "ஸ்மார்ட் காண்ட்ராக்ட் நிகழ்வு சரிபார்ப்பி",
    "Items Purchased": "வாங்கிய பொருட்கள்",
    "Total Amount:": "மொத்தத் தொகை:",
    "Payment ID Hash:": "கட்டண ID ஹேஷ்:",
    "Order ID Hash:": "ஆர்டர் ID ஹேஷ்:"
  },
  hi: {
    "Producer Name:": "उत्पादक का नाम:",
    "Farm / FPO Name:": "फार्म / एफपीओ नाम:",
    "Type:": "प्रकार:",
    "Location:": "स्थान:",
    "Items Summary": "वस्तुओं का सारांश",
    "Subtotal": "उप-योग",
    "Delivery": "डिलीवरी",
    "Free": "मुफ्त",
    "Razorpay Test Mode": "रेजरपे टेस्ट मोड",
    "Checkout Bag": "चेकआउट बैग",
    "Items Subtotal": "वस्तुओं का उप-योग",
    "Estimated Shipping": "अनुमानित शिपिंग",
    "Free Direct Delivery": "मुफ्त सीधी डिलीवरी",
    "Total Amount": "कुल राशि",
    "Failed to update.": "अद्यतन करने में विफल।",
    "Failed to remove.": "हटाने में विफल।",
    "Verified on": "सत्यापित किया गया",
    "Blockchain Network": "ब्लॉकचेन नेटवर्क",
    "Smart Contract Address": "स्मार्ट अनुबंध पता",
    "On-Chain Payment Audits": "ऑन-चेन भुगतान ऑडिट",
    "On-Chain Settlement Audits": "ऑन-चेन निपटान ऑडिट",
    "Smart Contract Event Verifier": "स्मार्ट अनुबंध इवेंट सत्यापनकर्ता",
    "Items Purchased": "खरीदी गई वस्तुएं",
    "Total Amount:": "कुल राशि:",
    "Payment ID Hash:": "भुगतान आईडी हैश:",
    "Order ID Hash:": "ऑर्डर आईडी हैश:"
  },
  te: {
    "Producer Name:": "ఉత్పత్తిదారు పేరు:",
    "Farm / FPO Name:": "ఫార్మ్ / FPO పేరు:",
    "Type:": "రకం:",
    "Location:": "ప్రాంతం:",
    "Items Summary": "వస్తువుల సారాంశం",
    "Subtotal": "ఉప మొత్తం",
    "Delivery": "డెలివరీ",
    "Free": "ఉచితం",
    "Razorpay Test Mode": "రేజర్‌పే టెస్ట్ మోడ్",
    "Checkout Bag": "చెక్‌అవుట్ బ్యాగ్",
    "Items Subtotal": "వస్తువుల ఉప మొత్తం",
    "Estimated Shipping": "అంచనా షిప్పింగ్",
    "Free Direct Delivery": "ఉచిత నేరుగా డెలివరీ",
    "Total Amount": "మొత్తం మొత్తం",
    "Failed to update.": "నవీకరించడం విఫలమైంది.",
    "Failed to remove.": "తొలగించడం విఫలమైంది.",
    "Verified on": "పరిశీలించబడింది",
    "Blockchain Network": "బ్లాక్‌చైన్ నెట్‌వర్క్",
    "Smart Contract Address": "స్మార్ట్ కాంట్రాక్ట్ చిరునామా",
    "On-Chain Payment Audits": "ఆన్-చైన్ చెల్లింపు ఆడిట్‌లు",
    "On-Chain Settlement Audits": "ఆన్-చైన్ పరిపరిష్కార ఆడిట్‌లు",
    "Smart Contract Event Verifier": "స్మార్ట్ కాంట్రాక్ట్ ఈవెంట్ వెరిఫైయర్",
    "Items Purchased": "కొనుగోలు చేసిన వస్తువులు",
    "Total Amount:": "మొత్తం మొత్తం:",
    "Payment ID Hash:": "చెల్లింపు ID హ్యాష్:",
    "Order ID Hash:": "ఆర్డర్ ID హ్యాష్:"
  },
  kn: {
    "Producer Name:": "ಉತ್ಪಾದಕರ ಹೆಸರು:",
    "Farm / FPO Name:": "ಫಾರ್ಮ್ / FPO ಹೆಸರು:",
    "Type:": "ಪ್ರಕಾರ:",
    "Location:": "ಸ್ಥಳ:",
    "Items Summary": "ವಸ್ತುಗಳ ಸಾರಾಂಶ",
    "Subtotal": "ಉಪ ಮೊತ್ತ",
    "Delivery": "ಡೆಲಿವರಿ",
    "Free": "ಉಚಿತ",
    "Razorpay Test Mode": "ರೇಜರ್‌ಪೇ ಟೆಸ್ಟ್ ಮೋಡ್",
    "Checkout Bag": "ಚೆಕ್‌ಔಟ್ ಬ್ಯಾಗ್",
    "Items Subtotal": "ವಸ್ತುಗಳ ಉಪ ಮೊತ್ತ",
    "Estimated Shipping": "ಅಂದಾಜು ಶಿಪ್ಪಿಂಗ್",
    "Free Direct Delivery": "ಉಚಿತ ನೇರ ಡೆಲಿವರಿ",
    "Total Amount": "ಒಟ್ಟು ಮೊತ್ತ",
    "Failed to update.": "ನವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    "Failed to remove.": "ತೆಗೆದುಹಾಕಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
    "Verified on": "ಖಾತರಿಪಡಿಸಲಾಗಿದೆ",
    "Blockchain Network": "ಬ್ಲಾಕ್‌ಚೈನ್ ನೆಟ್‌ವರ್ಕ್",
    "Smart Contract Address": "ಸ್ಮಾರ್ಟ್ ಕಾಂಟ್ರಾಕ್ಟ್ ವಿಳಾಸ",
    "On-Chain Payment Audits": "ಆನ್-ಚೈನ್ ಪಾವತಿ ಆಡಿಟ್‌ಗಳು",
    "On-Chain Settlement Audits": "ಆನ್-ಚೈನ್ ಇತ್ಯರ್ಥ ಆಡಿಟ್‌ಗಳು",
    "Smart Contract Event Verifier": "ಸ್ಮಾರ್ಟ್ ಕಾಂಟ್ರಾಕ್ಟ್ ಈವೆಂಟ್ ವೆರಿಫೈಯರ್",
    "Items Purchased": "ಖರೀದಿಸಿದ ವಸ್ತುಗಳು",
    "Total Amount:": "ಒಟ್ಟು ಮೊತ್ತ:",
    "Payment ID Hash:": "ಪಾವತಿ ID ಹ್ಯಾಶ್:",
    "Order ID Hash:": "ಆರ್ಡರ್ ID ಹ್ಯಾಶ್:"
  },
  ml: {
    "Producer Name:": "ഉത്പാദകന്റെ പേര്:",
    "Farm / FPO Name:": "ഫാം / FPO പേര്:",
    "Type:": "തരം:",
    "Location:": "സ്ഥലം:",
    "Items Summary": "വസ്തുക്കളുടെ ചുരുക്കം",
    "Subtotal": "സബ്‌ടോട്ടൽ",
    "Delivery": "ഡെലിവറി",
    "Free": "സൗജന്യം",
    "Razorpay Test Mode": "റേസർപേ ടെസ്റ്റ് മോഡ്",
    "Checkout Bag": "ചെക്കൗട്ട് ബാഗ്",
    "Items Subtotal": "വസ്തുക്കളുടെ ആകത്തുക",
    "Estimated Shipping": "ഷിപ്പിംഗ് തുക",
    "Free Direct Delivery": "സൗജന്യ നേരിട്ടുള്ള ഡെലിവറി",
    "Total Amount": "ആകെ തുക",
    "Failed to update.": "അപ്‌ഡേറ്റ് ചെയ്യാനായില്ല.",
    "Failed to remove.": "നീക്കം ചെയ്യാനായില്ല.",
    "Verified on": "സ്ഥിരീകരിച്ചത്",
    "Blockchain Network": "ബ്ലോക്ക്ചെയിൻ നെറ്റ്‌വർക്ക്",
    "Smart Contract Address": "സ്മാർട്ട് കോൺട്രാക്ട് വിലാസം",
    "On-Chain Payment Audits": "ഓൺ-ചെയിൻ പേയ്‌മെന്റ് ഓഡിറ്റുകൾ",
    "On-Chain Settlement Audits": "ഓൺ-ചെയിൻ തീർപ്പ് ഓഡിറ്റുകൾ",
    "Smart Contract Event Verifier": "സ്മാർട്ട് കോൺട്രാക്ട് ഇവന്റ് വെരിഫയർ",
    "Items Purchased": "വാങ്ങിയ വസ്തുക്കൾ",
    "Total Amount:": "ആകെ തുക:",
    "Payment ID Hash:": "പേയ്‌മെന്റ് ID ഹാഷ്:",
    "Order ID Hash:": "ഓർഡർ ID ഹാഷ്:"
  }
};

function getDeepValue(obj, keyPath) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length; i++) {
    if (curr && typeof curr === 'object' && parts[i] in curr) {
      curr = curr[parts[i]];
    } else {
      return undefined;
    }
  }
  return curr;
}

function setDeepValue(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!curr[parts[i]]) curr[parts[i]] = {};
    curr = curr[parts[i]];
  }
  curr[parts[parts.length - 1]] = value;
}

const targetLangs = ['ta', 'hi', 'te', 'kn', 'ml'];

targetLangs.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCount = 0;

  function traverse(objEn, prefix = '') {
    for (const k in objEn) {
      const fullKey = prefix ? `${prefix}.${k}` : k;
      const valEn = objEn[k];
      if (typeof valEn === 'object' && valEn !== null) {
        traverse(valEn, fullKey);
      } else if (typeof valEn === 'string') {
        const currentLocVal = getDeepValue(data, fullKey);
        // If current value in locale file is missing or equal to English or matches English terms in termMaps
        if (!currentLocVal || currentLocVal === valEn || termMaps[lang][valEn]) {
          const replacement = termMaps[lang][valEn];
          if (replacement) {
            setDeepValue(data, fullKey, replacement);
            updatedCount++;
          }
        }
      }
    }
  }

  traverse(en);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${lang}/translation.json with ${updatedCount} term replacements.`);
});
