import fs from 'fs';
import path from 'path';

const locales = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

const translations = {
  ta: {
    navigation: {
      addProduct: "தயாரிப்பைச் சேர்"
    },
    adminSettlements: {
      financialControlBadge: "சந்தை நிதி மேலாண்மை",
      headline: "செலுத்துதல் & பணத்தீர்வு மேலோட்டம்",
      subtitle: "ரேசர்பே விற்பனையாளர் கணக்கு அமைவு மற்றும் விவசாயிகளுக்கான பணத்தீர்வுகளைக் கண்காணிக்கவும்.",
      refreshSettlements: "பணத்தீர்வுகளைப் புதுப்பிக்கவும்",
      razorpayRoutePendingTitle: "ரேசர்பே ரூட் சேவை செயல்படுத்தப்பட வேண்டியுள்ளது (சோதனை முறை)",
      razorpayRoutePendingDesc: "சுற்றுச்சூழல் கொடி RAZORPAY_ROUTE_ENABLED=false செயலில் உள்ளது. சாதாரண வாங்குபவரின் கட்டணங்கள் சரியாகச் செயல்படும். உங்கள் கணக்கில் ரேசர்பே ரூட் இயக்கப்படும் வரை விவசாயிகளின் பணப்பரிமாற்றம் நிலுவையில் இருக்கும்.",
      colFarmerProducer: "விவசாயி / உற்பத்தியாளர்",
      colVerification: "அக்ரிபஜார் சரிபார்ப்பு",
      colRazorpayStatus: "ரேசர்பே விற்பனையாளர் நிலை",
      colSettlementAccount: "தீர்வுக் கணக்கு",
      colTotalSettled: "மொத்தம் தீர்வு செய்யப்பட்டது",
      colPendingSettlement: "நிலுவையில் உள்ள தீர்வு",
      colAuditProvenance: "தணிக்கை மூலம்",
      allFarmers: "அனைத்து விவசாயிகள்"
    },
    adminProducts: {
      colCropListing: "பயிர் பட்டியல்",
      colFarmerFpo: "விவசாயி / FPO",
      colCategory: "பயிர் வகை",
      colPriceUnit: "விலை / அலகு",
      colListingStatus: "பட்டியல் நிலை",
      colActions: "செயல்கள்",
      disableListing: "பட்டியலை முடக்கு",
      enableListing: "பட்டியலைச் செயல்படுத்து",
      allListings: "அனைத்து பட்டியல்களும்",
      noProduceListingsFound: "பயிர் பட்டியல்கள் எதுவும் கண்டறியப்படவில்லை"
    },
    blockchain: {
      directSmartContractRpcQuery: "நேரடி ஸ்மார்ட் கான்ட்ராக்ட் RPC வினவல்",
      blockchainAuditTrail: "பிளாக்செயின் தணிக்கை ஆவணம்",
      immutableAuditRecordsDesc: "மாற்ற முடியாத, கவா பிளாக்செயின் வலையமைப்பிலிருந்து நேரடியாகப் பெறப்பட்ட தணிக்கைப் பதிவுகள்.",
      fetchOnChainData: "பிளாக்செயின் தரவைப் பெறு",
      fetchingOnChainData: "தரவு பெறப்படுகிறது...",
      blockchainNetwork: "பிளாக்செயின் வலையமைப்பு",
      smartContractAddress: "ஸ்மார்ட் கான்ட்ராக்ட் முகவரி",
      onChainPaymentAudits: "பிளாக்செயின் கட்டணத் தணிக்கைகள்",
      onChainSettlementAudits: "பிளாக்செயின் தீர்வுத் தணிக்கைகள்"
    },
    adminAnalytics: {
      monthlyRevenueTrend: "மாதாந்திர வருவாய் போக்கு",
      grossVolumeDesc: "மாதவாரியாக மொத்த வர்த்தக மதிப்பு.",
      orderStatusBreakdown: "ஆர்டர் நிலை விகிதம்",
      orderRatioDesc: "நிலுவையில் உள்ள மற்றும் பூர்த்தியான ஆர்டர்களின் விகிதம்.",
      farmerRegistrations: "விவசாயி & FPO பதிவுகள்",
      registrationVelocityDesc: "காலப்போக்கில் புதிய பதிவுகளின் வேகம்.",
      categoryListingVolume: "பயிர் வகை வாரியான பட்டியல்கள்",
      categoryListingsDesc: "ஒவ்வொரு பயிர் வகையிலும் உள்ள பட்டியல்களின் எண்ணிக்கை."
    },
    common: {
      catalogModeration: "சரக்கு மேலாண்மை",
      productModeration: "தயாரிப்பு மேலாண்மை",
      reviewActiveDraftAndPausedCrop: "விவசாயிகளால் வெளியிடப்பட்ட செயலில் உள்ள, வரைவு மற்றும் இடைநிறுத்தப்பட்ட பட்டியல்களை மதிப்பாய்வு செய்யவும்.",
      account: "கணக்கு எண்:",
      ifsc: "IFSC குறியீடு:"
    }
  },
  hi: {
    navigation: {
      addProduct: "उत्पाद जोड़ें"
    },
    adminSettlements: {
      financialControlBadge: "मार्केटप्लेस वित्तीय नियंत्रण",
      headline: "भुगतान और सेटलमेंट अवलोकन",
      subtitle: "रेज़रपे विक्रेता खाता ऑनबोर्डिंग और किसानों के सेटलमेंट को ट्रैक करें।",
      refreshSettlements: "सेटलमेंट ताज़ा करें",
      razorpayRoutePendingTitle: "रेज़रपे रूट सेवा सक्रियण की प्रतीक्षा में है (परीक्षण मोड)",
      razorpayRoutePendingDesc: "पर्यावरण फ्लैग RAZORPAY_ROUTE_ENABLED=false सक्रिय है। सामान्य खरीदार भुगतान ठीक से काम करते हैं। जब तक आपके खाते पर रेज़रपे रूट सक्षम नहीं होता, तब तक किसानों का निपटान लंबित रहेगा।",
      colFarmerProducer: "किसान / उत्पादक",
      colVerification: "एग्रीबाज़ार सत्यापन",
      colRazorpayStatus: "रेज़रपे विक्रेता स्थिति",
      colSettlementAccount: "सेटलमेंट खाता",
      colTotalSettled: "कुल सेटल हुआ",
      colPendingSettlement: "लंबित सेटलमेंट",
      colAuditProvenance: "ऑडिट स्रोत",
      allFarmers: "सभी किसान"
    },
    adminProducts: {
      colCropListing: "फ़सल लिस्टिंग",
      colFarmerFpo: "किसान / एफपीओ",
      colCategory: "श्रेणी",
      colPriceUnit: "मूल्य / इकाई",
      colListingStatus: "लिस्टिंग स्थिति",
      colActions: "कार्रवाई",
      disableListing: "लिस्टिंग अक्षम करें",
      enableListing: "लिस्टिंग सक्षम करें",
      allListings: "सभी लिस्टिंग",
      noProduceListingsFound: "कोई फ़सल लिस्टिंग नहीं मिली"
    },
    blockchain: {
      directSmartContractRpcQuery: "प्रत्यक्ष स्मार्ट कॉन्ट्रैक्ट आरपीसी पूछताछ",
      blockchainAuditTrail: "ब्लॉकचेन ऑडिट ट्रेल",
      immutableAuditRecordsDesc: "अपरिवर्तनीय, कावा ब्लॉकचेन नेटवर्क से सीधे प्राप्त ऑडिट रिकॉर्ड।",
      fetchOnChainData: "ब्लॉकचेन डेटा प्राप्त करें",
      fetchingOnChainData: "डेटा प्राप्त किया जा रहा है...",
      blockchainNetwork: "ब्लॉकचेन नेटवर्क",
      smartContractAddress: "स्मार्ट कॉन्ट्रैक्ट पता",
      onChainPaymentAudits: "ब्लॉकचेन भुगतान ऑडिट",
      onChainSettlementAudits: "ब्लॉकचेन सेटलमेंट ऑडिट"
    },
    adminAnalytics: {
      monthlyRevenueTrend: "मासिक राजस्व रुझान",
      grossVolumeDesc: "महीने के अनुसार कुल व्यापार मूल्य।",
      orderStatusBreakdown: "ऑर्डर स्थिति विवरण",
      orderRatioDesc: "लंबित और पूर्ण ऑर्डर का अनुपात।",
      farmerRegistrations: "किसान और एफपीओ पंजीकरण",
      registrationVelocityDesc: "समय के साथ पंजीकरण की गति।",
      categoryListingVolume: "श्रेणी के अनुसार लिस्टिंग संख्या",
      categoryListingsDesc: "प्रत्येक श्रेणी में सक्रिय लिस्टिंग की संख्या।"
    },
    common: {
      catalogModeration: "इन्वेंटरी नियंत्रण",
      productModeration: "उत्पाद प्रबंधन",
      reviewActiveDraftAndPausedCrop: "किसानों द्वारा प्रकाशित सक्रिय, ड्राफ्ट और निलंबित फ़सल लिस्टिंग की समीक्षा करें।",
      account: "खाता:",
      ifsc: "IFSC कोड:"
    }
  },
  te: {
    navigation: {
      addProduct: "ఉత్పత్తిని జోడించు"
    },
    adminSettlements: {
      financialControlBadge: "మార్కెట్‌ప్లేస్ ఆర్థిక నియంత్రణ",
      headline: "చెల్లింపు మరియు సెటిల్‌మెంట్ అవలోకనం",
      subtitle: "రేజర్‌పే విక్రేత ఖాతా మరియు రైతుల సెటిల్‌మెంట్లను పర్యవేక్షించండి।",
      refreshSettlements: "సెటిల్‌మెంట్లు రీఫ్రెష్ చేయండి",
      razorpayRoutePendingTitle: "రేజర్‌పే రూట్ సేవ సక్రియం కావాల్సి ఉంది (టెస్ట్ మోడ్)",
      razorpayRoutePendingDesc: "ఎన్విరాన్‌మెంట్ ఫ్లాగ్ RAZORPAY_ROUTE_ENABLED=false సక్రియంగా ఉంది. కొనుగోలుదారు చెల్లింపులు సరిగ్గా పనిచేస్తాయి. మీ ఖాతాలో రేజర్‌పే రూట్ ప్రారంభించబడే వరకు రైతుల సెటిల్‌మెంట్ పెండింగ్‌లో ఉంటుంది.",
      colFarmerProducer: "రైతు / ఉత్పత్తిదారుడు",
      colVerification: "అగ్రిబజార్ ధృవీకరణ",
      colRazorpayStatus: "రేజర్‌పే విక్రేత స్థితి",
      colSettlementAccount: "సెటిల్‌మెంట్ ఖాతా",
      colTotalSettled: "మొత్తం సెటిల్ అయింది",
      colPendingSettlement: "పెండింగ్ సెటిల్‌మెంట్",
      colAuditProvenance: "ఆడిట్ ఆధారం",
      allFarmers: "అన్ని రైతులు"
    },
    adminProducts: {
      colCropListing: "పంట నమోదు",
      colFarmerFpo: "రైతు / FPO",
      colCategory: "వర్గం",
      colPriceUnit: "ధర / కొలత",
      colListingStatus: "నమోదు స్థితి",
      colActions: "చర్యలు",
      disableListing: "నమోదును నిలిపివేయి",
      enableListing: "నమోదును ప్రారంభించు",
      allListings: "అన్ని నమోదులు",
      noProduceListingsFound: "పంట నమోదులు లభించలేదు"
    },
    blockchain: {
      directSmartContractRpcQuery: "నేరుగా స్మార్ట్ కాంట్రాక్ట్ RPC విచారణ",
      blockchainAuditTrail: "బ్లాక్‌చైన్ ఆడిట్ రికార్డులు",
      immutableAuditRecordsDesc: "మార్చలేని, కావా బ్లాక్‌చైన్ నెట్‌వర్క్ నుండి నేరుగా పొందిన ఆడిట్ రికార్డులు.",
      fetchOnChainData: "బ్లాక్‌చైన్ డేటాను పొందండి",
      fetchingOnChainData: "డేటా పొందబడుతోంది...",
      blockchainNetwork: "బ్లాక్‌చైన్ నెట్‌వర్క్",
      smartContractAddress: "స్మార్ట్ కాంట్రాక్ట్ చిరునామా",
      onChainPaymentAudits: "బ్లాక్‌చైన్ చెల్లింపు ఆడిట్లు",
      onChainSettlementAudits: "బ్లాక్‌చైన్ సెటిల్‌మెంట్ ఆడిట్లు"
    },
    adminAnalytics: {
      monthlyRevenueTrend: "నెలవారీ రాబడి ధోరణి",
      grossVolumeDesc: "నెలల వారీగా మొత్తం వ్యాపార విలువ.",
      orderStatusBreakdown: "ఆర్డర్ స్థితి వివరాలు",
      orderRatioDesc: "పెండింగ్ మరియు పూర్తయిన ఆర్డర్‌ల నిష్పత్తి.",
      farmerRegistrations: "రైతు & FPO నమోదులు",
      registrationVelocityDesc: "సమయానుకూలంగా నమోదుల వేగం.",
      categoryListingVolume: "వర్గాల వారీగా ఉత్పత్తుల సంఖ్య",
      categoryListingsDesc: "ప్రతి వర్గంలో ఉన్న ఉత్పత్తుల సంఖ్య."
    },
    common: {
      catalogModeration: "ఇన్వెంటరీ నియంత్రణ",
      productModeration: "ఉత్పత్తుల నిర్వహణ",
      reviewActiveDraftAndPausedCrop: "రైతులు ప్రచురించిన పంట నమోదులను సమీక్షించండి.",
      account: "ఖాతా:",
      ifsc: "IFSC కోడ్:"
    }
  },
  kn: {
    navigation: {
      addProduct: "ಉತ್ಪನ್ನ ಸೇರಿಸಿ"
    },
    adminSettlements: {
      financialControlBadge: "ಮಾರುಕಟ್ಟೆ ಹಣಕಾಸು ನಿಯಂತ್ರಣ",
      headline: "ಪಾವತಿ ಮತ್ತು ಜಮೆ ಅವಲೋಕನ",
      subtitle: "ರೇಜರ್‌ಪೇ ಮಾರಾಟಗಾರರ ಖಾತೆ ಮತ್ತು ರೈತರ ಪಾವತಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      refreshSettlements: "ಪಾವತಿಗಳನ್ನು ನವೀಕರಿಸಿ",
      razorpayRoutePendingTitle: "ರೇಜರ್‌ಪೇ ರೂಟ್ ಸೇವೆ ಸಕ್ರಿಯಗೊಳಿಸುವಿಕೆಗೆ ಬಾಕಿ ಇದೆ (ಪರೀಕ್ಷಾ ಮೋಡ್)",
      razorpayRoutePendingDesc: "ಪರಿಸರ ಫ್ಲ್ಯಾಗ್ RAZORPAY_ROUTE_ENABLED=false ಸಕ್ರಿಯವಾಗಿದೆ. ಸಾಮಾನ್ಯ ಖರೀದಿದಾರರ ಪಾವತಿಗಳು ಸರಿಯಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ. ನಿಮ್ಮ ಖಾತೆಯಲ್ಲಿ ರೇಜರ್‌ಪೇ ರೂಟ್ ಸಕ್ರಿಯಗೊಳಿಸುವವರೆಗೆ ರೈತರ ಪಾವತಿಯು ಬಾಕಿ ಇರುತ್ತದೆ.",
      colFarmerProducer: "ರೈತ / ಉತ್ಪಾದಕ",
      colVerification: "ಅಗ್ರಿಬಜಾರ್ ದೃಢೀಕರಣ",
      colRazorpayStatus: "ರೇಜರ್‌ಪೇ ಮಾರಾಟಗಾರರ ಸ್ಥಿತಿ",
      colSettlementAccount: "ಪಾವತಿ ಖಾತೆ",
      colTotalSettled: "ಒಟ್ಟು ಜಮೆಯಾದ ಮೊತ್ತ",
      colPendingSettlement: "ಬಾಕಿ ಇರುವ ಪಾವತಿ",
      colAuditProvenance: "ಆಡಿಟ್ ಸಾಕ್ಷ್ಯ",
      allFarmers: "ಎಲ್ಲಾ ರೈತರು"
    },
    adminProducts: {
      colCropListing: "ಬೆಳೆ ಪಟ್ಟಿ",
      colFarmerFpo: "ರೈತ / FPO",
      colCategory: "ವರ್ಗ",
      colPriceUnit: "ದರ / ಘಟಕ",
      colListingStatus: "ಪಟ್ಟಿ ಸ್ಥಿತಿ",
      colActions: "ಕ್ರಿಯೆಗಳು",
      disableListing: "ಪಟ್ಟಿಯನ್ನು ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಿ",
      enableListing: "ಪಟ್ಟಿಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",
      allListings: "ಎಲ್ಲಾ ಪಟ್ಟಿಗಳು",
      noProduceListingsFound: "ಯಾವುದೇ ಬೆಳೆ ಪಟ್ಟಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ"
    },
    blockchain: {
      directSmartContractRpcQuery: "ನೇರ ಸ್ಮಾರ್ಟ್ ಕಾಂಟ್ರಾಕ್ಟ್ RPC ವಿಚಾರಣೆ",
      blockchainAuditTrail: "ಬ್ಲಾಕ್‌ಚೇನ್ ಆಡಿಟ್ ದಾಖಲೆ",
      immutableAuditRecordsDesc: "ಬದಲಾಯಿಸಲಾಗದ, ಕಾವಾ ಬ್ಲಾಕ್‌ಚೇನ್ ನೆಟ್‌ವರ್ಕ್‌ನಿಂದ ನೇರವಾಗಿ ಪಡೆದ ಆಡಿಟ್ ದಾಖಲೆಗಳು.",
      fetchOnChainData: "ಬ್ಲಾಕ್‌ಚೇನ್ ಡೇಟಾ ಪಡೆಯಿರಿ",
      fetchingOnChainData: "ಡೇಟಾ ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
      blockchainNetwork: "ಬ್ಲಾಕ್‌ಚೇನ್ ನೆಟ್‌ವರ್ಕ್",
      smartContractAddress: "ಸ್ಮಾರ್ಟ್ ಕಾಂಟ್ರಾಕ್ಟ್ ವಿಳಾಸ",
      onChainPaymentAudits: "ಬ್ಲಾಕ್‌ಚೇನ್ ಪಾವತಿ ಆಡಿಟ್‌ಗಳು",
      onChainSettlementAudits: "ಬ್ಲಾಕ್‌ಚೇನ್ ಪಾವತಿ ಆಡಿಟ್‌ಗಳು"
    },
    adminAnalytics: {
      monthlyRevenueTrend: "ಮಾಸಿಕ ಆದಾಯದ ಪ್ರವೃತ್ತಿ",
      grossVolumeDesc: "ತಿಂಗಳವಾರು ಒಟ್ಟು ವ್ಯಾಪಾರ ಮೌಲ್ಯ.",
      orderStatusBreakdown: "ಆರ್ಡರ್ ಸ್ಥಿತಿಯ ವಿವರ",
      orderRatioDesc: "ಬಾಕಿ ಮತ್ತು ಪೂರ್ಣಗೊಂಡ ಆರ್ಡರ್‌ಗಳ ಪ್ರಮಾಣ.",
      farmerRegistrations: "ರೈತ ಮತ್ತು FPO ನೋಂದಣಿಗಳು",
      registrationVelocityDesc: "ಸಮಯಕ್ಕೆ ತಕ್ಕಂತೆ ನೋಂದಣಿ ವೇಗ.",
      categoryListingVolume: "ವರ್ಗವಾರು ಪಟ್ಟಿಗಳ ಸಂಖ್ಯೆ",
      categoryListingsDesc: "ಪ್ರತಿ ವರ್ಗದಲ್ಲಿರುವ ಉತ್ಪನ್ನಗಳ ಸಂಖ್ಯೆ."
    },
    common: {
      catalogModeration: "ದಾಸ್ತಾನು ನಿಯಂತ್ರಣ",
      productModeration: "ಉತ್ಪನ್ನ ನಿರ್ವಹಣೆ",
      reviewActiveDraftAndPausedCrop: "ರೈತರು ಪ್ರಕಟಿಸಿದ ಬೆಳೆ ಪಟ್ಟಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
      account: "ಖಾತೆ:",
      ifsc: "IFSC ಕೋಡ್:"
    }
  },
  ml: {
    navigation: {
      addProduct: "ഉൽപ്പന്നം ചേർക്കുക"
    },
    adminSettlements: {
      financialControlBadge: "മാർക്കറ്റ് പ്ലേസ് സാമ്പത്തിക നിയന്ത്രണം",
      headline: "പേയ്‌മെന്റും സെറ്റിൽമെന്റും അവലോകനം",
      subtitle: "റേസർപേ സെല്ലർ അക്കൗണ്ടും കർഷകരുടെ പണമിടപാടുകളും നിരീക്ഷിക്കുക.",
      refreshSettlements: "സെറ്റിൽമെന്റുകൾ പുതുക്കുക",
      razorpayRoutePendingTitle: "റേസർപേ റൂട്ട് സേവനം സജീവമാക്കാനായി കാത്തിരിക്കുന്നു (ടെസ്റ്റ് മോഡ്)",
      razorpayRoutePendingDesc: "പരിസ്ഥിതി ഫ്ലാഗ് RAZORPAY_ROUTE_ENABLED=false സജീവമാണ്. സാധാരണ ബയർ പേയ്‌മെന്റുകൾ കൃത്യമായി പ്രവർത്തിക്കും. നിങ്ങളുടെ അക്കൗണ്ടിൽ റേസർപേ റൂട്ട് പ്രവർത്തനക്ഷമമാക്കുന്നത് വരെ കർഷകരുടെ പണം നൽകുന്നത് ബാക്കിയായി രേഖപ്പെടുത്തും.",
      colFarmerProducer: "കർഷകൻ / ഉൽപ്പാദകൻ",
      colVerification: "അഗ്രിബസാർ വെരിഫിക്കേഷൻ",
      colRazorpayStatus: "റേസർപേ സെല്ലർ സ്റ്റാറ്റസ്",
      colSettlementAccount: "സെറ്റിൽമെന്റ് അക്കൗണ്ട്",
      colTotalSettled: "ആകെ കൈമാറിയ തുക",
      colPendingSettlement: "നൽകാൻ ബാക്കിയുള്ള തുക",
      colAuditProvenance: "ഓഡിറ്റ് തെളിവ്",
      allFarmers: "എല്ലാ കർഷകരും"
    },
    adminProducts: {
      colCropListing: "വിള ലിസ്റ്റിംഗ്",
      colFarmerFpo: "കർഷകൻ / FPO",
      colCategory: "വിഭാഗം",
      colPriceUnit: "വില / യൂണിറ്റ്",
      colListingStatus: "ലിസ്റ്റിംഗ് സ്റ്റാറ്റസ്",
      colActions: "പ്രവർത്തനങ്ങൾ",
      disableListing: "ലിസ്റ്റിംഗ് നിർത്തിവെക്കുക",
      enableListing: "ലിസ്റ്റിംഗ് സജീവമാക്കുക",
      allListings: "എല്ലാ ലിസ്റ്റിംഗുകളും",
      noProduceListingsFound: "വിള ലിസ്റ്റിംഗുകളൊന്നും കണ്ടെത്തിയില്ല"
    },
    blockchain: {
      directSmartContractRpcQuery: "നേരിട്ടുള്ള സ്മാർട്ട് കോൺട്രാക്ട് RPC അന്വേഷണം",
      blockchainAuditTrail: "ബ്ലോക്ക്ചെയിൻ ഓഡിറ്റ് റെക്കോർഡ്",
      immutableAuditRecordsDesc: "മാറ്റാൻ കഴിയാത്ത, കാവ ബ്ലോക്ക്ചെയിൻ നെറ്റവർക്കിൽ നിന്ന് നേരിട്ട് ശേഖരിച്ച ഓഡിറ്റ് റെക്കോർഡുകൾ.",
      fetchOnChainData: "ബ്ലോക്ക്ചെയിൻ വിവരങ്ങൾ ശേഖരിക്കുക",
      fetchingOnChainData: "വിവരങ്ങൾ ശേഖരിക്കുന്നു...",
      blockchainNetwork: "ബ്ലോക്ക്ചെയിൻ നെറ്റ്വർക്ക്",
      smartContractAddress: "സ്മാർട്ട് കോൺട്രാക്ട് വിലാസം",
      onChainPaymentAudits: "ബ്ലോക്ക്ചെയിൻ പേയ്‌മെന്റ് ഓഡിറ്റുകൾ",
      onChainSettlementAudits: "ബ്ലോക്ക്ചെയിൻ സെറ്റിൽമെന്റ് ഓഡിറ്റുകൾ"
    },
    adminAnalytics: {
      monthlyRevenueTrend: "പ്രതിമാസ വരുമാന പ്രവണത",
      grossVolumeDesc: "മാസം തിരിച്ചുള്ള ആകെ വ്യാപാര മൂല്യം.",
      orderStatusBreakdown: "ഓർഡർ സ്റ്റാറ്റസ് തരംതിരിവ്",
      orderRatioDesc: "പൂർത്തിയാക്കിയതും ബാക്കിയുള്ളതുമായ ഓർഡറുകളുടെ അനുപാതം.",
      farmerRegistrations: "കർഷക & FPO രജിസ്ട്രേഷനുകൾ",
      registrationVelocityDesc: "കാലക്രമേണയുള്ള രജിസ്ട്രേഷൻ നിരക്ക്.",
      categoryListingVolume: "വിഭാഗം തിരിച്ചുള്ള ലിസ്റ്റിംഗുകൾ",
      categoryListingsDesc: "ഓരോ വിഭാഗത്തിലുമുള്ള ലിസ്റ്റിംഗുകളുടെ എണ്ണം."
    },
    common: {
      catalogModeration: "ഇൻവെന്ററി നിയന്ത്രണം",
      productModeration: "ഉൽപ്പന്ന മാനേജ്മെന്റ്",
      reviewActiveDraftAndPausedCrop: "കർഷകർ പ്രസിദ്ധീകരിച്ച ലിസ്റ്റിംഗുകൾ പരിശോധിക്കുക.",
      account: "അക്കൗണ്ട്:",
      ifsc: "IFSC കോഡ്:"
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
  console.log(`✓ Updated Admin & Layout master translations for locale: ${l}`);
});

console.log('✓ Successfully injected Admin & Layout master translations across all 6 locales!');
