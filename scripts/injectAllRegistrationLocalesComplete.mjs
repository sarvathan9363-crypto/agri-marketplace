import fs from 'fs';
import path from 'path';

const basePath = 'c:/Volume D/projects/temp/agri/frontend/src/i18n/locales';

const masterDict = {
  register: {
    buyerRegistration: {
      en: "Buyer Registration",
      ta: "வாங்குபவர் பதிவு",
      hi: "खरीदार पंजीकरण",
      te: "కొనుగోలుదారు నమోదు",
      kn: "ಖರೀದಿದಾರರ ನೋಂದಣಿ",
      ml: "ബയർ രജിസ്ട്രേഷൻ"
    },
    createYourAccountToPurchaseProduce: {
      en: "Create your account to purchase produce",
      ta: "விளைபொருட்களை வாங்க உங்கள் கணக்கை உருவாக்கவும்",
      hi: "उपज खरीदने के लिए अपना खाता बनाएं",
      te: "పంటలను కొనుగోలు చేయడానికి మీ ఖాతాను సృష్టించండి",
      kn: "ಬೆಳೆಗಳನ್ನು ಖರೀದಿಸಲು ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
      ml: "ഉൽപ്പന്നങ്ങൾ വാങ്ങുന്നതിനായി നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക"
    },
    backToRoleSelection: {
      en: "Back to role selection",
      ta: "பாத்திரத் தேர்வுக்குத் திரும்பு",
      hi: "भूमिका चयन पर वापस जाएं",
      te: "పాత్ర ఎంపికకు తిరిగి వెళ్ళండి",
      kn: "ಪಾತ್ರದ ಆಯ್ಕೆಗೆ ಹಿಂತಿರುಗಿ",
      ml: "റോൾ തിരഞ്ഞെടുപ്പിലേക്ക് മടങ്ങുക"
    }
  },
  auth: {
    transporterRegistration: {
      en: "Transporter Registration",
      ta: "போக்குவரத்து நபர் பதிவு",
      hi: "ट्रांसपोर्टर पंजीकरण",
      te: "ట్రాన్స్‌పోర్టర్ నమోదు",
      kn: "ಸಾರಿಗೆದಾರರ ನೋಂದಣಿ",
      ml: "ട്രാൻസ്പോർട്ടർ രജിസ്ട്രേഷൻ"
    },
    registerAsTransporter: {
      en: "Register as Transporter",
      ta: "போக்குவரத்து நபராகப் பதிவுசெய்க",
      hi: "ट्रांसपोर्टर के रूप में पंजीकरण करें",
      te: "ట్రాన్స్‌పోర్టర్‌గా నమోదు చేసుకోండి",
      kn: "ಸಾರಿಗೆದಾರನಾಗಿ ನೋಂದಾಯಿಸಿ",
      ml: "ട്രാൻസ്പോർട്ടറായി രജിസ്റ്റർ ചെയ്യുക"
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
  console.log(`Updated ${loc}/translation.json successfully.`);
});
