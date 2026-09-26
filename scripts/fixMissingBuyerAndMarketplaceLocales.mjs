import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.resolve(__dirname, '../frontend/src/i18n/locales');

const missingTranslations = {
  en: {
    common: {
      allOrders: "All Orders",
      editProfile: "Edit Profile",
      copyHash: "📋 Copy Hash"
    },
    farmerProfile: {
      onChainHashTitle: "🛡️ ON-CHAIN CRYPTOGRAPHIC ACCOUNT HASH"
    },
    home: {
      marketplace: {
        description: "Source quality farm produce directly from verified Indian farmers and FPOs with zero middleman markup.",
        showing: "Showing {{count}} agricultural listings"
      }
    },
    marketplace: {
      newestFirst: "Newest first",
      priceLowToHigh: "Price: low to high",
      priceHighToLow: "Price: high to low",
      mostPopular: "Most popular"
    },
    productDetails: {
      availableInStock: "{{count}} {{unit}} available in stock",
      harvestDateLabel: "Harvest: {{date}}",
      availableFromLabel: "Available: {{date}}",
      quantityLabel: "QUANTITY ({{unit}}):",
      aboutFarmerTitle: "About the Farmer / Producer"
    },
    buyerVerification: {
      officialPortal: "• Official Verification Portal",
      title: "Buyer Verification Status",
      subtitle: "Manage identity, business compliance, and regulatory credentials on AgriBazaar.",
      completedCountOfTotal: "{{count}} of {{total}} completed",
      checklistHeading: "Verification Checklist",
      wizardCardHeading: "Complete Your Verification Wizard",
      wizardCardDesc: "Finish all required identity, tax, bank, and documentation checks to build trust with farmers and unlock verified buyer badges."
    }
  },
  ta: {
    common: {
      allOrders: "அனைத்து ஆர்டர்கள்",
      editProfile: "சுயவிவரத்தைத் திருத்து",
      copyHash: "📋 ஹேஷ் நகலெடு"
    },
    farmerProfile: {
      onChainHashTitle: "🛡️ ஆன்-செயின் கிரிப்டோகிராஃபிக் கணக்கு ஹேஷ்"
    },
    home: {
      marketplace: {
        description: "சரிபார்க்கப்பட்ட இந்திய விவசாயிகள் மற்றும் FPO-க்களிடமிருந்து நேரடியாக தரமான விவசாய விளைபொருட்களை இடைத்தரகர் கட்டணமின்றிப் பெறுங்கள்.",
        showing: "{{count}} விவசாயப் பட்டியல்கள் காட்டப்படுகின்றன"
      }
    },
    marketplace: {
      newestFirst: "புதியது முதலில்",
      priceLowToHigh: "விலை: குறைந்ததிலிருந்து அதிகம்",
      priceHighToLow: "விலை: அதிகத்திலிருந்து குறைவு",
      mostPopular: "மிகவும் பிரபலமானது"
    },
    productDetails: {
      availableInStock: "இருப்பில் {{count}} {{unit}} உள்ளது",
      harvestDateLabel: "அறுவடை: {{date}}",
      availableFromLabel: "கிடைக்கும் நாள்: {{date}}",
      quantityLabel: "அளவு ({{unit}}):",
      aboutFarmerTitle: "விவசாயி / உற்பத்தியாளர் பற்றி"
    },
    buyerVerification: {
      officialPortal: "• அதிகாரப்பூர்வ சரிபார்ப்பு போர்டல்",
      title: "வாங்குபவர் சரிபார்ப்பு நிலை",
      subtitle: "அக்ரிபஜாரில் அடையாளம், வணிக இணக்கம் மற்றும் ஒழுங்குமுறை சான்றுகளை நிர்வகிக்கவும்.",
      completedCountOfTotal: "{{total}}-இல் {{count}} நிறைவு செய்யப்பட்டது",
      checklistHeading: "சரிபார்ப்பு சரிபார்ப்புப் பட்டியல்",
      wizardCardHeading: "உங்கள் சரிபார்ப்பு வழிகாட்டியை முடிக்கவும்",
      wizardCardDesc: "விவசாயிகளுடன் நம்பிக்கையை வளர்க்கவும், சரிபார்க்கப்பட்ட வாங்குபவர் பேட்ஜ்களைப் பெறவும் தேவையான அனைத்து அடையாள, வரி, வங்கி மற்றும் ஆவணச் சோதனைகளை முடிக்கவும்."
    }
  },
  hi: {
    common: {
      allOrders: "सभी ऑर्डर",
      editProfile: "प्रोफ़ाइल संपादित करें",
      copyHash: "📋 हैश कॉपी करें"
    },
    farmerProfile: {
      onChainHashTitle: "🛡️ ऑन-चेन क्रिप्टोग्राफिक खाता हैश"
    },
    home: {
      marketplace: {
        description: "सत्यापित भारतीय किसानों और FPO से शून्य बिचौलिए के सीधे गुणवत्तापूर्ण कृषि उत्पाद प्राप्त करें।",
        showing: "{{count}} कृषि लिस्टिंग दिखाई जा रही हैं"
      }
    },
    marketplace: {
      newestFirst: "नवीनतम पहले",
      priceLowToHigh: "मूल्य: कम से अधिक",
      priceHighToLow: "मूल्य: अधिक से कम",
      mostPopular: "सबसे लोकप्रिय"
    },
    productDetails: {
      availableInStock: "स्टॉक में {{count}} {{unit}} उपलब्ध है",
      harvestDateLabel: "कटाई: {{date}}",
      availableFromLabel: "उपलब्ध: {{date}}",
      quantityLabel: "मात्रा ({{unit}}):",
      aboutFarmerTitle: "किसान / उत्पादक के बारे में"
    },
    buyerVerification: {
      officialPortal: "• आधिकारिक सत्यापन पोर्टल",
      title: "खरीदार सत्यापन स्थिति",
      subtitle: "एग्रीबाजार पर पहचान, व्यावसायिक अनुपालन और नियामक क्रेडेंशियल प्रबंधित करें।",
      completedCountOfTotal: "{{total}} में से {{count}} पूरा हुआ",
      checklistHeading: "सत्यापन चेकलिस्ट",
      wizardCardHeading: "अपना सत्यापन विज़ार्ड पूरा करें",
      wizardCardDesc: "किसानों के साथ विश्वास बनाने और सत्यापित खरीदार बैज अनलॉक करने के लिए सभी आवश्यक पहचान, कर, बैंक और दस्तावेज़ीकरण जांच पूरी करें।"
    }
  },
  te: {
    common: {
      allOrders: "అన్ని ఆర్డర్లు",
      editProfile: "ప్రొఫైల్ సవరించండి",
      copyHash: "📋 హ్యాష్ కాపీ చేయండి"
    },
    farmerProfile: {
      onChainHashTitle: "🛡️ ఆన్-చైన్ క్రిప్టోగ్రాఫిక్ ఖాతా హ్యాష్"
    },
    home: {
      marketplace: {
        description: "మధ్యవర్తుల ధరలు లేకుండా ధృవీకరించబడిన భారతీయ రైతులు మరియు FPOల నుండి నేరుగా నాణ్యమైన వ్యవసాయ ఉత్పత్తులను పొందండి.",
        showing: "{{count}} వ్యవసాయ జాబితాలు చూపబడుతున్నాయి"
      }
    },
    marketplace: {
      newestFirst: "కొత్తవి ముందుగా",
      priceLowToHigh: "ధర: తక్కువ నుండి ఎక్కువ",
      priceHighToLow: "ధర: ఎక్కువ నుండి తక్కువ",
      mostPopular: "చాలా ప్రసిద్ధమైనవి"
    },
    productDetails: {
      availableInStock: "స్టాక్‌లో {{count}} {{unit}} అందుబాటులో ఉంది",
      harvestDateLabel: "కోత: {{date}}",
      availableFromLabel: "లభ్యత: {{date}}",
      quantityLabel: "పరిమాణం ({{unit}}):",
      aboutFarmerTitle: "రైతు / ఉత్పత్తిదారు గురించి"
    },
    buyerVerification: {
      officialPortal: "• అధికారిక ధృవీకరణ పోర్టల్",
      title: "కొనుగోలుదారు ధృవీకరణ స్థితి",
      subtitle: "అగ్రిబజార్‌లో గుర్తింపు, వ్యాపార నిబంధనలు మరియు నియంత్రణ ఆధారాలను నిర్వహించండి.",
      completedCountOfTotal: "{{total}} లో {{count}} పూర్తయింది",
      checklistHeading: "ధృవీకరణ చెక్‌లిస్ట్",
      wizardCardHeading: "మీ ధృవీకరణ విజార్డ్‌ను పూర్తి చేయండి",
      wizardCardDesc: "రైతులతో నమ్మకాన్ని పెంచుకోవడానికి మరియు ధృవీకరించబడిన కొనుగోలుదారు బ్యాడ్జిలను పొందడానికి అవసరమైన గుర్తింపు, పన్ను, బ్యాంక్ మరియు పత్రాల తనిఖీలను పూర్తి చేయండి."
    }
  },
  kn: {
    common: {
      allOrders: "ಎಲ್ಲಾ ಆರ್ಡರ್‌ಗಳು",
      editProfile: "ಪ್ರೊಫೈಲ್ ತಿದ್ದುಪಡಿ ಮಾಡಿ",
      copyHash: "📋 ಹ್ಯಾಶ್ ನಕಲಿಸಿ"
    },
    farmerProfile: {
      onChainHashTitle: "🛡️ ಆನ್-ಚೈನ್ ಕ್ರಿಪ್ಟೋಗ್ರಾಫಿಕ್ ಖಾತೆ ಹ್ಯಾಶ್"
    },
    home: {
      marketplace: {
        description: "ಮಧ್ಯವರ್ತಿಗಳ ಕಮಿಷನ್ ಇಲ್ಲದೆ ಪರಿಶೀಲಿಸಿದ ಭಾರತೀಯ ರೈತರು ಮತ್ತು FPO ಗಳಿಂದ ನೇರವಾಗಿ ಗುಣಮಟ್ಟದ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯಿರಿ.",
        showing: "{{count}} ಕೃಷಿ ಪಟ್ಟಿಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ"
      }
    },
    marketplace: {
      newestFirst: "ಹೊಸತು ಮೊದಲು",
      priceLowToHigh: "ಬೆಲೆ: ಕಡಿಮೆಯಿಂದ ಹೆಚ್ಚಿಗೆ",
      priceHighToLow: "ಬೆಲೆ: ಹೆಚ್ಚಿನಿಂದ ಕಡಿಮೆಗೆ",
      mostPopular: "ಅತ್ಯಂತ ಜನಪ್ರಿಯ"
    },
    productDetails: {
      availableInStock: "ದಾಸ್ತಾನಿನಲ್ಲಿ {{count}} {{unit}} ಲಭ್ಯವಿದೆ",
      harvestDateLabel: "ಕೊಯ್ಲು: {{date}}",
      availableFromLabel: "ಲಭ್ಯತೆ: {{date}}",
      quantityLabel: "ಪ್ರಮಾಣ ({{unit}}):",
      aboutFarmerTitle: "ರೈತ / ಉತ್ಪಾದಕರ ಬಗ್ಗೆ"
    },
    buyerVerification: {
      officialPortal: "• ಅಧಿಕೃತ ಪರಿಶೀಲನಾ ಪೋರ್ಟಲ್",
      title: "ಖರೀದಿದಾರರ ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ",
      subtitle: "ಅಗ್ರಿಬಜಾರ್‌ನಲ್ಲಿ ಗುರುತು, ವ್ಯಾಪಾರ ಅನುಸರಣೆ ಮತ್ತು ನಿಯಂತ್ರಕ ರುಜುವಾತುಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
      completedCountOfTotal: "{{total}} ರಲ್ಲಿ {{count}} ಪೂರ್ಣಗೊಂಡಿದೆ",
      checklistHeading: "ಪರಿಶೀಲನಾ ಪರಿಶೀಲನಾಪಟ್ಟಿ",
      wizardCardHeading: "ನಿಮ್ಮ ಪರಿಶೀಲನಾ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ",
      wizardCardDesc: "ರೈತರೊಂದಿಗೆ ನಂಬಿಕೆಯನ್ನು ಬೆಳೆಸಲು ಮತ್ತು ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರ ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ಪಡೆಯಲು ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ಗುರುತು, ತೆರಿಗೆ, ಬ್ಯಾಂಕ್ ಮತ್ತು ದಾಖಲೆ ಪರಿಶೀಲನೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ."
    }
  },
  ml: {
    common: {
      allOrders: "എല്ലാ ഓർഡറുകളും",
      editProfile: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക",
      copyHash: "📋 ഹാഷ് കോപ്പി ചെയ്യുക"
    },
    farmerProfile: {
      onChainHashTitle: "🛡️ ഓൺ-ചെയിൻ ക്രിപ്റ്റോഗ്രാഫിക് അക്കൗണ്ട് ഹാഷ്"
    },
    home: {
      marketplace: {
        description: "ഇടനിലക്കാരുടെ കമ്മീഷൻ ഇല്ലാതെ പരിശോധിച്ച ഇന്ത്യൻ കർഷകരിൽ നിന്നും FPO-കളിൽ നിന്നും നേരിട്ട് ഗുണനിലവാരമുള്ള കാർഷിക ഉൽപ്പന്നങ്ങൾ നേടുക.",
        showing: "{{count}} കാർഷിക ലിസ്റ്റിംഗുകൾ കാണിക്കുന്നു"
      }
    },
    marketplace: {
      newestFirst: "പുതിയത് ആദ്യം",
      priceLowToHigh: "വില: കുറഞ്ഞതിൽ നിന്ന് കൂടിയതിലേക്ക്",
      priceHighToLow: "വില: കൂടിയതിൽ നിന്ന് കുറഞ്ഞതിലേക്ക്",
      mostPopular: "ഏറ്റവും ജനപ്രിയം"
    },
    productDetails: {
      availableInStock: "സ്റ്റോക്കിൽ {{count}} {{unit}} ലഭ്യമാണ്",
      harvestDateLabel: "വിളവെടുപ്പ്: {{date}}",
      availableFromLabel: "ലഭ്യത: {{date}}",
      quantityLabel: "അളവ് ({{unit}}):",
      aboutFarmerTitle: "കർഷകൻ / ഉത്പാദകനെക്കുറിച്ച്"
    },
    buyerVerification: {
      officialPortal: "• ഔദ്യോഗിക പരിശോധനാ പോർട്ടൽ",
      title: "വാങ്ങൽക്കാരന്റെ പരിശോധന അവസ്ഥ",
      subtitle: "അഗ്രിബസാറിൽ തിരിച്ചറിയൽ രേഖകൾ, ബിസിനസ്സ് നിയമങ്ങൾ, നിയന്ത്രണ യോഗ്യതകൾ എന്നിവ കൈകാര്യം ചെയ്യുക.",
      completedCountOfTotal: "{{total}}-ൽ {{count}} പൂർത്തിയായി",
      checklistHeading: "പരിശോധനാ ചെക്ക്‌ലിസ്റ്റ്",
      wizardCardHeading: "നിങ്ങളുടെ പരിശോധനാ സഹായി പൂർത്തിയാക്കുക",
      wizardCardDesc: "കർഷകരുമായി വിശ്വാസം വളർത്തുന്നതിനും പരിശോധിച്ച വാങ്ങൽക്കാരൻ ബാഡ്ജുകൾ നേടുന്നതിനും ആവശ്യമായ എല്ലാ തിരിച്ചറിയൽ, നികുതി, ബാങ്ക്, രേഖ പരിശോധനകളും പൂർത്തിയാക്കുക."
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

for (const lang of Object.keys(missingTranslations)) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    deepMerge(content, missingTranslations[lang]);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    console.log(`Merged missing buyer & marketplace translations into ${lang}/translation.json`);
  }
}
