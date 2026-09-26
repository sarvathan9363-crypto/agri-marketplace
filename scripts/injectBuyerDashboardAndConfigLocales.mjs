import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.resolve(__dirname, '../frontend/src/i18n/locales');

const buyerVerificationConfigLocales = {
  en: {
    buyerVerificationConfig: {
      INDIVIDUAL: {
        portalTitle: "Individual Buyer Verification",
        pageTitle: "Buyer Verification Status",
        badgeText: "Verified Individual Buyer",
        incompleteBadgeText: "Verification Pending",
        steps: {
          mobile: {
            shortLabel: "Mobile",
            name: "Mobile Verification",
            description: "Verify mobile number for notification and alert access."
          },
          identity: {
            shortLabel: "Identity",
            name: "Aadhaar / Identity Proof",
            description: "Upload front & back copy of government identity proof."
          },
          address: {
            shortLabel: "Address",
            name: "Address Verification",
            description: "Provide verified delivery & billing address details."
          },
          summary: {
            shortLabel: "Summary",
            name: "Verification Summary",
            description: "Review and submit your individual verification application."
          }
        }
      },
      BUSINESS: {
        portalTitle: "Business Buyer Verification",
        pageTitle: "Corporate Verification Status",
        badgeText: "Verified Business Buyer",
        incompleteBadgeText: "Business Verification Pending",
        steps: {
          business: {
            shortLabel: "Business",
            name: "Business Details",
            description: "Enter legal entity name, type, and registered address."
          },
          pan: {
            shortLabel: "PAN",
            name: "Business PAN Card",
            description: "Provide registered company or firm PAN details."
          },
          gstin: {
            shortLabel: "GSTIN",
            name: "GSTIN Registration",
            description: "Provide Goods and Services Tax Identification Number."
          },
          businessRegistration: {
            shortLabel: "Registration",
            name: "Certificate of Incorporation / Registration",
            description: "Upload official business registration certificate."
          },
          representative: {
            shortLabel: "Representative",
            name: "Authorized Representative",
            description: "Provide manager or authorized signatory details."
          },
          bank: {
            shortLabel: "Bank",
            name: "Bank Account Details",
            description: "Provide commercial bank account details for billing."
          },
          documents: {
            shortLabel: "Documents",
            name: "Supporting Documents",
            description: "Upload additional business verification documents."
          },
          summary: {
            shortLabel: "Summary",
            name: "Verification Review",
            description: "Review company details before submitting application."
          }
        }
      },
      BULK_BUYER: {
        portalTitle: "Bulk / Wholesale Buyer Verification",
        pageTitle: "Wholesale License Verification",
        badgeText: "Verified Bulk Wholesale Buyer",
        incompleteBadgeText: "Wholesale Verification Pending",
        steps: {
          business: {
            shortLabel: "Business",
            name: "Wholesale Enterprise Details",
            description: "Enter wholesale company name, operational scope, and address."
          },
          pan: {
            shortLabel: "PAN",
            name: "Enterprise PAN",
            description: "Provide enterprise PAN document."
          },
          gstin: {
            shortLabel: "GSTIN",
            name: "Wholesale GSTIN",
            description: "Provide registered GSTIN details."
          },
          businessRegistration: {
            shortLabel: "Registration",
            name: "Trade / Registration Certificate",
            description: "Upload commercial trade license or registration certificate."
          },
          udyam: {
            shortLabel: "Udyam",
            name: "Udyam MSME Registration",
            description: "Provide MSME Udyam registration certificate."
          },
          representative: {
            shortLabel: "Representative",
            name: "Wholesale Contact Person",
            description: "Provide primary contact and authorized representative info."
          },
          bank: {
            shortLabel: "Bank",
            name: "Settlement Bank Account",
            description: "Provide bank details for high-volume trade settlements."
          },
          fssai: {
            shortLabel: "FSSAI",
            name: "FSSAI Food Safety License",
            description: "Provide FSSAI food trade license if dealing in food items."
          },
          documents: {
            shortLabel: "Documents",
            name: "Wholesale Licenses & Permits",
            description: "Upload trade permits, mandi licenses, and tax documents."
          },
          summary: {
            shortLabel: "Summary",
            name: "Final Wholesale Review",
            description: "Review all wholesale documentation before submission."
          }
        }
      }
    }
  },
  ta: {
    buyerVerificationConfig: {
      INDIVIDUAL: {
        portalTitle: "தனிநபர் வாங்குபவர் சரிபார்ப்பு",
        pageTitle: "வாங்குபவர் சரிபார்ப்பு நிலை",
        badgeText: "சரிபார்க்கப்பட்ட தனிநபர் வாங்குபவர்",
        incompleteBadgeText: "சரிபார்ப்பு நிலுவையில் உள்ளது",
        steps: {
          mobile: {
            shortLabel: "மொபைல்",
            name: "மொபைல் சரிபார்ப்பு",
            description: "அறிவிப்புகள் மற்றும் விழிப்பூட்டல்களைப் பெற மொபைல் எண்ணைச் சரிபார்க்கவும்."
          },
          identity: {
            shortLabel: "அடையாளம்",
            name: "ஆதார் / அடையாளச் சான்று",
            description: "அரசு அடையாளச் சான்றின் முன் & பின் நகலை பதிவேற்றவும்."
          },
          address: {
            shortLabel: "முகவரி",
            name: "முகவரி சரிபார்ப்பு",
            description: "சரிபார்க்கப்பட்ட விநியோகம் & கட்டண முகவரி விவரங்களை வழங்கவும்."
          },
          summary: {
            shortLabel: "சுருக்கம்",
            name: "சரிபார்ப்பு சுருக்கம்",
            description: "உங்கள் தனிநபர் சரிபார்ப்பு விண்ணப்பத்தை மதிப்பாய்வு செய்து சமர்ப்பிக்கவும்."
          }
        }
      },
      BUSINESS: {
        portalTitle: "வணிக வாங்குபவர் சரிபார்ப்பு",
        pageTitle: "நிறுவன சரிபார்ப்பு நிலை",
        badgeText: "சரிபார்க்கப்பட்ட வணிக வாங்குபவர்",
        incompleteBadgeText: "வணிக சரிபார்ப்பு நிலுவையில் உள்ளது",
        steps: {
          business: {
            shortLabel: "வணிகம்",
            name: "வணிக விவரங்கள்",
            description: "சட்டப்பூர்வ நிறுவனத்தின் பெயர், வகை மற்றும் பதிவுசெய்த முகவரியை உள்ளிடவும்."
          },
          pan: {
            shortLabel: "பான்",
            name: "வணிக பான் கார்டு",
            description: "பதிவுசெய்த நிறுவனம் அல்லது அமைப்பின் பான் விவரங்களை வழங்கவும்."
          },
          gstin: {
            shortLabel: "ஜிஎஸ்டிஐஎன்",
            name: "ஜிஎஸ்டிஐஎன் பதிவு",
            description: "சரக்கு மற்றும் சேவை வரி அடையாள எண்ணை வழங்கவும்."
          },
          businessRegistration: {
            shortLabel: "பதிவு",
            name: "நிறுவன பதிவுச் சான்றிதழ்",
            description: "அதிகாரப்பூர்வ வணிகப் பதிவுச் சான்றிதழைப் பதிவேற்றவும்."
          },
          representative: {
            shortLabel: "பிரதிநிதி",
            name: "அதிகாரம் பெற்ற பிரதிநிதி",
            description: "மேலாளர் அல்லது அதிகாரம் பெற்ற கையொப்பமிட்டவர் விவரங்களை வழங்கவும்."
          },
          bank: {
            shortLabel: "வங்கி",
            name: "வங்கி கணக்கு விவரங்கள்",
            description: "கட்டணப் பரிவர்த்தனைகளுக்கான வணிக வங்கி கணக்கு விவரங்களை வழங்கவும்."
          },
          documents: {
            shortLabel: "ஆவணங்கள்",
            name: "துணை ஆவணங்கள்",
            description: "கூடுதல் வணிக சரிபார்ப்பு ஆவணங்களைப் பதிவேற்றவும்."
          },
          summary: {
            shortLabel: "சுருக்கம்",
            name: "சரிபார்ப்பு மதிப்பாய்வு",
            description: "விண்ணப்பத்தைச் சமர்ப்பிப்பதற்கு முன் நிறுவனத்தின் விவரங்களை மதிப்பாய்வு செய்யவும்."
          }
        }
      },
      BULK_BUYER: {
        portalTitle: "மொத்த விற்பனை வாங்குபவர் சரிபார்ப்பு",
        pageTitle: "மொத்த விற்பனை உரிம சரிபார்ப்பு",
        badgeText: "சரிபார்க்கப்பட்ட மொத்த விற்பனை வாங்குபவர்",
        incompleteBadgeText: "மொத்த விற்பனை சரிபார்ப்பு நிலுவையில் உள்ளது",
        steps: {
          business: {
            shortLabel: "வணிகம்",
            name: "மொத்த விற்பனை நிறுவன விவரங்கள்",
            description: "மொத்த விற்பனை நிறுவனத்தின் பெயர், செயல்பாட்டு எல்லை மற்றும் முகவரியை உள்ளிடவும்."
          },
          pan: {
            shortLabel: "பான்",
            name: "நிறுவன பான்",
            description: "நிறுவன பான் ஆவணத்தை வழங்கவும்."
          },
          gstin: {
            shortLabel: "ஜிஎஸ்டிஐஎன்",
            name: "மொத்த விற்பனை ஜிஎஸ்டிஐஎன்",
            description: "பதிவுசெய்த ஜிஎஸ்டிஐஎன் விவரங்களை வழங்கவும்."
          },
          businessRegistration: {
            shortLabel: "பதிவு",
            name: "வர்த்தக / பதிவுச் சான்றிதழ்",
            description: "வணிக வர்த்தக உரிமம் அல்லது பதிவுச் சான்றிதழைப் பதிவேற்றவும்."
          },
          udyam: {
            shortLabel: "உத்யம்",
            name: "உத்யம் எம்எஸ்எம்இ பதிவு",
            description: "எம்எஸ்எம்இ உத்யம் பதிவுச் சான்றிதழை வழங்கவும்."
          },
          representative: {
            shortLabel: "பிரதிநிதி",
            name: "மொத்த விற்பனை தொடர்பு நபர்",
            description: "முதன்மைத் தொடர்பு மற்றும் அதிகாரம் பெற்ற பிரதிநிதி தகவலை வழங்கவும்."
          },
          bank: {
            shortLabel: "வங்கி",
            name: "தீர்வு வங்கி கணக்கு",
            description: "பெரிய அளவிலான வர்த்தகத் தீர்வுகளுக்கான வங்கி விவரங்களை வழங்கவும்."
          },
          fssai: {
            shortLabel: "எஃப்எஸ்எஸ்ஏஐ",
            name: "எஃப்எஸ்எஸ்ஏஐ உணவுப் பாதுகாப்பு உரிமம்",
            description: "உணவுப் பொருட்களைக் கையாளும் பட்சத்தில் எஃப்எஸ்எஸ்ஏஐ உரிமத்தை வழங்கவும்."
          },
          documents: {
            shortLabel: "ஆவணங்கள்",
            name: "மொத்த விற்பனை உரிமங்கள் & அனுமதிகள்",
            description: "வர்த்தக அனுமதிகள், மண்டி உரிமங்கள் மற்றும் வரி ஆவணங்களைப் பதிவேற்றவும்."
          },
          summary: {
            shortLabel: "சுருக்கம்",
            name: "இறுதி மொத்த விற்பனை மதிப்பாய்வு",
            description: "சமர்ப்பிப்பதற்கு முன் அனைத்து மொத்த விற்பனை ஆவணங்களையும் மதிப்பாய்வு செய்யவும்."
          }
        }
      }
    }
  },
  hi: {
    buyerVerificationConfig: {
      INDIVIDUAL: {
        portalTitle: "व्यक्तिगत खरीदार सत्यापन",
        pageTitle: "खरीदार सत्यापन स्थिति",
        badgeText: "सत्यापित व्यक्तिगत खरीदार",
        incompleteBadgeText: "सत्यापन लंबित",
        steps: {
          mobile: {
            shortLabel: "मोबाइल",
            name: "मोबाइल सत्यापन",
            description: "अधिसूचना और अलर्ट एक्सेस के लिए मोबाइल नंबर सत्यापित करें।"
          },
          identity: {
            shortLabel: "पहचान",
            name: "आधार / पहचान प्रमाण",
            description: "सरकारी पहचान प्रमाण की फ्रंट और बैक कॉपी अपलोड करें।"
          },
          address: {
            shortLabel: "पता",
            name: "पता सत्यापन",
            description: "सत्यापित डिलीवरी और बिलिंग पते का विवरण प्रदान करें।"
          },
          summary: {
            shortLabel: "सारांश",
            name: "सत्यापन सारांश",
            description: "अपने व्यक्तिगत सत्यापन आवेदन की समीक्षा करें और जमा करें।"
          }
        }
      },
      BUSINESS: {
        portalTitle: "व्यावसायिक खरीदार सत्यापन",
        pageTitle: "कॉर्पोरेट सत्यापन स्थिति",
        badgeText: "सत्यापित व्यावसायिक खरीदार",
        incompleteBadgeText: "व्यावसायिक सत्यापन लंबित",
        steps: {
          business: {
            shortLabel: "व्यवसाय",
            name: "व्यावसायिक विवरण",
            description: "कानूनी संस्था का नाम, प्रकार और पंजीकृत पता दर्ज करें।"
          },
          pan: {
            shortLabel: "पैन",
            name: "व्यावसायिक पैन कार्ड",
            description: "पंजीकृत कंपनी या फर्म के पैन विवरण प्रदान करें।"
          },
          gstin: {
            shortLabel: "जीएसटीआईएन",
            name: "जीएसटीआईएन पंजीकरण",
            description: "वस्तु एवं सेवा कर पहचान संख्या प्रदान करें।"
          },
          businessRegistration: {
            shortLabel: "पंजीकरण",
            name: "निगमन / पंजीकरण प्रमाणपत्र",
            description: "आधिकारिक व्यवसाय पंजीकरण प्रमाणपत्र अपलोड करें।"
          },
          representative: {
            shortLabel: "प्रतिनिधि",
            name: "अधिकृत प्रतिनिधि",
            description: "प्रबंधक या अधिकृत हस्ताक्षरकर्ता का विवरण प्रदान करें।"
          },
          bank: {
            shortLabel: "बैंक",
            name: "बैंक खाता विवरण",
            description: "बिलिंग के लिए व्यावसायिक बैंक खाता विवरण प्रदान करें।"
          },
          documents: {
            shortLabel: "दस्तावेज़",
            name: "सहायक दस्तावेज़",
            description: "अतिरिक्त व्यवसाय सत्यापन दस्तावेज़ अपलोड करें।"
          },
          summary: {
            shortLabel: "सारांश",
            name: "सत्यापन समीक्षा",
            description: "आवेदन जमा करने से पहले कंपनी के विवरण की समीक्षा करें।"
          }
        }
      },
      BULK_BUYER: {
        portalTitle: "थोक खरीदार सत्यापन",
        pageTitle: "थोक लाइसेंस सत्यापन",
        badgeText: "सत्यापित थोक खरीदार",
        incompleteBadgeText: "थोक सत्यापन लंबित",
        steps: {
          business: {
            shortLabel: "व्यवसाय",
            name: "थोक उद्यम विवरण",
            description: "थोक कंपनी का नाम, संचालन क्षेत्र और पता दर्ज करें।"
          },
          pan: {
            shortLabel: "पैन",
            name: "उद्यम पैन",
            description: "उद्यम पैन दस्तावेज़ प्रदान करें।"
          },
          gstin: {
            shortLabel: "जीएसटीआईएन",
            name: "थोक जीएसटीआईएन",
            description: "पंजीकृत जीएसटीआईएन विवरण प्रदान करें।"
          },
          businessRegistration: {
            shortLabel: "पंजीकरण",
            name: "व्यापार / पंजीकरण प्रमाणपत्र",
            description: "व्यावसायिक व्यापार लाइसेंस या पंजीकरण प्रमाणपत्र अपलोड करें।"
          },
          udyam: {
            shortLabel: "उद्यम",
            name: "उद्यम एमएसएमई पंजीकरण",
            description: "एमएसएमई उद्यम पंजीकरण प्रमाणपत्र प्रदान करें।"
          },
          representative: {
            shortLabel: "प्रतिनिधि",
            name: "थोक संपर्क व्यक्ति",
            description: "प्राथमिक संपर्क और अधिकृत प्रतिनिधि जानकारी प्रदान करें।"
          },
          bank: {
            shortLabel: "बैंक",
            name: "निपटान बैंक खाता",
            description: "उच्च-मात्रा व्यापार निपटान के लिए बैंक विवरण प्रदान करें।"
          },
          fssai: {
            shortLabel: "एफएसएसएआई",
            name: "एफएसएसएआई खाद्य सुरक्षा लाइसेंस",
            description: "खाद्य वस्तुओं में व्यापार करने पर एफएसएसएआई लाइसेंस प्रदान करें।"
          },
          documents: {
            shortLabel: "दस्तावेज़",
            name: "थोक लाइसेंस और परमिट",
            description: "व्यापार परमिट, मंडी लाइसेंस और कर दस्तावेज़ अपलोड करें।"
          },
          summary: {
            shortLabel: "सारांश",
            name: "अंतिम थोक समीक्षा",
            description: "जमा करने से पहले सभी थोक दस्तावेजों की समीक्षा करें।"
          }
        }
      }
    }
  },
  te: {
    buyerVerificationConfig: {
      INDIVIDUAL: {
        portalTitle: "వ్యక్తిగత కొనుగోలుదారు ధృవీకరణ",
        pageTitle: "కొనుగోలుదారు ధృవీకరణ స్థితి",
        badgeText: "ధృవీకరించబడిన వ్యక్తిగత కొనుగోలుదారు",
        incompleteBadgeText: "ధృవీకరణ పెండింగ్‌లో ఉంది",
        steps: {
          mobile: {
            shortLabel: "మొబైల్",
            name: "మొబైల్ ధృవీకరణ",
            description: "నోటిఫికేషన్‌లు మరియు अलर्टల ప్రాప్యత కోసం మొబైల్ నంబర్‌ను ధృవీకరించండి."
          },
          identity: {
            shortLabel: "గుర్తింపు",
            name: "ఆధార్ / గుర్తింపు రుజువు",
            description: "ప్రభుత్వ గుర్తింపు రుజువు యొక్క ముందు & వెనుక ప్రతిని అప్‌లోడ్ చేయండి."
          },
          address: {
            shortLabel: "చిరునామా",
            name: "చిరునామా ధృవీకరణ",
            description: "ధృవీకరించబడిన డెలివరీ & బిల్లింగ్ చిరునామా వివరాలను అందించండి."
          },
          summary: {
            shortLabel: "సారాంశం",
            name: "ధృవీకరణ సారాంశం",
            description: "మీ వ్యక్తిగత ధృవీకరణ దరఖాస్తును సమీక్షించి సమర్పించండి."
          }
        }
      },
      BUSINESS: {
        portalTitle: "వ్యాపార కొనుగోలుదారు ధృవీకరణ",
        pageTitle: "కార్పొరేట్ ధృవీకరణ స్థితి",
        badgeText: "ధృవీకరించబడిన వ్యాపార కొనుగోలుదారు",
        incompleteBadgeText: "వ్యాపార ధృవీకరణ పెండింగ్‌లో ఉంది",
        steps: {
          business: {
            shortLabel: "వ్యాపారం",
            name: "వ్యాపార వివరాలు",
            description: "చట్టపరమైన సంస్థ పేరు, రకం మరియు నమోదిత చిరునామాను నమోదు చేయండి."
          },
          pan: {
            shortLabel: "పాన్",
            name: "వ్యాపార పాన్ కార్డ్",
            description: "నమోదిత కంపెనీ లేదా సంస్థ యొక్క పాన్ వివరాలను అందించండి."
          },
          gstin: {
            shortLabel: "జిఎస్‌టిఐఎన్",
            name: "జిఎస్‌టిఐఎన్ నమోదు",
            description: "వస్తువులు మరియు సేవల పన్ను గుర్తింపు సంఖ్యను అందించండి."
          },
          businessRegistration: {
            shortLabel: "నమోదు",
            name: "సంస్థల నమోదు పత్రం",
            description: "అధికారిక వ్యాపార నమోదు పత్రాన్ని అప్‌లోడ్ చేయండి."
          },
          representative: {
            shortLabel: "ప్రతినిధి",
            name: "అధికారిక ప్రతినిధి",
            description: "మేనేజర్ లేదా అధికారిక సంతకం చేసేవారి వివరాలను అందించండి."
          },
          bank: {
            shortLabel: "బ్యాంక్",
            name: "బ్యాంక్ ఖాతా వివరాలు",
            description: "బిల్లింగ్ కోసం వాణిజ్య బ్యాంక్ ఖాతా వివరాలను అందించండి."
          },
          documents: {
            shortLabel: "పత్రాలు",
            name: "సహాయక పత్రాలు",
            description: "అదనపు వ్యాపార ధృవీకరణ పత్రాలను అప్‌లోడ్ చేయండి."
          },
          summary: {
            shortLabel: "సారాంశం",
            name: "ధృవీకరణ సమీక్ష",
            description: "దరఖాస్తు సమర్పించే ముందు కంపెనీ వివరాలను సమీక్షించండి."
          }
        }
      },
      BULK_BUYER: {
        portalTitle: "హాప్‌సేల్ కొనుగోలుదారు ధృవీకరణ",
        pageTitle: "హోల్‌సేల్ లైసెన్స్ ధృవీకరణ",
        badgeText: "ధృవీకరించబడిన హోల్‌సేల్ కొనుగోలుదారు",
        incompleteBadgeText: "హోల్‌సేల్ ధృవీకరణ పెండింగ్‌లో ఉంది",
        steps: {
          business: {
            shortLabel: "వ్యాపారం",
            name: "హోల్‌సేల్ సంస్థ వివరాలు",
            description: "హోల్‌సేల్ కంపెనీ పేరు, నిర్వహణ పరిధి మరియు చిరునామాను నమోదు చేయండి."
          },
          pan: {
            shortLabel: "పాన్",
            name: "సంస్థ పాన్",
            description: "సంస్థ పాన్ పత్రాన్ని అందించండి."
          },
          gstin: {
            shortLabel: "జిఎస్‌టిఐఎన్",
            name: "హోల్‌సేల్ జిఎస్‌టిఐఎన్",
            description: "నమోదిత జిఎస్‌టిఐఎన్ వివరాలను అందించండి."
          },
          businessRegistration: {
            shortLabel: "నమోదు",
            name: "వాణిజ్య / నమోదు పత్రం",
            description: "వాణిజ్య లైసెన్స్ లేదా నమోదు పత్రాన్ని అప్‌లోడ్ చేయండి."
          },
          udyam: {
            shortLabel: "ఉద్యమ్",
            name: "ఉద్యమ్ MSME నమోదు",
            description: "MSME ఉద్యమ్ నమోదు పత్రాన్ని అందించండి."
          },
          representative: {
            shortLabel: "ప్రతినిధి",
            name: "హోల్‌సేల్ సంప్రదింపు వ్యక్తి",
            description: "ప్రాథమిక సంప్రదింపు మరియు అధికారిక ప్రతినిధి సమాచారాన్ని అందించండి."
          },
          bank: {
            shortLabel: "బ్యాంక్",
            name: "సెటిల్మెంట్ బ్యాంక్ ఖాతా",
            description: "భారీ వర్తక సెటిల్మెంట్ల కోసం బ్యాంక్ వివరాలను అందించండి."
          },
          fssai: {
            shortLabel: "FSSAI",
            name: "FSSAI ఆహార భద్రత లైసెన్స్",
            description: "ఆహార పదార్థాల వర్తకం చేస్తే FSSAI లైసెన్స్‌ను అందించండి."
          },
          documents: {
            shortLabel: "పత్రాలు",
            name: "హోల్‌సేల్ లైసెన్స్‌లు & అనుమతులు",
            description: "వర్తక అనుమతులు, మండి లైసెన్స్‌లు మరియు పన్ను పత్రాలను అప్‌లోడ్ చేయండి."
          },
          summary: {
            shortLabel: "సారాంశం",
            name: "తుది హోల్‌సేల్ సమీక్ష",
            description: "సమర్పించే ముందు అన్ని హోల్‌సేల్ పత్రాలను సమీక్షించండి."
          }
        }
      }
    }
  },
  kn: {
    buyerVerificationConfig: {
      INDIVIDUAL: {
        portalTitle: "ವೈಯಕ್ತಿಕ ಖರೀದಿದಾರರ ಪರಿಶೀಲನೆ",
        pageTitle: "ಖರೀದಿದಾರರ ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ",
        badgeText: "ಪರಿಶೀಲಿಸಿದ ವೈಯಕ್ತಿಕ ಖರೀದಿದಾರ",
        incompleteBadgeText: "ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ",
        steps: {
          mobile: {
            shortLabel: "ಮೊಬೈಲ್",
            name: "ಮೊಬೈಲ್ ಪರಿಶೀಲನೆ",
            description: "ಸೂಚನೆ ಮತ್ತು ಎಚ್ಚರಿಕೆ ಪ್ರವೇಶಕ್ಕಾಗಿ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಿ."
          },
          identity: {
            shortLabel: "ಗುರುತು",
            name: "ಆಧಾರ್ / ಗುರುತಿನ ಪುರಾವೆ",
            description: "ಸರ್ಕಾರಿ ಗುರುತಿನ ಪುರಾವೆಯ ಮುಂಭಾಗ ಮತ್ತು ಹಿಂಭಾಗದ ಪ್ರತಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
          },
          address: {
            shortLabel: "ವಿಳಾಸ",
            name: "ವಿಳಾಸ ಪರಿಶೀಲನೆ",
            description: "ಪರಿಶೀಲಿಸಿದ ಡೆಲಿವರಿ ಮತ್ತು ಬಿಲ್ಲಿಂಗ್ ವಿಳಾಸದ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ."
          },
          summary: {
            shortLabel: "ಸಾರಾಂಶ",
            name: "ಪರಿಶೀಲನಾ ಸಾರಾಂಶ",
            description: "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಪರಿಶೀಲನಾ ಅರ್ಜಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ."
          }
        }
      },
      BUSINESS: {
        portalTitle: "ವ್ಯಾಪಾರ ಖರೀದಿದಾರರ ಪರಿಶೀಲನೆ",
        pageTitle: "ಸಂಸ್ಥೆಯ ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ",
        badgeText: "ಪರಿಶೀಲಿಸಿದ ವ್ಯಾಪಾರ ಖರೀದಿದಾರ",
        incompleteBadgeText: "ವ್ಯಾಪಾರ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ",
        steps: {
          business: {
            shortLabel: "ವ್ಯಾಪಾರ",
            name: "ವ್ಯಾಪಾರದ ವಿವರಗಳು",
            description: "ಕಾನೂನುಬದ್ಧ ಸಂಸ್ಥೆಯ ಹೆಸರು, ಪ್ರಕಾರ ಮತ್ತು ನೋಂದಾಯಿತ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ."
          },
          pan: {
            shortLabel: "ಪ್ಯಾನ್",
            name: "ವ್ಯಾಪಾರ ಪ್ಯಾನ್ ಕಾರ್ಡ್",
            description: "ನೋಂದಾಯಿತ ಕಂಪನಿ ಅಥವಾ ಸಂಸ್ಥೆಯ ಪ್ಯಾನ್ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ."
          },
          gstin: {
            shortLabel: "ಜಿಎಸ್‌ಟಿಐಎನ್",
            name: "ಜಿಎಸ್‌ಟಿಐಎನ್ ನೋಂದಣಿ",
            description: "ಸರಕು ಮತ್ತು ಸೇವಾ ತೆರಿಗೆ ಗುರುತಿನ ಸಂಖ್ಯೆಯನ್ನು ಒದಗಿಸಿ."
          },
          businessRegistration: {
            shortLabel: "ನೋಂದಣಿ",
            name: "ಸಂಸ್ಥೆಯ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ",
            description: "ಅಧಿಕೃತ ವ್ಯಾಪಾರ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
          },
          representative: {
            shortLabel: "ಪ್ರತಿನಿಧಿ",
            name: "ಅಧಿಕೃತ ಪ್ರತಿನಿಧಿ",
            description: "ಮ್ಯಾನೇಜರ್ ಅಥವಾ ಅಧಿಕೃತ ಸಹಿದಾರರ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ."
          },
          bank: {
            shortLabel: "ಬ್ಯಾಂಕ್",
            name: "ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳು",
            description: "ಬಿಲ್ಲಿಂಗ್‌ಗಾಗಿ ವಾಣಿಜ್ಯ ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ."
          },
          documents: {
            shortLabel: "ದಾಖಲೆಗಳು",
            name: "ಪೂರಕ ದಾಖಲೆಗಳು",
            description: "ಹೆಚ್ಚುವರಿ ವ್ಯಾಪಾರ ಪರಿಶೀಲನಾ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
          },
          summary: {
            shortLabel: "ಸಾರಾಂಶ",
            name: "ಪರಿಶೀಲನಾ ಪರಿಶೀಲನೆ",
            description: "ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಕಂಪನಿಯ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."
          }
        }
      },
      BULK_BUYER: {
        portalTitle: "ಸಗಟು ಖರೀದಿದಾರರ ಪರಿಶೀಲನೆ",
        pageTitle: "ಸಗಟು ಪರವಾನಗಿ ಪರಿಶೀಲನೆ",
        badgeText: "ಪರಿಶೀಲಿಸಿದ ಸಗಟು ಖರೀದಿದಾರ",
        incompleteBadgeText: "ಸಗಟು ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ",
        steps: {
          business: {
            shortLabel: "ವ್ಯಾಪಾರ",
            name: "ಸಗಟು ಸಂಸ್ಥೆಯ ವಿವರಗಳು",
            description: "ಸಗಟು ಕಂಪನಿಯ ಹೆಸರು, ಕಾರ್ಯಾಚರಣೆಯ ವ್ಯಾಪ್ತಿ ಮತ್ತು ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ."
          },
          pan: {
            shortLabel: "ಪ್ಯಾನ್",
            name: "ಸಂಸ್ಥೆಯ ಪ್ಯಾನ್",
            description: "ಸಂಸ್ಥೆಯ ಪ್ಯಾನ್ ದಾಖಲೆಯನ್ನು ಒದಗಿಸಿ."
          },
          gstin: {
            shortLabel: "ಜಿಎಸ್‌ಟಿಐಎನ್",
            name: "ಸಗಟು ಜಿಎಸ್‌ಟಿಐಎನ್",
            description: "ನೋಂದಾಯಿತ ಜಿಎಸ್‌ಟಿಐಎನ್ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ."
          },
          businessRegistration: {
            shortLabel: "ನೋಂದಣಿ",
            name: "ವಾಣಿಜ್ಯ / ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ",
            description: "ವಾಣಿಜ್ಯ ವ್ಯಾಪಾರ ಪರವಾನಗಿ ಅಥವಾ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
          },
          udyam: {
            shortLabel: "ಉದ್ಯಮ್",
            name: "ಉದ್ಯಮ್ MSME ನೋಂದಣಿ",
            description: "MSME ಉದ್ಯಮ್ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರವನ್ನು ಒದಗಿಸಿ."
          },
          representative: {
            shortLabel: "ಪ್ರತಿನಿಧಿ",
            name: "ಸಗಟು ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ",
            description: "ಪ್ರಾಥಮಿಕ ಸಂಪರ್ಕ ಮತ್ತು ಅಧಿಕೃತ ಪ್ರತಿನಿಧಿ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸಿ."
          },
          bank: {
            shortLabel: "ಬ್ಯಾಂಕ್",
            name: "ಇತ್ಯರ್ಥ ಬ್ಯಾಂಕ್ ಖಾತೆ",
            description: "ಹೆಚ್ಚಿನ ಪ್ರಮಾಣದ ವ್ಯಾಪಾರ ಇತ್ಯರ್ಥಗಳಿಗೆ ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ."
          },
          fssai: {
            shortLabel: "FSSAI",
            name: "FSSAI ಆಹಾರ ಸುರಕ್ಷತಾ ಪರವಾನಗಿ",
            description: "ಆಹಾರ ಪದಾರ್ಥಗಳ ವ್ಯಾಪಾರ ಮಾಡುತ್ತಿದ್ದರೆ FSSAI ಪರವಾನಗಿಯನ್ನು ಒದಗಿಸಿ."
          },
          documents: {
            shortLabel: "ದಾಖಲೆಗಳು",
            name: "ಸಗಟು ಪರವಾನಗಿಗಳು ಮತ್ತು ಅನುಮತಿಗಳು",
            description: "ವ್ಯಾಪಾರ ಅನುಮತಿಗಳು, ಮಂಡಿ ಪರವಾನಗಿಗಳು ಮತ್ತು ತೆರಿಗೆ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ."
          },
          summary: {
            shortLabel: "ಸಾರಾಂಶ",
            name: "ಅಂತಿಮ ಸಗಟು ಪರಿಶೀಲನೆ",
            description: "ಸಲ್ಲಿಸುವ ಮೊದಲು ಎಲ್ಲಾ ಸಗಟು ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ."
          }
        }
      }
    }
  },
  ml: {
    buyerVerificationConfig: {
      INDIVIDUAL: {
        portalTitle: "വ്യക്തിഗത വാങ്ങൽക്കാരന്റെ പരിശോധന",
        pageTitle: "വാങ്ങൽക്കാരന്റെ പരിശോധന അവസ്ഥ",
        badgeText: "പരിശോധിച്ച വ്യക്തിഗത വാങ്ങൽക്കാരൻ",
        incompleteBadgeText: "പരിശോധന നിലവിലുണ്ട്",
        steps: {
          mobile: {
            shortLabel: "മൊബൈൽ",
            name: "മൊബൈൽ പരിശോധന",
            description: "അറിയിപ്പുകൾ ലഭിക്കുന്നതിന് മൊബൈൽ നമ്പർ പരിശോധിക്കുക."
          },
          identity: {
            shortLabel: "തിരിച്ചറിയൽ",
            name: "ആധാർ / തിരിച്ചറിയൽ രേഖ",
            description: "ഔദ്യോഗിക തിരിച്ചറിയൽ രേഖയുടെ മുൻപിലെയും പിൻപിലെയും പകർപ്പ് അപ്‌ലോഡ് ചെയ്യുക."
          },
          address: {
            shortLabel: "മേൽവിലാസം",
            name: "മേൽവിലാസ പരിശോധന",
            description: "സ്ഥിരീകരിച്ച വിതരണ മേൽവിലാസ വിവരങ്ങൾ നൽകുക."
          },
          summary: {
            shortLabel: "ചുരുക്കം",
            name: "പരിശോധനാ ചുരുക്കം",
            description: "നിങ്ങളുടെ പരിശോധനാ അപേക്ഷ അവലോകനം ചെയ്ത് സമർപ്പിക്കുക."
          }
        }
      },
      BUSINESS: {
        portalTitle: "ബിസിനസ് വാങ്ങൽക്കാരന്റെ പരിശോധന",
        pageTitle: "കോർപ്പറേറ്റ് പരിശോധന അവസ്ഥ",
        badgeText: "പരിശോധിച്ച ബിസിനസ് വാങ്ങൽക്കാരൻ",
        incompleteBadgeText: "ബിസിനസ് പരിശോധന ബാക്കിയുണ്ട്",
        steps: {
          business: {
            shortLabel: "ബിസിനസ്",
            name: "ബിസിനസ് വിവരങ്ങൾ",
            description: "നിയമപരമായ സ്ഥാപനത്തിന്റെ പേരും വിലാസവും നൽകുക."
          },
          pan: {
            shortLabel: "പാൻ",
            name: "ബിസിനസ് പാൻ കാർഡ്",
            description: "കമ്പനി പാൻ വിവരങ്ങൾ നൽകുക."
          },
          gstin: {
            shortLabel: "ജിഎസ്ടിഐഎൻ",
            name: "ജിഎസ്ടിഐഎൻ രജിസ്ട്രേഷൻ",
            description: "ജിഎസ്ടി നമ്പർ നൽകുക."
          },
          businessRegistration: {
            shortLabel: "രജിസ്ട്രേഷൻ",
            name: "രജിസ്ട്രേഷൻ സർട്ടിഫിക്കറ്റ്",
            description: "ഔദ്യോഗിക ബിസിനസ് രജിസ്ട്രേഷൻ സർട്ടിഫിക്കറ്റ് അപ്‌ലോഡ് ചെയ്യുക."
          },
          representative: {
            shortLabel: "പ്രതിനിധി",
            name: "അംഗീകൃത പ്രതിനിധി",
            description: "ചുമതലയുള്ള വ്യക്തിയുടെ വിവരങ്ങൾ നൽകുക."
          },
          bank: {
            shortLabel: "ബാങ്ക്",
            name: "ബാങ്ക് അക്കൗണ്ട് വിവരങ്ങൾ",
            description: "ബിസിനസ് ബാങ്ക് അക്കൗണ്ട് വിവരങ്ങൾ നൽകുക."
          },
          documents: {
            shortLabel: "രേഖകൾ",
            name: "അനുബന്ധ രേഖകൾ",
            description: "കൂടുതൽ പരിശോധനാ രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക."
          },
          summary: {
            shortLabel: "ചുരുക്കം",
            name: "പരിശോധന വിലയിരുത്തൽ",
            description: "സമർപ്പിക്കുന്നതിന് മുൻപ് വിവരങ്ങൾ പരിശോധിച്ച് ഉറപ്പാക്കുക."
          }
        }
      },
      BULK_BUYER: {
        portalTitle: "ഹോൾസെയിൽ വാങ്ങൽക്കാരന്റെ പരിശോധന",
        pageTitle: "ഹോൾസെയിൽ ലൈസൻസ് പരിശോധന",
        badgeText: "പരിശോധിച്ച ഹോൾസെയിൽ വാങ്ങൽക്കാരൻ",
        incompleteBadgeText: "ഹോൾസെയിൽ പരിശോധന ബാക്കിയുണ്ട്",
        steps: {
          business: {
            shortLabel: "ബിസിനസ്",
            name: "ഹോൾസെയിൽ സ്ഥാപന വിവരങ്ങൾ",
            description: "ഹോൾസെയിൽ കമ്പനിയുടെ പേരും വിലാസവും നൽകുക."
          },
          pan: {
            shortLabel: "പാൻ",
            name: "സ്ഥാപന പാൻ",
            description: "സ്ഥാപനത്തിന്റെ പാൻ രേഖ നൽകുക."
          },
          gstin: {
            shortLabel: "ജിഎസ്ടിഐഎൻ",
            name: "ഹോൾസെയിൽ ജിഎസ്ടിഐഎൻ",
            description: "രജിസ്റ്റർ ചെയ്ത ജിഎസ്ടിഐഎൻ വിവരങ്ങൾ നൽകുക."
          },
          businessRegistration: {
            shortLabel: "രജിസ്ട്രേഷൻ",
            name: "ട്രേഡ് / രജിസ്ട്രേഷൻ സർട്ടിഫിക്കറ്റ്",
            description: "വ്യാപാര ലൈസൻസ് അപ്‌ലോഡ് ചെയ്യുക."
          },
          udyam: {
            shortLabel: "ഉദ്യം",
            name: "ഉദ്യം MSME രജിസ്ട്രേഷൻ",
            description: "MSME ഉദ്യം സർട്ടിഫിക്കറ്റ് നൽകുക."
          },
          representative: {
            shortLabel: "പ്രതിനിധി",
            name: "ഹോൾസെയിൽ ബന്ധപ്പെടേണ്ട വ്യക്തി",
            description: "പ്രധാന ബന്ധപ്പെടേണ്ട വിവരങ്ങൾ നൽകുക."
          },
          bank: {
            shortLabel: "ബാങ്ക്",
            name: "സെറ്റിൽമെന്റ് ബാങ്ക് അക്കൗണ്ട്",
            description: "വലിയ ഇടപാടുകൾക്കുള്ള ബാങ്ക് വിവരങ്ങൾ നൽകുക."
          },
          fssai: {
            shortLabel: "FSSAI",
            name: "FSSAI ഭക്ഷ്യ സുരക്ഷാ ലൈസൻസ്",
            description: "ഭക്ഷണസാധനങ്ങളുടെ വ്യാപാരത്തിന് FSSAI ലൈസൻസ് നൽകുക."
          },
          documents: {
            shortLabel: "രേഖകൾ",
            name: "ലൈസൻസുകളും പെർമിറ്റുകളും",
            description: "വ്യാപാര പെർമിറ്റുകളും നികുതി രേഖകളും അപ്‌ലോഡ് ചെയ്യുക."
          },
          summary: {
            shortLabel: "ചുരുക്കം",
            name: "അവസാന ഹോൾസെയിൽ വിലയിരുത്തൽ",
            description: "സമർപ്പിക്കുന്നതിന് മുൻപ് എല്ലാ രേഖകളും പരിശോധിക്കുക."
          }
        }
      }
    }
  }
};

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

for (const lang of Object.keys(buyerVerificationConfigLocales)) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    deepMerge(content, buyerVerificationConfigLocales[lang]);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    console.log(`Updated buyerVerificationConfig in ${lang}/translation.json`);
  }
}
