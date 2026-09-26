import fs from 'fs';
import path from 'path';

const localesDir = 'c:/Volume D/projects/temp/agri/frontend/src/i18n/locales';

const masterDict = {
  ta: {
    // admin & common
    "common.executiveControls": "நிர்வாகக் கட்டுப்பாடுகள்",
    "common.adminDashboard": "நிர்வாகி டாஷ்போர்டு",
    "common.noOrderVolumeDataYet": "இன்னும் ஆர்டர் அளவு தரவு இல்லை",
    "common.noCategoryDistributionDataYet": "இன்னும் பயிர் வகை தரவு இல்லை",
    "common.conflictOversight": "சிக்கல் மேலாண்மை",
    "common.disputeResolution": "புகார் தீர்வாக்கம்",
    "common.arbitrateBuyerAndFarmerClaimsQuality": "வாங்குபவர் மற்றும் விவசாயி புகார்கள், தரம் மற்றும் கட்டணப் பிடிகளைத் தீர்க்கவும்.",
    "common.resolveDispute": "புகாரைத் தீர்",
    "common.kycVerificationPipeline": "KYC சரிபார்ப்பு வரிசை",
    "common.reviewFarmRegistrationsVerifyIdentityAnd": "பண்ணைப் பதிவுகளை மதிப்பாய்வு செய்து, அடையாளத்தைச் சரிபார்த்து, விற்பனையாளர் உரிமைகளை வழங்கவும்.",
    "common.platformFulfillment": "தள நிறைவேற்றம்",
    "common.allPlatformOrders": "தளத்தின் அனைத்து ஆர்டர்களும்",
    "common.fullOversightOfOrdersFulfillmentStatuses": "ஆர்டர்கள், நிறைவேற்ற நிலைகள் மற்றும் பரிவர்த்தனைகளின் முழு மேற்பார்வை.",
    "common.financialAudit": "நிதித் தணிக்கை",
    "common.paymentAuditLogs": "கட்டணத் தணிக்கைப் பதிவுகள்",
    "common.auditPlatformTransactionSettlementsAndGateway": "தளப் பரிவர்த்தனைத் தீர்வுகள் மற்றும் நுழைவாயில் நிலைப் பதிவுகளைத் தணிக்கை செய்யவும்.",
    "common.catalogModeration": "பட்டியல் மேலாண்மை",
    "common.productModeration": "தயாரிப்பு மேலாண்மை",
    "common.reviewActiveDraftAndPausedCrop": "விவசாயிகளால் வெளியிடப்பட்ட செயலில் உள்ள, வரைவு மற்றும் இடைநிறுத்தப்பட்ட பயிர் பட்டியல்களை மதிப்பாய்வு செய்யவும்.",

    // admin specific
    "admin.userDirectory": "பயனாளர் கோப்பகம்",
    "admin.platformUserManagement": "தளப் பயனாளர் நிர்வாகம்",
    "admin.viewUserRolesAccessStatusesAnd": "பயனாளர் பாத்திரங்கள், அணுகல் நிலைகளைப் பார்த்து கணக்குகளைச் செயல்படுத்தவும் அல்லது இடைநிறுத்தவும்.",
    "admin.users": "பயனாளர்கள்",
    "admin.farmers": "விவசாயிகள் / FPOக்கள்",
    "admin.settlements": "பணத் தீர்வுகள்",
    "admin.payments": "பணம் செலுத்துதல்கள்",
    "admin.blockchain": "பிளாக்செயின் தணிக்கை",
    "admin.disputes": "சிக்கல்கள் / புகார்கள்",
    "admin.analytics": "பகுப்பாய்வு",

    // adminUsers table column headers
    "adminUsers.colUserName": "பயனாளர் பெயர்",
    "adminUsers.colEmail": "மின்னஞ்சல் முகவரி",
    "adminUsers.colAccountHash": "ஆன்-செயின் கணக்கு ஹேஷ்",
    "adminUsers.colAccountRole": "கணக்கு பங்கு",
    "adminUsers.colAccountStatus": "கணக்கு நிலை",
    "adminUsers.colActions": "செயல்கள்",
    "adminUsers.suspendAccount": "கணக்கை இடைநீக்கம் செய்",
    "adminUsers.activateAccount": "கணக்கைச் செயல்படுத்து",

    // settings page
    "settings.title": "கணக்கு அமைப்புகள்",
    "settings.description": "உங்கள் கணினி விருப்பத்தேர்வுகள், பாதுகாப்பு மற்றும் அறிவிப்பு சேனல்களை நிர்வகிக்கவும்.",
    "settings.notificationPreferences": "அறிவிப்பு விருப்பத்தேர்வுகள்",
    "settings.notificationDescription": "ஆர்டர்கள் மற்றும் இருப்பு மாற்றங்களை AgriBazaar எவ்வாறு அறிவிக்க வேண்டும் என்பதை அமைக்கவும்.",
    "settings.emailOrders": "மின்னஞ்சல் ஆர்டர் அறிவிப்புகள்",
    "settings.emailOrdersDescription": "புதிய ஆர்டர்கள் மற்றும் நிலை மாற்றங்களுக்கு மின்னஞ்சல் பெறவும்.",
    "settings.sms": "SMS அறிவிப்புகள்",
    "settings.smsDescription": "அனுப்பல் மற்றும் விநியோகத்தில் உடனடி SMS விழிப்பூட்டல்களைப் பெறவும்.",
    "settings.marketPriceTrendAlerts": "சந்தை விலை போக்கு அறிவிப்புகள்",
    "settings.marketPriceTrendAlertsDescription": "முக்கிய விவசாய சந்தை விலை மாற்றங்களின் தினசரி சுருக்கம்.",
    "settings.securityAndAccess": "பாதுகாப்பு & அணுகல்",
    "settings.securityAndAccessDescription": "கூடுதல் பாதுகாப்பு அடுக்குகளுடன் உங்கள் கணக்கைப் பாதுகாக்கவும்.",
    "settings.agribazaarPlatform": "AGRIBAZAAR தளம்",
    "settings.needHelpDescription": "உங்கள் KYC விவரங்கள் அல்லது விவசாயி சரிபார்ப்பைப் புதுப்பிப்பதில் உதவி தேவைப்பட்டால், தள நிர்வாகத்தைத் தொடர்பு கொள்ளவும்."
  },
  hi: {
    // admin & common
    "common.executiveControls": "कार्यकारी नियंत्रण",
    "common.adminDashboard": "एडमिन डैशबोर्ड",
    "common.noOrderVolumeDataYet": "अभी तक कोई ऑर्डर मात्रा डेटा नहीं है",
    "common.noCategoryDistributionDataYet": "अभी तक कोई श्रेणी वितरण डेटा नहीं है",
    "common.conflictOversight": "विवाद देखरेख",
    "common.disputeResolution": "विवाद निवारण",
    "common.arbitrateBuyerAndFarmerClaimsQuality": "खरीदार और किसान के दावों, गुणवत्ता के मुद्दों या भुगतान रोक को हल करें।",
    "common.resolveDispute": "विवाद हल करें",
    "common.kycVerificationPipeline": "केवाईसी सत्यापन पाइपलाइन",
    "common.reviewFarmRegistrationsVerifyIdentityAnd": "खेत पंजीकरण की समीक्षा करें, पहचान सत्यापित करें और सक्रिय विक्रेता अधिकार प्रदान करें।",
    "common.platformFulfillment": "प्लेटफ़ॉर्म पूर्ति",
    "common.allPlatformOrders": "सभी प्लेटफ़ॉर्म ऑर्डर",
    "common.fullOversightOfOrdersFulfillmentStatuses": "ऑर्डर, पूर्ति स्थितियों और लेनदेन की पूरी देखरेख।",
    "common.financialAudit": "वित्तीय ऑडिट",
    "common.paymentAuditLogs": "भुगतान ऑडिट लॉग",
    "common.auditPlatformTransactionSettlementsAndGateway": "प्लेटफ़ॉर्म लेनदेन निपटान और गेटवे स्थिति लॉग का ऑडिट करें।",
    "common.catalogModeration": "कैटलॉग मॉडरेशन",
    "common.productModeration": "उत्पाद मॉडरेशन",
    "common.reviewActiveDraftAndPausedCrop": "किसानों द्वारा प्रकाशित सक्रिय, ड्राफ्ट और रुके हुए फसल लिस्टिंग की समीक्षा करें।",

    // admin specific
    "admin.userDirectory": "उपयोगकर्ता निर्देशिका",
    "admin.platformUserManagement": "प्लेटफ़ॉर्म उपयोगकर्ता प्रबंधन",
    "admin.viewUserRolesAccessStatusesAnd": "उपयोगकर्ता भूमिकाएं, पहुंच स्थितियां देखें और खातों को सक्रिय या निलंबित करें।",
    "admin.users": "उपयोगकर्ता",
    "admin.farmers": "किसान / एफपीओ",
    "admin.settlements": "भुगतान निपटान",
    "admin.payments": "भुगतान",
    "admin.blockchain": "ब्लॉकचेन ऑडिट",
    "admin.disputes": "विवाद समाधान",
    "admin.analytics": "विश्लेषण",

    // adminUsers table column headers
    "adminUsers.colUserName": "उपयोगकर्ता का नाम",
    "adminUsers.colEmail": "ईमेल पता",
    "adminUsers.colAccountHash": "ऑन-चेन खाता हैश",
    "adminUsers.colAccountRole": "खाता भूमिका",
    "adminUsers.colAccountStatus": "खाता स्थिति",
    "adminUsers.colActions": "कार्रवाइयां",
    "adminUsers.suspendAccount": "खाता निलंबित करें",
    "adminUsers.activateAccount": "खाता सक्रिय करें",

    // settings page
    "settings.title": "खाता सेटिंग्स",
    "settings.description": "अपनी सिस्टम प्राथमिकताओं, सुरक्षा और अधिसूचना चैनलों का प्रबंधन करें।",
    "settings.notificationPreferences": "अधिसूचना प्राथमिकताएं",
    "settings.notificationDescription": "कॉन्फ़िगर करें कि एग्रीबाज़ार आपको ऑर्डर और स्टॉक अपडेट की सूचना कैसे देता है।",
    "settings.emailOrders": "ईमेल ऑर्डर सूचनाएं",
    "settings.emailOrdersDescription": "नए ऑर्डर और स्थिति अपडेट के लिए ईमेल प्राप्त करें।",
    "settings.sms": "एसएमएस सूचनाएं",
    "settings.smsDescription": "डिस्पैच और डिलीवरी पर त्वरित एसएमएस अलर्ट प्राप्त करें।",
    "settings.marketPriceTrendAlerts": "बाजार मूल्य प्रवृत्ति अलर्ट",
    "settings.marketPriceTrendAlertsDescription": "शीर्ष कृषि बाजार मूल्य में बदलाव का दैनिक सारांश।",
    "settings.securityAndAccess": "सुरक्षा और पहुंच",
    "settings.securityAndAccessDescription": "अतिरिक्त सुरक्षा परतों के साथ अपने खाते की रक्षा करें।",
    "settings.agribazaarPlatform": "एग्रीबाज़ार प्लेटफॉर्म",
    "settings.needHelpDescription": "यदि आपको अपने केवाईसी विवरण या किसान सत्यापन को अद्यतन करने में सहायता की आवश्यकता है, तो प्लेटफ़ॉर्म प्रशासन से संपर्क करें।"
  },
  te: {
    "common.executiveControls": "ఎగ్జిక్యూటివ్ నియంత్రణలు",
    "common.adminDashboard": "అడ్మిన్ డాష్‌బోర్డ్",
    "common.noOrderVolumeDataYet": "ఇంకా ఆర్డర్ పరిమాణ డేటా లేదు",
    "common.noCategoryDistributionDataYet": "ఇంకా వర్గం పంపిణీ డేటా లేదు",
    "common.conflictOversight": "వివాదాల పర్యవేక్షణ",
    "common.disputeResolution": "వివాదాల పరిష్కారం",
    "common.arbitrateBuyerAndFarmerClaimsQuality": "కొనుగోలుదారు మరియు రైతు దావాలు, నాణ్యత సమస్యలను పరిష్కరించండి.",
    "common.resolveDispute": "వివాదాన్ని పరిష్కరించు",
    "common.kycVerificationPipeline": "KYC పరిశీలన పైప్‌లైన్",
    "common.reviewFarmRegistrationsVerifyIdentityAnd": "వ్యవసాయ నమోదులను సమీక్షించి, గుర్తింపును పరిశీలించండి.",
    "common.platformFulfillment": "ప్లాట్‌ఫారమ్ నెరవేర్పు",
    "common.allPlatformOrders": "అన్ని ప్లాట్‌ఫారమ్ ఆర్డర్లు",
    "common.fullOversightOfOrdersFulfillmentStatuses": "ఆర్డర్లు మరియు చెల్లింపుల పూర్తి పర్యవేక్షణ.",
    "common.financialAudit": "ఆర్థిక ఆడిట్",
    "common.paymentAuditLogs": "చెల్లింపు ఆడిట్ లాగ్‌లు",
    "common.auditPlatformTransactionSettlementsAndGateway": "లావాదేవీల పరిష్కారాలు మరియు గేట్‌వే లాగ్‌లను ఆడిట్ చేయండి.",
    "common.catalogModeration": "కేటలాగ్ నియంత్రణ",
    "common.productModeration": "ఉత్పత్తి నియంత్రణ",
    "common.reviewActiveDraftAndPausedCrop": "రైతులు ప్రచురించిన పంట జాబితాలను సమీక్షించండి.",

    "admin.userDirectory": "వినియోగదారు డైరెక్టరీ",
    "admin.platformUserManagement": "ప్లాట్‌ఫారమ్ వినియోగదారు నిర్వహణ",
    "admin.viewUserRolesAccessStatusesAnd": "వినియోగదారు పాత్రలు, ప్రాప్యత స్థితులను చూడండి మరియు ఖాతాలను నిర్వహించండి.",
    "admin.users": "వినియోగదారులు",
    "admin.farmers": "రైతులు / FPOలు",
    "admin.settlements": "పరిష్కారాలు",
    "admin.payments": "చెల్లింపులు",
    "admin.blockchain": "బ్లాక్‌చైన్ ఆడిట్",
    "admin.disputes": "వివాదాలు",
    "admin.analytics": "విశ్లేషణలు",

    "adminUsers.colUserName": "వినియోగదారు పేరు",
    "adminUsers.colEmail": "ఈమెయిల్ చిరునామా",
    "adminUsers.colAccountHash": "ఆన్-చైన్ ఖాతా హ్యాష్",
    "adminUsers.colAccountRole": "ఖాతా పాత్ర",
    "adminUsers.colAccountStatus": "ఖాతా స్థితి",
    "adminUsers.colActions": "చర్యలు",
    "adminUsers.suspendAccount": "ఖాతాను నిలిపివేయి",
    "adminUsers.activateAccount": "ఖాతాను సక్రియం చేయి",

    "settings.title": "ఖాతా అమరికలు",
    "settings.description": "మీ సిస్టమ్ ప్రాధాన్యతలు, భద్రత మరియు నోటిఫికేషన్ ఛానెల్‌లను నిర్వహించండి.",
    "settings.notificationPreferences": "నోటిఫికేషన్ ప్రాధాన్యతలు",
    "settings.notificationDescription": "ఆర్డర్లు మరియు స్టాక్ నవీకరణల గురించి నోటిఫికేషన్‌లను అమర్చండి.",
    "settings.emailOrders": "ఈమెయిల్ ఆర్డర్ నోటిఫికేషన్‌లు",
    "settings.emailOrdersDescription": "కొత్త ఆర్డర్‌లు మరియు స్థితి నవీకరణల కోసం ఈమెయిల్‌లను పొందండి.",
    "settings.sms": "SMS నోటిఫికేషన్‌లు",
    "settings.smsDescription": "తక్షణ SMS హెచ్చరికలను పొందండి.",
    "settings.marketPriceTrendAlerts": "మార్కెట్ ధరల ట్రెండ్ హెచ్చరికలు",
    "settings.marketPriceTrendAlertsDescription": "ప్రధాన వ్యవసాయ మార్కెట్ ధర మార్పుల రోజువారీ సారాంశం.",
    "settings.securityAndAccess": "భద్రత మరియు ప్రాప్యత",
    "settings.securityAndAccessDescription": "అదనపు భద్రతా పొరలతో మీ ఖాతాను రక్షించుకోండి.",
    "settings.agribazaarPlatform": "అగ్రిబజార్ ప్లాట్‌ఫారమ్",
    "settings.needHelpDescription": "మీ KYC వివరాలు లేదా రైతు పరిశీలనను నవీకరించడంలో సహాయం కావాలంటే ప్లాట్‌ఫారమ్ పరిపాలనను సంప్రదించండి."
  },
  kn: {
    "common.executiveControls": "ಕಾರ್ಯನಿರ್ವಾಹಕ ನಿಯಂತ್ರಣಗಳು",
    "common.adminDashboard": "ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    "common.noOrderVolumeDataYet": "ಇನ್ನೂ ಯಾವುದೇ ಆರ್ಡರ್ ಪ್ರಮಾಣದ ಡೇಟಾ ಇಲ್ಲ",
    "common.noCategoryDistributionDataYet": "ಇನ್ನೂ ಯಾವುದೇ ವರ್ಗ ವಿತರಣಾ ಡೇಟಾ ಇಲ್ಲ",
    "common.conflictOversight": "ಸಂಘರ್ಷ ಮೇಲ್ವಿಚಾರಣೆ",
    "common.disputeResolution": "ವಿವಾದ ಪರಿಹಾರ",
    "common.arbitrateBuyerAndFarmerClaimsQuality": "ಖರೀದಿದಾರ ಮತ್ತು ರೈತರ ಹಕ್ಕುಗಳು ಮತ್ತು ಗುಣಮಟ್ಟದ ಸಮಸ್ಯೆಗಳನ್ನು ಪರಿಹರಿಸಿ.",
    "common.resolveDispute": "ವಿವಾದ ಪರಿಹರಿಸಿ",
    "common.kycVerificationPipeline": "KYC ಪರಿಶೀಲನಾ ಸಾಲು",
    "common.reviewFarmRegistrationsVerifyIdentityAnd": "ಜಮೀನು ನೋಂದಣಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಕ್ರಿಯ ಮಾರಾಟಗಾರರ ಹಕ್ಕುಗಳನ್ನು ನೀಡಿ.",
    "common.platformFulfillment": "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪೂರೈಕೆ",
    "common.allPlatformOrders": "ಎಲ್ಲಾ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಆರ್ಡರ್‌ಗಳು",
    "common.fullOversightOfOrdersFulfillmentStatuses": "ಆರ್ಡರ್‌ಗಳು ಮತ್ತು ಪಾವತಿಗಳ ಸಂಪೂರ್ಣ ಮೇಲ್ವಿಚಾರಣೆ.",
    "common.financialAudit": "ಹಣಕಾಸು ಆಡಿಟ್",
    "common.paymentAuditLogs": "ಪಾವತಿ ಆಡಿಟ್ ಲಾಗ್‌ಗಳು",
    "common.auditPlatformTransactionSettlementsAndGateway": "ವಹಿವಾಟು ಇತ್ಯರ್ಥಗಳು ಮತ್ತು ಗೇಟ್‌ವೇ ಲಾಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    "common.catalogModeration": "ಕ್ಯಾಟಲಾಗ್ ನಿಯಂತ್ರಣ",
    "common.productModeration": "ಉತ್ಪನ್ನ ನಿಯಂತ್ರಣ",
    "common.reviewActiveDraftAndPausedCrop": "ರೈತರು ಪ್ರಕಟಿಸಿದ ಬೆಳೆ ಪಟ್ಟಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",

    "admin.userDirectory": "ಬಳಕೆದಾರರ ಡೈರೆಕ್ಟರಿ",
    "admin.platformUserManagement": "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಬಳಕೆದಾರರ ನಿರ್ವಹಣೆ",
    "admin.viewUserRolesAccessStatusesAnd": "ಬಳಕೆದಾರರ ಪಾತ್ರಗಳು ಮತ್ತು ಸ್ಥಿತಿಗಳನ್ನು ನೋಡಿ ಖಾತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    "admin.users": "ಬಳಕೆದಾರರು",
    "admin.farmers": "ರೈತರು / FPOಗಳು",
    "admin.settlements": "ಇತ್ಯರ್ಥಗಳು",
    "admin.payments": "ಪಾವತಿಗಳು",
    "admin.blockchain": "ಬ್ಲಾಕ್‌ಚೈನ್ ಆಡಿಟ್",
    "admin.disputes": "ವಿವಾದಗಳು",
    "admin.analytics": "ವಿಶ್ಲೇಷಣೆಗಳು",

    "adminUsers.colUserName": "ಬಳಕೆದಾರರ ಹೆಸರು",
    "adminUsers.colEmail": "ಇಮೇಲ್ ವಿಳಾಸ",
    "adminUsers.colAccountHash": "ಆನ್-ಚೈನ್ ಖಾತೆ ಹ್ಯಾಶ್",
    "adminUsers.colAccountRole": "ಖಾತೆ ಪಾತ್ರ",
    "adminUsers.colAccountStatus": "ಖಾತೆ ಸ್ಥಿತಿ",
    "adminUsers.colActions": "ಕ್ರಿಯೆಗಳು",
    "adminUsers.suspendAccount": "ಖಾತೆಯನ್ನು ಅಮಾನತುಗೊಳಿಸಿ",
    "adminUsers.activateAccount": "ಖಾತೆಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ",

    "settings.title": "ಖಾತೆ ಸಂಯೋಜನೆಗಳು",
    "settings.description": "ನಿಮ್ಮ ಸಿಸ್ಟಮ್ ಆದ್ಯತೆಗಳು, ಭದ್ರತೆ ಮತ್ತು ಅಧಿಸೂಚನೆ ಚಾನಲ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
    "settings.notificationPreferences": "ಅಧಿಸೂಚನೆ ಆದ್ಯತೆಗಳು",
    "settings.notificationDescription": "ಆರ್ಡರ್‌ಗಳು ಮತ್ತು ಸ್ಟಾಕ್ ನವೀಕರಣಗಳ ಕುರಿತು ಅಧಿಸೂಚನೆಗಳನ್ನು ಸಂಯೋಜಿಸಿ.",
    "settings.emailOrders": "ಇಮೇಲ್ ಆರ್ಡರ್ ಅಧಿಸೂಚನೆಗಳು",
    "settings.emailOrdersDescription": "ಹೊಸ ಆರ್ಡರ್‌ಗಳಿಗಾಗಿ ಇಮೇಲ್ ಪಡೆಯಿರಿ.",
    "settings.sms": "SMS ಅಧಿಸೂಚನೆಗಳು",
    "settings.smsDescription": "ತಕ್ಷಣದ SMS ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ.",
    "settings.marketPriceTrendAlerts": "ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಪ್ರವೃತ್ತಿ ಎಚ್ಚರಿಕೆಗಳು",
    "settings.marketPriceTrendAlertsDescription": "ಪ್ರಮುಖ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಬದಲಾವಣೆಗಳ ದೈನಂದಿನ ಸಾರಾಂಶ.",
    "settings.securityAndAccess": "ಭದ್ರತೆ ಮತ್ತು ಪ್ರವೇಶ",
    "settings.securityAndAccessDescription": "ಹೆಚ್ಚುವರಿ ಭದ್ರತಾ ಪದರಗಳೊಂದಿಗೆ ನಿಮ್ಮ ಖಾತೆಯನ್ನು ರಕ್ಷಿಸಿ.",
    "settings.agribazaarPlatform": "ಅಗ್ರಿಬಜಾರ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
    "settings.needHelpDescription": "ನಿಮ್ಮ KYC ವಿವರಗಳು ಅಥವಾ ರೈತರ ಪರಿಶೀಲನೆಯನ್ನು ನವೀಕರಿಸಲು ನೆರವು ಬೇಕಾದರೆ, ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಆಡಳಿತವನ್ನು ಸಂಪರ್ಕಿಸಿ."
  },
  ml: {
    "common.executiveControls": "എക്സിക്യൂട്ടീവ് നിയന്ത്രണങ്ങൾ",
    "common.adminDashboard": "അഡ്മിൻ ഡാഷ്‌ബോർഡ്",
    "common.noOrderVolumeDataYet": "ഇതുവരെ ഓർഡർ വ്യാപ്തി ഡാറ്റയില്ല",
    "common.noCategoryDistributionDataYet": "ഇതുവരെ വിഭാഗ വിതരണ ഡാറ്റയില്ല",
    "common.conflictOversight": "തർക്ക മേൽനോട്ടം",
    "common.disputeResolution": "തർക്ക പരിഹാരം",
    "common.arbitrateBuyerAndFarmerClaimsQuality": "വാങ്ങുന്നയാളുടെയും കർഷകന്റെയും അവകാശവാദങ്ങളും ഗുണനിലവാര പ്രശ്നങ്ങളും പരിഹരിക്കുക.",
    "common.resolveDispute": "തർക്കം പരിഹരിക്കുക",
    "common.kycVerificationPipeline": "KYC സ്ഥിരീകരണ പൈപ്പ്‌ലൈൻ",
    "common.reviewFarmRegistrationsVerifyIdentityAnd": "ഫാം രജിസ്ട്രേഷനുകൾ അവലോകനം ചെയ്യുകയും കർഷകർക്ക് അനുമതി നൽകുകയും ചെയ്യുക.",
    "common.platformFulfillment": "പ്ലാറ്റ്‌ഫോം നിർവ്വഹണം",
    "common.allPlatformOrders": "എല്ലാ പ്ലാറ്റ്‌ഫോം ഓർഡറുകളും",
    "common.fullOversightOfOrdersFulfillmentStatuses": "ഓർഡറുകളുടെയും ഇടപാടുകളുടെയും പൂർണ്ണ മേൽനോട്ടം.",
    "common.financialAudit": "സാമ്പത്തിക ഓഡിറ്റ്",
    "common.paymentAuditLogs": "പേയ്‌മെന്റ് ഓഡിറ്റ് ലോഗുകൾ",
    "common.auditPlatformTransactionSettlementsAndGateway": "ഇടപാട് തീർപ്പുകളും ഗേറ്റ്‌വേ ലോഗുകളും ഓഡിറ്റ് ചെയ്യുക.",
    "common.catalogModeration": "കാറ്റലോഗ് മോഡറേഷൻ",
    "common.productModeration": "ഉൽപ്പന്ന മോഡറേഷൻ",
    "common.reviewActiveDraftAndPausedCrop": "കർഷകർ പ്രസിദ്ധീകരിച്ച വിള ലിസ്റ്റിംഗുകൾ പരിശോധിക്കുക.",

    "admin.userDirectory": "ഉപയോക്തൃ ഡയറക്ടറി",
    "admin.platformUserManagement": "പ്ലാറ്റ്‌ഫോം ഉപയോക്തൃ മാനേജ്‌മെന്റ്",
    "admin.viewUserRolesAccessStatusesAnd": "ഉപയോക്തൃ ചുമതലകളും സ്ഥിതിയും കാണുകയും അക്കൗണ്ടുകൾ കൈകാര്യം ചെയ്യുകയും ചെയ്യുക.",
    "admin.users": "ഉപയോക്താക്കൾ",
    "admin.farmers": "കർഷകർ / FPO കൾ",
    "admin.settlements": "തീർപ്പുകൾ",
    "admin.payments": "പേയ്‌മെന്റുകൾ",
    "admin.blockchain": "ബ്ലോക്ക്ചെയിൻ ഓഡിറ്റ്",
    "admin.disputes": "തർക്കങ്ങൾ",
    "admin.analytics": "വിശകലനം",

    "adminUsers.colUserName": "ഉപയോക്തൃ നാമം",
    "adminUsers.colEmail": "ഇമെയിൽ വിലാസം",
    "adminUsers.colAccountHash": "ഓൺ-ചെയിൻ അക്കൗണ്ട് ഹാഷ്",
    "adminUsers.colAccountRole": "അക്കൗണ്ട് ചുമതല",
    "adminUsers.colAccountStatus": "അക്കൗണ്ട് നില",
    "adminUsers.colActions": "നടപടികൾ",
    "adminUsers.suspendAccount": "അക്കൗണ്ട് സസ്പെൻഡ് ചെയ്യുക",
    "adminUsers.activateAccount": "അക്കൗണ്ട് സജീവമാക്കുക",

    "settings.title": "അക്കൗണ്ട് ക്രമീകരണങ്ങൾ",
    "settings.description": "നിങ്ങളുടെ സിസ്റ്റം മുൻഗണനകളും സുരക്ഷയും അറിയിപ്പ് ചാനലുകളും നിയന്ത്രിക്കുക.",
    "settings.notificationPreferences": "അറിയിപ്പ് മുൻഗണനകൾ",
    "settings.notificationDescription": "ഓർഡറുകളും സ്റ്റോക്ക് അപ്‌ഡേറ്റുകളും എങ്ങനെ അറിയിക്കണമെന്ന് ക്രമീകരിക്കുക.",
    "settings.emailOrders": "ഇമെയിൽ ഓർഡർ അറിയിപ്പുകൾ",
    "settings.emailOrdersDescription": "പുതിയ ഓർഡറുകൾക്കും സ്ഥിതി മാറ്റങ്ങൾക്കും ഇമെയിൽ നേടുക.",
    "settings.sms": "SMS അറിയിപ്പുകൾ",
    "settings.smsDescription": "ഉടനടി SMS മുന്നറിയിപ്പുകൾ നേടുക.",
    "settings.marketPriceTrendAlerts": "വിപണി വില ട്രെൻഡ് മുന്നറിയിപ്പുകൾ",
    "settings.marketPriceTrendAlertsDescription": "പ്രധാന കമ്പോള വില മാറ്റങ്ങളുടെ ദിനാന്തരീക്ഷ സംഗ്രഹം.",
    "settings.securityAndAccess": "സുരക്ഷയും പ്രവേശനവും",
    "settings.securityAndAccessDescription": "കൂടുതൽ സുരക്ഷാ പാളികൾ ഉപയോഗിച്ച് നിങ്ങളുടെ അക്കൗണ്ട് സംരക്ഷിക്കുക.",
    "settings.agribazaarPlatform": "അഗ്രിബസാർ പ്ലാറ്റ്‌ഫോം",
    "settings.needHelpDescription": "നിങ്ങളുടെ KYC വിവരങ്ങളോ കർഷക സ്ഥിരീകരണമോ അപ്‌ഡേറ്റ് ചെയ്യാൻ സഹായം വേണമെങ്കിൽ പ്ലാറ്റ്‌ഫോം അഡ്മിനിസ്ട്രേഷനുമായി ബന്ധപ്പെടുക."
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

for (const [lang, dict] of Object.entries(masterDict)) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const [keyPath, val] of Object.entries(dict)) {
      setDeepValue(data, keyPath, val);
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully updated ${lang}/translation.json with master dictionary.`);
  }
}
