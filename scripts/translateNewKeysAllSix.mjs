import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Volume D/projects/temp/agri/frontend/src/i18n/locales';

const newKeysDict = {
  en: {
    "status.captured": "Captured",
    "status.authorized": "Authorized",
    "status.paid": "Paid",
    "status.processing": "Processing",
    "status.shipped": "Shipped",
    "status.completed": "Completed",
    "status.onboarding": "Onboarding",
    "status.suspended": "Suspended",
    "status.notStarted": "Not Started",
    "status.inProgress": "In Progress",
    "status.approved": "Approved",

    "admin.platformIntelligence": "Platform Intelligence",
    "admin.platformAnalytics": "Platform Analytics",
    "admin.deepDiveIntoTradeRevenuesSeller": "Deep dive into trade revenues, seller registration velocity, and category volume.",

    "adminAnalytics.monthlyRevenueTrend": "Monthly Revenue Trend",
    "adminAnalytics.grossVolumeDesc": "Gross merchandise volume by month.",
    "adminAnalytics.orderStatusBreakdown": "Order Status Breakdown",
    "adminAnalytics.orderRatioDesc": "Ratio of pending, active, and completed orders.",
    "adminAnalytics.farmerRegistrations": "Farmer & FPO Registrations",
    "adminAnalytics.registrationVelocityDesc": "Registration velocity over time.",
    "adminAnalytics.categoryListingVolume": "Category Listing Volume",
    "adminAnalytics.categoryListingsDesc": "Number of active listings per produce category.",

    "blockchain.verifyEventIdHashOnChain": "VERIFY EVENT ID HASH ON-CHAIN",
    "blockchain.placeholderEventHash": "Paste Event ID Hash (e.g. 0xd8273e6f...)",
    "blockchain.pasteHashSubtitle": "Paste any Buyer Hash or Seller Hash (0x...) to reveal their full profile, contact info, and verification status.",
    "blockchain.placeholderAccountHash": "Paste Buyer Hash or Seller Hash (0x...)",

    "adminSettlements.razorpayRoutePendingTitle": "Razorpay Route Capability is Pending Activation (Test Mode)",
    "adminSettlements.razorpayRoutePendingDesc": "Environment flag RAZORPAY_ROUTE_ENABLED=false is active. Normal buyer checkout payments function properly. Marketplace farmer settlements remain recorded as PENDING until Razorpay Route is enabled on your merchant account."
  },
  ta: {
    "status.captured": "கைப்பற்றப்பட்டது",
    "status.authorized": "அங்கீகரிக்கப்பட்டது",
    "status.paid": "பணம் செலுத்தப்பட்டது",
    "status.processing": "செயலாக்கத்தில் உள்ளது",
    "status.shipped": "அனுப்பப்பட்டது",
    "status.completed": "நிறைவடைந்தது",
    "status.onboarding": "இணைவு செயல்பாட்டில்",
    "status.suspended": "இடைநீக்கம் செய்யப்பட்டது",
    "status.notStarted": "தொடங்கப்படவில்லை",
    "status.inProgress": "செயல்பாட்டில் உள்ளது",
    "status.approved": "ஒப்புதல் அளிக்கப்பட்டது",

    "admin.platformIntelligence": "தள நுண்ணறிவு",
    "admin.platformAnalytics": "தளப் பகுப்பாய்வு",
    "admin.deepDiveIntoTradeRevenuesSeller": "வர்த்தக வருவாய், விற்பனையாளர் பதிவு வேகம் மற்றும் பயிர் அளவு பற்றிய ஆழமான பகுப்பாய்வு.",

    "adminAnalytics.monthlyRevenueTrend": "மாதாந்திர வருவாய் போக்கு",
    "adminAnalytics.grossVolumeDesc": "மாதவாரியாக மொத்த வர்த்தக மதிப்பு.",
    "adminAnalytics.orderStatusBreakdown": "ஆர்டர் நிலை விவரம்",
    "adminAnalytics.orderRatioDesc": "நிலுவையில் உள்ள, செயலில் உள்ள மற்றும் முடிந்த ஆர்டர்களின் விகிதம்.",
    "adminAnalytics.farmerRegistrations": "விவசாயி & FPO பதிவுகள்",
    "adminAnalytics.registrationVelocityDesc": "காலப்போக்கில் பதிவு வளர்ச்சி.",
    "adminAnalytics.categoryListingVolume": "பயிர் வகை பட்டியல் அளவு",
    "adminAnalytics.categoryListingsDesc": "ஒவ்வொரு விளைபொருள் வகையிலும் உள்ள செயலில் உள்ள பட்டியல்களின் எண்ணிக்கை.",

    "blockchain.verifyEventIdHashOnChain": "ஆன்-செயினில் நிகழ்வு ID ஹேஷைச் சரிபார்",
    "blockchain.placeholderEventHash": "நிகழ்வு ID ஹேஷை ஒட்டவும் (எ.கா. 0xd8273e6f...)",
    "blockchain.pasteHashSubtitle": "வாங்குபவர் அல்லது விற்பனையாளர் ஹேஷை (0x...) ஒட்டி அவர்களின் சுயவிவரம் மற்றும் சரிபார்ப்பு நிலையைப் பெறலாம்.",
    "blockchain.placeholderAccountHash": "வாங்குபவர் அல்லது விற்பனையாளர் ஹேஷை ஒட்டவும் (0x...)",

    "adminSettlements.razorpayRoutePendingTitle": "ரேஸர்பே ரூட் வசதி செயலாக்க நிலுவையில் உள்ளது (சோதனை முறை)",
    "adminSettlements.razorpayRoutePendingDesc": "சாதாரண வாங்குபவர் செலுத்துதல்கள் சரியாகச் செயல்படுகின்றன. உங்கள் வணிகக் கணக்கில் ரேஸர்பே ரூட் இயக்கப்படும் வரை விவசாயிகளுக்கான தீர்வுகள் நிலுவையில் (PENDING) இருக்கும்."
  },
  hi: {
    "status.captured": "कैप्चर किया गया",
    "status.authorized": "अधिकृत",
    "status.paid": "भुगतान किया गया",
    "status.processing": "प्रसंस्करण",
    "status.shipped": "शिप किया गया",
    "status.completed": "पूरा हुआ",
    "status.onboarding": "ऑनबोर्डिंग",
    "status.suspended": "निलंबित",
    "status.notStarted": "शुरू नहीं हुआ",
    "status.inProgress": "प्रगति में",
    "status.approved": "स्वीकृत",

    "admin.platformIntelligence": "इंटेलिजेंस प्लेटफॉर्म",
    "admin.platformAnalytics": "प्लेटफ़ॉर्म विश्लेषण",
    "admin.deepDiveIntoTradeRevenuesSeller": "व्यापार राजस्व, विक्रेता पंजीकरण गति और श्रेणी मात्रा का विस्तृत विश्लेषण।",

    "adminAnalytics.monthlyRevenueTrend": "मासिक राजस्व प्रवृत्ति",
    "adminAnalytics.grossVolumeDesc": "माह के अनुसार सकल व्यापार मूल्य।",
    "adminAnalytics.orderStatusBreakdown": "ऑर्डर स्थिति विवरण",
    "adminAnalytics.orderRatioDesc": "लंबित, सक्रिय और पूर्ण किए गए आदेशों का अनुपात।",
    "adminAnalytics.farmerRegistrations": "किसान और एफपीओ पंजीकरण",
    "adminAnalytics.registrationVelocityDesc": "समय के साथ पंजीकरण की गति।",
    "adminAnalytics.categoryListingVolume": "श्रेणी लिस्टिंग मात्रा",
    "adminAnalytics.categoryListingsDesc": "प्रति उपज श्रेणी सक्रिय लिस्टिंग की संख्या।",

    "blockchain.verifyEventIdHashOnChain": "ऑन-चेन इवेंट आईडी हैश सत्यापित करें",
    "blockchain.placeholderEventHash": "इवेंट आईडी हैश पेस्ट करें (उदा. 0xd8273e6f...)",
    "blockchain.pasteHashSubtitle": "किसी भी खरीदार हैश या विक्रेता हैश (0x...) को पेस्ट करें और उनकी प्रोफ़ाइल और सत्यापन स्थिति देखें।",
    "blockchain.placeholderAccountHash": "खरीदार हैश या विक्रेता हैश पेस्ट करें (0x...)",

    "adminSettlements.razorpayRoutePendingTitle": "रेज़रपे रूट क्षमता सक्रियण लंबित है (परीक्षण मोड)",
    "adminSettlements.razorpayRoutePendingDesc": "सामान्य खरीदार चेकआउट भुगतान ठीक से काम करते हैं। जब तक आपके मर्चेंट खाते पर रेज़रपे रूट सक्षम नहीं हो जाता, तब तक किसानों के निपटान PENDING के रूप में दर्ज रहेंगे।"
  },
  te: {
    "status.captured": "క్యాప్చర్ చేయబడింది",
    "status.authorized": "అధికారికం",
    "status.paid": "చెల్లించబడింది",
    "status.processing": "ప్రాసెసింగ్",
    "status.shipped": "రవాణా చేయబడింది",
    "status.completed": "పూర్తయింది",
    "status.onboarding": "ఆన్‌బోర్డింగ్",
    "status.suspended": "సస్పెండ్ చేయబడింది",
    "status.notStarted": "ప్రారంభించబడలేదు",
    "status.inProgress": "పురోగతిలో ఉంది",
    "status.approved": "ఆమోదించబడింది",

    "admin.platformIntelligence": "ఇంటెలిజెన్స్ ప్లాట్‌ఫారమ్",
    "admin.platformAnalytics": "ప్లాట్‌ఫారమ్ విశ్లేషణలు",
    "admin.deepDiveIntoTradeRevenuesSeller": "వ్యాపార రాబడి, విక్రేత నమోదు వేగం మరియు వర్గం పరిమాణం యొక్క సమగ్ర విశ్లేషణ.",

    "adminAnalytics.monthlyRevenueTrend": "మాససిక రాబడి ట్రెండ్",
    "adminAnalytics.grossVolumeDesc": "నెలకు మొత్తం సరుకుల పరిమాణం.",
    "adminAnalytics.orderStatusBreakdown": "ఆర్డర్ స్థితి వివరాలు",
    "adminAnalytics.orderRatioDesc": "పెండింగ్, సక్రియ మరియు పూర్తయిన ఆర్డర్ల నిష్పత్తి.",
    "adminAnalytics.farmerRegistrations": "రైతు & FPO నమోదులు",
    "adminAnalytics.registrationVelocityDesc": "కాలక్రమేణా నమోదుల వేగం.",
    "adminAnalytics.categoryListingVolume": "వర్గం జాబితా పరిమాణం",
    "adminAnalytics.categoryListingsDesc": "ప్రతి పంట వర్గానికి సక్రియ జాబితాల సంఖ్య.",

    "blockchain.verifyEventIdHashOnChain": "ఆన్-చైన్‌లో ఈవెంట్ ID హ్యాష్ పరిశీలించు",
    "blockchain.placeholderEventHash": "ఈవెంట్ ID హ్యాష్ పేస్ట్ చేయండి (ఉదా. 0xd8273e6f...)",
    "blockchain.pasteHashSubtitle": "ఎవరైనా కొనుగోలుదారు లేదా విక్రేత హ్యాష్ (0x...) పేస్ట్ చేసి వారి స్వయంవివరాలు చూడండి.",
    "blockchain.placeholderAccountHash": "కొనుగోలుదారు లేదా విక్రేత హ్యాష్ పేస్ట్ చేయండి (0x...)",

    "adminSettlements.razorpayRoutePendingTitle": "రేజర్‌పే రూట్ సదుపాయం సక్రియం కావలసి ఉంది (టెస్ట్ మోడ్)",
    "adminSettlements.razorpayRoutePendingDesc": "సాధారణ కొనుగోలుదారు చెల్లింపులు సరిగ్గా పనిచేస్తాయి. రేజర్‌పే రూట్ సక్రియం అయ్యే వరకు రైతు పరిష్కారాలు PENDING లో ఉంటాయి."
  },
  kn: {
    "status.captured": "ಕ್ಯಾಪ್ಚರ್ ಮಾಡಲಾಗಿದೆ",
    "status.authorized": "ಅಧಿಕೃತಗೊಳಿಸಲಾಗಿದೆ",
    "status.paid": "ಪಾವತಿಸಲಾಗಿದೆ",
    "status.processing": "ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ",
    "status.shipped": "ರವಾನಿಸಲಾಗಿದೆ",
    "status.completed": "ಪೂರ್ಣಗೊಂಡಿದೆ",
    "status.onboarding": "ಆನ್‌ಬೋರ್ಡಿಂಗ್",
    "status.suspended": "ಅಮಾನತುಗೊಳಿಸಲಾಗಿದೆ",
    "status.notStarted": "ಪ್ರಾರಂಭಿಸಲಾಗಿಲ್ಲ",
    "status.inProgress": "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
    "status.approved": "ಅನುಮೋದಿಸಲಾಗಿದೆ",

    "admin.platformIntelligence": "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಇಂಟೆಲಿಜೆನ್ಸ್",
    "admin.platformAnalytics": "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ವಿಶ್ಲೇಷಣೆಗಳು",
    "admin.deepDiveIntoTradeRevenuesSeller": "ವ್ಯಾಪಾರ ಆದಾಯ, ಮಾರಾಟಗಾರರ ನೋಂದಣಿ ವೇಗ ಮತ್ತು ವರ್ಗ ಪ್ರಮಾಣದ ಸಮಗ್ರ ವಿಶ್ಲೇಷಣೆ.",

    "adminAnalytics.monthlyRevenueTrend": "ಮಾಸಿಕ ಆದಾಯ ಪ್ರವೃತ್ತಿ",
    "adminAnalytics.grossVolumeDesc": "ತಿಂಗಳ ಬಾಗಿ ಒಟ್ಟು ವ್ಯಾಪಾರ ಮೌಲ್ಯ.",
    "adminAnalytics.orderStatusBreakdown": "ಆರ್ಡರ್ ಸ್ಥಿತಿ ವಿವರಗಳು",
    "adminAnalytics.orderRatioDesc": "ಬಾಕಿ, ಸಕ್ರಿಯ ಮತ್ತು ಪೂರ್ಣಗೊಂಡ ಆರ್ಡರ್‌ಗಳ ಪ್ರಮಾಣ.",
    "adminAnalytics.farmerRegistrations": "ರೈತ ಮತ್ತು FPO ನೋಂದಣಿಗಳು",
    "adminAnalytics.registrationVelocityDesc": "ಸಮಯದೊಂದಿಗೆ ನೋಂದಣಿ ವೇಗ.",
    "adminAnalytics.categoryListingVolume": "ವರ್ಗ ಪಟ್ಟಿ ಪ್ರಮಾಣ",
    "adminAnalytics.categoryListingsDesc": "ಪ್ರತಿ ಬೆಳೆ ವರ್ಗಕ್ಕೆ ಸಕ್ರಿಯ ಪಟ್ಟಿಗಳ ಸಂಖ್ಯೆ.",

    "blockchain.verifyEventIdHashOnChain": "ಆನ್-ಚೈನ್‌ನಲ್ಲಿ ಈವೆಂಟ್ ID ಹ್ಯಾಶ್ ಪರಿಶೀಲಿಸಿ",
    "blockchain.placeholderEventHash": "ಈವೆಂಟ್ ID ಹ್ಯಾಶ್ ಪೇಸ್ಟ್ ಮಾಡಿ (ಉದಾ. 0xd8273e6f...)",
    "blockchain.pasteHashSubtitle": "ಖರೀದಿದಾರ ಅಥವಾ ಮಾರಾಟಗಾರರ ಹ್ಯಾಶ್ (0x...) ಪೇಸ್ಟ್ ಮಾಡಿ ವಿವರಗಳನ್ನು ನೋಡಿ.",
    "blockchain.placeholderAccountHash": "ಖರೀದಿದಾರ ಅಥವಾ ಮಾರಾಟಗಾರರ ಹ್ಯಾಶ್ ಪೇಸ್ಟ್ ಮಾಡಿ (0x...)",

    "adminSettlements.razorpayRoutePendingTitle": "ರೇಜರ್‌ಪೇ ರೂಟ್ ಸೌಲಭ್ಯ ಸಕ್ರಿಯಗೊಳಿಸಲು ಬಾಕಿ ಇದೆ (ಟೆಸ್ಟ್ ಮೋಡ್)",
    "adminSettlements.razorpayRoutePendingDesc": "ಸಾಮಾನ್ಯ ಖರೀದಿದಾರರ ಪಾವತಿಗಳು ಸರಿಯಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ. ರೇಜರ್‌ಪೇ ರೂಟ್ ಸಕ್ರಿಯಗೊಳಿಸುವವರೆಗೆ ರೈತರ ಇತ್ಯರ್ಥಗಳು PENDING ಆಗಿರುತ್ತವೆ."
  },
  ml: {
    "status.captured": "ക്യാപ്ചർ ചെയ്തു",
    "status.authorized": "അംഗീകരിച്ചു",
    "status.paid": "പണം നൽകി",
    "status.processing": "പ്രോസസ്സ് ചെയ്യുന്നു",
    "status.shipped": "അയച്ചു",
    "status.completed": "പൂർത്തിയായി",
    "status.onboarding": "ഓൺബോർഡിംഗ്",
    "status.suspended": "സസ്പെൻഡ് ചെയ്തു",
    "status.notStarted": "ആരംഭിച്ചിട്ടില്ല",
    "status.inProgress": "പുരോഗമിക്കുന്നു",
    "status.approved": "അംഗീകരിച്ചു",

    "admin.platformIntelligence": "പ്ലാറ്റ്‌ഫോം ഇന്റലിജൻസ്",
    "admin.platformAnalytics": "പ്ലാറ്റ്‌ഫോം വിശകലനം",
    "admin.deepDiveIntoTradeRevenuesSeller": "വ്യാപാര വരുമാനം, വിൽപനക്കാരുടെ രജിസ്ട്രേഷൻ വേഗത, കാറ്റഗറി വ്യാപ്തി എന്നിവയുടെ വിശദമായ വിശകലനം.",

    "adminAnalytics.monthlyRevenueTrend": "മാസാന്തര വരുമാന പ്രവണത",
    "adminAnalytics.grossVolumeDesc": "മാസത്തിലുടനീളമുള്ള ആകെ വ്യാപാര തുക.",
    "adminAnalytics.orderStatusBreakdown": "ഓർഡർ സ്ഥിതി വിവരങ്ങൾ",
    "adminAnalytics.orderRatioDesc": "ബാക്കിനിൽക്കുന്നവ, സജീവമായവ, പൂർത്തിയായവ എന്നിവയുടെ അനുപാതം.",
    "adminAnalytics.farmerRegistrations": "കർഷകരും FPO രജിസ്ട്രേഷനുകളും",
    "adminAnalytics.registrationVelocityDesc": "കാലക്രമേണയുള്ള രജിസ്ട്രേഷൻ വേഗത.",
    "adminAnalytics.categoryListingVolume": "വിഭാഗ ലിസ്റ്റിംഗ് വ്യാപ്തി",
    "adminAnalytics.categoryListingsDesc": "ഓരോ വിള വിഭാഗത്തിലും ഉള്ള സജീവ ലിസ്റ്റിംഗുകളുടെ എണ്ണം.",

    "blockchain.verifyEventIdHashOnChain": "ഓൺ-ചെയിനിൽ ഇവന്റ് ID ഹാഷ് പരിശോധിക്കുക",
    "blockchain.placeholderEventHash": "ഇവന്റ് ID ഹാഷ് പേസ്റ്റ് ചെയ്യുക (ഉദാ. 0xd8273e6f...)",
    "blockchain.pasteHashSubtitle": "വാങ്ങുന്നയാളുടെയോ വിൽപനക്കാരന്റെയോ ഹാഷ് (0x...) പേസ്റ്റ് ചെയ്ത് വിവരങ്ങൾ കാണുക.",
    "blockchain.placeholderAccountHash": "വാങ്ങുന്നയാളുടെയോ വിൽപനക്കാരന്റെയോ ഹാഷ് പേസ്റ്റ് ചെയ്യുക (0x...)",

    "adminSettlements.razorpayRoutePendingTitle": "റേസർപേ റൂട്ട് സൗകര്യം ആക്റ്റിവേഷൻ ബാക്കിയുണ്ട് (ടെസ്റ്റ് മോഡ്)",
    "adminSettlements.razorpayRoutePendingDesc": "സാധാരണ വാങ്ങൽ പേയ്‌മെന്റുകൾ ശരിയായി പ്രവർത്തിക്കുന്നു. റേസർപേ റൂട്ട് ആക്റ്റിവേറ്റ് ചെയ്യുന്നത് വരെ കർഷക തീർപ്പുകൾ PENDING ആയിരിക്കും."
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

for (const [lang, dict] of Object.entries(newKeysDict)) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const [keyPath, val] of Object.entries(dict)) {
      setDeepValue(data, keyPath, val);
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}/translation.json with new keys.`);
  }
}
