import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Volume D/projects/temp/agri/frontend/src/i18n/locales';

const settingsDict = {
  ta: {
    "settings.preferences": "விருப்பத்தேர்வுகள்",
    "settings.title": "கணக்கு அமைப்புகள்",
    "settings.description": "உங்கள் கணினி விருப்பத்தேர்வுகள், பாதுகாப்பு மற்றும் அறிவிப்பு சேனல்களை நிர்வகிக்கவும்.",
    "settings.notificationPreferences": "அறிவிப்பு விருப்பத்தேர்வுகள்",
    "settings.notificationDescription": "ஆர்டர்கள் மற்றும் இருப்பு மாற்றங்களை AgriBazaar எவ்வாறு அறிவிக்க வேண்டும் என்பதை அமைக்கவும்.",
    "settings.emailOrders": "மின்னஞ்சல் ஆர்டர் அறிவிப்புகள்",
    "settings.emailOrdersDescription": "புதிய ஆர்டர்கள் மற்றும் நிலை மாற்றங்களுக்கு மின்னஞ்சல் பெறவும்.",
    "settings.sms": "SMS அறிவிப்புகள்",
    "settings.smsDescription": "அனுப்பல் மற்றும் விநியோகத்தில் உடனடி SMS விழிப்பூட்டல்களைப் பெறவும்.",
    "settings.priceAlerts": "சந்தை விலை போக்கு அறிவிப்புகள்",
    "settings.priceAlertsDescription": "முக்கிய விவசாய சந்தை விலை மாற்றங்களின் தினசரி சுருக்கம்.",
    "settings.security": "பாதுகாப்பு & அணுகல்",
    "settings.securityDescription": "கூடுதல் பாதுகாப்பு அடுக்குகளுடன் உங்கள் கணக்கைப் பாதுகாக்கவும்.",
    "settings.twoFactor": "இரண்டு காரணி அங்கீகாரம் (2FA)",
    "settings.twoFactorDescription": "உள்நுழைவின் போது OTP சரிபார்ப்பு தேவை.",
    "settings.save": "விருப்பத்தேர்வுகளைச் சேமி",
    "settings.saved": "கணக்கு விருப்பத்தேர்வுகள் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டன!",
    "settings.help": "உதவி தேவையா?",
    "settings.helpDescription": "உங்கள் KYC விவரங்கள் அல்லது விவசாயி சரிபார்ப்பைப் புதுப்பிப்பதில் உதவி தேவைப்பட்டால், தள நிர்வாகத்தைத் தொடர்பு கொள்ளவும்.",
    "settings.platform": "AgriBazaar தளம்",
    "settings.architecture": "நேரடி விவசாய வர்த்தகக் கட்டமைப்பு",
    "settings.systemVersionV104production": "கணினி பதிப்பு: v1.0.4-production"
  },
  hi: {
    "settings.preferences": "प्राथमिकताएं",
    "settings.title": "खाता सेटिंग्स",
    "settings.description": "अपनी सिस्टम प्राथमिकताओं, सुरक्षा और अधिसूचना चैनलों का प्रबंधन करें।",
    "settings.notificationPreferences": "अधिसूचना प्राथमिकताएं",
    "settings.notificationDescription": "कॉन्फ़िगर करें कि एग्रीबाज़ार आपको ऑर्डर और स्टॉक अपडेट की सूचना कैसे देता है।",
    "settings.emailOrders": "ईमेल ऑर्डर सूचनाएं",
    "settings.emailOrdersDescription": "नए ऑर्डर और स्थिति अपडेट के लिए ईमेल प्राप्त करें।",
    "settings.sms": "एसएमएस सूचनाएं",
    "settings.smsDescription": "डिस्पैच और डिलीवरी पर त्वरित एसएमएस अलर्ट प्राप्त करें।",
    "settings.priceAlerts": "बाजार मूल्य प्रवृत्ति अलर्ट",
    "settings.priceAlertsDescription": "शीर्ष कृषि बाजार मूल्य में बदलाव का दैनिक सारांश।",
    "settings.security": "सुरक्षा और पहुंच",
    "settings.securityDescription": "अतिरिक्त सुरक्षा परतों के साथ अपने खाते की रक्षा करें।",
    "settings.twoFactor": "दो-कारक प्रमाणीकरण (2FA)",
    "settings.twoFactorDescription": "लॉगिन पर ओटीपी सत्यापन की आवश्यकता।",
    "settings.save": "प्राथमिकताएं सहेजें",
    "settings.saved": "खाता प्राथमिकताएं सफलतापूर्वक अद्यतन की गईं!",
    "settings.help": "क्या आपको मदद चाहिए?",
    "settings.helpDescription": "यदि आपको अपने केवाईसी विवरण या किसान सत्यापन को अद्यतन करने में सहायता की आवश्यकता है, तो प्लेटफ़ॉर्म प्रशासन से संपर्क करें।",
    "settings.platform": "एग्रीबाज़ार प्लेटफॉर्म",
    "settings.architecture": "प्रत्यक्ष कृषि वाणिज्य वास्तुकला",
    "settings.systemVersionV104production": "सिस्टम संस्करण: v1.0.4-production"
  },
  te: {
    "settings.preferences": "ప్రాధాన్యతలు",
    "settings.title": "ఖాతా అమరికలు",
    "settings.description": "మీ సిస్టమ్ ప్రాధాన్యతలు, భద్రత మరియు నోటిఫికేషన్ ఛానెల్‌లను నిర్వహించండి.",
    "settings.notificationPreferences": "నోటిఫికేషన్ ప్రాధాన్యతలు",
    "settings.notificationDescription": "ఆర్డర్లు మరియు స్టాక్ నవీకరణల గురించి నోటిఫికేషన్‌లను అమర్చండి.",
    "settings.emailOrders": "ఈమెయిల్ ఆర్డర్ నోటిఫికేషన్‌లు",
    "settings.emailOrdersDescription": "కొత్త ఆర్డర్‌లు మరియు స్థితి నవీకరణల కోసం ఈమెయిల్‌లను పొందండి.",
    "settings.sms": "SMS నోటిఫికేషన్‌లు",
    "settings.smsDescription": "తక్షణ SMS హెచ్చరికలను పొందండి.",
    "settings.priceAlerts": "మార్కెట్ ధరల ట్రెండ్ హెచ్చరికలు",
    "settings.priceAlertsDescription": "ప్రధాన వ్యవసాయ మార్కెట్ ధర మార్పుల రోజువారీ సారాంశం.",
    "settings.security": "భద్రత మరియు ప్రాప్యత",
    "settings.securityDescription": "అదనపు భద్రతా పొరలతో మీ ఖాతాను రక్షించుకోండి.",
    "settings.twoFactor": "రెండు అంశాల ప్రామాణీకరణ (2FA)",
    "settings.twoFactorDescription": "లాగిన్‌లో OTP పరిశీలన అవసరం.",
    "settings.save": "ప్రాధాన్యతలను సేవ్ చేయి",
    "settings.saved": "ఖాతా ప్రాధాన్యతలు విజయవంతంగా నవీకరించబడ్డాయి!",
    "settings.help": "సహాయం కావాలా?",
    "settings.helpDescription": "మీ KYC వివరాలు లేదా రైతు పరిశీలనను నవీకరించడంలో సహాయం కావాలంటే ప్లాట్‌ఫారమ్ పరిపాలనను సంప్రదించండి.",
    "settings.platform": "అగ్రిబజార్ ప్లాట్‌ఫారమ్",
    "settings.architecture": "నేరుగా వ్యవసాయ వాణిజ్య నిర్మాణం",
    "settings.systemVersionV104production": "సిస్టమ్ వెర్షన్: v1.0.4-production"
  },
  kn: {
    "settings.preferences": "ಆದ್ಯತೆಗಳು",
    "settings.title": "ಖಾತೆ ಸಂಯೋಜನೆಗಳು",
    "settings.description": "ನಿಮ್ಮ ಸಿಸ್ಟಮ್ ಆದ್ಯತೆಗಳು, ಭದ್ರತೆ ಮತ್ತು ಅಧಿಸೂಚನೆ ಚಾನಲ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    "settings.notificationPreferences": "ಅಧಿಸೂಚನೆ ಆದ್ಯತೆಗಳು",
    "settings.notificationDescription": "ಆರ್ಡರ್‌ಗಳು ಮತ್ತು ಸ್ಟಾಕ್ ನವೀಕರಣಗಳ ಕುರಿತು ಅಧಿಸೂಚನೆಗಳನ್ನು ಸಂಯೋಜಿಸಿ.",
    "settings.emailOrders": "ಇಮೇಲ್ ಆರ್ಡರ್ ಅಧಿಸೂಚನೆಗಳು",
    "settings.emailOrdersDescription": "ಹೊಸ ಆರ್ಡರ್‌ಗಳಿಗಾಗಿ ಇಮೇಲ್ ಪಡೆಯಿರಿ.",
    "settings.sms": "SMS ಅಧಿಸೂಚನೆಗಳು",
    "settings.smsDescription": "ತಕ್ಷಣದ SMS ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
    "settings.priceAlerts": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಪ್ರವೃತ್ತಿ ಎಚ್ಚರಿಕೆಗಳು",
    "settings.priceAlertsDescription": "ಪ್ರಮುಖ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಬದಲಾವಣೆಗಳ ದೈನಂದಿನ ಸಾರಾಂಶ.",
    "settings.security": "ಭದ್ರತೆ ಮತ್ತು ಪ್ರವೇಶ",
    "settings.securityDescription": "ಹೆಚ್ಚುವರಿ ಭದ್ರತಾ ಪದರಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಕ್ಷಿಸಿ.",
    "settings.twoFactor": "ದ್ವಿಮುಖ ದೃಢೀಕರಣ (2FA)",
    "settings.twoFactorDescription": "ಲಾಗಿನ್ ಮಾಡುವಾಗ OTP ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ.",
    "settings.save": "ಆದ್ಯತೆಗಳನ್ನು ಉಳಿಸಿ",
    "settings.saved": "ಖಾತೆ ಆದ್ಯತೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!",
    "settings.help": "ಸಹಾಯ ಬೇಕೇ?",
    "settings.helpDescription": "ನಿಮ್ಮ KYC ವಿವರಗಳು ಅಥವಾ ರೈತರ ಪರಿಶೀಲನೆಯನ್ನು ನವೀಕರಿಸಲು ನೆರವು ಬೇಕಾದರೆ, ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಆಡಳಿತವನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    "settings.platform": "ಅಗ್ರಿಬಜಾರ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
    "settings.architecture": "ನೇರ ಕೃಷಿ ವಾಣಿಜ್ಯ ರಚನೆ",
    "settings.systemVersionV104production": "ಸಿಸ್ಟಮ್ ಆವೃತ್ತಿ: v1.0.4-production"
  },
  ml: {
    "settings.preferences": "മുൻഗണനകൾ",
    "settings.title": "അക്കൗണ്ട് ക്രമീകരണങ്ങൾ",
    "settings.description": "നിങ്ങളുടെ സിസ്റ്റം മുൻഗണനകളും സുരക്ഷയും അറിയിപ്പ് ചാനലുകളും നിയന്ത്രിക്കുക.",
    "settings.notificationPreferences": "അറിയിപ്പ് മുൻഗണനകൾ",
    "settings.notificationDescription": "ഓർഡറുകളും സ്റ്റോക്ക് അപ്‌ഡേറ്റുകളും എങ്ങനെ അറിയിക്കണമെന്ന് ക്രമീകരിക്കുക.",
    "settings.emailOrders": "ഇമെയിൽ ഓർഡർ അറിയിപ്പുകൾ",
    "settings.emailOrdersDescription": "പുതിയ ഓർഡറുകൾക്കും സ്ഥിതി മാറ്റങ്ങൾക്കും ഇമെയിൽ നേടുക.",
    "settings.sms": "SMS അറിയിപ്പുകൾ",
    "settings.smsDescription": "ഉടനടി SMS മുന്നറിയിപ്പുകൾ നേടുക.",
    "settings.priceAlerts": "വിപണി വില ട്രെൻഡ് മുന്നറിയിപ്പുകൾ",
    "settings.priceAlertsDescription": "പ്രധാന കമ്പോള വില മാറ്റങ്ങളുടെ ദിനാന്തരീക്ഷ സംഗ്രഹം.",
    "settings.security": "സുരക്ഷയും പ്രവേശനവും",
    "settings.securityDescription": "കൂടുതൽ സുരക്ഷാ പാളികൾ ഉപയോഗിച്ച് നിങ്ങളുടെ അക്കൗണ്ട് സംരക്ഷിക്കുക.",
    "settings.twoFactor": "ടു-ഫാക്ടർ ഓതന്റിക്കേഷൻ (2FA)",
    "settings.twoFactorDescription": "ലോഗിൻ ചെയ്യുമ്പോൾ OTP സ്ഥിരീകരണം ആവശ്യമാണ്.",
    "settings.save": "മുൻഗണനകൾ സംരക്ഷിക്കുക",
    "settings.saved": "അക്കൗണ്ട് മുൻഗണനകൾ വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു!",
    "settings.help": "സഹായം വേണോ?",
    "settings.helpDescription": "നിങ്ങളുടെ KYC വിവരങ്ങളോ കർഷക സ്ഥിരീകരണമോ അപ്‌ഡേറ്റ് ചെയ്യാൻ സഹായം വേണമെങ്കിൽ പ്ലാറ്റ്‌ഫോം അഡ്മിനിസ്ട്രേഷനുമായി ബന്ധപ്പെടുക.",
    "settings.platform": "അഗ്രിബസാർ പ്ലാറ്റ്‌ഫോം",
    "settings.architecture": "നേരിട്ടുള്ള കാർഷിക വാണിജ്യ ഘടന",
    "settings.systemVersionV104production": "സിസ്റ്റം പതിപ്പ്: v1.0.4-production"
  }
};

function setDeepValue(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!curr[parts[i]]) curr[parts[i]] = {};
    curr = curr[parts[i]];
  }
  curr[parts[parts.length - 1]] = value;
}

for (const [lang, dict] of Object.entries(settingsDict)) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const [keyPath, val] of Object.entries(dict)) {
      setDeepValue(data, keyPath, val);
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully updated ${lang}/translation.json settings.`);
  }
}
