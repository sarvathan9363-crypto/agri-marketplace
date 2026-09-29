import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const newTranslations = {
  en: {
    register: {
      accountCreatedSuccessfully: "Account Created Successfully",
      completeBuyerVerification: "Complete Buyer Verification",
      verifyBuyerDetailsNoticePrefix: "Verify your details to unlock verified buyer features, build trust on AgriBazaar, and earn your",
      verifyBuyerDetailsNoticeSuffix: "badge.",
      skippingBuyerVerificationNotice: "Skipping verification does NOT mean verified. Status will remain PENDING_VERIFICATION until completed.",
      individualConsumer: "Individual Consumer",
      businessRetailer: "Business / Retailer",
      wholesaleBulkBuyer: "Wholesale Bulk Buyer"
    },
    buyerVerificationWizard: {
      completeStepsNotice: "Complete required verification steps to become a verified buyer.",
      verificationSteps: "Verification Steps",
      stepProgress: "Step {{current}} of {{total}}",
      stepProgressUpper: "STEP {{current}} OF {{total}}",
      pending: "Pending",
      verified: "Verified",
      skipped: "Skipped",
      active: "Active",
      mobileNumberLabel: "Mobile Number *",
      enter6DigitOtpLabel: "Enter 6-Digit OTP *",
      identityVerificationMethod: "Identity Verification Method",
      explicitConsentNotice: "I provide my explicit consent to AgriBazaar portal to verify my identity details with official identity registries for buyer authentication.",
      enterIdentityGatewayOtpLabel: "Enter Identity Gateway OTP *",
      streetAddressLabel: "Street Address / Premises *",
      stateLabel: "State *",
      districtLabel: "District *",
      cityTownLabel: "City / Town *",
      pincodeLabel: "Pincode *",
      allChecksAuditedNotice: "All required verification checks have been audited and updated in the official buyer registry.",
      checklistAuditStatus: "Verification Checklist Audit Status"
    }
  },
  ta: {
    register: {
      accountCreatedSuccessfully: "கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது",
      completeBuyerVerification: "வாங்குபவர் சரிபார்ப்பை பூர்த்தி செய்யவும்",
      verifyBuyerDetailsNoticePrefix: "சரிபார்க்கப்பட்ட வாங்குபவர் அம்சங்களைத் திறக்கவும், நம்பிக்கையை உருவாக்கவும் மற்றும் உங்கள்",
      verifyBuyerDetailsNoticeSuffix: "பேட்ஜைப் பெறவும் உங்கள் விவரங்களைச் சரிபார்க்கவும்.",
      skippingBuyerVerificationNotice: "சரிபார்ப்பைத் தவிர்க்கவது சரிபார்க்கப்பட்டதாக அர்த்தமல்ல. பூர்த்தி செய்யும் வரை நிலை PENDING_VERIFICATION ஆக இருக்கும்.",
      individualConsumer: "தனிநபர் நுகர்வோர்",
      businessRetailer: "வணிகம் / சில்லறை விற்பனையாளர்",
      wholesaleBulkBuyer: "மொத்த விற்பனை வாங்குபவர்"
    },
    buyerVerificationWizard: {
      completeStepsNotice: "சரிபார்க்கப்பட்ட வாங்குபவராக மாற தேவையான சரிபார்ப்பு படிகளை பூர்த்தி செய்யவும்.",
      verificationSteps: "சரிபார்ப்பு படிகள்",
      stepProgress: "படி {{current}} / {{total}}",
      stepProgressUpper: "படி {{current}} / {{total}}",
      pending: "நிலுவையில் உள்ளது",
      verified: "சரிபார்க்கப்பட்டது",
      skipped: "தவிர்க்கப்பட்டது",
      active: "செயலில் உள்ளது",
      mobileNumberLabel: "மொபைல் எண் *",
      enter6DigitOtpLabel: "6 இலக்க OTP ஐ உள்ளிடவும் *",
      identityVerificationMethod: "அடையாள சரிபார்ப்பு முறை",
      explicitConsentNotice: "வாங்குபவர் அங்கீகாரத்திற்காக அதிகாரப்பூர்வ அடையாள பதிவேடுகளுடன் எனது அடையாள விவரங்களை சரிபார்க்க அக்ரிபஜார் போர்ட்டலுக்கு எனது வெளிப்படையான சம்மதத்தை வழங்குகிறேன்.",
      enterIdentityGatewayOtpLabel: "அடையாள நுழைவாயில் OTP ஐ உள்ளிடவும் *",
      streetAddressLabel: "தெரு முகவரி / வளாகம் *",
      stateLabel: "மாநிலம் *",
      districtLabel: "மாவட்டம் *",
      cityTownLabel: "நகரம் / ஊர் *",
      pincodeLabel: "அஞ்சல் குறியீடு (Pincode) *",
      allChecksAuditedNotice: "தேவையான அனைத்து சரிபார்ப்பு சோதனைகளும் தணிக்கை செய்யப்பட்டு அதிகாரப்பூர்வ வாங்குபவர் பதிவேட்டில் புதுப்பிக்கப்பட்டுள்ளன.",
      checklistAuditStatus: "சரிபார்ப்பு சரிபார்ப்பு பட்டியல் தணிக்கை நிலை"
    }
  },
  hi: {
    register: {
      accountCreatedSuccessfully: "खाता सफलतापूर्वक बनाया गया",
      completeBuyerVerification: "खरीदार सत्यापन पूरा करें",
      verifyBuyerDetailsNoticePrefix: "सत्यापित खरीदार सुविधाओं को अनलॉक करने और अपना",
      verifyBuyerDetailsNoticeSuffix: "बैज प्राप्त करने के लिए अपने विवरण सत्यापित करें।",
      skippingBuyerVerificationNotice: "सत्यापन छोड़ने का अर्थ सत्यापित होना नहीं है। पूरा होने तक स्थिति PENDING_VERIFICATION रहेगी।",
      individualConsumer: "व्यक्तिगत उपभोक्ता",
      businessRetailer: "व्यवसाय / खुदरा विक्रेता",
      wholesaleBulkBuyer: "थोक खरीदार"
    },
    buyerVerificationWizard: {
      completeStepsNotice: "सत्यापित खरीदार बनने के लिए आवश्यक सत्यापन चरण पूरा करें।",
      verificationSteps: "सत्यापन चरण",
      stepProgress: "चरण {{current}} / {{total}}",
      stepProgressUpper: "चरण {{current}} / {{total}}",
      pending: "लंबित",
      verified: "सत्यापित",
      skipped: "छोड़ा गया",
      active: "सक्रिय",
      mobileNumberLabel: "मोबाइल नंबर *",
      enter6DigitOtpLabel: "6 अंकों का OTP दर्ज करें *",
      identityVerificationMethod: "पहचान सत्यापन विधि",
      explicitConsentNotice: "मैं खरीदार प्रमाणीकरण के लिए आधिकारिक पहचान रजिस्ट्रियों के साथ अपने पहचान विवरण की पुष्टि करने के लिए एग्रीबाज़ार पोर्टल को स्पष्ट सहमति देता हूं।",
      enterIdentityGatewayOtpLabel: "पहचान गेटवे OTP दर्ज करें *",
      streetAddressLabel: "सड़क का पता / परिसर *",
      stateLabel: "राज्य *",
      districtLabel: "जिला *",
      cityTownLabel: "शहर / कस्बा *",
      pincodeLabel: "पिन कोड *",
      allChecksAuditedNotice: "सभी आवश्यक सत्यापन जांचों का ऑडिट किया गया है और आधिकारिक खरीदार रजिस्ट्री में अपडेट किया गया है।",
      checklistAuditStatus: "सत्यापन चेकलिस्ट ऑडिट स्थिति"
    }
  },
  te: {
    register: {
      accountCreatedSuccessfully: "ఖాతా విజయవంతంగా సృష్టించబడింది",
      completeBuyerVerification: "కొనుగోలుదారు తనిఖీని పూర్తి చేయండి",
      verifyBuyerDetailsNoticePrefix: "ధృవీకరించబడిన కొనుగోలుదారు ఫీచర్లను అన్‌లాక్ చేయడానికి మరియు మీ",
      verifyBuyerDetailsNoticeSuffix: "బ్యాడ్జ్‌ను పొందడానికి మీ వివరాలను ధృవీకరించండి.",
      skippingBuyerVerificationNotice: "తనిఖీని దాటవేయడం అంటే ధృవీకరించబడినట్లు కాదు. పూర్తయ్యే వరకు స్థితి PENDING_VERIFICATION లో ఉంటుంది.",
      individualConsumer: "వ్యక్తిగత వినియోగదారు",
      businessRetailer: "వ్యాపారి / రిటైలర్",
      wholesaleBulkBuyer: "హోల్‌సేల్ బల్క్ కొనుగోలుదారు"
    },
    buyerVerificationWizard: {
      completeStepsNotice: "ధృవీకరించబడిన కొనుగోలుదారుగా మారడానికి అవసరమైన తనిఖీ దశలను పూర్తి చేయండి.",
      verificationSteps: "తనిఖీ దశలు",
      stepProgress: "దశ {{current}} / {{total}}",
      stepProgressUpper: "దశ {{current}} / {{total}}",
      pending: "పెండింగ్",
      verified: "ధృవీకరించబడింది",
      skipped: "దాటవేయబడింది",
      active: "యాక్టివ్",
      mobileNumberLabel: "మొబైల్ సంఖ్య *",
      enter6DigitOtpLabel: "6 అంకెల OTP ని నమోదు చేయండి *",
      identityVerificationMethod: "గుర్తింపు తనిఖీ విధానం",
      explicitConsentNotice: "కొనుగోలుదారు ప్రామాణీకరణ కోసం అధికారిక గుర్తింపు రిజిస్ట్రీలతో నా గుర్తింపు వివరాలను తనిఖీ చేయడానికి అగ్రిబజార్ పోర్టల్‌కు నా స్పష్టమైన సమ్మతిని ఇస్తున్నాను.",
      enterIdentityGatewayOtpLabel: "ఐడెంటిటీ గేట్‌వే OTP ని నమోదు చేయండి *",
      streetAddressLabel: "వీధి చిరునామా / భవనం *",
      stateLabel: "రాష్ట్రం *",
      districtLabel: "జిల్లా *",
      cityTownLabel: "నగరం / పట్టణం *",
      pincodeLabel: "పిన్‌కోడ్ *",
      allChecksAuditedNotice: "అన్ని అవసరమైన తనిఖీలు ఆడిట్ చేయబడ్డాయి మరియు అధికారిక కొనుగోలుదారు రిజిస్ట్రీలో నవీకరించబడ్డాయి.",
      checklistAuditStatus: "తనిఖీ చెక్‌లిస్ట్ ఆడిట్ స్థితి"
    }
  },
  kn: {
    register: {
      accountCreatedSuccessfully: "ಖಾತೆ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ",
      completeBuyerVerification: "ಖರೀದಿದಾರರ ಪರಿಶೀಲನೆ ಪೂರ್ಣಗೊಳಿಸಿ",
      verifyBuyerDetailsNoticePrefix: "ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ಲಾಕ್ ಮಾಡಲು ಮತ್ತು ನಿಮ್ಮ",
      verifyBuyerDetailsNoticeSuffix: "ಬ್ಯಾಡ್ಜ್ ಪಡೆಯಲು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      skippingBuyerVerificationNotice: "ಪರಿಶೀಲನೆಯನ್ನು ಬಿಟ್ಟುಬಿಡುವುದು ಪರಿಶೀಲಿಸಲಾಗಿದೆ ಎಂದು ಅರ್ಥವಲ್ಲ. ಪೂರ್ಣಗೊಳ್ಳುವವರೆಗೆ ಸ್ಥಿತಿ PENDING_VERIFICATION ಆಗಿರುತ್ತದೆ.",
      individualConsumer: "ವ್ಯಕ್ತಿಗತ ಗ್ರಾಹಕ",
      businessRetailer: "ಉದ್ಯಮ / ಚಿಲ್ಲರೆ ಮಾರಾಟಗಾರ",
      wholesaleBulkBuyer: "ಸಗಟು ಖರೀದಿ ಪ್ರವರ್ತಕ"
    },
    buyerVerificationWizard: {
      completeStepsNotice: "ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರಾಗಲು ಅಗತ್ಯವಿರುವ ಪರಿಶೀಲನೆ ಹಂತಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
      verificationSteps: "ಪರಿಶೀಲನೆ ಹಂತಗಳು",
      stepProgress: "ಹಂತ {{current}} / {{total}}",
      stepProgressUpper: "ಹಂತ {{current}} / {{total}}",
      pending: "ಬಾಕಿ ಇದೆ",
      verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
      skipped: "ಬಿಟ್ಟುಬಿಡಲಾಗಿದೆ",
      active: "ಸಕ್ರಿಯವಾಗಿದೆ",
      mobileNumberLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *",
      enter6DigitOtpLabel: "6 ಅಂಕಿಯ OTP ನಮೂದಿಸಿ *",
      identityVerificationMethod: "ಗುರುತಿನ ಪರಿಶೀಲನೆ ವಿಧಾನ",
      explicitConsentNotice: "ಖರೀದಿದಾರರ ದೃಢೀಕರಣಕ್ಕಾಗಿ ಅಧಿಕೃತ ಗುರುತಿನ ನೋಂದಣಿಗಳೊಂದಿಗೆ ನನ್ನ ಗುರುತಿನ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಅಗ್ರಿಬಜಾರ್ ಪೋರ್ಟಲ್‌ಗೆ ನನ್ನ ಸ್ಪಷ್ಟ ಸಮ್ಮತಿಯನ್ನು ನೀಡುತ್ತೇನೆ.",
      enterIdentityGatewayOtpLabel: "ಐಡೆಂಟಿಟಿ ಗೇಟ್‌ವೇ OTP ನಮೂದಿಸಿ *",
      streetAddressLabel: "ರಸ್ತೆ ವಿಳಾಸ / ಕಟ್ಟಡ *",
      stateLabel: "ರಾಜ್ಯ *",
      districtLabel: "ಜಿಲ್ಲೆ *",
      cityTownLabel: "ನಗರ / ಪಟ್ಟಣ *",
      pincodeLabel: "ಪಿನ್‌ಕೋಡ್ *",
      allChecksAuditedNotice: "ಎಲ್ಲಾ ಅಗತ್ಯ ಪರಿಶೀಲನೆ ತಪಾಸಣೆಗಳನ್ನು ಲೆಕ್ಕಪರಿಶೋಧಿಸಲಾಗಿದೆ ಮತ್ತು ಅಧಿಕೃತ ಖರೀದಿದಾರರ ನೋಂದಣಿಯಲ್ಲಿ ನವೀಕರಿಸಲಾಗಿದೆ.",
      checklistAuditStatus: "ಪರಿಶೀಲನೆ ಪರಿಶೀಲನಾಪಟ್ಟಿ ಲೆಕ್ಕಪರಿಶೋಧನೆ ಸ್ಥಿತಿ"
    }
  },
  ml: {
    register: {
      accountCreatedSuccessfully: "അക്കൗണ്ട് വിജയകരമായി സൃഷ്ടിച്ചു",
      completeBuyerVerification: "വാങ്ങുന്നയാളുടെ പരിശോധന പൂർത്തിയാക്കുക",
      verifyBuyerDetailsNoticePrefix: "സ്ഥിരീകരിച്ച വാങ്ങുന്നയാളുടെ ഫീച്ചറുകൾ അൺലോക്ക് ചെയ്യാനും നിങ്ങളുടെ",
      verifyBuyerDetailsNoticeSuffix: "ബാഡ്ജ് നേടാനും നിങ്ങളുടെ വിവരങ്ങൾ പരിശോധിക്കുക.",
      skippingBuyerVerificationNotice: "പരിശോധന ഒഴിവാക്കുന്നത് വെരിഫൈ ചെയ്തു എന്ന് അർത്ഥമാക്കുന്നില്ല. പൂർത്തിയാകുന്നതുവരെ സ്റ്റാറ്റസ് PENDING_VERIFICATION ആയിരിക്കും.",
      individualConsumer: "വ്യക്തിഗത ഉപഭോക്താവ്",
      businessRetailer: "ബിസിനസ്സ് / റീട്ടെയിലർ",
      wholesaleBulkBuyer: "ഹോൾസെയിൽ ബൾക്ക് വാങ്ങുന്നയാൾ"
    },
    buyerVerificationWizard: {
      completeStepsNotice: "സ്ഥിരീകരിച്ച വാങ്ങുന്നയാളാകാൻ ആവശ്യമായ പരിശോധനാ ഘട്ടങ്ങൾ പൂർത്തിയാക്കുക.",
      verificationSteps: "പരിശോധനാ ഘട്ടങ്ങൾ",
      stepProgress: "ഘട്ടം {{current}} / {{total}}",
      stepProgressUpper: "ഘട്ടം {{current}} / {{total}}",
      pending: "തീർപ്പുകൽപ്പിക്കാത്തത്",
      verified: "സ്ഥിരീകരിച്ചു",
      skipped: "ഒഴിവാക്കി",
      active: "സജീവം",
      mobileNumberLabel: "മൊബൈൽ നമ്പർ *",
      enter6DigitOtpLabel: "6 അക്ക OTP നൽകുക *",
      identityVerificationMethod: "തിരിച്ചറിയൽ പരിശോധനാ രീതി",
      explicitConsentNotice: "വാങ്ങുന്നയാളുടെ പ്രാമാണീകരണത്തിനായി ഔദ്യോഗിക ഐഡന്റിറ്റി രജിസ്ട്രികളുമായി എന്റെ ഐഡന്റിറ്റി വിവരങ്ങൾ പരിശോധിക്കാൻ ഞാൻ അഗ്രിബസാർ പോർട്ടലിന് എന്റെ വ്യക്തമായ സമ്മതം നൽകുന്നു.",
      enterIdentityGatewayOtpLabel: "ഐഡന്റിറ്റി ഗേറ്റ്‌വേ OTP നൽകുക *",
      streetAddressLabel: "വിലാസം / കെട്ടിടം *",
      stateLabel: "സംസ്ഥാനം *",
      districtLabel: "ജില്ല *",
      cityTownLabel: "നഗരം / പട്ടണം *",
      pincodeLabel: "പിൻകോഡ് *",
      allChecksAuditedNotice: "ആവശ്യമായ എല്ലാ പരിശോധനകളും ഓഡിറ്റ് ചെയ്യുകയും ഔദ്യോഗിക ബയർ രജിസ്ട്രിയിൽ അപ്‌ഡേറ്റ് ചെയ്യുകയും ചെയ്തിട്ടുണ്ട്.",
      checklistAuditStatus: "പരിശോധനാ ചെക്ക്‌ലിസ്റ്റ് ഓഡിറ്റ് സ്റ്റാറ്റസ്"
    }
  }
};

const locales = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

locales.forEach(loc => {
  const filePath = path.join(rootDir, 'frontend', 'src', 'i18n', 'locales', loc, 'translation.json');
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    data.register = {
      ...(data.register || {}),
      ...newTranslations[loc].register,
    };

    data.buyerVerificationWizard = {
      ...(data.buyerVerificationWizard || {}),
      ...newTranslations[loc].buyerVerificationWizard,
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated register & buyerVerificationWizard for ${loc}`);
  }
});
