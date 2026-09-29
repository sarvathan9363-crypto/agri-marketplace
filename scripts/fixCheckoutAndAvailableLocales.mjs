import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.resolve(__dirname, '../frontend/src/i18n/locales');

const checkoutLocales = {
  en: {
    common: {
      back: "Back"
    },
    home: {
      marketplace: {
        available: "{{count}} {{unit}} available"
      }
    },
    checkout: {
      secureSettlement: "SAFE & SECURE SETTLEMENT",
      title: "Checkout",
      addressReviewHint: "Provide delivery location and review produce items before confirming payment.",
      stepShipping: "1. Shipping",
      stepPayment: "2. Payment",
      continueToReview: "Continue to Order Review →",
      totalOrder: "Total Amount",
      securePayment: "Secure Razorpay Payment",
      razorpayVerificationNote: "Your order is confirmed only after Razorpay payment verification succeeds.",
      paySecurely: "Pay Securely · ₹{{amount}}"
    }
  },
  ta: {
    common: {
      back: "பின்செல்"
    },
    home: {
      marketplace: {
        available: "இருப்பில் {{count}} {{unit}} உள்ளது"
      }
    },
    checkout: {
      secureSettlement: "பாதுகாப்பான மற்றும் உறுதியான தீர்வு",
      title: "கட்டணம் செலுத்துதல்",
      addressReviewHint: "பணம் செலுத்துவதை உறுதிப்படுத்தும் முன் விநியோக இருப்பிடம் மற்றும் விளைபொருட்களை மதிப்பாய்வு செய்யவும்.",
      stepShipping: "1. விநியோகம்",
      stepPayment: "2. பணம் செலுத்துதல்",
      continueToReview: "ஆர்டர் மதிப்பாய்வுக்கு தொடரவும் →",
      totalOrder: "மொத்தத் தொகை",
      securePayment: "பாதுகாப்பான ரேசர்பே கட்டணம்",
      razorpayVerificationNote: "ரேசர்பே கட்டணச் சரிபார்ப்பு வெற்றிகரமாக முடிந்த பின்னரே உங்கள் ஆர்டர் உறுதிசெய்யப்படும்.",
      paySecurely: "பாதுகாப்பாகப் பணம் செலுத்துங்கள் · ₹{{amount}}"
    }
  },
  hi: {
    common: {
      back: "वापस"
    },
    home: {
      marketplace: {
        available: "स्टॉक में {{count}} {{unit}} उपलब्ध है"
      }
    },
    checkout: {
      secureSettlement: "सुरक्षित भुगतान निपटान",
      title: "चेकआउट",
      addressReviewHint: "भुगतान की पुष्टि करने से पहले वितरण स्थान प्रदान करें और उपज की समीक्षा करें।",
      stepShipping: "1. शिपिंग",
      stepPayment: "2. भुगतान",
      continueToReview: "ऑर्डर समीक्षा के लिए आगे बढ़ें →",
      totalOrder: "कुल राशि",
      securePayment: "सुरक्षित रेज़रपे भुगतान",
      razorpayVerificationNote: "रेज़रपे भुगतान सत्यापन सफल होने के बाद ही आपका ऑर्डर कन्फर्म होता है।",
      paySecurely: "सुरक्षित भुगतान करें · ₹{{amount}}"
    }
  },
  te: {
    common: {
      back: "వెనుకకు"
    },
    home: {
      marketplace: {
        available: "స్టాక్‌లో {{count}} {{unit}} అందుబాటులో ఉంది"
      }
    },
    checkout: {
      secureSettlement: "సురక్షితమైన సెటిల్మెంట్",
      title: "చెక్అవుట్",
      addressReviewHint: "చెల్లింపును నిర్ధారించే ముందు డెలివరీ స్థానాన్ని మరియు ఉత్పత్తులను సమీక్షించండి.",
      stepShipping: "1. డెలివరీ",
      stepPayment: "2. చెల్లింపు",
      continueToReview: "ఆర్డర్ సమీక్షకు కొనసాగండి →",
      totalOrder: "మొత్తం మొత్తం",
      securePayment: "సురక్షిత రేజర్‌పే చెల్లింపు",
      razorpayVerificationNote: "రేజర్‌పే చెల్లింపు ధృవీకరణ విజయవంతమైన తర్వాత మాత్రమే మీ ఆర్డర్ నిర్ధారించబడుతుంది.",
      paySecurely: "సురక్షితంగా చెల్లించండి · ₹{{amount}}"
    }
  },
  kn: {
    common: {
      back: "ಹಿಂದಕ್ಕೆ"
    },
    home: {
      marketplace: {
        available: "ದಾಸ್ತಾನಿನಲ್ಲಿ {{count}} {{unit}} ಲಭ್ಯವಿದೆ"
      }
    },
    checkout: {
      secureSettlement: "ಸುರಕ್ಷಿತ ಪಾವತಿ ಇತ್ಯರ್ಥ",
      title: "ಚೆಕ್‌ಔಟ್",
      addressReviewHint: "ಪಾವತಿಯನ್ನು ಖಚಿತಪಡಿಸುವ ಮೊದಲು ಡೆಲಿವರಿ ಸ್ಥಳವನ್ನು ನೀಡಿ ಮತ್ತು ಉತ್ಪನ್ನಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      stepShipping: "1. ಡೆಲಿವರಿ",
      stepPayment: "2. ಪಾವತಿ",
      continueToReview: "ಆರ್ಡರ್ ಪರಿಶೀಲನೆಗೆ ಮುಂದುವರಿಯಿರಿ →",
      totalOrder: "ಒಟ್ಟು ಮೊತ್ತ",
      securePayment: "ಸುರಕ್ಷಿತ ரேಸರ್ಪೇ ಪಾವತಿ",
      razorpayVerificationNote: "ರೇಸರ್‌ಪೇ ಪಾವತಿ ಪರಿಶೀಲನೆ ಯಶಸ್ವಿಯಾದ ನಂತರವೇ ನಿಮ್ಮ ಆರ್ಡರ್ ಖಚಿತಗೊಳ್ಳುತ್ತದೆ.",
      paySecurely: "ಸುರಕ್ಷಿತವಾಗಿ ಪಾವತಿಸಿ · ₹{{amount}}"
    }
  },
  ml: {
    common: {
      back: "പിന്നിലേക്ക്"
    },
    home: {
      marketplace: {
        available: "സ്റ്റോക്കിൽ {{count}} {{unit}} ലഭ്യമാണ്"
      }
    },
    checkout: {
      secureSettlement: "സുരക്ഷിതമായ പേയ്‌മെന്റ് സെറ്റിൽമെന്റ്",
      title: "ചെക്ക്ഔട്ട്",
      addressReviewHint: "പേയ്‌മെന്റ് സ്ഥിരീകരിക്കുന്നതിന് മുൻപ് വിതരണ സ്ഥലവും ഉൽപ്പന്നങ്ങളും പരിശോധിക്കുക.",
      stepShipping: "1. ഡെലിവറി",
      stepPayment: "2. പേയ്‌മെന്റ്",
      continueToReview: "ഓർഡർ അവലോകനത്തിലേക്ക് തുടരുക →",
      totalOrder: "ആകെ തുക",
      securePayment: "സുരക്ഷിതമായ റേസർപേ പേയ്‌മെന്റ്",
      razorpayVerificationNote: "റേസർപേ പേയ്‌മെന്റ് പരിശോധന വിജയകരമായ ശേഷം മാത്രമേ നിങ്ങളുടെ ഓർഡർ സ്ഥിരീകരിക്കപ്പെടൂ.",
      paySecurely: "സുരക്ഷിതമായി പേ ചെയ്യുക · ₹{{amount}}"
    }
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

for (const lang of Object.keys(checkoutLocales)) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    deepMerge(content, checkoutLocales[lang]);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    console.log(`Merged checkout & available translations into ${lang}/translation.json`);
  }
}
