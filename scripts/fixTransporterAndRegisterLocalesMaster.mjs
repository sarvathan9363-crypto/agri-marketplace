import fs from 'fs';
import path from 'path';

const locales = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

const translations = {
  ta: {
    transporterProfile: {
      logisticsBadge: "சரிபார்க்கப்பட்ட போக்குவரத்து கூட்டாளி",
      title: "போக்குவரத்தாளர் வாகனப் படை சுயவிவரம்",
      subtitle: "உங்கள் வணிகப் போக்குவரத்து விவரங்கள், தொடர்புத் தகவல் மற்றும் சேவைப் பகுதிகளை நிர்வகிக்கவும்.",
      editBtn: "சுயவிவரத்தைத் திருத்து",
      accountHashLabel: "சங்கேத போக்குவரத்து அடையாளக் குறியீடு",
      companyName: "நிறுவனம் / போக்குவரத்தாளர் பெயர்",
      contactPerson: "முதன்மை தொடர்பு நபர்",
      email: "மின்னஞ்சல் முகவரி",
      mobile: "மொபைல் எண்",
      address: "வணிக முகவரி",
      serviceAreas: "இயங்கும் மாநிலங்கள் / வழிகள்",
      registeredVehicles: "பதிவு செய்யப்பட்ட வாகனங்கள்",
      activeDrivers: "செயலில் உள்ள ஓட்டுநர்கள்",
      failedToLoad: "சுயவிவரத்தை ஏற்ற முடியவில்லை.",
      updatedSuccess: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!",
      updateFailed: "சுயவிவரத்தைப் புதுப்பிப்பதில் தோல்வி."
    },
    transport: {
      portalTitle: "போக்குவரத்தாளர் லாக்ஜிஸ்டிக்ஸ் போர்டல்",
      transporterDashboard: "போக்குவரத்தாளர் டாஷ்போர்டு & மேற்கோள்கள்",
      dashboardSubtitle: "வேளாண் சரக்கு கோரிக்கைகளை நிர்வகிக்கவும், கட்டண மேற்கோள்களைச் சமர்ப்பிக்கவும், பயிர் விநியோகங்களைக் கண்காணிக்கவும்.",
      openRequests: "திறந்த போக்குவரத்து கோரிக்கைகள்",
      activeShipments: "செயலில் உள்ள சரக்குகள்",
      totalFreightEarnings: "உறுதிப்படுத்தப்பட்ட சரக்கு கட்டணம்",
      availableRequests: "கிடைக்கும் கோரிக்கைகள்",
      myShipments: "என் செயலில் உள்ள சரக்குகள்",
      availableRequestsHeading: "கிடைக்கும் வேளாண் சரக்கு கோரிக்கைகள்",
      totalWeight: "மொத்த எடை",
      pickup: "ஏற்றும் இடம்",
      delivery: "இறக்கும் இடம்",
      quoteSubmittedBadge: "விலைப்புள்ளி சமர்ப்பிக்கப்பட்டது",
      awaitingBuyerSelection: "வாங்குபவரின் தேர்வுக்காகக் காத்திருக்கிறது...",
      submitQuote: "சரக்கு கட்டண விலைப்புள்ளியைச் சமர்ப்பிக்கவும்",
      verificationRequiredToQuote: "மேற்கோள் சமர்ப்பிக்க சரிபார்ப்பு அனுமதி தேவை.",
      transporterProfile: "போக்குவரத்தாளர் சுயவிவரம்",
      failedToLoadRequests: "தரவை ஏற்ற முடியவில்லை.",
      quoteSubmitted: "விலைப்புள்ளி சமர்ப்பிக்கப்பட்டது!",
      quoteSubmitFailed: "விலைப்புள்ளியை சமர்ப்பிப்பதில் தோல்வி.",
      transporterAccepted: "வேலை ஏற்றுக்கொள்ளப்பட்டது!",
      acceptFailed: "ஏற்பதில் தோல்வி.",
      statusUpdated: "நிலை புதுப்பிக்கப்பட்டது",
      updateStatusFailed: "நிலையைப் புதுப்பிப்பதில் தோல்வி.",
      profileUpdated: "சுயவிவரம் புதுப்பிக்கப்பட்டது!",
      profileUpdateFailed: "சுயவிவரத்தைப் புதுப்பிப்பதில் தோல்வி.",
      noOpenRequests: "தற்போது திறந்த கோரிக்கைகள் எதுவும் இல்லை."
    },
    transporter: {
      verifiedBadge: "✓ சரிபார்க்கப்பட்ட போக்குவரத்தாளர்",
      continueVerificationBtn: "சரிபார்ப்பைத் தொடரவும்",
      verificationPendingTag: "சரிபார்ப்பு நிலுவையில் உள்ளது",
      completeVerificationTitle: "உங்கள் கட்டாயப் போக்குவரத்தாளர் சரிபார்ப்பைப் பூர்த்தி செய்யவும்",
      verificationPendingDesc: "சரிபார்க்கப்படாத போக்குவரத்தாளர்களால் கட்டண மேற்கோள்களைச் சமர்ப்பிக்க முடியாது. அம்சங்களைத் திறக்க சரிபார்ப்பை பூர்த்தி செய்யவும்.",
      startVerificationBtn: "சரிபார்ப்பைத் தொடங்கு"
    },
    register: {
      registrationSuccessful: "பதிவு வெற்றிகரமாக முடிந்தது",
      completeFpoVerification: "உங்கள் FPO சரிபார்ப்பைப் பூர்த்தி செய்யவும்",
      completeFarmerVerification: "உங்கள் விவசாயி சரிபார்ப்பைப் பூர்த்தி செய்யவும்",
      verifyCredentialsNoticePrefix: "உங்கள் சான்றுகளையும் வங்கி கணக்கையும் சரிபார்த்து",
      verifyCredentialsNoticeSuffix: "பேட்ஜைப் பெற்று அக்ரிபஜாரில் விளைபொருட்களை விற்கவும்.",
      startVerificationBtn: "சரிபார்ப்பைத் தொடங்கு",
      skipForNowBtn: "இப்போதைக்குத் தவிர்க்கவும்",
      canCompleteLaterNotice: "உங்கள் விற்பனையாளர் டாஷ்போர்டிலிருந்து எப்போது வேண்டுமானாலும் சரிபார்ப்பைப் பூர்த்தி செய்யலாம்."
    }
  },
  hi: {
    transporterProfile: {
      logisticsBadge: "सत्यापित लॉजिस्टिक्स भागीदार",
      title: "परिवहनकर्ता वाहन फ्लीट प्रोफ़ाइल",
      subtitle: "अपने वाणिज्यिक माल ढुलाई विवरण, संपर्क जानकारी और सेवा क्षेत्रों का प्रबंधन करें।",
      editBtn: "प्रोफ़ाइल संपादित करें",
      accountHashLabel: "ऑन-चेन परिवहनकर्ता पहचान हैश",
      companyName: "कंपनी / परिवहनकर्ता का नाम",
      contactPerson: "प्राथमिक संपर्क व्यक्ति",
      email: "ईमेल पता",
      mobile: "मोबाइल नंबर",
      address: "व्यावसायिक पता",
      serviceAreas: "संचालन राज्य / मार्ग",
      registeredVehicles: "पंजीकृत वाहन",
      activeDrivers: "सक्रिय चालक",
      failedToLoad: "प्रोफ़ाइल लोड करने में विफल।",
      updatedSuccess: "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!",
      updateFailed: "प्रोफ़ाइल अपडेट करने में विफल।"
    },
    transport: {
      portalTitle: "परिवहनकर्ता लॉजिस्टिक्स पोर्टल",
      transporterDashboard: "परिवहनकर्ता डैशबोर्ड और कोटेशन",
      dashboardSubtitle: "कृषि माल ढुलाई अनुरोधों का प्रबंधन करें, कोटेशन सबमिट करें और फ़सल शिपमेंट ट्रैक करें।",
      openRequests: "खुले परिवहन अनुरोध",
      activeShipments: "सक्रिय शिपमेंट",
      totalFreightEarnings: "पुष्ट माल ढुलाई",
      availableRequests: "उपलब्ध अनुरोध",
      myShipments: "मेरी सक्रिय शिपमेंट",
      availableRequestsHeading: "उपलब्ध कृषि माल ढुलाई अनुरोध",
      totalWeight: "कुल वजन",
      pickup: "पिकअप स्थान",
      delivery: "डिलिवरी स्थान",
      quoteSubmittedBadge: "कोटेशन सबमिट किया गया",
      awaitingBuyerSelection: "खरीदार के चयन की प्रतीक्षा है...",
      submitQuote: "माल ढुलाई कोटेशन सबमिट करें",
      verificationRequiredToQuote: "कोटेशन के लिए सत्यापन स्वीकृति आवश्यक है।",
      transporterProfile: "परिवहनकर्ता प्रोफ़ाइल",
      failedToLoadRequests: "डेटा लोड करने में विफल।",
      quoteSubmitted: "कोटेशन सफलतापूर्वक सबमिट हुआ!",
      quoteSubmitFailed: "कोटेशन सबमिट करने में विफल।",
      transporterAccepted: "कार्य स्वीकार किया गया!",
      acceptFailed: "स्वीकार करने में विफल।",
      statusUpdated: "स्थिति अपडेट हुई",
      updateStatusFailed: "स्थिति अपडेट करने में विफल।",
      profileUpdated: "प्रोफ़ाइल अपडेट हो गई!",
      profileUpdateFailed: "प्रोफ़ाइल अपडेट करने में विफल।",
      noOpenRequests: "फिलहाल कोई खुला अनुरोध उपलब्ध नहीं है।"
    },
    transporter: {
      verifiedBadge: "✓ सत्यापित परिवहनकर्ता",
      continueVerificationBtn: "सत्यापन जारी रखें",
      verificationPendingTag: "सत्यापन लंबित है",
      completeVerificationTitle: "अपना आवश्यक परिवहनकर्ता सत्यापन पूरा करें",
      verificationPendingDesc: "अस्वीकृत या असत्यापित परिवहनकर्ता कोटेशन सबमिट नहीं कर सकते। सुविधाएँ अनलॉक करने के लिए सत्यापन पूरा करें।",
      startVerificationBtn: "सत्यापन शुरू करें"
    },
    register: {
      registrationSuccessful: "पंजीकरण सफल रहा",
      completeFpoVerification: "अपना FPO सत्यापन पूरा करें",
      completeFarmerVerification: "अपना किसान सत्यापन पूरा करें",
      verifyCredentialsNoticePrefix: "अपनी साख और बैंक खाते को सत्यापित करके",
      verifyCredentialsNoticeSuffix: "बैज अनलॉक करें और एग्रीबाज़ार पर उपज बेचें।",
      startVerificationBtn: "सत्यापन शुरू करें",
      skipForNowBtn: "अभी के लिए छोड़ें",
      canCompleteLaterNotice: "आप अपने विक्रेता डैशबोर्ड से किसी भी समय सत्यापन पूरा कर सकते हैं।"
    }
  },
  te: {
    transporterProfile: {
      logisticsBadge: "ధృవీకరించబడిన రవాణా భాగస్వామి",
      title: "రవాణాదారు వాహన ప్రొఫైల్",
      subtitle: "మీ వాణిజ్య రవాణా వివరాలు మరియు సంప్రదింపు సమాచారాన్ని నిర్వహించండి.",
      editBtn: "ప్రొఫైల్ సవరించు",
      accountHashLabel: "ఆన్-చైన్ రవాణాదారు గుర్తింపు హాష్",
      companyName: "సంస్థ / రవాణాదారు పేరు",
      contactPerson: "ముఖ్య సంప్రదింపు వ్యక్తి",
      email: "ఈమెయిల్ చిరునామా",
      mobile: "మొబైల్ సంఖ్య",
      address: "వ్యాపార చిరునామా",
      serviceAreas: "సేవ అందించే రాష్ట్రాలు / మార్గాలు",
      registeredVehicles: "నమోదిత వాహనాలు",
      activeDrivers: "సక్రియ డ్రైవర్లు",
      failedToLoad: "ప్రొఫైల్ లోడ్ చేయడం విఫలమైంది.",
      updatedSuccess: "ప్రొఫైల్ విజయవంతంగా అప్‌డేట్ అయింది!",
      updateFailed: "ప్రొఫైల్ అప్‌డేట్ విఫలమైంది."
    },
    transport: {
      portalTitle: "రవాణాదారు లాజిస్టిక్స్ పోర్టల్",
      transporterDashboard: "రవాణాదారు డాష్‌బోర్డ్ మరియు కోటేషన్లు",
      dashboardSubtitle: "వ్యవసాయ రవాణా అభ్యర్థనలను నిర్వహించండి, కోటేషన్లను సమర్పించండి మరియు పంట రవాణాను పర్యవేక్షించండి.",
      openRequests: "తెరిచిన రవాణా అభ్యర్థనలు",
      activeShipments: "సక్రియ రవాణా విడతలు",
      totalFreightEarnings: "స్థిరీకరించబడిన రవాణా రుసుము",
      availableRequests: "లభ్యత అభ్యర్థనలు",
      myShipments: "నా సక్రియ రవాణాలు",
      availableRequestsHeading: "లభ్యత వ్యవసాయ రవాణా అభ్యర్థనలు",
      totalWeight: "మొత్తం బరువు",
      pickup: "పికప్ ప్రాంతం",
      delivery: "డెలివరీ ప్రాంతం",
      quoteSubmittedBadge: "కోటేషన్ సమర్పించబడింది",
      awaitingBuyerSelection: "కొనుగోలుదారు ఎంపిక కోసం వేచి ఉంది...",
      submitQuote: "రవాణా కోటేషన్ సమర్పించండి",
      verificationRequiredToQuote: "కోటేషన్ ఇవ్వడానికి ధృవీకరణ ఆమోదం అవసరం.",
      transporterProfile: "రవాణాదారు ప్రొఫైల్",
      failedToLoadRequests: "డేటా లోడ్ చేయడం విఫలమైంది.",
      quoteSubmitted: "కోటేషన్ విజయవంతంగా సమర్పించబడింది!",
      quoteSubmitFailed: "కోటేషన్ సమర్పించడంలో విఫలమైంది.",
      transporterAccepted: "పని అంగీకరించబడింది!",
      acceptFailed: "అంగీకరించడంలో విఫలమైంది.",
      statusUpdated: "స్థితి అప్‌డేట్ చేయబడింది",
      updateStatusFailed: "స్థితి అప్‌డేట్ చేయడంలో విఫలమైంది.",
      profileUpdated: "ప్రొఫైల్ అప్‌డేట్ అయింది!",
      profileUpdateFailed: "ప్రొఫైల్ అప్‌డేట్ విఫలమైంది.",
      noOpenRequests: "ప్రస్తుతం అభ్యర్థనలు ఏవీ అందుబాటులో లేవు."
    },
    transporter: {
      verifiedBadge: "✓ ధృవీకరించబడిన రవాణాదారు",
      continueVerificationBtn: "ధృవీకరణను కొనసాగించండి",
      verificationPendingTag: "ధృవీకరణ పెండింగ్‌లో ఉంది",
      completeVerificationTitle: "మీ అవసరమైన రవాణాదారు ధృవీకరణను పూర్తి చేయండి",
      verificationPendingDesc: "ధృవీకరించబడని రవాణాదారులు కోటేషన్లను సమర్పించలేరు. సదుపాయాలు పొందడానికి ధృవీకరణ పూర్తి చేయండి.",
      startVerificationBtn: "ధృవీకరణ ప్రారంభించు"
    },
    register: {
      registrationSuccessful: "నమోదు విజయవంతమైంది",
      completeFpoVerification: "మీ FPO ధృవీకరణను పూర్తి చేయండి",
      completeFarmerVerification: "మీ రైతు ధృవీకరణను పూర్తి చేయండి",
      verifyCredentialsNoticePrefix: "మీ ఆధారాలు మరియు బ్యాంక్ ఖాతాను ధృవీకరించి",
      verifyCredentialsNoticeSuffix: "బ్యాడ్జ్ పొంది అగ్రిబజార్‌లో పంటలను అమ్మండి.",
      startVerificationBtn: "ధృవీకరణ ప్రారంభించు",
      skipForNowBtn: "ఇప్పటికి దాటవేయండి",
      canCompleteLaterNotice: "మీరు మీ విక్రేత డాష్‌బోర్డ్ నుండి ఎప్పుడైనా ధృవీకరణను పూర్తి చేయవచ్చు."
    }
  },
  kn: {
    transporterProfile: {
      logisticsBadge: "ದೃಢೀಕರಿಸಲ್ಪಟ್ಟ ಸಾರಿಗೆ ಪಾಲುದಾರ",
      title: "ಸಾರಿಗೆದಾರ ವಾಹನಗಳ ಪ್ರೊಫೈಲ್",
      subtitle: "ನಿಮ್ಮ ವಾಣಿಜ್ಯ ಸಾರಿಗೆ ವಿವರಗಳು ಮತ್ತು ಸಂಪರ್ಕ ಮಾಹಿತಿಯನ್ನು ನಿರ್ವಹಿಸಿ.",
      editBtn: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
      accountHashLabel: "ಆನ್-ಚೈನ್ ಸಾರಿಗೆದಾರ ಗುರುತು ಹ್ಯಾಶ್",
      companyName: "ಸಂಸ್ಥೆ / ಸಾರಿಗೆದಾರರ ಹೆಸರು",
      contactPerson: "ಮುಖ್ಯ ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ",
      email: "ಇಮೇಲ್ ವಿಳಾಸ",
      mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      address: "ವ್ಯಾಪಾರ ವಿಳಾಸ",
      serviceAreas: "ಸೇವೆ ನೀಡುವ ರಾಜ್ಯಗಳು / ಮಾರ್ಗಗಳು",
      registeredVehicles: "ನೋಂದಾಯಿತ ವಾಹನಗಳು",
      activeDrivers: "ಸಕ್ರಿಯ ಚಾಲಕರು",
      failedToLoad: "ಪ್ರೊಫೈಲ್ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ.",
      updatedSuccess: "ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!",
      updateFailed: "ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ."
    },
    transport: {
      portalTitle: "ಸಾರಿಗೆದಾರ ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಪೋರ್ಟಲ್",
      transporterDashboard: "ಸಾರಿಗೆದಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು ಕೋಟೇಶನ್‌ಗಳು",
      dashboardSubtitle: "ಕೃಷಿ ಸಾರಿಗೆ ವಿನಂತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ, ಕೋಟೇಶನ್‌ಗಳನ್ನು ಸಲ್ಲಿಸಿ ಮತ್ತು ಬೆಳೆಗಳ ರವಾನೆಯನ್ನು ವೀಕ್ಷಿಸಿ.",
      openRequests: "ತೆರೆದ ಸಾರಿಗೆ ವಿನಂತಿಗಳು",
      activeShipments: "ಸಕ್ರಿಯ ಸಾಗಣೆಗಳು",
      totalFreightEarnings: "ಖಚಿತಪಡಿಸಿದ ಸಾರಿಗೆ ಶುಲ್ಕ",
      availableRequests: "ಲಭ್ಯವಿರುವ ವಿನಂತಿಗಳು",
      myShipments: "ನನ್ನ ಸಕ್ರಿಯ ಸಾಗಣೆಗಳು",
      availableRequestsHeading: "ಲಭ್ಯವಿರುವ ಕೃಷಿ ಸಾರಿಗೆ ವಿನಂತಿಗಳು",
      totalWeight: "ಒಟ್ಟು ತೂಕ",
      pickup: "ಪಿಕಪ್ ಸ್ಥಳ",
      delivery: "ಡೆಲಿವರಿ ಸ್ಥಳ",
      quoteSubmittedBadge: "ಕೋಟೇಶನ್ ಸಲ್ಲಿಸಲಾಗಿದೆ",
      awaitingBuyerSelection: "ಖರೀದಿದಾರರ ಆಯ್ಕೆಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...",
      submitQuote: "ಸಾರಿಗೆ ಕೋಟೇಶನ್ ಸಲ್ಲಿಸಿ",
      verificationRequiredToQuote: "ಕೋಟೇಶನ್ ನೀಡಲು ದೃಢೀಕರಣ ಅನುಮೋದನೆ ಅಗತ್ಯವಿದೆ.",
      transporterProfile: "ಸಾರಿಗೆದಾರ ಪ್ರೊಫೈಲ್",
      failedToLoadRequests: "ಮಾಹಿತಿ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ.",
      quoteSubmitted: "ಕೋಟೇಶನ್ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!",
      quoteSubmitFailed: "ಕೋಟೇಶನ್ ಸಲ್ಲಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ.",
      transporterAccepted: "ಕೆಲಸವನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ!",
      acceptFailed: "ಸ್ವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ.",
      statusUpdated: "ಸ್ಥಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ",
      updateStatusFailed: "ಸ್ಥಿತಿ ನವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ.",
      profileUpdated: "ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲಾಗಿದೆ!",
      profileUpdateFailed: "ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ.",
      noOpenRequests: "ಸದ್ಯಕ್ಕೆ ಯಾವುದೇ ವಿನಂತಿಗಳು ಲಭ್ಯವಿಲ್ಲ."
    },
    transporter: {
      verifiedBadge: "✓ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟ ಸಾರಿಗೆದಾರ",
      continueVerificationBtn: "ದೃಢೀಕರಣ ಮುಂದುವರಿಸಿ",
      verificationPendingTag: "ದೃಢೀಕರಣ ಬಾಕಿ ಇದೆ",
      completeVerificationTitle: "ನಿಮ್ಮ ಅಗತ್ಯ ಸಾರಿಗೆದಾರ ದೃಢೀಕರಣವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ",
      verificationPendingDesc: "ದೃಢೀಕರಿಸದ ಸಾರಿಗೆದಾರರು ಕೋಟೇಶನ್‌ಗಳನ್ನು ಸಲ್ಲಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ. ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಪಡೆಯಲು ದೃಢೀಕರಣ ಪೂರ್ಣಗೊಳಿಸಿ.",
      startVerificationBtn: "ದೃಢೀಕರಣ ಪ್ರಾರಂಭಿಸಿ"
    },
    register: {
      registrationSuccessful: "ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ",
      completeFpoVerification: "ನಿಮ್ಮ FPO ದೃಢೀಕರಣವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ",
      completeFarmerVerification: "ನಿಮ್ಮ ರೈತರ ದೃಢೀಕರಣವನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ",
      verifyCredentialsNoticePrefix: "ನಿಮ್ಮ ವಿವರಗಳು ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆಯನ್ನು ದೃಢೀಕರಿಸಿ",
      verifyCredentialsNoticeSuffix: "ಬ್ಯಾಡ್ಜ್ ಪಡೆದು ಅಗ್ರಿಬಜಾರ್‌ನಲ್ಲಿ ಬೆಳೆಗಳನ್ನು ಮಾರಾಟ ಮಾಡಿ.",
      startVerificationBtn: "ದೃಢೀಕರಣ ಪ್ರಾರಂಭಿಸಿ",
      skipForNowBtn: "ಸದ್ಯಕ್ಕೆ ಬಿಟ್ಟುಬಿಡಿ",
      canCompleteLaterNotice: "ನಿಮ್ಮ ಮಾರಾಟಗಾರರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಿಂದ ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ದೃಢೀಕರಣ ಪೂರ್ಣಗೊಳಿಸಬಹುದು."
    }
  },
  ml: {
    transporterProfile: {
      logisticsBadge: "സ്ഥിരീകരിച്ച ഗതാഗത പങ്കാളി",
      title: "ഗതാഗതക്കാരന്റെ വാഹന ശൃംഖല പ്രൊഫൈൽ",
      subtitle: "നിങ്ങളുടെ വാണിജ്യ ഗതാഗത വിവരങ്ങളും സേവന മേഖലകളും നിയന്ത്രിക്കുക.",
      editBtn: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക",
      accountHashLabel: "ഓൺ-ചെയിൻ ഗതാഗത അക്കൗണ്ട് ഹാഷ്",
      companyName: "കമ്പനി / ഗതാഗതക്കാരന്റെ പേര്",
      contactPerson: "പ്രധാന ബന്ധപ്പെടേണ്ട വ്യക്തി",
      email: "ഇമെയിൽ വിലാസം",
      mobile: "മൊബൈൽ നമ്പർ",
      address: "ബിസിനസ്സ് വിലാസം",
      serviceAreas: "സേവന മേഖലകൾ / റൂട്ടുകൾ",
      registeredVehicles: "രജിസ്റ്റർ ചെയ്ത വാഹനങ്ങൾ",
      activeDrivers: "സജീവ ഡ്രൈവർമാർ",
      failedToLoad: "പ്രൊഫൈൽ ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.",
      updatedSuccess: "പ്രൊഫൈൽ വിജയകരമായി പുതുക്കി!",
      updateFailed: "പ്രൊഫൈൽ പുതുക്കുന്നതിൽ പരാജയപ്പെട്ടു."
    },
    transport: {
      portalTitle: "ഗതാഗത ലോജിസ്റ്റിക്സ് പോർട്ടൽ",
      transporterDashboard: "ഗതാഗത ഡാഷ്‌ബോർഡും ക്വോട്ടേഷനുകളും",
      dashboardSubtitle: "കാർഷിക ചരക്ക് ഗതാഗത അഭ്യർത്ഥനകൾ നിയന്ത്രിക്കുക, നിരക്കുകൾ സമർപ്പിക്കുക, ഷിപ്പ്മെന്റുകൾ ട്രാക്ക് ചെയ്യുക.",
      openRequests: "തുറന്ന ഗതാഗത അഭ്യർത്ഥനകൾ",
      activeShipments: "സജീവ ഷിപ്പ്മെന്റുകൾ",
      totalFreightEarnings: "ഉറപ്പാക്കിയ ചരക്ക് കൂലി",
      availableRequests: "ലഭ്യമായ അഭ്യർത്ഥനകൾ",
      myShipments: "എന്റെ സജീവ ഷിപ്പ്മെന്റുകൾ",
      availableRequestsHeading: "ലഭ്യമായ കാർഷിക ചരക്ക് അഭ്യർത്ഥനകൾ",
      totalWeight: "ആകെ ഭാരം",
      pickup: "പിക്കപ്പ് സ്ഥലം",
      delivery: "ഡെലിവറി സ്ഥലം",
      quoteSubmittedBadge: "ക്വോട്ടേഷൻ സമർപ്പിച്ചു",
      awaitingBuyerSelection: "ബയറുടെ തിരഞ്ഞെടുപ്പിനായി കാത്തിരിക്കുന്നു...",
      submitQuote: "നിരക്ക് ക്വോട്ടേഷൻ സമർപ്പിക്കുക",
      verificationRequiredToQuote: "ക്വോട്ടേഷൻ സമർപ്പിക്കാൻ വെരിഫിക്കേഷൻ അനുമതി ആവശ്യമാണ്.",
      transporterProfile: "ഗതാഗത പ്രൊഫൈൽ",
      failedToLoadRequests: "വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.",
      quoteSubmitted: "ക്വോട്ടേഷൻ വിജയകരമായി സമർപ്പിച്ചു!",
      quoteSubmitFailed: "ക്വോട്ടേഷൻ സമർപ്പിക്കുന്നതിൽ പരാജയപ്പെട്ടു.",
      transporterAccepted: "ജോലി സ്വീകരിച്ചു!",
      acceptFailed: "സ്വീകരിക്കുന്നതിൽ പരാജയപ്പെട്ടു.",
      statusUpdated: "സ്റ്റാറ്റസ് പുതുക്കി",
      updateStatusFailed: "സ്റ്റാറ്റസ് പുതുക്കുന്നതിൽ പരാജയപ്പെട്ടു.",
      profileUpdated: "പ്രൊഫൈൽ പുതുക്കി!",
      profileUpdateFailed: "പ്രൊഫൈൽ പുതുക്കുന്നതിൽ പരാജയപ്പെട്ടു.",
      noOpenRequests: "നിലവിൽ തുറന്ന അഭ്യർത്ഥനകളൊന്നുമില്ല."
    },
    transporter: {
      verifiedBadge: "✓ വെരിഫൈ ചെയ്ത ഗതാഗതക്കാരൻ",
      continueVerificationBtn: "വെരിഫിക്കേഷൻ തുടരുക",
      verificationPendingTag: "വെരിഫിക്കേഷൻ പൂർത്തിയായിട്ടില്ല",
      completeVerificationTitle: "ഗതാഗത വെരിഫിക്കേഷൻ പൂർത്തിയാക്കുക",
      verificationPendingDesc: "സ്ഥിരീകരിക്കാത്ത ഗതാഗതക്കാർക്ക് ക്വോട്ടേഷൻ സമർപ്പിക്കാൻ കഴിയില്ല. ഫീച്ചറുകൾ ലഭിക്കാൻ വെരിഫിക്കേഷൻ പൂർത്തിയാക്കുക.",
      startVerificationBtn: "വെരിഫിക്കേഷൻ ആരംഭിക്കുക"
    },
    register: {
      registrationSuccessful: "രജിസ്ട്രേഷൻ വിജയകരമായി പൂർത്തിയായി",
      completeFpoVerification: "നിങ്ങളുടെ FPO വെരിഫിക്കേഷൻ പൂർത്തിയാക്കുക",
      completeFarmerVerification: "നിങ്ങളുടെ കർഷക വെരിഫിക്കേഷൻ പൂർത്തിയാക്കുക",
      verifyCredentialsNoticePrefix: "നിങ്ങളുടെ വിവരങ്ങളും ബാങ്ക് അക്കൗണ്ടും വെരിഫൈ ചെയ്ത്",
      verifyCredentialsNoticeSuffix: "ബാഡ്ജ് നേടി അഗ്രിബസാറിൽ ഉൽപ്പന്നങ്ങൾ വിൽക്കുക.",
      startVerificationBtn: "വെരിഫിക്കേഷൻ ആരംഭിക്കുക",
      skipForNowBtn: "ഇപ്പോഴത്തേക്ക് ഒഴിവാക്കുക",
      canCompleteLaterNotice: "സെല്ലർ ഡാഷ്‌ബോർഡിൽ നിന്ന് എപ്പോൾ വേണമെങ്കിലും വെരിഫിക്കേഷൻ പൂർത്തിയാക്കാം."
    }
  }
};

locales.forEach(l => {
  if (l === 'en') return;
  const filePath = path.join('frontend/src/i18n/locales', l, 'translation.json');
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (translations[l]) {
    Object.keys(translations[l]).forEach(section => {
      if (!content[section]) content[section] = {};
      Object.keys(translations[l][section]).forEach(key => {
        content[section][key] = translations[l][section][key];
      });
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
  console.log(`✓ Updated Transporter & Register translations for locale: ${l}`);
});

console.log('✓ Successfully injected Transporter & Register master translations across all locales!');
