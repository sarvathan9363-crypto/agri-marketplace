import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const verificationConfigsDict = {
  en: {
    farmer: {
      portalTitle: "GOI National Agricultural Farmer Verification Service",
      pageTitle: "Official Identity & Compliance Gateway",
      badgeText: "✓ VERIFIED FARMER",
      incompleteBadgeText: "You can return anytime to complete pending checks and unlock your verified seller badge.",
      steps: {
        aadhaar: {
          shortLabel: "Aadhaar Auth",
          name: "Aadhaar Authentication Protocol",
          description: "Enter your 12-digit Aadhaar number to receive a One-Time Password (OTP) via UIDAI authorized gateway."
        },
        farmerRegistry: {
          shortLabel: "Farmer Registry",
          name: "Farmer Database Protocol",
          description: "Enter your official Farmer / Agristack ID along with state and district to verify active agricultural registry status."
        },
        landRecord: {
          shortLabel: "Land Record",
          name: "Land Holding Protocol",
          description: "Enter state, district, taluk, village, Patta / 7-12 number, survey number, and total acreage."
        },
        bankAccount: {
          shortLabel: "Bank Account",
          name: "Bank Settlement Protocol",
          description: "Link your active bank account for direct payments and automated sales settlements."
        },
        pan: {
          shortLabel: "PAN Verification",
          name: "PAN Verification Protocol",
          description: "Enter your 10-character Permanent Account Number for statutory tax compliance & payouts."
        },
        pmKisan: {
          shortLabel: "PM-KISAN",
          name: "PM-KISAN Scheme Protocol",
          description: "Optionally link PM-KISAN Beneficiary Reference for added seller credibility on the marketplace."
        }
      }
    },
    fpo: {
      portalTitle: "National FPO Compliance & Governance Service",
      pageTitle: "FPO Identity & Statutory Verification Gateway",
      badgeText: "✓ VERIFIED FPO ORGANISATION",
      incompleteBadgeText: "Complete FPO compliance steps to issue bulk agricultural listings.",
      steps: {
        orgIdentity: {
          shortLabel: "FPO Certificate",
          name: "FPO Incorporation & Registration Protocol",
          description: "Upload MCA Incorporation Certificate, Co-operative Registration, or Society Registration document."
        },
        orgPan: {
          shortLabel: "FPO PAN Card",
          name: "FPO Corporate PAN Protocol",
          description: "Provide official 10-character PAN number and card scan issued to the FPO entity."
        },
        gstin: {
          shortLabel: "GSTIN Tax Reg",
          name: "GSTIN Registration Protocol",
          description: "Provide 15-digit Goods & Services Tax Identification Number for commercial bulk billing."
        },
        representative: {
          shortLabel: "Authorized Signatory",
          name: "CEO / Director Identity Verification",
          description: "Verify identity of authorized signatory (CEO, Chairman, or Managing Director)."
        },
        orgBank: {
          shortLabel: "FPO Bank Account",
          name: "Institutional Settlement Account Protocol",
          description: "Link active current bank account registered under the official FPO organization name."
        },
        orgDocuments: {
          shortLabel: "Board Resolution",
          name: "Board Resolution & Audit Compliance Protocol",
          description: "Upload board resolution authorizing trading activities & recent audited financial report."
        }
      }
    },
    transporter: {
      portalTitle: "Transporter Verification Gateway",
      pageTitle: "Transporter Onboarding & Verification",
      badgeText: "✓ VERIFIED TRANSPORTER",
      incompleteBadgeText: "Complete transporter verification steps to start accepting freight quotes.",
      steps: {
        basicDetails: {
          shortLabel: "Basic Details",
          name: "Basic Transporter & Company Details",
          description: "Company name, contact person, mobile, email, and service areas."
        },
        identity: {
          shortLabel: "Identity Verification",
          name: "Identity Verification (Aadhaar / PAN)",
          description: "Identity check of proprietor or authorized business owner."
        },
        businessRegistration: {
          shortLabel: "Business Reg",
          name: "Business Registration & Tax (GST / Udyam)",
          description: "Optional business incorporation certificate or GST registration."
        },
        bankAccount: {
          shortLabel: "Bank Payout",
          name: "Bank Account Verification",
          description: "Verified bank account details for direct freight payout settlement."
        },
        vehiclesStep: {
          shortLabel: "Fleet RC",
          name: "Vehicle Fleet & Document Verification",
          description: "Registered transport vehicles with RC, Insurance, Fitness, and PUC certificates."
        },
        driversStep: {
          shortLabel: "Driver Roster",
          name: "Driver Roster & License Verification",
          description: "Driver credentials and valid commercial driving license verification."
        }
      }
    }
  },
  ta: {
    farmer: {
      portalTitle: "இந்திய அரசு தேசிய விவசாயி சரிபார்ப்பு சேவை",
      pageTitle: "அதிகாரப்பூர்வ அடையாளம் & இணக்க போர்டல்",
      badgeText: "✓ சரிபார்க்கப்பட்ட விவசாயி",
      incompleteBadgeText: "நிலுவையில் உள்ள காசோலைகளை பூர்த்தி செய்து உங்கள் சரிபார்க்கப்பட்ட விற்பனையாளர் பேட்ஜைப் பெற எந்த நேரத்திலும் வரலாம்.",
      steps: {
        aadhaar: {
          shortLabel: "ஆதார் சரிபார்ப்பு",
          name: "ஆதார் சான்றளிப்பு நெறிமுறை",
          description: "UIDAI போர்டல் மூலம் OTP பெற உங்கள் 12 இலக்க ஆதார் எண்ணை உள்ளிடவும்."
        },
        farmerRegistry: {
          shortLabel: "விவசாயி பதிவு",
          name: "விவசாயி தரவுத்தள நெறிமுறை",
          description: "செயலில் உள்ள விவசாய பதிவை சரிபார்க்க உங்கள் அதிகாரப்பூர்வ விவசாயி / அக்ரிஸ்டாக் ஐடி, மாநிலம் மற்றும் மாவட்டத்தை உள்ளிடவும்."
        },
        landRecord: {
          shortLabel: "நிலப் பதிவு",
          name: "நில உரிமை நெறிமுறை",
          description: "மாநிலம், மாவட்டம், தாலுகா, கிராமம், பட்டா / 7-12 எண், சர்வே எண் மற்றும் மொத்த பரப்பளவை உள்ளிடவும்."
        },
        bankAccount: {
          shortLabel: "வங்கி கணக்கு",
          name: "வங்கி தீர்வு நெறிமுறை",
          description: "நேரடி செலுத்துதல்கள் மற்றும் விற்பனை தீர்வுகளுக்கு உங்கள் வங்கி கணக்கை இணைக்கவும்."
        },
        pan: {
          shortLabel: "பான் சரிபார்ப்பு",
          name: "பான் கார்டு நெறிமுறை",
          description: "வரி இணக்கம் மற்றும் செலுத்துதல்களுக்கு உங்கள் 10 இலக்க பான் எண்ணை உள்ளிடவும்."
        },
        pmKisan: {
          shortLabel: "பிஎம்-கிசான்",
          name: "பிஎம்-கிசான் திட்ட நெறிமுறை",
          description: "சந்தையில் கூடுதல் விற்பனையாளர் நம்பிக்கைக்கு பிஎம்-கிசான் குறிப்பு எண்ணை விருப்பமாக இணைக்கவும்."
        }
      }
    },
    fpo: {
      portalTitle: "தேசிய எஃப்.பி.ஓ இணக்கம் & ஆளுகை சேவை",
      pageTitle: "எஃப்.பி.ஓ அடையாளம் & சட்டப்பூர்வ சரிபார்ப்பு போர்டல்",
      badgeText: "✓ சரிபார்க்கப்பட்ட எஃப்.பி.ஓ அமைப்பு",
      incompleteBadgeText: "மொத்த விவசாய பட்டியல்களை வழங்க எஃப்.பி.ஓ இணக்க படிகளை பூர்த்தி செய்யவும்.",
      steps: {
        orgIdentity: {
          shortLabel: "எஃப்.பி.ஓ சான்றிதழ்",
          name: "எஃப்.பி.ஓ பதிவு நெறிமுறை",
          description: "MCA இணைப்பு சான்றிதழ் அல்லது கூட்டுறவு பதிவு ஆவணத்தைப் பதிவேற்றவும்."
        },
        orgPan: {
          shortLabel: "எஃப்.பி.ஓ பான்",
          name: "எஃப்.பி.ஓ கார்ப்பரேட் பான் நெறிமுறை",
          description: "அமைப்பிற்கு வழங்கப்பட்ட அதிகாரப்பூர்வ பான் எண் மற்றும் நகலைப் பதிவேற்றவும்."
        },
        gstin: {
          shortLabel: "ஜிஎஸ்டி பதிவு",
          name: "ஜிஎஸ்டிஐஎன் பதிவு நெறிமுறை",
          description: "வணிக பில்லிங்கிற்கு செல்லுபடியாகும் 15 இலக்க ஜிஎஸ்டி எண்ணை வழங்கவும்."
        },
        representative: {
          shortLabel: "அதிகாரம் பெற்ற பிரதிநிதி",
          name: "சிஇஓ / இயக்குனர் அடையாள சரிபார்ப்பு",
          description: "அதிகாரம் பெற்ற பிரதிநிதியின் (சிஇஓ/தலைவர்) ஆதாரை சரிபார்க்கவும்."
        },
        orgBank: {
          shortLabel: "எஃப்.பி.ஓ வங்கி கணக்கு",
          name: "நிறுவன தீர்வு கணக்கு நெறிமுறை",
          description: "எஃப்.பி.ஓ பெயரில் பதிவு செய்யப்பட்ட நடப்பு வங்கி கணக்கை இணைக்கவும்."
        },
        orgDocuments: {
          shortLabel: "இயக்குனர் குழு தீர்மானம்",
          name: "இயக்குனர் குழு தீர்மானம் & தணிக்கை இணக்க நெறிமுறை",
          description: "வர்த்தக நடவடிக்கைகளுக்கு அதிகாரம் அளிக்கும் தீர்மானம் மற்றும் தணிக்கை அறிக்கையை பதிவேற்றவும்."
        }
      }
    },
    transporter: {
      portalTitle: "போக்குவரத்தாளர் சரிபார்ப்பு போர்டல்",
      pageTitle: "போக்குவரத்தாளர் பதிவு & சரிபார்ப்பு",
      badgeText: "✓ சரிபார்க்கப்பட்ட போக்குவரத்தாளர்",
      incompleteBadgeText: "சரக்கு மேற்கோள்களை ஏற்க போக்குவரத்தாளர் சரிபார்ப்பை பூர்த்தி செய்யவும்.",
      steps: {
        basicDetails: {
          shortLabel: "அடிப்படை விவரங்கள்",
          name: "அடிப்படை போக்குவரத்தாளர் & நிறுவன விவரங்கள்",
          description: "நிறுவனத்தின் பெயர், தொடர்பு நபர், மொபைல், மின்னஞ்சல் மற்றும் சேவை பகுதிகள்."
        },
        identity: {
          shortLabel: "அடையாள சரிபார்ப்பு",
          name: "அடையாள சரிபார்ப்பு (ஆதார் / பான்)",
          description: "உரிமையாளர் அல்லது அதிகாரம் பெற்ற வணிக உரிமையாளரின் அடையாள சோதனை."
        },
        businessRegistration: {
          shortLabel: "வணிக பதிவு",
          name: "வணிக பதிவு & வரி (ஜிஎஸ்டி / உத்யம்)",
          description: "விருப்பமான வணிக பதிவு சான்றிதழ் அல்லது ஜிஎஸ்டி பதிவு."
        },
        bankAccount: {
          shortLabel: "வங்கி பணம் செலுத்துதல்",
          name: "வங்கி கணக்கு சரிபார்ப்பு",
          description: "நேரடி சரக்கு கட்டண தீர்வுக்கான சரிபார்க்கப்பட்ட வங்கி கணக்கு விவரங்கள்."
        },
        vehiclesStep: {
          shortLabel: "வாகனங்கள் RC",
          name: "வாகனக் குழு & ஆவணச் சரிபார்ப்பு",
          description: "RC, காப்பீடு, தகுதி மற்றும் புகைக் கட்டுப்பாடு சான்றிதழ்களுடன் பதிவு செய்யப்பட்ட வாகனங்கள்."
        },
        driversStep: {
          shortLabel: "ஓட்டுநர் பட்டியல்",
          name: "ஓட்டுநர் பட்டியல் & உரிமச் சரிபார்ப்பு",
          description: "ஓட்டுநர் சான்றுகள் மற்றும் செல்லுபடியாகும் வர்த்தக ஓட்டுநர் உரிமச் சரிபார்ப்பு."
        }
      }
    }
  },
  hi: {
    farmer: {
      portalTitle: "भारत सरकार राष्ट्रीय कृषि किसान सत्यापन सेवा",
      pageTitle: "आधिकारिक पहचान और अनुपालन पोर्टल",
      badgeText: "✓ सत्यापित किसान",
      incompleteBadgeText: "लंबित जांच पूरी करने और अपना सत्यापित विक्रेता बैज प्राप्त करने के लिए आप कभी भी वापस आ सकते हैं।",
      steps: {
        aadhaar: {
          shortLabel: "आधार सत्यापन",
          name: "आधार प्रमाणन प्रोटोकॉल",
          description: "UIDAI पोर्टल के माध्यम से OTP प्राप्त करने के लिए अपना 12 अंकों का आधार नंबर दर्ज करें।"
        },
        farmerRegistry: {
          shortLabel: "किसान रजिस्ट्री",
          name: "किसान डेटाबेस प्रोटोकॉल",
          description: "सक्रिय कृषि रजिस्ट्री स्थिति सत्यापित करने के लिए अपनी आधिकारिक किसान / एग्रीस्टैक आईडी दर्ज करें।"
        },
        landRecord: {
          shortLabel: "भूमि रिकॉर्ड",
          name: "भूमि धारण प्रोटोकॉल",
          description: "राज्य, जिला, तालुका, गांव, पट्ठा / 7-12 संख्या, सर्वेक्षण संख्या और कुल क्षेत्रफल दर्ज करें।"
        },
        bankAccount: {
          shortLabel: "बैंक खाता",
          name: "बैंक निपटान प्रोटोकॉल",
          description: "प्रत्यक्ष भुगतान और स्वचालित बिक्री निपटान के लिए अपना बैंक खाता लिंक करें।"
        },
        pan: {
          shortLabel: "पैन सत्यापन",
          name: "पैन कार्ड प्रोटोकॉल",
          description: "कर अनुपालन और भुगतान के लिए अपना 10 अंकों का पैन नंबर दर्ज करें।"
        },
        pmKisan: {
          shortLabel: "पीएम-किसान",
          name: "पीएम-किसान योजना प्रोटोकॉल",
          description: "बाजार में अधिक विक्रेता विश्वसनीयता के लिए पीएम-किसान संदर्भ लिंक करें।"
        }
      }
    },
    fpo: {
      portalTitle: "राष्ट्रीय एफपीओ अनुपालन और शासन सेवा",
      pageTitle: "एफपीओ पहचान और वैधानिक सत्यापन पोर्टल",
      badgeText: "✓ सत्यापित एफपीओ संगठन",
      incompleteBadgeText: "थोक कृषि लिस्टिंग जारी करने के लिए एफपीओ अनुपालन चरण पूरे करें।",
      steps: {
        orgIdentity: {
          shortLabel: "एफपीओ प्रमाण पत्र",
          name: "एफपीओ निगमन और पंजीकरण प्रोटोकॉल",
          description: "MCA निगमन प्रमाण पत्र या सहकारी पंजीकरण दस्तावेज अपलोड करें।"
        },
        orgPan: {
          shortLabel: "एफपीओ पैन",
          name: "एफपीओ कॉर्पोरेट पैन प्रोटोकॉल",
          description: "एफपीओ संस्था को जारी किया गया आधिकारिक पैन नंबर और स्कैन अपलोड करें।"
        },
        gstin: {
          shortLabel: "जीएसटी पंजीकरण",
          name: "जीएसटीइन पंजीकरण प्रोटोकॉल",
          description: "वाणिज्यिक बिलिंग के लिए मान्य 15-अंकीय जीएसटी नंबर प्रदान करें।"
        },
        representative: {
          shortLabel: "अधिकृत प्रतिनिधि",
          name: "सीईओ / निदेशक पहचान सत्यापन",
          description: "अधिकृत हस्ताक्षरकर्ता (सीईओ / अध्यक्ष) की पहचान सत्यापित करें।"
        },
        orgBank: {
          shortLabel: "एफपीओ बैंक खाता",
          name: "संस्थागत निपटान खाता प्रोटोकॉल",
          description: "एफपीओ नाम से पंजीकृत चालू बैंक खाता लिंक करें।"
        },
        orgDocuments: {
          shortLabel: "बोर्ड संकल्प",
          name: "बोर्ड संकल्प और लेखा परीक्षा अनुपालन प्रोटोकॉल",
          description: "व्यापार गतिविधियों को अधिकृत करने वाला प्रस्ताव और ऑडिट रिपोर्ट अपलोड करें।"
        }
      }
    },
    transporter: {
      portalTitle: "ट्रांसपोर्टर सत्यापन पोर्टल",
      pageTitle: "ट्रांसपोर्टर ऑनबोर्डिंग और सत्यापन",
      badgeText: "✓ सत्यापित ट्रांसपोर्टर",
      incompleteBadgeText: "भाड़ा उद्धरण स्वीकार करना शुरू करने के लिए ट्रांसपोर्टर सत्यापन पूरा करें।",
      steps: {
        basicDetails: {
          shortLabel: "मूल विवरण",
          name: "मूल ट्रांसपोर्टर और कंपनी विवरण",
          description: "कंपनी का नाम, संपर्क व्यक्ति, मोबाइल, ईमेल और सेवा क्षेत्र।"
        },
        identity: {
          shortLabel: "पहचान सत्यापन",
          name: "पहचान सत्यापन (आधार / पैन)",
          description: "मालिक या अधिकृत व्यवसाय स्वामी की पहचान जांच।"
        },
        businessRegistration: {
          shortLabel: "व्यवसाय पंजीकरण",
          name: "व्यवसाय पंजीकरण और कर (जीएसटी / उद्यम)",
          description: "वैकल्पिक व्यवसाय निगमन प्रमाण पत्र या जीएसटी पंजीकरण।"
        },
        bankAccount: {
          shortLabel: "बैंक भुगतान",
          name: "बैंक खाता सत्यापन",
          description: "प्रत्यक्ष भाड़ा भुगतान निपटान के लिए सत्यापित बैंक खाता विवरण।"
        },
        vehiclesStep: {
          shortLabel: "वाहन आरसी",
          name: "वाहन बेड़ा और दस्तावेज सत्यापन",
          description: "आरसी, बीमा, फिटनेस और पीयूसी प्रमाण पत्र के साथ पंजीकृत वाहन।"
        },
        driversStep: {
          shortLabel: "चालक सूची",
          name: "चालक रोस्टर और लाइसेंस सत्यापन",
          description: "ड्राइवर क्रेडेंशियल और मान्य वाणिज्यिक ड्राइविंग लाइसेंस सत्यापन।"
        }
      }
    }
  },
  te: {
    farmer: {
      portalTitle: "భారత ప్రభుత్వం జాతీయ వ్యవసాయ రైతు తనిఖీ సేవ",
      pageTitle: "అధికారిక గుర్తింపు & సమ్మతి పోర్టల్",
      badgeText: "✓ ధృవీకరించబడిన రైతు",
      incompleteBadgeText: "పెండింగ్‌లో ఉన్న తనిఖీలను పూర్తి చేసి, ధృవీకరించబడిన విక్రేత బ్యాడ్జ్‌ను అన్‌లాక్ చేయడానికి మీరు ఎప్పుడైనా తిరిగి రావచ్చు.",
      steps: {
        aadhaar: {
          shortLabel: "ఆధార్ తనిఖీ",
          name: "ఆధార్ ప్రమాణీకరణ ప్రొటోకాల్",
          description: "UIDAI పోర్టల్ ద్వారా OTP పొందడానికి 12 అంకెల ఆధార్ సంఖ్యను నమోదు చేయండి."
        },
        farmerRegistry: {
          shortLabel: "రైతు రిజిస్ట్రీ",
          name: "రైతు డేటాబేస్ ప్రొటోకాల్",
          description: "యాక్టివ్ వ్యవసాయ రిజిస్ట్రీ స్థితిని తనిఖీ చేయడానికి అధికారిక రైతు / అగ్రిస్టాక్ ID ని నమోదు చేయండి."
        },
        landRecord: {
          shortLabel: "భూమి రికార్డు",
          name: "భూమి హక్కుల ప్రొటోకాల్",
          description: "రాష్ట్రం, జిల్లా, తాలూకా, గ్రామం, పట్టా / 7-12 సంఖ్య, సర్వే సంఖ్య మరియు మొత్తం వైశాల్యాన్ని నమోదు చేయండి."
        },
        bankAccount: {
          shortLabel: "బ్యాంకు ఖాతా",
          name: "బ్యాంకు చెల్లింపుల ప్రొటోకాల్",
          description: "నేరుగా చెల్లింపులు మరియు విక్రయ చెల్లింపుల కోసం మీ బ్యాంకు ఖాతాను లింక్ చేయండి."
        },
        pan: {
          shortLabel: "పాన్ తనిఖీ",
          name: "పాన్ కార్డ్ ప్రొటోకాల్",
          description: "పన్ను సమ్మతి మరియు చెల్లింపుల కోసం 10 అంకెల పాన్ సంఖ్యను నమోదు చేయండి."
        },
        pmKisan: {
          shortLabel: "పీఎం-కిసాన్",
          name: "పీఎం-కిసాన్ పథకం ప్రొటోకాల్",
          description: "మార్కెట్‌లో విక్రేత నమ్మకం కోసం పీఎం-కిసాన్ సూచన సంఖ్యను లింక్ చేయండి."
        }
      }
    },
    fpo: {
      portalTitle: "జాతీయ ఎఫ్‌పీఓ సమ్మతి & పాలనా సేవ",
      pageTitle: "ఎఫ్‌పీఓ గుర్తింపు & చట్టబద్ధమైన తనిఖీ పోర్టల్",
      badgeText: "✓ ధృవీకరించబడిన ఎఫ్‌పీఓ సంస్థ",
      incompleteBadgeText: "బల్క్ వ్యవసాయ జాబితాలను జారీ చేయడానికి ఎఫ్‌పీఓ సమ్మతి దశలను పూర్తి చేయండి.",
      steps: {
        orgIdentity: {
          shortLabel: "ఎఫ్‌పీఓ సర్టిఫికెట్",
          name: "ఎఫ్‌పీఓ నమోదు ప్రొటోకాల్",
          description: "MCA నిగమన సర్టిఫికేట్ లేదా సహకార రిజిస్ట్రేషన్ పత్రాన్ని అప్‌లోడ్ చేయండి."
        },
        orgPan: {
          shortLabel: "ఎఫ్‌పీఓ పాన్",
          name: "ఎఫ్‌పీఓ కార్పొరేట్ పాన్ ప్రొటోకాల్",
          description: "సంస్థకు జారీ చేసిన అధికారిక పాన్ సంఖ్య మరియు పత్రాన్ని అప్‌లోడ్ చేయండి."
        },
        gstin: {
          shortLabel: "జీఎస్టీ నమోదు",
          name: "జీఎస్టీఐఎన్ నమోదు ప్రొటోకాల్",
          description: "వాణిజ్య బిల్లింగ్ కోసం చెల్లుబాటు అయ్యే 15 అంకెల జీఎస్టీ సంఖ్యను అందించండి."
        },
        representative: {
          shortLabel: "అధికార ప్రతినిధి",
          name: "సీఈఓ / డైరెక్టర్ గుర్తింపు తనిఖీ",
          description: "అధికార ప్రతినిధి (సీఈఓ/చైర్మన్) ఆధార్/పాన్ తనిఖీ చేయండి."
        },
        orgBank: {
          shortLabel: "ఎఫ్‌పీఓ బ్యాంకు ఖాతా",
          name: "సంస్థాగత చెల్లింపు ఖాతా ప్రొటోకాల్",
          description: "ఎఫ్‌పీఓ పేరు మీద నమోదైన కరెంట్ బ్యాంకు ఖాతాను లింక్ చేయండి."
        },
        orgDocuments: {
          shortLabel: "డైరెక్టర్ల బోర్డు తీర్మానం",
          name: "బోర్డు తీర్మానం & ఆడిట్ సమ్మతి ప్రొటోకాల్",
          description: "వ్యాపార కార్యకలాపాలను అనుమతించే తీర్మానం మరియు ఆడిట్ నివేదికను అప్‌లోడ్ చేయండి."
        }
      }
    },
    transporter: {
      portalTitle: "రవాణాదారు తనిఖీ పోర్టల్",
      pageTitle: "రవాణాదారు నమోదు & తనిఖీ",
      badgeText: "✓ ధృవీకరించబడిన రవాణాదారు",
      incompleteBadgeText: "రవాణా ధరల కోట్‌లను అంగీకరించడం ప్రారంభించడానికి రవాణాదారు తనిఖీని పూర్తి చేయండి.",
      steps: {
        basicDetails: {
          shortLabel: "ప్రాథమిక వివరాలు",
          name: "ప్రాథమిక రవాణాదారు & కంపెనీ వివరాలు",
          description: "కంపెనీ పేరు, సంప్రదింపు వ్యక్తి, మొబైల్, ఇమెయిల్ మరియు సేవా ప్రాంతాలు."
        },
        identity: {
          shortLabel: "గుర్తింపు తనిఖీ",
          name: "గుర్తింపు తనిఖీ (ఆధార్ / పాన్)",
          description: "యజమాని లేదా అధికారిక వ్యాపార యజమాని గుర్తింపు తనిఖీ."
        },
        businessRegistration: {
          shortLabel: "వ్యాపార నమోదు",
          name: "వ్యాపార నమోదు & పన్ను (జీఎస్టీ / ఉద్యమ్)",
          description: "ఐచ్ఛిక వ్యాపార నమోదు పత్రం లేదా జీఎస్టీ నమోదు."
        },
        bankAccount: {
          shortLabel: "బ్యాంకు చెల్లింపు",
          name: "బ్యాంకు ఖాతా తనిఖీ",
          description: "నేరుగా రవాణా రుసుము చెల్లింపుల కోసం ధృవీకరించబడిన బ్యాంకు ఖాతా వివరాలు."
        },
        vehiclesStep: {
          shortLabel: "వాహనాల RC",
          name: "వాహనాల సముదాయం & పత్రాల తనిఖీ",
          description: "RC, ఇన్సూరెన్స్, ఫిట్‌నెస్ మరియు PUC పత్రాలతో నమోదైన రవాణా వాహనాలు."
        },
        driversStep: {
          shortLabel: "డ్రైవర్ల జాబితా",
          name: "డ్రైవర్ల రోస్టర్ & లైసెన్స్ తనిఖీ",
          description: "డ్రైవర్ వివరాలు మరియు చెల్లుబాటు అయ్యే కమర్షియల్ డ్రైవింగ్ లైసెన్స్ తనిఖీ."
        }
      }
    }
  },
  kn: {
    farmer: {
      portalTitle: "ಭಾರತ ಸರ್ಕಾರ ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ರೈತ ಪರಿಶೀಲನೆ ಸೇವೆ",
      pageTitle: "ಅಧಿಕೃತ ಗುರುತು ಮತ್ತು ಅನುಸರಣೆ ಪೋರ್ಟಲ್",
      badgeText: "✓ ಪರಿಶೀಲಿಸಿದ ರೈತ",
      incompleteBadgeText: "ನಿಮ್ಮ ಬಾಕಿ ಇರುವ ತಪಾಸಣೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಲು ಮತ್ತು ನಿಮ್ಮ ಪರಿಶೀಲಿಸಿದ ಮಾರಾಟಗಾರ ಬ್ಯಾಡ್ಜ್ ಪಡೆಯಲು ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ಹಿಂತಿರುಗಬಹುದು.",
      steps: {
        aadhaar: {
          shortLabel: "ಆಧಾರ್ ಪರಿಶೀಲನೆ",
          name: "ಆಧಾರ್ ದೃಢೀಕರಣ ಪ್ರೋಟೋಕಾಲ್",
          description: "UIDAI ಪೋರ್ಟಲ್ ಮೂಲಕ OTP ಪಡೆಯಲು 12 ಅಂಕಿಯ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ."
        },
        farmerRegistry: {
          shortLabel: "ರೈತ ನೋಂದಣಿ",
          name: "ರೈತ ಡೇಟಾಬೇಸ್ ಪ್ರೋಟೋಕಾಲ್",
          description: "ಸಕ್ರಿಯ ಕೃಷಿ ನೋಂದಣಿ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲು ನಿಮ್ಮ ಅಧಿಕೃತ ರೈತ / ಅಗ್ರಿಸ್ಟ್ಯಾಕ್ ID ನಮೂದಿಸಿ."
        },
        landRecord: {
          shortLabel: "ಜಮೀನು ದಾಖಲೆ",
          name: "ಜಮೀನು ಹಕ್ಕುಗಳ ಪ್ರೋಟೋಕಾಲ್",
          description: "ರಾಜ್ಯ, ಜಿಲ್ಲೆ, ತಾಲೂಕು, ಗ್ರಾಮ, ಪಟ್ಟಾ / 7-12 ಸಂಖ್ಯೆ, ಸರ್ವೇ ಸಂಖ್ಯೆ ಮತ್ತು ಒಟ್ಟು ವಿಸ್ತೀರ್ಣವನ್ನು ನಮೂದಿಸಿ."
        },
        bankAccount: {
          shortLabel: "ಬ್ಯಾಂಕ್ ಖಾತೆ",
          name: "ಬ್ಯಾಂಕ್ ಪಾವತಿ ಪ್ರೋಟೋಕಾಲ್",
          description: "ನೇರ ಪಾವತಿಗಳು ಮತ್ತು ಸ್ವಯಂಚಾಲಿತ ಮಾರಾಟ ಪಾವತಿಗಳಿಗಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಯನ್ನು ಲಿಂಕ್ ಮಾಡಿ."
        },
        pan: {
          shortLabel: "ಪ್ಯಾನ್ ಪರಿಶೀಲನೆ",
          name: "ಪ್ಯಾನ್ ಕಾರ್ಡ್ ಪ್ರೋಟೋಕಾಲ್",
          description: "ತೆರಿಗೆ ಅನುಸರಣೆ ಮತ್ತು ಪಾವತಿಗಳಿಗಾಗಿ ನಿಮ್ಮ 10 ಅಂಕಿಯ ಪ್ಯಾನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ."
        },
        pmKisan: {
          shortLabel: "ಪಿಎಂ-ಕಿಸಾನ್",
          name: "ಪಿಎಂ-ಕಿಸಾನ್ ಯೋಜನೆ ಪ್ರೋಟೋಕಾಲ್",
          description: "ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಹೆಚ್ಚಿನ ಮಾರಾಟಗಾರರ ನಂಬಿಕೆಗಾಗಿ ಪಿಎಂ-ಕಿಸಾನ್ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ಲಿಂಕ್ ಮಾಡಿ."
        }
      }
    },
    fpo: {
      portalTitle: "ರಾಷ್ಟ್ರೀಯ ಎಫ್‌ಪಿಒ ಅನುಸರಣೆ ಮತ್ತು ಆಡಳಿತ ಸೇವೆ",
      pageTitle: "ಎಫ್‌ಪಿಒ ಗುರುತು ಮತ್ತು ಶಾಸನಬದ್ಧ ಪರಿಶೀಲನೆ ಪೋರ್ಟಲ್",
      badgeText: "✓ ಪರಿಶೀಲಿಸಿದ ಎಫ್‌ಪಿಒ ಸಂಸ್ಥೆ",
      incompleteBadgeText: "ಸಮಗ್ರ ಕೃಷಿ ಪಟ್ಟಿಗಳನ್ನು ನೀಡಲು ಎಫ್‌ಪಿಒ ಅನುಸರಣೆ ಹಂತಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
      steps: {
        orgIdentity: {
          shortLabel: "ಎಫ್‌ಪಿಒ ಪ್ರಮಾಣಪತ್ರ",
          name: "ಎಫ್‌ಪಿಒ ನೋಂದಣಿ ಪ್ರೋಟೋಕಾಲ್",
          description: "MCA ಸಂಯೋಜನೆ ಪ್ರಮಾಣಪತ್ರ ಅಥವಾ ಸಹಕಾರಿ ನೋಂದಣಿ ದಾಖಲೆಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
        },
        orgPan: {
          shortLabel: "ಎಫ್‌ಪಿಒ ಪ್ಯಾನ್",
          name: "ಎಫ್‌ಪಿಒ ಕಾರ್ಪೊರೇಟ್ ಪ್ಯಾನ್ ಪ್ರೋಟೋಕಾಲ್",
          description: "ಸಂಸ್ಥೆಗೆ ನೀಡಲಾದ ಅಧಿಕೃತ ಪ್ಯಾನ್ ಸಂಖ್ಯೆ ಮತ್ತು ಪ್ರತಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
        },
        gstin: {
          shortLabel: "ಜಿಎಸ್‌ಟಿ ನೋಂದಣಿ",
          name: "ಜಿಎಸ್‌ಟಿಐಎನ್ ನೋಂದಣಿ ಪ್ರೋಟೋಕಾಲ್",
          description: "ವಾಣಿಜ್ಯ ಬಿಲ್ಲಿಂಗ್‌ಗಾಗಿ ಚಾಲ್ತಿಯಲ್ಲಿರುವ 15 ಅಂಕಿಯ ಜಿಎಸ್‌ಟಿ ಸಂಖ್ಯೆಯನ್ನು ಒದಗಿಸಿ."
        },
        representative: {
          shortLabel: "ಅಧಿಕೃತ ಪ್ರತಿನಿಧಿ",
          name: "ಸಿಇಒ / ನಿರ್ದೇಶಕರ ಗುರುತಿನ ಪರಿಶೀಲನೆ",
          description: "ಅಧಿಕೃತ ಪ್ರತಿನಿಧಿಯ (ಸಿಇಒ/ಅಧ್ಯಕ್ಷ) ಆಧಾರ್/ಪ್ಯಾನ್ ಪರಿಶೀಲಿಸಿ."
        },
        orgBank: {
          shortLabel: "ಎಫ್‌ಪಿಒ ಬ್ಯಾಂಕ್ ಖಾತೆ",
          name: "ಸಂಸ್ಥೆಯ ಪಾವತಿ ಖಾತೆ ಪ್ರೋಟೋಕಾಲ್",
          description: "ಎಫ್‌ಪಿಒ ಹೆಸರಿನಲ್ಲಿ ನೋಂದಾಯಿಸಲಾದ ಚಾಲ್ತಿ ಬ್ಯಾಂಕ್ ಖಾತೆಯನ್ನು ಲಿಂಕ್ ಮಾಡಿ."
        },
        orgDocuments: {
          shortLabel: "ನಿರ್ದೇಶಕರ ಮಂಡಳಿ ನಿರ್ಣಯ",
          name: "ಮಂಡಳಿಯ ನಿರ್ಣಯ ಮತ್ತು ಆಡಿಟ್ ಅನುಸರಣೆ ಪ್ರೋಟೋಕಾಲ್",
          description: "ವ್ಯಾಪಾರ ಚಟುವಟಿಕೆಗಳನ್ನು ಅಧಿಕೃತಗೊಳಿಸುವ ನಿರ್ಣಯ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನಾ ವರದಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
        }
      }
    },
    transporter: {
      portalTitle: "ಸಾರಿಗೆದಾರರ ಪರಿಶೀಲನೆ ಪೋರ್ಟಲ್",
      pageTitle: "ಸಾರಿಗೆದಾರರ ನೋಂದಣಿ ಮತ್ತು ಪರಿಶೀಲನೆ",
      badgeText: "✓ ಪರಿಶೀಲಿಸಿದ ಸಾರಿಗೆದಾರ",
      incompleteBadgeText: "ಸರಕು ಸಾಗಣೆ ದರಗಳನ್ನು ಸ್ವೀಕರಿಸಲು ಸಾರಿಗೆದಾರರ ಪರಿಶೀಲನೆಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
      steps: {
        basicDetails: {
          shortLabel: "ಮೂಲ ವಿವರಗಳು",
          name: "ಮೂಲ ಸಾರಿಗೆದಾರ ಮತ್ತು ಕಂಪನಿ ವಿವರಗಳು",
          description: "ಕಂಪನಿಯ ಹೆಸರು, ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ, ಮೊಬೈಲ್, ಇಮೇಲ್ ಮತ್ತು ಸೇವಾ ಪ್ರದೇಶಗಳು."
        },
        identity: {
          shortLabel: "ಗುರುತಿನ ಪರಿಶೀಲನೆ",
          name: "ಗುರುತಿನ ಪರಿಶೀಲನೆ (ಆಧಾರ್ / ಪ್ಯಾನ್)",
          description: "ಮಾಲೀಕರು ಅಥವಾ ಅಧಿಕೃತ ಉದ್ಯಮ ಮಾಲೀಕರ ಗುರುತಿನ ಪರಿಶೀಲನೆ."
        },
        businessRegistration: {
          shortLabel: "ಉದ್ಯಮ ನೋಂದಣಿ",
          name: "ಉದ್ಯಮ ನೋಂದಣಿ ಮತ್ತು ತೆರಿಗೆ (ಜಿಎಸ್‌ಟಿ / ಉದ್ಯಮ್)",
          description: "ಐಚ್ಛಿಕ ಉದ್ಯಮ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ ಅಥವಾ ಜಿಎಸ್‌ಟಿ ನೋಂದಣಿ."
        },
        bankAccount: {
          shortLabel: "ಬ್ಯಾಂಕ್ ಪಾವತಿ",
          name: "ಬ್ಯಾಂಕ್ ಖಾತೆ ಪರಿಶೀಲನೆ",
          description: "ನೇರ ಸರಕು ಸಾಗಣೆ ಪಾವತಿಗಳಿಗಾಗಿ ಪರಿಶೀಲಿಸಿದ ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳು."
        },
        vehiclesStep: {
          shortLabel: "ವಾಹನಗಳ RC",
          name: "ವಾಹನಗಳ ಸಮೂಹ ಮತ್ತು ದಾಖಲೆಗಳ ಪರಿಶೀಲನೆ",
          description: "RC, ವಿಮೆ, ಫಿಟ್‌ನೆಸ್ ಮತ್ತು PUC ಪ್ರಮಾಣಪತ್ರಗಳೊಂದಿಗೆ ನೋಂದಾಯಿಸಲಾದ ವಾಹನಗಳು."
        },
        driversStep: {
          shortLabel: "ಚಾಲಕರ ಪಟ್ಟಿ",
          name: "ಚಾಲಕರ ರೋಸ್ಟರ್ ಮತ್ತು ಚಾಲನಾ ಪರವಾನಗಿ ಪರಿಶೀಲನೆ",
          description: "ಚಾಲಕರ ವಿವರಗಳು ಮತ್ತು ಚಾಲ್ತಿಯಲ್ಲಿರುವ ವಾಣಿಜ್ಯ ಚಾಲನಾ ಪರವಾನಗಿ ಪರಿಶೀಲನೆ."
        }
      }
    }
  },
  ml: {
    farmer: {
      portalTitle: "ഇന്ത്യൻ സർക്കാർ ദേശീയ കാർഷിക കർഷക പരിശോധന സേവനം",
      pageTitle: "ഔദ്യോഗിക തിരിച്ചറിയൽ & അനുസരണ പോർട്ടൽ",
      badgeText: "✓ വെരിഫൈഡ് കർഷകൻ",
      incompleteBadgeText: "തീർപ്പുകൽപ്പിക്കാത്ത പരിശോധനകൾ പൂർത്തിയാക്കാനും നിങ്ങളുടെ സ്ഥിരീകരിച്ച വിൽപ്പനക്കാരന്റെ ബാഡ്ജ് നേടാനും ഏത് സമയത്തും തിരികെ വരാം.",
      steps: {
        aadhaar: {
          shortLabel: "ആധാർ പരിശോധന",
          name: "ആധാർ ഓതന്റിക്കേഷൻ പ്രോട്ടോക്കോൾ",
          description: "UIDAI പോർട്ടൽ വഴി OTP ലഭിക്കുന്നതിന് നിങ്ങളുടെ 12 അക്ക ആധാർ നമ്പർ നൽകുക."
        },
        farmerRegistry: {
          shortLabel: "കർഷക രജിസ്ട്രി",
          name: "കർഷക ഡാറ്റാബേസ് പ്രോട്ടോക്കോൾ",
          description: "സജീവ കാർഷിക രജിസ്ട്രി സ്റ്റാറ്റസ് പരിശോധിക്കുന്നതിന് നിങ്ങളുടെ ഔദ്യോഗിക ഫാർമർ / അഗ്രിസ്റ്റാക്ക് ഐഡി നൽകുക."
        },
        landRecord: {
          shortLabel: "ഭൂമി രേഖ",
          name: "ഭൂമി ഉടമസ്ഥാവകാശ പ്രോട്ടോക്കോൾ",
          description: "സംസ്ഥാനം, ജില്ല, താലൂക്ക്, വില്ലേജ്, പട്ടയം / 7-12 നമ്പർ, സർവേ നമ്പർ, മൊത്തം വിസ്തീർണം എന്നിവ നൽകുക."
        },
        bankAccount: {
          shortLabel: "ബാങ്ക് അക്കൗണ്ട്",
          name: "ബാങ്ക് സെറ്റിൽമെന്റ് പ്രോട്ടോക്കോൾ",
          description: "നേരിട്ടുള്ള പേയ്‌മെന്റുകൾക്കും സെയിൽസ് സെറ്റിൽമെന്റുകൾക്കുമായി നിങ്ങളുടെ ബാങ്ക് അക്കൗണ്ട് ലിങ്ക് ചെയ്യുക."
        },
        pan: {
          shortLabel: "പാൻ പരിശോധന",
          name: "പാൻ കാർഡ് പ്രോട്ടോക്കോൾ",
          description: "നികുതി അനുസരണത്തിനും പേയ്‌മെന്റുകൾക്കുമായി നിങ്ങളുടെ 10 അക്ക പാൻ നമ്പർ നൽകുക."
        },
        pmKisan: {
          shortLabel: "പിഎം-കിസാൻ",
          name: "പിഎം-കിസാൻ പദ്ധതി പ്രോട്ടോക്കോൾ",
          description: "വിപണിയിലെ വിശ്വാസ്യതയ്ക്കായി പിഎം-കിസാൻ റഫറൻസ് നമ്പർ ലിങ്ക് ചെയ്യുക."
        }
      }
    },
    fpo: {
      portalTitle: "ദേശീയ എഫ്‌പിഒ അനുസരണ & ഭരണ സേവനം",
      pageTitle: "എഫ്‌പിഒ തിരിച്ചറിയൽ & നിയമപരമായ പരിശോധനാ പോർട്ടൽ",
      badgeText: "✓ വെരിഫൈഡ് എഫ്‌പിഒ ഓർഗനൈസേഷൻ",
      incompleteBadgeText: "ബൾക്ക് കാർഷിക ലിസ്റ്റിംഗുകൾ നൽകുന്നതിന് എഫ്‌പിഒ പരിശോധനാ ഘട്ടങ്ങൾ പൂർത്തിയാക്കുക.",
      steps: {
        orgIdentity: {
          shortLabel: "എഫ്‌പിഒ സർട്ടിഫിക്കറ്റ്",
          name: "എഫ്‌പിഒ രജിസ്ട്രേഷൻ പ്രോട്ടോക്കോൾ",
          description: "MCA ഇൻകോർപ്പറേഷൻ സർട്ടിഫിക്കറ്റ് അല്ലെങ്കിൽ സഹകരണ രജിസ്ട്രേഷൻ രേഖ അപ്‌ലോഡ് ചെയ്യുക."
        },
        orgPan: {
          shortLabel: "എഫ്‌പിഒ പാൻ",
          name: "എഫ്‌പിഒ കോർപ്പറേറ്റ് പാൻ പ്രോട്ടോക്കോൾ",
          description: "സ്ഥാപനത്തിന് നൽകിയ ഔദ്യോഗിക പാൻ നമ്പറും പകർപ്പും അപ്‌ലോഡ് ചെയ്യുക."
        },
        gstin: {
          shortLabel: "ജിഎസ്ടി രജിസ്ട്രേഷൻ",
          name: "ജിഎസ്ടിഐഎൻ രജിസ്ട്രേഷൻ പ്രോട്ടോക്കോൾ",
          description: "വാണിജ്യ ബില്ലിംഗിനായി സാധുവായ 15 അക്ക ജിഎസ്ടി നമ്പർ നൽകുക."
        },
        representative: {
          shortLabel: "അധികൃത പ്രതിനിധി",
          name: "സിഇഒ / ഡയറക്ടർ തിരിച്ചറിയൽ പരിശോധന",
          description: "അധികൃത പ്രതിനിധിയുടെ (സിഇഒ/ചെയർമാൻ) ആധാർ/പാൻ പരിശോധിക്കുക."
        },
        orgBank: {
          shortLabel: "എഫ്‌പിഒ ബാങ്ക് അക്കൗണ്ട്",
          name: "സ്ഥാപന സെറ്റിൽമെന്റ് അക്കൗണ്ട് പ്രോട്ടോക്കോൾ",
          description: "എഫ്‌പിഒ പേരിൽ രജിസ്റ്റർ ചെയ്ത കറന്റ് ബാങ്ക് അക്കൗണ്ട് ലിങ്ക് ചെയ്യുക."
        },
        orgDocuments: {
          shortLabel: "ഡയറക്ടർ ബോർഡ് പ്രമേയം",
          name: "ബോർഡ് പ്രമേയവും ഓഡിറ്റ് അനുസരണ പ്രോട്ടോക്കോളും",
          description: "വ്യാപാര പ്രവർത്തനങ്ങൾക്ക് അനുമതി നൽകുന്ന പ്രമേയവും ഓഡിറ്റ് റിപ്പോർട്ടും അപ്‌ലോഡ് ചെയ്യുക."
        }
      }
    },
    transporter: {
      portalTitle: "ട്രാൻസ്പോർട്ടർ പരിശോധനാ പോർട്ടൽ",
      pageTitle: "ട്രാൻസ്പോർട്ടർ രജിസ്ട്രേഷനും പരിശോധനയും",
      badgeText: "✓ വെരിഫൈഡ് ട്രാൻസ്പോർട്ടർ",
      incompleteBadgeText: "ചരക്ക് നിരക്കുകൾ സ്വീകരിച്ചു തുടങ്ങാൻ ട്രാൻസ്പോർട്ടർ പരിശോധന പൂർത്തിയാക്കുക.",
      steps: {
        basicDetails: {
          shortLabel: "അടിസ്ഥാന വിവരങ്ങൾ",
          name: "അടിസ്ഥാന ട്രാൻസ്പോർട്ടർ & കമ്പനി വിവരങ്ങൾ",
          description: "കമ്പനിയുടെ പേര്, ബന്ധപ്പെടേണ്ട വ്യക്തി, മൊബൈൽ, ഇമെയിൽ, സേവന മേഖലകൾ."
        },
        identity: {
          shortLabel: "തിരിച്ചറിയൽ പരിശോധന",
          name: "തിരിച്ചറിയൽ പരിശോധന (ആധാർ / പാൻ)",
          description: "ഉടമയുടെ അല്ലെങ്കിൽ അധികൃത ബിസിനസ് ഉടമയുടെ തിരിച്ചറിയൽ പരിശോധന."
        },
        businessRegistration: {
          shortLabel: "ബിസിനസ് രജിസ്ട്രേഷൻ",
          name: "ബിസിനസ് രജിസ്ട്രേഷനും നികുതിയും (ജിഎസ്ടി / ഉദ്യം)",
          description: "ഓപ്ഷണൽ ബിസിനസ് രജിസ്ട്രേഷൻ സർട്ടിഫിക്കറ്റ് അല്ലെങ്കിൽ ജിഎസ്ടി രജിസ്ട്രേഷൻ."
        },
        bankAccount: {
          shortLabel: "ബാങ്ക് പേയ്‌മെന്റ്",
          name: "ബാങ്ക് അക്കൗണ്ട് പരിശോധന",
          description: "നേരിട്ടുള്ള ചരക്ക് പേയ്‌മെന്റുകൾക്കായി പരിശോധിച്ച ബാങ്ക് അക്കൗണ്ട് വിവരങ്ങൾ."
        },
        vehiclesStep: {
          shortLabel: "വാഹനങ്ങൾ RC",
          name: "വാഹന നിരയും രേഖ പരിശോധനയും",
          description: "RC, ഇൻഷുറൻസ്, ഫിറ്റ്നസ്, PUC സർട്ടിഫിക്കറ്റുകളോടെ രജിസ്റ്റർ ചെയ്ത വാഹനങ്ങൾ."
        },
        driversStep: {
          shortLabel: "ഡ്രൈവർമാരുടെ പട്ടിക",
          name: "ഡ്രൈവർ റോസ്റ്ററും ലൈസൻസ് പരിശോധനയും",
          description: "ഡ്രൈവർ വിവരങ്ങളും സാധുവായ കൊമേഴ്‌സ്യൽ ഡ്രൈവിംഗ് ലൈസൻസ് പരിശോധനയും."
        }
      }
    }
  }
};

const locales = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

locales.forEach(loc => {
  const filePath = path.join(rootDir, 'frontend', 'src', 'i18n', 'locales', loc, 'translation.json');
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    // Clean single-character garbage keys if present
    ['r', 'c', 'b', 'm', 'p', 'v'].forEach(key => {
      if (data[key] && typeof data[key] === 'object' && Object.keys(data[key]).length <= 5) {
        delete data[key];
      }
    });

    // Inject verificationConfigs
    data.verificationConfigs = verificationConfigsDict[loc];

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated verificationConfigs for ${loc}`);
  }
});
