import fs from 'fs';
import path from 'path';

const basePath = 'c:/Volume D/projects/temp/agri/frontend/src/i18n/locales';

const masterDict = {
  auth: {
    welcomeBack: {
      en: "Welcome back",
      ta: "மீண்டும் வருக",
      hi: "वापसी पर आपका स्वागत है",
      te: "తిరిగి స్వాగతం",
      kn: "ಮತ್ತೆ స్వాಗತ",
      ml: "വീണ്ടും സ്വാഗതം"
    },
    rememberMe: {
      en: "Remember me",
      ta: "என்னை நினைவில் கொள்க",
      hi: "मुझे याद रखें",
      te: "నన్ను గుర్తుంచుకో",
      kn: "ನನ್ನನ್ನು ನೆನಪಿಡಿ",
      ml: "എന്നെ ഓർക്കുക"
    },
    forgotPassword: {
      en: "Forgot password?",
      ta: "கடவுச்சொல் மறந்துவிட்டதா?",
      hi: "पासवर्ड भूल गए?",
      te: "పాస్‌వర్డ్ మరచిపోయారా?",
      kn: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
      ml: "പാസ്‌വേഡ് മറന്നോ?"
    },
    dontHaveAccount: {
      en: "Don't have an account?",
      ta: "கணக்கு இல்லையா?",
      hi: "क्या आपका खाता नहीं है?",
      te: "ఖాతా లేదా?",
      kn: "ಖಾತೆ ಇಲ್ಲವೇ?",
      ml: "അക്കൗണ്ട് ഇല്ലേ?"
    },
    createAccount: {
      en: "Create your account",
      ta: "உங்கள் கணக்கை உருவாக்கவும்",
      hi: "अपना खाता बनाएं",
      te: "మీ ఖాతాను సృష్టించండి",
      kn: "ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
      ml: "നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക"
    },
    alreadyHaveAccount: {
      en: "Already have an account?",
      ta: "ஏற்கனவே கணக்கு உள்ளதா?",
      hi: "क्या पहले से ही एक खाता है?",
      te: "ఇప్పటికే ఖాతా ఉందా?",
      kn: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",
      ml: "ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?"
    },
    registerAsTransporterBtn: {
      en: "Register as Transporter →",
      ta: "போக்குவரத்து நபராகப் பதிவுசெய்க →",
      hi: "ट्रांसपोर्टर के रूप में पंजीकरण करें →",
      te: "ట్రాన్స్‌పోర్టర్‌గా నమోదు చేసుకోండి →",
      kn: "ಸಾರಿಗೆದಾರನಾಗಿ ನೋಂದಾಯಿಸಿ →",
      ml: "ട്രാൻസ്പോർട്ടറായി രജിസ്റ്റർ ചെയ്യുക →"
    }
  },
  register: {
    joinAgribazaar: {
      en: "Join AgriBazaar",
      ta: "AgriBazaar இல் இணையுங்கள்",
      hi: "एग्रीबाज़ार में शामिल हों",
      te: "అగ్రిబజార్‌లో చేరండి",
      kn: "ಅಗ್ರಿಬಜಾರ್‌ಗೆ ಸೇರಿ",
      ml: "അഗ്രിബസാറിൽ ചേരുക"
    },
    selectYourAccountTypeToGet: {
      en: "Select your account type to get started",
      ta: "தொடங்குவதற்கு உங்கள் கணக்கு வகையைத் தேர்ந்தெடுக்கவும்",
      hi: "शुरू करने के लिए अपना खाता प्रकार चुनें",
      te: "ప్రారంభించడానికి మీ ఖాతా రకాన్ని ఎంచుకోండి",
      kn: "ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಖಾತೆ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      ml: "ആരംഭിക്കുന്നതിന് നിങ്ങളുടെ അക്കൗണ്ട് തരം തിരഞ്ഞെടുക്കുക"
    },
    farmerFpo: {
      en: "Farmer / FPO",
      ta: "விவசாயி / FPO",
      hi: "किसान / एफपीओ",
      te: "రైతు / FPO",
      kn: "ರೈತ / FPO",
      ml: "കർഷകൻ / FPO"
    },
    sellYourProduceDirectlyToBuyers: {
      en: "Sell your produce directly to buyers at fair market prices.",
      ta: "நியாயமான சந்தை விலையில் உங்கள் விளைபொருட்களை நேரடியாக வாங்குபவர்களுக்கு விற்கவும்.",
      hi: "उचित बाजार मूल्यों पर सीधे खरीदारों को अपनी उपज बेचें।",
      te: "న్యాయమైన మార్కెట్ ధరలకు నేరుగా కొనుగోలుదారులకు మీ పంటలను అమ్మండి.",
      kn: "ನ್ಯಾಯಯುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳಲ್ಲಿ ನೇರವಾಗಿ ಖರೀದಿದಾರರಿಗೆ ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಮಾರಾಟ ಮಾಡಿ.",
      ml: "ന്യായമായ വിപണി വിലയിൽ നിങ്ങളുടെ കാർഷിക ഉൽപ്പന്നങ്ങൾ നേരിട്ട് വാങ്ങുന്നവർക്ക് വിൽക്കുക."
    },
    buyer: {
      en: "Buyer",
      ta: "வாங்குபவர்",
      hi: "खरीदार",
      te: "కొనుగోలుదారు",
      kn: "ಖರೀದಿದಾರ",
      ml: "ബയർ"
    },
    sourceFreshAgriculturalProduceDirectlyFrom: {
      en: "Source fresh agricultural produce directly from verified farmers.",
      ta: "சரிபார்க்கப்பட்ட விவசாயிகளிடமிருந்து நேரடியாக புதிய வேளாண் விளைபொருட்களைப் பெறுங்கள்.",
      hi: "सत्यापित किसानों से सीधे ताजी कृषि उपज प्राप्त करें।",
      te: "ధృవీకరించబడిన రైతుల నుండి నేరుగా తాజా వ్యవసాయ ఉత్పత్తులను పొందండి.",
      kn: "ಖಚಿತಪಡಿಸಿದ ರೈತರಿಂದ ನೇರವಾಗಿ ತಾಜಾ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯಿರಿ.",
      ml: "സ്ഥിരീകരിച്ച കർഷകരിൽ നിന്ന് നേരിട്ട് പുതിയ കാർഷിക ഉൽപ്പന്നങ്ങൾ വാങ്ങുക."
    },
    transporterDesc: {
      en: "Manage agricultural freight requests, submit locked quotes, and track crop shipments.",
      ta: "வேளாண் சரக்கு கோரிக்கைகளை நிர்வகிக்கவும், மேற்கோள்களைச் சமர்ப்பிக்கவும், பயிர் ஏற்றுமதிகளைக் கண்காணிக்கவும்.",
      hi: "कृषि माल भाड़ा अनुरोधों को प्रबंधित करें, कोटेशन जमा करें और फसल शिपमेंट को ट्रैक करें।",
      te: "వ్యవసాయ రవాణా అభ్యర్థనలను నిర్వహించండి, కోటేషన్‌లను సమర్పించండి మరియు పంట షిప్‌మెంట్‌లను ట్రాక్ చేయండి.",
      kn: "ಕೃಷಿ ಸರಕು ಸಾಗಣೆ ವಿನಂತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ, ಉಲ್ಲೇಖಗಳನ್ನು ಸಲ್ಲಿಸಿ ಮತ್ತು ಬೆಳೆ ರವಾನೆಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ.",
      ml: "കാർഷിക ചരക്ക് ഗതാഗത അഭ്യർത്ഥനകൾ കൈകാര്യം ചെയ്യുക, കൊട്ടേഷൻ സമർപ്പിക്കുക, ഷിപ്പ്‌മെന്റുകൾ ട്രാക്ക് ചെയ്യുക."
    }
  },
  roles: {
    transporter: {
      en: "Transporter / Freight Carrier",
      ta: "போக்குவரத்து நபர் / சரக்கு கேரியர்",
      hi: "ट्रांसपोर्टर / फ्रेट कैरियर",
      te: "ట్రాన్స్‌పోర్టర్ / ఫ్రైట్ క్యారియర్",
      kn: "ಸಾರಿಗೆದಾರ / ಸರಕು ಸಾಗಣೆದಾರ",
      ml: "ട്രാൻസ്പോർട്ടർ / ഫ്രൈറ്റ് കാരിയർ"
    }
  },
  footer: {
    engine: {
      en: "Direct Farm Commerce Engine",
      ta: "நேரடி பண்ணை வணிக எஞ்சின்",
      hi: "डायरेक्ट फार्म कॉमर्स इंजन",
      te: "డైరెక్ట్ ఫారమ్ కామర్స్ ఇంజిన్",
      kn: "ಡೈರೆಕ್ಟ್ ಫಾರ್ಮ್ ಕಾಮರ್ಸ್ ಇಂಜಿನ್",
      ml: "ഡയറക്ട് ഫാം കൊമേഴ്‌സ് എഞ്ചിൻ"
    }
  }
};

const locales = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

locales.forEach((loc) => {
  const filePath = path.join(basePath, loc, 'translation.json');
  let locData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : {};

  Object.keys(masterDict).forEach((sec) => {
    if (!locData[sec]) locData[sec] = {};
    Object.keys(masterDict[sec]).forEach((key) => {
      const translationVal = masterDict[sec][key][loc] || masterDict[sec][key].en;
      locData[sec][key] = translationVal;
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(locData, null, 2) + '\n', 'utf8');
  console.log(`Updated ${loc}/translation.json with Auth and Register master keys.`);
});
