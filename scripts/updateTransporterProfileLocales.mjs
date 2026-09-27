import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Volume D/projects/temp/agri/frontend/src/i18n/locales';

const profileTranslations = {
  en: {
    logisticsBadge: "Verified Logistics Partner",
    title: "Transporter Fleet Profile",
    subtitle: "Manage your commercial freight details, contact information, and service regions.",
    editBtn: "Edit Profile",
    accountHashLabel: "On-Chain Transporter Identity Hash",
    companyName: "Company / Transporter Name",
    contactPerson: "Primary Contact Person",
    email: "Email Address",
    mobile: "Mobile Number",
    address: "Business Address",
    serviceAreas: "Operating States / Routes",
    registeredVehicles: "Registered Vehicles",
    activeDrivers: "Active Drivers",
    updatedSuccess: "Transporter profile updated successfully!",
    updateFailed: "Failed to update profile.",
    failedToLoad: "Failed to load transporter profile.",
    hashCopied: "Account Hash copied to clipboard!"
  },
  ta: {
    logisticsBadge: "சரிபார்க்கப்பட்ட போக்குவரத்து பங்குதாரர்",
    title: "போக்குவரத்து வாகனக் குழு சுயவிவரம்",
    subtitle: "உங்கள் வணிகப் சரக்கு விவரங்கள், தொடர்புத் தகவல் மற்றும் சேவை மண்டலங்களை நிர்வகிக்கவும்.",
    editBtn: "சுயவிவரத்தைத் திருத்து",
    accountHashLabel: "ஆன்-செயின் போக்குவரத்து அடையாள ஹேஷ்",
    companyName: "நிறுவனம் / போக்குவரத்து பெயர்",
    contactPerson: "முதன்மை தொடர்பு நபர்",
    email: "மின்னஞ்சல் முகவரி",
    mobile: "கைப்பேசி எண்",
    address: "வணிக முகவரி",
    serviceAreas: "இயங்கும் மாநிலங்கள் / வழிகள்",
    registeredVehicles: "பதிவுசெய்யப்பட்ட வாகனங்கள்",
    activeDrivers: "செயலில் உள்ள ஓட்டுநர்கள்",
    updatedSuccess: "போக்குவரத்து சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
    updateFailed: "சுயவிவரத்தைப் புதுப்பிக்க முடியவில்லை.",
    failedToLoad: "போக்குவரத்து சுயவிவரத்தை ஏற்றுவதில் தோல்வி.",
    hashCopied: "அடையாள ஹேஷ் நகலெடுக்கப்பட்டது!"
  },
  hi: {
    logisticsBadge: "सत्यापित लॉजिस्टिक्स पार्टनर",
    title: "ट्रांसपोर्टर बेड़ा प्रोफ़ाइल",
    subtitle: "अपने वाणिज्यिक माल ढुलाई विवरण, संपर्क जानकारी और सेवा क्षेत्रों का प्रबंधन करें।",
    editBtn: "प्रोफ़ाइल संपादित करें",
    accountHashLabel: "ऑन-चेन ट्रांसपोर्टर पहचान हैश",
    companyName: "कंपनी / ट्रांसपोर्टर का नाम",
    contactPerson: "प्राथमिक संपर्क व्यक्ति",
    email: "ईमेल पता",
    mobile: "मोबाइल नंबर",
    address: "व्यावसायिक पता",
    serviceAreas: "संचालन राज्य / मार्ग",
    registeredVehicles: "पंजीकृत वाहन",
    activeDrivers: "सक्रिय ड्राइवर",
    updatedSuccess: "ट्रांसपोर्टर प्रोफ़ाइल सफलतापूर्वक अद्यतन की गई!",
    updateFailed: "प्रोफ़ाइल अद्यतन करने में विफल।",
    failedToLoad: "ट्रांसपोर्टर प्रोफ़ाइल लोड करने में विफल।",
    hashCopied: "खाता हैश क्लिपबोर्ड पर कॉपी किया गया!"
  },
  te: {
    logisticsBadge: "పరిశీలించిన రవాణా భాగస్వామి",
    title: "రవాణా వాహన సమూహ ప్రొఫైల్",
    subtitle: "మీ వాణిజ్య సరుకు వివరాలు, సంప్రదింపు సమాచారం మరియు సేవా ప్రాంతాలను నిర్వహించండి.",
    editBtn: "ప్రొఫైల్ సవరించు",
    accountHashLabel: "ఆన్-చైన్ ట్రాన్స్‌పోర్టర్ గుర్తింపు హ్యాష్",
    companyName: "సంస్థ / ట్రాన్స్‌పోర్టర్ పేరు",
    contactPerson: "ముఖ్య సంప్రదింపు వ్యక్తి",
    email: "ఈమెయిల్ చిరునామా",
    mobile: "మొబైల్ నంబర్",
    address: "వ్యాపార చిరునామా",
    serviceAreas: "రవాణా రాష్ట్రాలు / మార్గాలు",
    registeredVehicles: "నమోదిత వాహనాలు",
    activeDrivers: "సక్రియ డ్రైవర్లు",
    updatedSuccess: "ట్రాన్స్‌పోర్టర్ ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది!",
    updateFailed: "ప్రొఫైల్ నవీకరించడంలో విఫలమైంది.",
    failedToLoad: "ట్రాన్స్‌పోర్టర్ ప్రొఫైల్ లోడ్ చేయడంలో విఫలమైంది.",
    hashCopied: "ఖాతా హ్యాష్ కాపీ చేయబడింది!"
  },
  kn: {
    logisticsBadge: "ಖಾತರಿಪಡಿಸಿದ ಸರಕು ಸಾಗಣೆ ಪಾಲುದಾರ",
    title: "ಸಾರಿಗೆ ವಾಹನ ಬಳಗದ ಪ್ರೊಫೈಲ್",
    subtitle: "ನಿಮ್ಮ ವಾಣಿಜ್ಯ ಸರಕು ಸಾಗಣೆ ವಿವರಗಳು, ಸಂಪರ್ಕ ಮಾಹಿತಿ ಮತ್ತು ಸೇವಾ ಪ್ರದೇಶಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    editBtn: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    accountHashLabel: "ಆನ್-ಚೈನ್ ಸಾರಿಗೆ ಗುರುತಿನ ಹ್ಯಾಶ್",
    companyName: "ಸಂಸ್ಥೆ / ಸಾರಿಗೆದಾರರ ಹೆಸರು",
    contactPerson: "ಪ್ರಾಥಮಿಕ ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    address: "ವ್ಯಾಪಾರ ವಿಳಾಸ",
    serviceAreas: "ಕಾರ್ಯಾಚರಿಸುವ ರಾಜ್ಯಗಳು / ಮಾರ್ಗಗಳು",
    registeredVehicles: "ನೋಂದಾಯಿತ ವಾಹನಗಳು",
    activeDrivers: "ಸಕ್ರಿಯ ಚಾಲಕರು",
    updatedSuccess: "ಸಾರಿಗೆದಾರರ ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!",
    updateFailed: "ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲು ವಿಫಲವಾಗಿದೆ.",
    failedToLoad: "ಸಾರಿಗೆದಾರರ ಪ್ರೊಫೈಲ್ ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ.",
    hashCopied: "ಖಾತೆ ಹ್ಯಾಶ್ ನಕಲಿಸಲಾಗಿದೆ!"
  },
  ml: {
    logisticsBadge: "സ്ഥിരീകരിച്ച ലോജിസ്റ്റിക്‌സ് പങ്കാളി",
    title: "ട്രാൻസ്പോർട്ടർ വാഹന നിര പ്രൊഫൈൽ",
    subtitle: "നിങ്ങളുടെ വാണിജ്യ ചരക്ക് വിവരങ്ങളും ബന്ധപ്പെടാനുള്ള വിവരങ്ങളും സേവന മേഖലകളും കൈകാര്യം ചെയ്യുക.",
    editBtn: "പ്രൊഫൈൽ തിരുത്തുക",
    accountHashLabel: "ഓൺ-ചെയിൻ ട്രാൻസ്പോർട്ടർ തിരിച്ചറിയൽ ഹാഷ്",
    companyName: "സ്ഥാപനം / ട്രാൻസ്പോർട്ടറുടെ പേര്",
    contactPerson: "പ്രധാന ബന്ധപ്പെടേണ്ട വ്യക്തി",
    email: "ഇമെയിൽ വിലാസം",
    mobile: "മൊബൈൽ നമ്പർ",
    address: "ബിസിനസ്സ് വിലാസം",
    serviceAreas: "പ്രവർത്തന സംസ്ഥാനങ്ങൾ / വഴികൾ",
    registeredVehicles: "രജിസ്റ്റർ ചെയ്ത വാഹനങ്ങൾ",
    activeDrivers: "സജീവ ഡ്രൈവർമാർ",
    updatedSuccess: "ട്രാൻസ്പോർട്ടർ പ്രൊഫൈൽ വിജയകരമായി പുതുക്കി!",
    updateFailed: "പ്രൊഫൈൽ പുതുക്കുന്നതിൽ പരാജയപ്പെട്ടു.",
    failedToLoad: "ട്രാൻസ്പോർട്ടർ പ്രൊഫൈൽ ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.",
    hashCopied: "അക്കൗണ്ട് ഹാഷ് പകർത്തി!"
  }
};

Object.entries(profileTranslations).forEach(([lang, dict]) => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    data.transporterProfile = {
      ...(data.transporterProfile || {}),
      ...dict,
    };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}/translation.json with transporterProfile translations.`);
  }
});
