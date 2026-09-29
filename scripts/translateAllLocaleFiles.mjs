import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Volume D/projects/temp/agri/frontend/src/i18n/locales';

const en = JSON.parse(fs.readFileSync(path.join(localesDir, 'en', 'translation.json'), 'utf8'));

// Exact translations dictionary for Tamil, Hindi, Telugu, Kannada, Malayalam
const translations = {
  ta: {
    // farmerDashboard
    "farmerDashboard.manageYourAgriculturalProductsIncomingOrders": "உங்கள் விவசாயப் பொருட்கள், வரவிருக்கும் ஆர்டர்கள் மற்றும் வருவாயை நிர்வகிக்கவும்.",
    "farmerDashboard.recentOrders": "சமீபத்திய ஆர்டர்கள்",
    "farmerDashboard.noOrdersReceivedYet": "இன்னும் ஆர்டர்கள் எதுவும் பெறப்படவில்லை.",
    "farmerDashboard.activeListings": "செயலில் உள்ள பட்டியல்கள்",
    "farmerDashboard.noActiveListings": "செயலில் உள்ள பட்டியல்கள் எதுவும் இல்லை.",
    "farmerDashboard.viewAll": "அனைத்தையும் காண்க →",
    "farmerDashboard.addProductButton": "+ தயாரிப்பு சேர்",

    // farmerProducts
    "farmerProducts.cropInventory": "பயிர் இருப்பு",
    "farmerProducts.myProducts": "எனது பொருட்கள்",
    "farmerProducts.manageListingsDesc": "உங்கள் செயலில் உள்ள, வரைவு மற்றும் கையிருப்பில் இல்லாத விளைபொருள் பட்டியல்களை நிர்வகிக்கவும் (மொத்தம் {{count}}).",
    "farmerProducts.addNewProduct": "புதிய தயாரிப்பு சேர்",
    "farmerProducts.searchPlaceholder": "பயிர் பட்டியல்களைத் தேடுங்கள்...",
    "farmerProducts.colProduct": "தயாரிப்பு",
    "farmerProducts.colCategory": "பயிர் வகை",
    "farmerProducts.colAvailableStock": "இருப்பு அளவு",
    "farmerProducts.colPriceUnit": "விலை / அலகு",
    "farmerProducts.colStatus": "நிலை",
    "farmerProducts.colActions": "செயல்கள்",
    "farmerProducts.pauseBtn": "நிறுத்து",
    "farmerProducts.activateBtn": "செயல்படுத்து",

    // addProduct
    "farmerAddProduct.newCropListing": "புதிய பயிர் பட்டியல்",
    "farmerAddProduct.addNewProduct": "புதிய தயாரிப்பு சேர்",
    "farmerAddProduct.createVerifiedListingDesc": "வாங்குபவர்களுக்கு நேரடியாக விற்பனை செய்ய சரிபார்க்கப்பட்ட விளைபொருள் பட்டியலை உருவாக்கவும்.",
    "farmerAddProduct.productCropName": "தயாரிப்பு / பயிர் பெயர்",
    "farmerAddProduct.cropCategory": "பயிர் வகை",
    "farmerAddProduct.measurementUnit": "அளவீட்டு அலகு",
    "farmerAddProduct.unitPriceInr": "அலகு விலை (₹)",
    "farmerAddProduct.availableStockQuantity": "கிடைக்கும் இருப்பு அளவு",
    "farmerAddProduct.minimumOrderQuantity": "குறைந்தபட்ச ஆர்டர் அளவு",
    "farmerAddProduct.harvestDate": "அறுவடை தேதி",
    "farmerAddProduct.farmLocationOrigin": "பண்ணை இருப்பிடம் / தோற்றம்",
    "farmerAddProduct.cropDescription": "பயிர் விளக்கம் & தரம்",
    "farmerAddProduct.organicCertified": "இயற்கை / சான்றளிக்கப்பட்ட விளைபொருள்",
    "farmerAddProduct.cancel": "ரத்துசெய்",
    "farmerAddProduct.publishListing": "பட்டியலை வெளியிடு",

    // farmerOrders
    "farmerOrders.orderManagement": "ஆர்டர் நிர்வாகம்",
    "farmerOrders.incomingProduceOrders": "வரவிருக்கும் விளைபொருள் ஆர்டர்கள்",
    "farmerOrders.fulfillPurchaseOrdersReceivedFromRetail": "சில்லறை மற்றும் மொத்த வாங்குபவர்களிடமிருந்து பெறப்பட்ட கொள்முதல் ஆர்டர்களை நிறைவேற்றுங்கள்.",
    "farmerOrders.colProduceItems": "விளைபொருள் பொருட்கள்",
    "farmerOrders.colBuyerInfo": "வாங்குபவர் தகவல்",
    "farmerOrders.colQuantity": "அளவு",
    "farmerOrders.colTotalValue": "மொத்த மதிப்பு",
    "farmerOrders.colOrderStatus": "ஆர்டர் நிலை",
    "farmerOrders.colAuditProvenance": "தணிக்கை மூலம்",
    "farmerOrders.colActions": "செயல்கள்",

    // farmerProfile
    "farmerProfile.sellerProfileCredentials": "விற்பனையாளர் சுயவிவரம் & சான்றுகள்",
    "farmerProfile.manageYourAgriculturalCredentials": "உங்கள் விவசாய சான்றுகள், பண்ணை இருப்பிடம் மற்றும் தொடர்புத் தகவலை நிர்வகிக்கவும்.",

    // farmerVerification
    "farmerVerification.verificationStatusHeading": "சரிபார்ப்பு நிலை & சான்றுகள்",
    "farmerVerification.centralDashboardAgri": "உங்கள் விவசாய சான்றுகள், முன்னேற்றம் மற்றும் அதிகாரப்பூர்வ நிலையைப் பார்ப்பதற்கான மத்திய டாஷ்போர்டு.",
    "farmerVerification.centralDashboardOrg": "உங்கள் நிறுவன சான்றுகள், முன்னேற்றம் மற்றும் அதிகாரப்பூர்வ நிலையைப் பார்ப்பதற்கான மத்திய டாஷ்போர்டு.",
    "farmerVerification.overallProgress": "ஒட்டுமொத்த முன்னேற்றம்",
    "farmerVerification.verifiedStat": "{{count}} சரிபார்க்கப்பட்டது",
    "farmerVerification.skippedStat": "{{count}} தவிர்க்கப்பட்டது",
    "farmerVerification.pendingStat": "{{count}} தேவைப்படும் நிலுவை",
    "farmerVerification.congratulationsVerifiedMsg": "வாழ்த்துகள்! தேவையான அனைத்து அடையாளம் மற்றும் நிறுவன சான்றுகளும் முழுமையாக சரிபார்க்கப்பட்டுள்ளன. உங்கள் விளைபொருள் பட்டியல்களில் இப்போது அதிகாரப்பூர்வ சரிபார்க்கப்பட்ட பேட்ஜ் காட்டப்படுகிறது.",
    "farmerVerification.loadingVerificationDashboard": "சரிபார்ப்பு டாஷ்போர்டு ஏற்றப்படுகிறது...",
    "farmerVerification.all5RequiredChecksActive": "தேவையான 5 சரிபார்ப்புகளும் செயலில் உள்ளன",
    "farmerVerification.verificationChecksBreakdown": "சரிபார்ப்பு சோதனைகளின் விவரம்",
    "farmerVerification.requiredCheck": "தேவையான சோதனை",
    "farmerVerification.optionalCheck": "விருப்ப சோதனை",
    "farmerVerification.statusActive": "நிலை: செயலில்",
    "farmerVerification.statusNotApplicable": "நிலை: பொருந்தாது",
    "farmerVerification.statusSkipped": "நிலை: தவிர்க்கப்பட்டது",
    "farmerVerification.statusNotStarted": "நிலை: தொடங்கப்படவில்லை",
    "farmerVerification.viewEdit": "பார் / திருத்து",
    "farmerVerification.completeInWizard": "விசாரணையில் பூர்த்தி செய்",
    "farmerVerification.reviewUpdateCredentials": "சான்றுகளை மறுஆய்வு செய் / புதுப்பி",

    // status
    "status.all": "அனைத்து நிலைகளும்",
    "status.active": "செயலில்",
    "status.draft": "வரைவு",
    "status.inactive": "செயலற்றது",
    "status.outOfStock": "கையிருப்பில் இல்லை",
    "status.created": "உருவாக்கப்பட்டது",
    "status.confirmed": "உறுதிப்படுத்தப்பட்டது",
    "status.dispatched": "அனுப்பப்பட்டது",
    "status.delivered": "வழங்கப்பட்டது",
    "status.cancelled": "ரத்து செய்யப்பட்டது",
    "status.pendingPayment": "பணம் செலுத்த நிலுவையில் உள்ளது",

    // categories
    "categories.vegetables": "காய்கறிகள்",
    "categories.fruits": "பழங்கள்",
    "categories.grains": "தானியங்கள் & அரிசி",
    "categories.pulses": "பருப்பு வகைகள்",
    "categories.spices": "நறுமணப் பொருட்கள்",
    "categories.millets": "சிறுதானியங்கள்",
    "categories.dairy": "பால் பொருட்கள்",
    "categories.other": "இதர பயிர்கள்"
  },
  hi: {
    // farmerDashboard
    "farmerDashboard.manageYourAgriculturalProductsIncomingOrders": "अपने कृषि उत्पादों, आने वाले ऑर्डर और राजस्व का प्रबंधन करें।",
    "farmerDashboard.recentOrders": "हाल के ऑर्डर",
    "farmerDashboard.noOrdersReceivedYet": "अभी तक कोई ऑर्डर प्राप्त नहीं हुआ है।",
    "farmerDashboard.activeListings": "सक्रिय लिस्टिंग",
    "farmerDashboard.noActiveListings": "कोई सक्रिय लिस्टिंग नहीं है।",
    "farmerDashboard.viewAll": "सभी देखें →",
    "farmerDashboard.addProductButton": "+ उत्पाद जोड़ें",

    // farmerProducts
    "farmerProducts.cropInventory": "फसल सूची",
    "farmerProducts.myProducts": "मेरे उत्पाद",
    "farmerProducts.manageListingsDesc": "अपनी सक्रिय, ड्राफ्ट और आउट ऑफ स्टॉक उपज लिस्टिंग प्रबंधित करें (कुल {{count}})।",
    "farmerProducts.addNewProduct": "नया उत्पाद जोड़ें",
    "farmerProducts.searchPlaceholder": "फसल लिस्टिंग खोजें...",
    "farmerProducts.colProduct": "उत्पाद",
    "farmerProducts.colCategory": "फसल श्रेणी",
    "farmerProducts.colAvailableStock": "उपलब्ध स्टॉक",
    "farmerProducts.colPriceUnit": "मूल्य / इकाई",
    "farmerProducts.colStatus": "स्थिति",
    "farmerProducts.colActions": "कार्रवाइयां",
    "farmerProducts.pauseBtn": "रोकें",
    "farmerProducts.activateBtn": "सक्रिय करें",

    // addProduct
    "farmerAddProduct.newCropListing": "नई फसल लिस्टिंग",
    "farmerAddProduct.addNewProduct": "नया उत्पाद जोड़ें",
    "farmerAddProduct.createVerifiedListingDesc": "खरीदारों को सीधे बेचने के लिए सत्यापित उपज लिस्टिंग बनाएं।",
    "farmerAddProduct.productCropName": "उत्पाद / फसल का नाम",
    "farmerAddProduct.cropCategory": "फसल श्रेणी",
    "farmerAddProduct.measurementUnit": "माप इकाई",
    "farmerAddProduct.unitPriceInr": "इकाई मूल्य (₹)",
    "farmerAddProduct.availableStockQuantity": "उपलब्ध स्टॉक मात्रा",
    "farmerAddProduct.minimumOrderQuantity": "न्यूनतम ऑर्डर मात्रा",
    "farmerAddProduct.harvestDate": "कटाई की तारीख",
    "farmerAddProduct.farmLocationOrigin": "खेत का स्थान / उत्पत्ति",
    "farmerAddProduct.cropDescription": "फसल विवरण और गुणवत्ता",
    "farmerAddProduct.organicCertified": "जैविक / प्रमाणित उपज",
    "farmerAddProduct.cancel": "रद्द करें",
    "farmerAddProduct.publishListing": "लिस्टिंग प्रकाशित करें",

    // farmerOrders
    "farmerOrders.orderManagement": "ऑर्डर प्रबंधन",
    "farmerOrders.incomingProduceOrders": "आने वाले उपज ऑर्डर",
    "farmerOrders.fulfillPurchaseOrdersReceivedFromRetail": "खुदरा और थोक खरीदारों से प्राप्त खरीद आदेशों को पूरा करें।",
    "farmerOrders.colProduceItems": "उपज वस्तुएं",
    "farmerOrders.colBuyerInfo": "खरीदार की जानकारी",
    "farmerOrders.colQuantity": "मात्रा",
    "farmerOrders.colTotalValue": "कुल मूल्य",
    "farmerOrders.colOrderStatus": "ऑर्डर स्थिति",
    "farmerOrders.colAuditProvenance": "ऑडिट उत्पत्ति",
    "farmerOrders.colActions": "कार्रवाइयां",

    // farmerProfile
    "farmerProfile.sellerProfileCredentials": "विक्रेता प्रोफ़ाइल और साख",
    "farmerProfile.manageYourAgriculturalCredentials": "अपनी कृषि साख, खेत के स्थान और संपर्क जानकारी का प्रबंधन करें।",

    // farmerVerification
    "farmerVerification.verificationStatusHeading": "सत्यापन स्थिति और साख",
    "farmerVerification.centralDashboardAgri": "अपनी कृषि साख, प्रगति और आधिकारिक स्थिति देखने के लिए केंद्रीय डैशबोर्ड।",
    "farmerVerification.centralDashboardOrg": "अपनी संगठन साख, प्रगति और आधिकारिक स्थिति देखने के लिए केंद्रीय डैशबोर्ड।",
    "farmerVerification.overallProgress": "समग्र प्रगति",
    "farmerVerification.verifiedStat": "{{count}} सत्यापित",
    "farmerVerification.skippedStat": "{{count}} छोड़ा गया",
    "farmerVerification.pendingStat": "{{count}} आवश्यक लंबित",
    "farmerVerification.congratulationsVerifiedMsg": "बधाई हो! सभी आवश्यक पहचान और संगठन साख पूरी तरह से सत्यापित हैं। आपकी उपज लिस्टिंग अब आधिकारिक सत्यापित बैज दिखाती है।",
    "farmerVerification.loadingVerificationDashboard": "सत्यापन डैशबोर्ड लोड हो रहा है...",
    "farmerVerification.all5RequiredChecksActive": "सभी 5 आवश्यक जांच सक्रिय हैं",
    "farmerVerification.verificationChecksBreakdown": "सत्यापन जांच का विवरण",
    "farmerVerification.requiredCheck": "आवश्यक जांच",
    "farmerVerification.optionalCheck": "वैकल्पिक जांच",
    "farmerVerification.statusActive": "स्थिति: सक्रिय",
    "farmerVerification.statusNotApplicable": "स्थिति: लागू नहीं",
    "farmerVerification.statusSkipped": "स्थिति: छोड़ा गया",
    "farmerVerification.statusNotStarted": "स्थिति: शुरू नहीं हुआ",
    "farmerVerification.viewEdit": "देखें / संपादित करें",
    "farmerVerification.completeInWizard": "विज़ार्ड में पूरा करें",
    "farmerVerification.reviewUpdateCredentials": "साख की समीक्षा / अद्यतन करें",

    // status
    "status.all": "सभी स्थितियां",
    "status.active": "सक्रिय",
    "status.draft": "ड्राफ्ट",
    "status.inactive": "निष्क्रिय",
    "status.outOfStock": "स्टॉक में नहीं",
    "status.created": "निर्मित",
    "status.confirmed": "पुष्ट",
    "status.dispatched": "भेजा गया",
    "status.delivered": "वितरित",
    "status.cancelled": "रद्द",
    "status.pendingPayment": "भुगतान लंबित",

    // categories
    "categories.vegetables": "सब्जियां",
    "categories.fruits": "फल",
    "categories.grains": "अनाज और चावल",
    "categories.pulses": "दालें",
    "categories.spices": "मसाले",
    "categories.millets": "बाजरा / मोटा अनाज",
    "categories.dairy": "डेयरी उत्पाद",
    "categories.other": "अन्य फसलें"
  },
  te: {
    // farmerDashboard
    "farmerDashboard.manageYourAgriculturalProductsIncomingOrders": "మీ వ్యవసాయ ఉత్పత్తులు, آنے والے ఆపరేషన్లు మరియు రాబడిని నిర్వహించండి.",
    "farmerDashboard.recentOrders": "ఇటీవలి ఆర్డర్లు",
    "farmerDashboard.noOrdersReceivedYet": "ఇంకా ఎలాంటి ఆర్డర్లు రాలేదు.",
    "farmerDashboard.activeListings": "సక్రియ జాబితాలు",
    "farmerDashboard.noActiveListings": "సక్రియ జాబితాలు లేవు.",
    "farmerDashboard.viewAll": "అన్నీ చూడండి →",
    "farmerDashboard.addProductButton": "+ ఉత్పత్తిని జోడించండి",

    // farmerProducts
    "farmerProducts.cropInventory": "పంట నిల్వలు",
    "farmerProducts.myProducts": "నా ఉత్పత్తులు",
    "farmerProducts.manageListingsDesc": "మీ సక్రియ, ముసాయిదా మరియు స్టాక్ లేని పంట జాబితాలను నిర్వహించండి (మొత్తం {{count}}).",
    "farmerProducts.addNewProduct": "కొత్త ఉత్పత్తిని జోడించండి",
    "farmerProducts.searchPlaceholder": "పంట జాబితాలను శోధించండి...",
    "farmerProducts.colProduct": "ఉత్పత్తి",
    "farmerProducts.colCategory": "పంట వర్గం",
    "farmerProducts.colAvailableStock": "లభ్యత నిల్వ",
    "farmerProducts.colPriceUnit": "ధర / యూనిట్",
    "farmerProducts.colStatus": "స్థితి",
    "farmerProducts.colActions": "చర్యలు",
    "farmerProducts.pauseBtn": "నిలిపివేయి",
    "farmerProducts.activateBtn": "సక్రియం చేయి",

    // farmerVerification
    "farmerVerification.verificationStatusHeading": "పరిశీలన స్థితి & వివరాలు",
    "farmerVerification.centralDashboardAgri": "మీ వ్యవసాయ వివరాలు, ప్రగతి మరియు అధికారిక స్థితిని చూడటానికి కేంద్రీయ డాష్‌బోర్డ్.",
    "farmerVerification.centralDashboardOrg": "మీ సంస్థ వివరాలు, ప్రగతి మరియు అధికారిక స్థితిని చూడటానికి కేంద్రీయ డాష్‌బోర్డ్.",
    "farmerVerification.overallProgress": "మొత్తం ప్రగతి",
    "farmerVerification.verifiedStat": "{{count}} పరిశీలించబడింది",
    "farmerVerification.skippedStat": "{{count}} దాటవేయబడింది",
    "farmerVerification.pendingStat": "{{count}} అవసరమైనవి పెండింగ్‌లో ఉన్నాయి",
    "farmerVerification.congratulationsVerifiedMsg": "అభినందనలు! అవసరమైన అన్ని గురింపు మరియు సంస్థ ఆధారాలు పూర్తిగా పరిశీలించబడ్డాయి. మీ పంట ఉత్పత్తులకు ఇప్పుడు అధికారిక వెరిఫైడ్ బ్యాడ్జ్ ప్రదర్శించబడుతుంది.",
    "farmerVerification.loadingVerificationDashboard": "పరిశీలన డాష్‌బోర్డ్ లోడ్ అవుతోంది...",
    "farmerVerification.all5RequiredChecksActive": "అన్ని 5 అవసరమైన పరిశీలనలు సక్రియంగా ఉన్నాయి",
    "farmerVerification.verificationChecksBreakdown": "పరిశీలనల వివరాలు",

    // categories
    "categories.vegetables": "కూరగాయలు",
    "categories.fruits": "పండ్లు",
    "categories.grains": "ధాన్యాలు & బియ్యం",
    "categories.pulses": "పప్పుధాన్యాలు",
    "categories.spices": "మసాలా దినుసులు",
    "categories.millets": "చిరుధాన్యాలు",
    "categories.dairy": "పాలు & పాల ఉత్పత్తులు",
    "categories.other": "ఇతర పంటలు"
  },
  kn: {
    // farmerDashboard
    "farmerDashboard.manageYourAgriculturalProductsIncomingOrders": "నిమ్మ ಕೃಷಿ ಉತ್ಪನ್ನಗಳು, రాబోయే ఆదేశాలు మరియు రాబడిని నిర్పహించండి.",
    "farmerDashboard.recentOrders": "ఇటీవలి ఆర్డర్‌లు",
    "farmerDashboard.noOrdersReceivedYet": "ఇనూ యావుదే ఆర్డర్‌గళు స్వీకరిసలాగిల్ల.",
    "farmerDashboard.activeListings": "సక్రియ పట్టికలు",
    "farmerDashboard.noActiveListings": "యావుదే సక్రియ పట్టికగళిల్ల.",
    "farmerDashboard.viewAll": "ఎల్లవన్ను నోడి →",
    "farmerDashboard.addProductButton": "+ ఉత్పన్న సేరిసి",

    // farmerProducts
    "farmerProducts.cropInventory": "బెళె కొఠార",
    "farmerProducts.myProducts": "నన్న ఉత్పన్నగళు",
    "farmerProducts.manageListingsDesc": "నిమ్మ సక్రియ, ముసౌదే మరియు స్టాక్ ఇల్లద బెళె పట్టికగళన్ను నిర్పహిసి (మొత్త {{count}}).",
    "farmerProducts.addNewProduct": "హొస ఉత్పన్న సేరిసి",
    "farmerProducts.searchPlaceholder": "బెళె పట్టికగళన్ను హుడుకి...",
    "farmerProducts.colProduct": "ఉత్పన్న",
    "farmerProducts.colCategory": "బెళె వర్గ",
    "farmerProducts.colAvailableStock": "లభ్యవిరువ స్టాక్",
    "farmerProducts.colPriceUnit": "బెలె / యూనిట్",
    "farmerProducts.colStatus": "స్థితి",
    "farmerProducts.colActions": "క్రియెగళు",

    // farmerVerification
    "farmerVerification.verificationStatusHeading": "పరిశీలనె స్థితి మరియు ఆధారగళు",
    "farmerVerification.centralDashboardAgri": "నిమ్మ కృషి వివరగళు, ప్రగతి మరియు అధీకృత స్థితియన్ను నోడలు కేంద్రీయ డాష్‌బోర్డ్.",
    "farmerVerification.centralDashboardOrg": "నిమ్మ సంస్థె వివరగళు, ప్రగతి మరియు అధీకృత స్థితియన్ను నోడలు కేంద్రీయ డాష్‌బోర్డ్.",
    "farmerVerification.overallProgress": "ఒట్టు ప్రగతి",
    "farmerVerification.verifiedStat": "{{count}} ఖాత్రిపడిసలాగిదే",
    "farmerVerification.skippedStat": "{{count}} బిడలాగిదే",
    "farmerVerification.pendingStat": "{{count}} అగత్య బాకియిరువవు",
    "farmerVerification.congratulationsVerifiedMsg": "అభినందనెగళు! ఎల్లా అగత్య గుర్తిసిద వివరగళు సంపూర్ణవాగి ఖాత్రిపడిసలాగిదే. నిమ్మ ఉత్పన్నగళిగే ఈగ అధీకృత బ్యాడ్జ్ తోరిసలాగుత్తిదే.",

    // categories
    "categories.vegetables": "తరికారిగళు",
    "categories.fruits": "హణ్ణుగళు",
    "categories.grains": "ధాన్యగళు మత్తు అక్కి",
    "categories.pulses": "బెళెగళు",
    "categories.spices": "మసాలె పదాథాగళు",
    "categories.millets": "సిరిధాన్యగళు",
    "categories.dairy": "హాలు ఉత్పన్నగళు",
    "categories.other": "ఇతర బెళెగళు"
  },
  ml: {
    // farmerDashboard
    "farmerDashboard.manageYourAgriculturalProductsIncomingOrders": "നിങ്ങളുടെ കാര്‍ഷിക ഉത്പന്നങ്ങള്‍, പുതിയ ഓര്‍ഡറുകള്‍, വരുമാനം എന്നിവ നിയന്ത്രിക്കുക.",
    "farmerDashboard.recentOrders": "സമീപകാല ഓര്‍ഡറുകള്‍",
    "farmerDashboard.noOrdersReceivedYet": "ഇതുവരെ ഓര്‍ഡറുകളൊന്നും ലഭിച്ചിട്ടില്ല.",
    "farmerDashboard.activeListings": "സജീവ ലിസ്റ്റിംഗുകള്‍",
    "farmerDashboard.noActiveListings": "സജീവ ലിസ്റ്റിംഗുകളൊന്നുമില്ല.",
    "farmerDashboard.viewAll": "എല്ലാം കാണുക →",
    "farmerDashboard.addProductButton": "+ ഉത്പന്നം ചേര്‍ക്കുക",

    // farmerProducts
    "farmerProducts.cropInventory": "വിള ശേഖരം",
    "farmerProducts.myProducts": "എന്റെ ഉത്പന്നങ്ങള്‍",
    "farmerProducts.manageListingsDesc": "നിങ്ങളുടെ സജീവമായതും ഡ്രാഫ്റ്റിലുള്ളതും സ്റ്റോക്കില്ലാത്തതുമായ ലിസ്റ്റിംഗുകള്‍ കൈകാര്യം ചെയ്യുക (ആകെ {{count}}).",
    "farmerProducts.addNewProduct": "പുതിയ ഉത്പന്നം ചേര്‍ക്കുക",
    "farmerProducts.searchPlaceholder": "വിള ലിസ്റ്റിംഗുകള്‍ തിരയുക...",
    "farmerProducts.colProduct": "ഉത്പന്നം",
    "farmerProducts.colCategory": "വിള വിഭാഗം",
    "farmerProducts.colAvailableStock": "ലഭ്യമായ സ്റ്റോക്ക്",
    "farmerProducts.colPriceUnit": "വില / യൂണിറ്റ്",
    "farmerProducts.colStatus": "സ്ഥിതി",
    "farmerProducts.colActions": "നടപടികള്‍",

    // farmerVerification
    "farmerVerification.verificationStatusHeading": "സ്ഥിരീകരണ നിലയും യോഗ്യതകളും",
    "farmerVerification.centralDashboardAgri": "നിങ്ങളുടെ കാര്‍ഷിക യോഗ്യതകളും പുരോഗതിയും ഔദ്യോഗിക നിലയും കാണാനുള്ള സെന്‍ട്രല്‍ ഡാഷ്‌ബോര്‍ഡ്.",
    "farmerVerification.centralDashboardOrg": "നിങ്ങളുടെ സ്ഥാപന യോഗ്യതകളും പുരോഗതിയും ഔദ്യോഗിക നിലയും കാണാനുള്ള സെന്‍ട്രല്‍ ഡാഷ്‌ബോര്‍ഡ്.",
    "farmerVerification.overallProgress": "ആകെ പുരോഗതി",
    "farmerVerification.verifiedStat": "{{count}} സ്ഥിരീകരിച്ചു",
    "farmerVerification.skippedStat": "{{count}} ഒഴിവാക്കി",
    "farmerVerification.pendingStat": "{{count}} ബാക്കിയുണ്ട്",
    "farmerVerification.congratulationsVerifiedMsg": "അഭിനന്ദനങ്ങള്‍! ആവശ്യമായ എല്ലാ തിരിച്ചറിയല്‍ വിവരങ്ങളും സ്ഥാപന യോഗ്യതകളും പൂര്‍ണ്ണമായി സ്ഥിരീകരിച്ചു. നിങ്ങളുടെ ഉത്പന്നങ്ങള്‍ക്ക് ഇനി ഔദ്യോഗിക വെരിഫൈഡ് ബാഡ്ജ് ലഭിക്കും.",

    // categories
    "categories.vegetables": "പച്ചക്കറികള്‍",
    "categories.fruits": "പഴങ്ങള്‍",
    "categories.grains": "ധാന്യങ്ങളും അരിയും",
    "categories.pulses": "പയറുവര്‍ഗ്ഗങ്ങള്‍",
    "categories.spices": "സുഗന്ധവ്യഞ്ജനങ്ങള്‍",
    "categories.millets": "ചെറുധാന്യങ്ങള്‍",
    "categories.dairy": "പാല്‍ ഉത്പന്നങ്ങള്‍",
    "categories.other": "മറ്റ് വിളകള്‍"
  }
};

// Generic translator fallback for nested keys if not explicitly defined above
function setDeepValue(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!curr[parts[i]]) curr[parts[i]] = {};
    curr = curr[parts[i]];
  }
  curr[parts[parts.length - 1]] = value;
}

function getDeepValue(obj, keyPath) {
  const parts = keyPath.split('.');
  let curr = obj;
  for (let i = 0; i < parts.length; i++) {
    if (curr && typeof curr === 'object' && parts[i] in curr) {
      curr = curr[parts[i]];
    } else {
      return undefined;
    }
  }
  return curr;
}

const targetLangs = ['ta', 'hi', 'te', 'kn', 'ml'];

targetLangs.forEach(lang => {
  const file = path.join(localesDir, lang, 'translation.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let updatedCount = 0;

  // Apply predefined translations
  const langDict = translations[lang] || {};
  for (const [keyPath, val] of Object.entries(langDict)) {
    setDeepValue(data, keyPath, val);
    updatedCount++;
  }

  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${lang}/translation.json with ${updatedCount} keys.`);
});

console.log('Locale translations updated successfully.');
