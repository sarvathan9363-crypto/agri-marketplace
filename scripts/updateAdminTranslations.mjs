import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Volume D/projects/temp/agri/frontend/src/i18n/locales';

const adminTranslations = {
  ta: {
    "admin.users": "பயனாளர்கள்",
    "admin.farmers": "விவசாயிகள் / FPOக்கள்",
    "admin.settlements": "பணத் தீர்வுகள்",
    "admin.payments": "பணம் செலுத்துதல்கள்",
    "admin.blockchain": "பிளாக்செயின் தணிக்கை",
    "admin.disputes": "சிக்கல்கள் / புகார்கள்",
    "admin.analytics": "பகுப்பாய்வு",

    "navigation.addProduct": "தயாரிப்பு சேர்",

    "common.agribazaarPlatformMetricsFarmerVerificationPipeline": "AgriBazaar தள அளவீடுகள், விவசாயி சரிபார்ப்பு செயல்முறை மற்றும் வர்த்தக அளவுகள்.",
    "common.recentPlatformOrders": "சமீபத்திய தள ஆர்டர்கள்",
    "common.verify": "சரிபார்",
    "common.reject": "நிராகரி",
    "common.cancel": "ரத்துசெய்",
    "common.review": "மதிப்பாய்வு செய்",
    "common.resolve": "தீர்",

    "adminFarmers.allApplications": "அனைத்து விண்ணப்பங்களும்",
    "adminFarmers.approveVerification": "சரிபார்ப்பை அங்கீகரி",
    "adminFarmers.rejectFarmerModalTitle": "{{name}} நிராகரிக்கப்பட வேண்டுமா?",
    "adminFarmers.rejectFarmerBtn": "விவசாயியை நிராகரி",

    "adminUsers.allRoles": "அனைத்து பாத்திரங்களும்",
    "adminPayments.viewOnChainAudit": "ஆன்-செயின் பிளாக்செயின் தணிக்கையைப் பார்",

    "adminDisputes.resolveIssue": "சிக்கலைத் தீர்",
    "adminDisputes.rejectClaim": "புகாரை நிராகரி",
    "adminDisputes.resolveClaim": "புகாரைத் தீர்",

    "adminSettlements.financialControlBadge": "சந்தை நிதி நிர்வகிப்பு",
    "adminSettlements.headline": "பணம் செலுத்துதல் & தீர்வு மேலோட்டம்",
    "adminSettlements.subtitle": "ரேஸர்பே விற்பனையாளர் கணக்கு இணைப்பு மற்றும் சந்தைப் பகிர்வு தீர்வுகளைக் கண்காணிக்கவும்.",
    "adminSettlements.refreshSettlements": "தீர்வுகளைப் புதுப்பி",
    "adminSettlements.allFarmers": "அனைத்து விவசாயிகள்",

    "adminOrders.allOrders": "அனைத்து ஆர்டர்களும்",

    "adminProducts.allListings": "அனைத்து பட்டியல்களும்",
    "adminProducts.disableListing": "பட்டியலை முடக்கு",
    "adminProducts.enableListing": "பட்டியலைச் செயல்படுத்து",

    "blockchain.directSmartContractRpcQuery": "நேரடி ஸ்மார்ட் காண்ட்ராக்ட் RPC விசாரணை",
    "blockchain.blockchainAuditTrail": "பிளாக்செயின் தணிக்கைப் பதிவு",
    "blockchain.immutableAuditRecordsDesc": "Kava EVM நெட்வொர்க்கிலிருந்து நேரடியாகப் பெறப்பட்ட மாற்ற முடியாத தணிக்கைப் பதிவுகள்.",
    "blockchain.fetchingOnChainData": "ஆன்-செயின் தரவு ஏற்றப்படுகிறது...",
    "blockchain.fetchOnChainData": "ஆன்-செயின் தரவைப் பெறு",
    "blockchain.buyerSellerHashLookup": "வாங்குபவர் & விற்பனையாளர் ஹேஷ் தேடல்",
    "blockchain.lookupIdentity": "அடையாளத்தைத் தேடு",
    "blockchain.paymentAuditsOnChain": "ஆன்-செயின் கட்டணத் தணிக்கை",
    "blockchain.settlementAuditsOnChain": "ஆன்-செயின் தீர்வுத் தணிக்கை",
    "blockchain.buyerHashIdentity": "வாங்குபவர் ஹேஷ் & அடையாளம்",
    "blockchain.amountRupees": "தொகை (₹)"
  },
  hi: {
    "admin.users": "उपयोगकर्ता",
    "admin.farmers": "किसान / एफपीओ",
    "admin.settlements": "भुगतान निपटान",
    "admin.payments": "भुगतान",
    "admin.blockchain": "ब्लॉकचेन ऑडिट",
    "admin.disputes": "विवाद समाधान",
    "admin.analytics": "विश्लेषण",

    "navigation.addProduct": "उत्पाद जोड़ें",

    "common.agribazaarPlatformMetricsFarmerVerificationPipeline": "एग्रीबाज़ार प्लेटफ़ॉर्म मेट्रिक्स, किसान सत्यापन पाइपलाइन और व्यापार मात्रा।",
    "common.recentPlatformOrders": "हाल के प्लेटफॉर्म ऑर्डर",
    "common.verify": "सत्यापित करें",
    "common.reject": "अस्वीकार करें",
    "common.cancel": "रद्द करें",
    "common.review": "समीक्षा करें",
    "common.resolve": "हल करें",

    "adminFarmers.allApplications": "सभी आवेदन",
    "adminFarmers.approveVerification": "सत्यापन स्वीकार करें",
    "adminFarmers.rejectFarmerModalTitle": "क्या {{name}} को अस्वीकार करना चाहते हैं?",
    "adminFarmers.rejectFarmerBtn": "किसान को अस्वीकार करें",

    "adminUsers.allRoles": "सभी भूमिकाएं",
    "adminPayments.viewOnChainAudit": "ऑन-चेन ब्लॉकचेन ऑडिट देखें",

    "adminDisputes.resolveIssue": "समस्या का समाधान करें",
    "adminDisputes.rejectClaim": "दावा अस्वीकार करें",
    "adminDisputes.resolveClaim": "दावा हल करें",

    "adminSettlements.financialControlBadge": "बाज़ार वित्तीय नियंत्रण",
    "adminSettlements.headline": "भुगतान और निपटान अवलोकन",
    "adminSettlements.subtitle": "रेज़रपे विक्रेता खाता ऑनबोर्डिंग, रूट सक्रियण और बाज़ार विभाजन निपटान को ट्रैक करें।",
    "adminSettlements.refreshSettlements": "निपटान ताज़ा करें",
    "adminSettlements.allFarmers": "सभी किसान",

    "adminOrders.allOrders": "सभी ऑर्डर",

    "adminProducts.allListings": "सभी लिस्टिंग",
    "adminProducts.disableListing": "लिस्टिंग अक्षम करें",
    "adminProducts.enableListing": "लिस्टिंग सक्षम करें",

    "blockchain.directSmartContractRpcQuery": "प्रत्यक्ष स्मार्ट अनुबंध आरपीसी पूछताछ",
    "blockchain.blockchainAuditTrail": "ब्लॉकचेन ऑडिट ट्रेल",
    "blockchain.immutableAuditRecordsDesc": "कावा ईवीएम टेस्टनेट स्मार्ट अनुबंध से सीधे प्राप्त अपरिवर्तनीय ऑडिट रिकॉर्ड।",
    "blockchain.fetchingOnChainData": "ऑन-चेन डेटा लाया जा रहा है...",
    "blockchain.fetchOnChainData": "ऑन-चेन डेटा प्राप्त करें",
    "blockchain.buyerSellerHashLookup": "खरीदार और विक्रेता हैश खोज",
    "blockchain.lookupIdentity": "पहचान खोजें",
    "blockchain.paymentAuditsOnChain": "ऑन-चेन भुगतान ऑडिट",
    "blockchain.settlementAuditsOnChain": "ऑन-चेन निपटान ऑडिट",
    "blockchain.buyerHashIdentity": "खरीदार हैश और पहचान",
    "blockchain.amountRupees": "राशि (₹)"
  },
  te: {
    "admin.users": "వినియోగదారులు",
    "admin.farmers": "రైతులు / FPOలు",
    "admin.settlements": "పరిష్కారాలు",
    "admin.payments": "చెల్లింపులు",
    "admin.blockchain": "బ్లాక్‌చైన్ ఆడిట్",
    "admin.disputes": "వివాదాలు",
    "admin.analytics": "విశ్లేషణలు",
    "navigation.addProduct": "ఉత్పత్తిని జోడించండి",
    "common.agribazaarPlatformMetricsFarmerVerificationPipeline": "అగ్రిబజార్ ప్లాట్‌ఫారమ్ గణాంకాలు, రైతు పరిశీలన పైప్‌లైన్ మరియు వాణిజ్య పరిమాణాలు.",
    "common.recentPlatformOrders": "ఇటీవలి ప్లాట్‌ఫారమ్ ఆర్డర్లు",
    "common.verify": "పరిశీలించు",
    "common.reject": "తిరస్కరించు",
    "common.cancel": "రద్దు చేయి",
    "adminFarmers.allApplications": "అన్ని దరఖాస్తులు",
    "adminFarmers.approveVerification": "పరిశీలన ఆమోదించు",
    "adminUsers.allRoles": "అన్ని పాత్రలు",
    "adminPayments.viewOnChainAudit": "ఆన్-చైన్ బ్లాక్‌చైన్ ఆడిట్ చూడండి",
    "adminOrders.allOrders": "అన్ని ఆర్డర్లు",
    "adminProducts.allListings": "అన్ని జాబితాలు",
    "adminProducts.disableListing": "జాబితాను నిలిపివేయి",
    "adminProducts.enableListing": "జాబితాను సక్రియం చేయి"
  },
  kn: {
    "admin.users": "ಬಳಕೆದಾರರು",
    "admin.farmers": "ರೈತರು / FPOಗಳು",
    "admin.settlements": "ಇತ್ಯರ್ಥಗಳು",
    "admin.payments": "ಪಾವತಿಗಳು",
    "admin.blockchain": "ಬ್ಲಾಕ್‌ಚೈನ್ ಆಡಿಟ್",
    "admin.disputes": "ವಿವಾದಗಳು",
    "admin.analytics": "ವಿಶ್ಲೇಷಣೆಗಳು",
    "navigation.addProduct": "ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
    "common.agribazaarPlatformMetricsFarmerVerificationPipeline": "ಅಗ್ರಿಬಜಾರ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅಂಕಿಅಂಶಗಳು, ರೈತ ಪರಿಶೀಲನೆ ಮತ್ತು ವ್ಯಾಪಾರದ ಪ್ರಮಾಣ.",
    "common.recentPlatformOrders": "ఇటీవలి ప్లాట్‌ఫారమ్ ఆర్ಡర్‌ಗಳು",
    "common.verify": "ಖಾತರಿಪಡಿಸಿ",
    "common.reject": "తిరస్కరిసి",
    "common.cancel": "రద్దుమాడి",
    "adminFarmers.allApplications": "ఎల్లా అర్జిగళు",
    "adminFarmers.approveVerification": "పరిశీలనె అంగీకరిసి",
    "adminUsers.allRoles": "ఎల్లా పాత్రగళు",
    "adminPayments.viewOnChainAudit": "ఆన్-చైన్ బ್లాక్‌చైన్ ఆడిట్ నోడి",
    "adminOrders.allOrders": "ఎల్లా ఆర్డర్‌గళు",
    "adminProducts.allListings": "ఎల్లా పట్టికగళు",
    "adminProducts.disableListing": "పట్టికె నిష్క్రియగొళిసి",
    "adminProducts.enableListing": "పట్టికె సక్రియగొళిసి"
  },
  ml: {
    "admin.users": "ഉപയോക്താക്കള്‍",
    "admin.farmers": "കര്‍ഷകര്‍ / FPO കള്‍",
    "admin.settlements": "തീര്‍പ്പുകള്‍",
    "admin.payments": "പേയ്‌മെന്റുകള്‍",
    "admin.blockchain": "ബ്ലോക്ക്ചെയിന്‍ ഓഡിറ്റ്",
    "admin.disputes": "തര്‍ക്കങ്ങള്‍",
    "admin.analytics": "വിശകലനം",
    "navigation.addProduct": "ഉത്പന്നം ചേര്‍ക്കുക",
    "common.agribazaarPlatformMetricsFarmerVerificationPipeline": "അഗ്രിബസാര്‍ പ്ലാറ്റ്‌ഫോം കണക്കുകള്‍, കര്‍ഷക സ്ഥിരീകരണ പൈപ്പ്‌ലൈന്‍, വ്യാപാര അളവുകള്‍.",
    "common.recentPlatformOrders": "സമീപകാല പ്ലാറ്റ്‌ഫോം ഓര്‍ഡറുകള്‍",
    "common.verify": "സ്ഥിരീകരിക്കുക",
    "common.reject": "നിരസിക്കുക",
    "common.cancel": "റദ്ദാക്കുക",
    "adminFarmers.allApplications": "എല്ലാ അപേക്ഷകളും",
    "adminFarmers.approveVerification": "സ്ഥിരീകരണം അംഗീകരിക്കുക",
    "adminUsers.allRoles": "എല്ലാ ചുമതലകളും",
    "adminPayments.viewOnChainAudit": "ഓണ്‍-ചെയിന്‍ ബ്ലോക്ക്ചെയിന്‍ ഓഡിറ്റ് കാണുക",
    "adminOrders.allOrders": "എല്ലാ ഓര്‍ഡറുകളും",
    "adminProducts.allListings": "എല്ലാ ലിസ്റ്റിംഗുകളും",
    "adminProducts.disableListing": "ലിസ്റ്റിംഗ് പ്രവര്‍ത്തനരഹിതമാക്കുക",
    "adminProducts.enableListing": "ലിസ്റ്റിംഗ് സജീവമാക്കുക"
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

for (const [lang, dict] of Object.entries(adminTranslations)) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const [keyPath, val] of Object.entries(dict)) {
      setDeepValue(data, keyPath, val);
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}/translation.json with admin translations.`);
  }
}
