import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'frontend', 'src', 'i18n', 'locales');
const langs = ['en', 'ta', 'hi', 'te', 'kn', 'ml'];

const dicts = {};
langs.forEach(l => {
  dicts[l] = JSON.parse(fs.readFileSync(path.join(localesDir, l, 'translation.json'), 'utf8'));
});

function setDeep(obj, pathArr, value) {
  let curr = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    const key = pathArr[i];
    if (!curr[key] || typeof curr[key] !== 'object') {
      curr[key] = {};
    }
    curr = curr[key];
  }
  curr[pathArr[pathArr.length - 1]] = value;
}

const newTranslations = {
  roles: {
    individual: { en: "Individual Buyer", ta: "தனிநபர் வாங்குபவர்", hi: "व्यक्तिगत खरीदार", te: "వ్యక్తిగత కొనుగోలుదారు", kn: "ವೈಯಕ್ತಿಕ ಖರೀದಿದಾರ", ml: "വ്യക്തിഗത വാങ്ങുന്നയാൾ" },
    business: { en: "Business / Retailer", ta: "வணிகம் / சில்லறை விற்பனையாளர்", hi: "व्यवसाय / खुदरा विक्रेता", te: "వ్యాపారం / రిటైలర్", kn: "ವ್ಯವಹಾರ / ಚಿಲ್ಲರೆ ಮಾರಾಟಗಾರ", ml: "ബിസിനസ്സ് / റീട്ടെയിലർ" },
    bulkBuyer: { en: "Wholesale Bulk Buyer", ta: "மொத்த விற்பனை வாங்குபவர்", hi: "थोक खरीदार", te: "హోల్‌సేల్ బల్క్ కొనుగోలుదారు", kn: "ಸಗಟು ಖರೀದಿ ಗ್ರಾಹಕ", ml: "ഹോൾസെയിൽ ബൾക്ക് വാങ്ങുന്നയാൾ" },
    farmer: { en: "Individual Farmer", ta: "தனிநபர் விவசாயி", hi: "व्यक्तिगत किसान", te: "వ్యక్తిగత రైతు", kn: "ವೈಯಕ್ತಿಕ ರೈತ", ml: "വ്യക്തിഗത കർഷകൻ" },
    fpo: { en: "Farmer Producer Organization (FPO)", ta: "விவசாய உற்பத்தியாளர் அமைப்பு (FPO)", hi: "किसान उत्पादक संगठन (एफपीओ)", te: "రైతు ఉత్పత్తిదారుల సంస్థ (FPO)", kn: "ರೈತ ಉತ್ಪಾದಕರ ಸಂಸ್ಥೆ (FPO)", ml: "കർഷക ഉൽപാദക സംഘടന (FPO)" }
  },
  categories: {
    fruits: { en: "Fruits", ta: "பழங்கள்", hi: "फल", te: "పండ్లు", kn: "ಹಣ್ಣುಗಳು", ml: "പഴങ്ങൾ" },
    vegetables: { en: "Vegetables", ta: "காய்கறிகள்", hi: "सब्जियां", te: "కూరగాయలు", kn: "ತರಕಾರಿಗಳು", ml: "പച്ചക്കറികൾ" },
    grains: { en: "Grains & Rice", ta: "தானியங்கள் & அரிசி", hi: "अनाज और चावल", te: "ధాన్యాలు & బియ్యం", kn: "ಧಾನ್ಯಗಳು ಮತ್ತು ಅಕ್ಕಿ", ml: "ധാന്യങ്ങളും അരിയും" },
    pulses: { en: "Pulses & Dal", ta: "பருப்பு வகைகள்", hi: "दालें", te: "పప్పుధాన్యాలు", kn: "ಬೇಳೆಕಾಳುಗಳು", ml: "പയറുവർഗ്ഗങ്ങൾ" },
    spices: { en: "Pure Spices", ta: "நறுமணப் பொருட்கள்", hi: "मसाले", te: "సుగంధ ద్రవ్యాలు", kn: "ಸಾಂಬಾರು ಪದಾರ್ಥಗಳು", ml: "സുഗന്ധവ്യഞ്ജനങ്ങൾ" },
    millets: { en: "Millets", ta: "சிறுதானியங்கள்", hi: "बाजरा", te: "చిరుధాన్యాలు", kn: "ಸಿರಿಧಾನ್ಯಗಳು", ml: "ചാമധാന്യങ്ങൾ" },
    dairy: { en: "Dairy & Agro", ta: "பால் பொருட்கள்", hi: "डेयरी उत्पाद", te: "పాడి ఉత్పత్తులు", kn: "ಡೈರಿ ಉತ್ಪನ್ನಗಳು", ml: "ക്ഷീരോൽപ്പന്നങ്ങൾ" },
    other: { en: "Other Crop Produce", ta: "இதர பயிர் விளைபொருட்கள்", hi: "अन्य फसल उत्पाद", te: "ఇతర పంట ఉత్పత్తులు", kn: "ಇತರ ಬೆಳೆ ಉತ್ಪನ್ನಗಳು", ml: "മറ്റ് വിള ഉൽപ്പന്നങ്ങൾ" }
  },
  common: {
    allOrders: { en: "All Orders", ta: "அனைத்து ஆர்டர்கள்", hi: "सभी ऑर्डर", te: "అన్ని ఆర్డర్లు", kn: "ಎಲ್ಲಾ ಆರ್ಡರ್‌ಗಳು", ml: "എല്ലാ ഓർഡറുകളും" },
    payNow: { en: "Pay Now", ta: "இப்போது பணம் செலுத்துங்கள்", hi: "अभी भुगतान करें", te: "ఇప్పుడే చెల్లించండి", kn: "ಈಗ ಪಾವತಿಸಿ", ml: "ഇപ്പോൾ പേയ്‌മെന്റ് ചെയ്യുക" },
    editProfile: { en: "Edit Profile", ta: "சுயவிவரத்தைத் திருத்து", hi: "प्रोफ़ाइल संपादित करें", te: "ప్రొఫైల్‌ను సవరించండి", kn: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ", ml: "പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക" },
    saveChanges: { en: "Save Changes", ta: "மாற்றங்களைச் சேமிக்கவும்", hi: "परिवर्तन सहेजें", te: "మార్పులను సేవ్ చేయండి", kn: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ", ml: "മാറ്റങ്ങൾ സംരക്ഷിക്കുക" },
    copyHash: { en: "Copy Hash", ta: "ஹாஷ் நகலெடு", hi: "हैश कॉपी करें", te: "హ్యాష్ కాపీ చేయండి", kn: "ಹ್ಯಾಶ್ ಕಾಪಿ ಮಾಡಿ", ml: "ഹാഷ് കോപ്പി ചെയ്യുക" }
  },
  buyerVerification: {
    buyerLabel: { en: "BUYER", ta: "வாங்குபவர்", hi: "खरीदार", te: "కొనుగోలుదారు", kn: "ಖರೀದಿದಾರ", ml: "വാങ്ങുന്നയാൾ" },
    title: { en: "Buyer Verification Status", ta: "வாங்குபவர் சரிபார்ப்பு நிலை", hi: "खरीदार सत्यापन स्थिति", te: "కొనుగోలుదారు సరిచూసే స్థితి", kn: "ಖರೀದಿದಾರರ ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ", ml: "വാങ്ങുന്നയാളുടെ സ്ഥിരീകരണ അവസ്ഥ" },
    subtitle: { en: "Manage identity, business compliance, and regulatory credentials on AgriBazaar.", ta: "அக்ரிபஜாரில் அடையாளம், வணிக இணக்கம் மற்றும் ஒழுங்குமுறை சான்றுகளை நிர்வகிக்கவும்.", hi: "एग्रीबाजार पर पहचान, व्यावसायिक अनुपालन और नियामक क्रेडेंशियल प्रबंधित करें।", te: "అగ్రిబజార్‌లో గుర్తింపు, వ్యాపార వర్తింపు మరియు నిబంధనల వివరాలను నిర్వహించండి.", kn: "ಅಗ್ರಿಬಜಾರ್‌ನಲ್ಲಿ ಗುರುತು, ವ್ಯವಹಾರ ನಿಯಮಗಳು ಮತ್ತು ದಾಖಲೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.", ml: "അഗ്രിബസാറിൽ തിരിച്ചറിയൽ, ബിസിനസ്സ് അനുസരണം, റെഗുലേറ്ററി വിവരങ്ങൾ എന്നിവ നിയന്ത്രിക്കുക." },
    checklistHeading: { en: "Verification Checklist", ta: "சரிபார்ப்பு சரிபார்ப்பு பட்டியல்", hi: "सत्यापन जांच सूची", te: "సరిచూసే చెక్‌లిస్ట్", kn: "ಪರಿಶೀಲನಾ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ", ml: "സ്ഥിരീകരണ ചെക്ക്‌ലിസ്റ്റ്" },
    wizardCardHeading: { en: "Complete Your Verification Wizard", ta: "உங்கள் சரிபார்ப்பு வழிகாட்டியை முடிக்கவும்", hi: "अपना सत्यापन विज़ार्ड पूरा करें", te: "మీ సరిచూసే విజార్డ్‌ను పూర్తి చేయండి", kn: "ನಿಮ್ಮ ಪರಿಶೀಲನಾ ವಿಝಾರ್ಡ್ ಪೂರ್ಣಗೊಳಿಸಿ", ml: "നിങ്ങളുടെ സ്ഥിരീകരണ വിസാർഡ് പൂർത്തിയാക്കുക" },
    wizardCardDesc: { en: "Finish all required identity, tax, bank, and documentation checks to build trust with farmers and unlock verified buyer badges.", ta: "விவசாயிகளுடன் நம்பிக்கையை உருவாக்க மற்றும் சரிபார்க்கப்பட்ட பேட்ஜ்களைப் பெற அனைத்து சோதனைகளையும் முடிக்கவும்.", hi: "किसानों के साथ विश्वास बनाने और सत्यापित खरीदार बैज अनलॉक करने के लिए सभी जांच पूरी करें।", te: "రైతులతో నమ్మకాన్ని పెంపొందించడానికి మరియు ధృవీకరించిన బ్యాడ్జ్‌లను పొందడానికి అన్ని తనిఖీలను పూర్తి చేయండి.", kn: "ರೈತರಲ್ಲಿ ವಿಶ್ವಾಸ ಮೂಡಿಸಲು ಮತ್ತು ಪರಿಶೀಲಿಸಿದ ಬ್ಯಾಡ್ಜ್‌ಗಳನ್ನು ಪಡೆಯಲು ಎಲ್ಲಾ ತಪಾಸಣೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.", ml: "കർഷകരുമായി വിശ്വാസം കെട്ടിപ്പടുക്കുന്നതിനും സ്ഥിരീകരിച്ച ബാഡ്ജുകൾ നേടുന്നതിനും എല്ലാ പരിശോധനകളും പൂർത്തിയാക്കുക." },
    completedCountOfTotal: { en: "{{count}} of {{total}} completed", ta: "{{total}} இல் {{count}} முடிந்தது", hi: "{{total}} में से {{count}} पूरा हुआ", te: "{{total}} లో {{count}} పూర్తయింది", kn: "{{total}} ರಲ್ಲಿ {{count}} ಪೂರ್ಣಗೊಂಡಿದೆ", ml: "{{total}}-ൽ {{count}} എണ്ണം പൂർത്തിയായി" },
    officialPortal: { en: "• Official Verification Portal", ta: "• அதிகாரப்பூர்வ சரிபார்ப்பு போர்டல்", hi: "• आधिकारिक सत्यापन पोर्टल", te: "• అధికారిక సరిచూసే పోర్టల్", kn: "• ಅಧಿಕೃತ ಪರಿಶೀಲನಾ ಪೋರ್ಟಲ್", ml: "• ഔദ്യോഗിക സ്ഥിരീകരണ പോർട്ടൽ" },
    allChecksCompletedDesc: { en: "All required verification checks have been successfully completed and audited against Indian regulatory standards.", ta: "தேவையான அனைத்து சரிபார்ப்பு சோதனைகளும் வெற்றிகரமாக முடிவடைந்து தணிக்கை செய்யப்பட்டுள்ளன.", hi: "सभी आवश्यक सत्यापन जांच सफलतापूर्वक पूरी हो गई हैं और उनका ऑडिट किया गया है।", te: "అన్ని అవసరమైన సరిచూసే తనిఖీలు విజయవంతంగా పూర్తయ్యాయి.", kn: "ಅಗತ್ಯವಿರುವ ಎಲ್ಲಾ ಪರಿಶೀಲನಾ ತಪಾಸಣೆಗಳು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿವೆ.", ml: "ആവശ്യമായ എല്ലാ സ്ഥിരീകരണ പരിശോധനകളും വിജയകരമായി പൂർത്തിയായി." },
    verifiedOn: { en: "Verified On:", ta: "சரிபார்க்கப்பட்ட தேதி:", hi: "सत्यापित तिथि:", te: "పరిశీలించిన తేదీ:", kn: "ಪರಿಶೀಲಿಸಿದ ದಿನಾಂಕ:", ml: "സ്ഥിരീകരിച്ച തീയതി:" }
  },
  marketplace: {
    newestFirst: { en: "Newest first", ta: "புதியது முதலில்", hi: "नवीनतम पहले", te: "కొత్తవి ముందుగా", kn: "ಇತ್ತೀಚಿನವು ಮೊದಲು", ml: "ഏറ്റവും പുതിയത് ആദ്യം" },
    priceLowToHigh: { en: "Price: low to high", ta: "விலை: குறைந்ததிலிருந்து அதிகம்", hi: "मूल्य: कम से अधिक", te: "ధర: తక్కువ నుండి ఎక్కువ", kn: "ಬೆಲೆ: ಕಡಿಮೆಯಿಂದ ఎక్కువ", ml: "വില: കുറഞ്ഞതിൽ നിന്ന് കൂടിയതിലേക്ക്" },
    priceHighToLow: { en: "Price: high to low", ta: "விலை: அதிகத்திலிருந்து குறைவு", hi: "मूल्य: अधिक से कम", te: "ధర: ఎక్కువ నుండి తక్కువ", kn: "ಬೆಲೆ: ಹೆಚ್ಚಿನಿಂದ ಕಡಿಮೆ", ml: "വില: കൂടിയതിൽ നിന്ന് കുറഞ്ഞതിലേക്ക്" },
    mostPopular: { en: "Most popular", ta: "மிகவும் பிரபலமானவை", hi: "सबसे लोकप्रिय", te: "అత్యంత ప్రజాదరణ పొందినవి", kn: "ಅತ್ಯಂತ ಜನಪ್ರಿಯ", ml: "ഏറ്റവും ജനപ്രീതിയുള്ളത്" }
  },
  productDetails: {
    availableInStock: { en: "{{count}} {{unit}} available in stock", ta: "{{count}} {{unit}} இருப்பில் உள்ளது", hi: "{{count}} {{unit}} स्टॉक में उपलब्ध", te: "{{count}} {{unit}} స్టాక్‌లో అందుబాటులో ఉంది", kn: "{{count}} {{unit}} ಸ್ಟಾಕ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ", ml: "{{count}} {{unit}} സ്റ്റോക്കിൽ ലഭ്യമാണ്" },
    harvestDateLabel: { en: "Harvest: {{date}}", ta: "அறுவடை: {{date}}", hi: "कटाई: {{date}}", te: "కోత: {{date}}", kn: "ಕೊಯ್ಲು: {{date}}", ml: "വിളവെടുപ്പ്: {{date}}" },
    availableFromLabel: { en: "Available: {{date}}", ta: "கிடைக்கும் தேதி: {{date}}", hi: "उपलब्धता: {{date}}", te: "అందుబాటులో ఉంది: {{date}}", kn: "ಲಭ್ಯತೆ: {{date}}", ml: "ലഭ്യത: {{date}}" },
    quantityLabel: { en: "Quantity ({{unit}}):", ta: "அளவு ({{unit}}):", hi: "मात्रा ({{unit}}):", te: "పరిమాణం ({{unit}}):", kn: "ಪ್ರಮಾಣ ({{unit}}):", ml: "അളവ് ({{unit}}):" },
    aboutFarmerTitle: { en: "About the Farmer / Producer", ta: "விவசாயி / உற்பத்தியாளர் பற்றி", hi: "किसान / उत्पादक के बारे में", te: "రైతు / ఉత్పత్తిదారు గురించి", kn: "ರೈತ / ಉತ್ಪಾದಕರ ಬಗ್ಗೆ", ml: "കർഷകൻ / ഉത്പാദകൻ സംബന്ധിച്ച്" }
  },
  buyerVerificationConfig: {
    INDIVIDUAL: {
      portalTitle: { en: "Individual Buyer Verification Portal", ta: "தனிநபர் வாங்குபவர் சரிபார்ப்பு போர்டல்", hi: "व्यक्तिगत खरीदार सत्यापन पोर्टल", te: "వ్యక్తిగత కొనుగోలుదారు సరిచూసే పోర్టల్", kn: "ವೈಯಕ್ತಿಕ ಖರೀದಿದಾರರ ಪರಿಶೀಲನಾ ಪೋರ್ಟಲ್", ml: "വ്യക്തിഗത വാങ്ങുന്നയാളുടെ സ്ഥിരീകരണ പോർട്ടൽ" },
      pageTitle: { en: "Individual Buyer Compliance & Verification", ta: "தனிநபர் வாங்குபவர் இணக்கம் & சரிபார்ப்பு", hi: "व्यक्तिगत खरीदार अनुपालन और सत्यापन", te: "వ్యక్తిగత కొనుగోలుదారు వర్తింపు & సరిచూడడం", kn: "ವೈಯಕ್ತಿಕ ಖರೀದಿದಾರರ ಅನುಸರಣೆ ಮತ್ತು ಪರಿಶೀಲನೆ", ml: "വ്യക്തിഗത വാങ്ങുന്നയാളുടെ അനുസരണവും സ്ഥിരീകരണവും" },
      badgeText: { en: "VERIFIED INDIVIDUAL BUYER", ta: "சரிபார்க்கப்பட்ட தனிநபர் வாங்குபவர்", hi: "सत्यापित व्यक्तिगत खरीदार", te: "ధృవీకరించిన వ్యక్తిగత కొనుగోలుదారు", kn: "ಪರಿಶೀಲಿಸಿದ ವೈಯಕ್ತಿಕ ಖರೀದಿದಾರ", ml: "സ്ഥിരീകരിച്ച വ്യക്തിഗത വാങ്ങുന്നയാൾ" },
      incompleteBadgeText: { en: "Verification Pending", ta: "சரிபார்ப்பு நிலுவையில் உள்ளது", hi: "सत्यापन लंबित", te: "సరిచూడడం పెండింగ్‌లో ఉంది", kn: "ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ", ml: "സ്ഥിരീകരണം തീർപ്പാക്കാത്തതാണ്" },
      steps: {
        mobile: {
          shortLabel: { en: "Mobile OTP", ta: "மொபைல் OTP", hi: "मोबाइल ओटीपी", te: "మొబైల్ OTP", kn: "ಮೊಬೈಲ್ OTP", ml: "മൊബൈൽ OTP" },
          name: { en: "Mobile Number Verification", ta: "கைபேசி எண் சரிபார்ப்பு", hi: "मोबाइल नंबर सत्यापन", te: "మొబైల్ నంబర్ సరిచూడడం", kn: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಪರಿಶೀಲನೆ", ml: "മൊബൈൽ നമ്പർ സ്ഥിരീകരണം" },
          description: { en: "Verify 10-digit mobile number via instant SMS OTP.", ta: "SMS OTP மூலம் மொபைல் எண்ணை சரிபார்க்கவும்.", hi: "एसएमएस ओटीपी के माध्यम से मोबाइल नंबर सत्यापित करें।", te: "SMS OTP ద్వారా మొబైల్ నంబర్‌ను సరిచూడండి.", kn: "SMS OTP ಮೂಲಕ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.", ml: "SMS OTP വഴി മൊബൈൽ നമ്പർ സ്ഥിരീകരിക്കുക." }
        },
        identity: {
          shortLabel: { en: "Govt Identity", ta: "அரசு அடையாளம்", hi: "सरकारी पहचान", te: "ప్రభుత్వ గుర్తింపు", kn: "ಸರ್ಕಾರಿ ಗುರುತು", ml: "സർക്കാർ തിരിച്ചറിയൽ" },
          name: { en: "Aadhaar / Passport / Voter ID", ta: "ஆதார் / பாஸ்போர்ட் / வாக்காளர் அடையாள அட்டை", hi: "आधार / पासपोर्ट / मतदाता पहचान पत्र", te: "ఆధార్ / పాస్‌పోర్ట్ / ఓటరు ID", kn: "ಆಧಾರ್ / ಪಾಸ್‌ಪೋರ್ಟ್ / ಮತದಾರರ ID", ml: "ആധാർ / പാസ്പോർട്ട് / വോട്ടർ ഐഡി" },
          description: { en: "Identity verification with government issued ID photo.", ta: "அரசாங்க அடையாள அட்டையுடன் சரிபார்ப்பு.", hi: "सरकारी पहचान पत्र के साथ सत्यापन।", te: "ప్రభుత్వ ఐడీ కార్డుతో సరిచూడడం.", kn: "ಸರ್ಕಾರಿ ಗುರುತಿನ ಚೀಟಿಯೊಂದಿಗೆ ಪರಿಶೀಲನೆ.", ml: "സർക്കാർ തിരിച്ചറിയൽ കാർഡ് ഉപയോഗിച്ച് സ്ഥിരീകരണം." }
        },
        address: {
          shortLabel: { en: "Shipping Address", ta: "விநியோக முகவரி", hi: "शिपिंग पता", te: "షిప్పింగ్ చిరునామా", kn: "ಶಿಪ್ಪಿಂಗ್ ವಿಳಾಸ", ml: "ഷിപ്പിംഗ് വിലാസം" },
          name: { en: "Delivery & Residential Address", ta: "விநியோக மற்றும் குடியிருப்பு முகவரி", hi: "डिलीवरी और आवासीय पता", te: "డెలివరీ మరియు నివాస చిరునామా", kn: "ಡೆಲಿವರಿ ಮತ್ತು ವಸತಿ ವಿಳಾಸ", ml: "ഡെലിവറിയും താമസ വിലാസവും" },
          description: { en: "Valid residential address for produce deliveries.", ta: "பயிர் விநியோகத்திற்கான சரியான முகவரி.", hi: "उपज प्रेषण के लिए वैध आवासीय पता।", te: "సరుకు డెలివరీ కోసం చెల్లుబాటు అయ్యే నివాస చిరునామా.", kn: "ಸರಕು ಡೆಲಿವರಿಗಾಗಿ ಮಾನ್ಯ ವಸತಿ ವಿಳಾಸ.", ml: "ഉൽപ്പന്ന ഡെലിവറിക്കായി സാധുവായ വിലാസം." }
        },
        summary: {
          shortLabel: { en: "Review & Submit", ta: "மதிப்பாய்வு & சமர்ப்பிப்பு", hi: "समीक्षा और सबमिट करें", te: "సమీక్షించండి & సమర్పించండి", kn: "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಸಲ್ಲಿಸಿ", ml: "വിലയിരുത്തലും സമർപ്പണവും" },
          name: { en: "Verification Review", ta: "சரிபார்ப்பு மதிப்பாய்வு", hi: "सत्यापन समीक्षा", te: "సరిచూసే సమీక్ష", kn: "ಪರಿಶೀಲನಾ ವಿಮರ್ಶೆ", ml: "സ്ഥിരീകരണ വിലയിരുത്തൽ" },
          description: { en: "Final review of submitted individual credentials.", ta: "சமர்ப்பிக்கப்பட்ட சான்றுகளின் இறுதி மதிப்பாய்வு.", hi: "सबमिट किए गए क्रेडेंशियल्स की अंतिम समीक्षा।", te: "సమర్పించిన ఆధారాల తుది సమీక్ష.", kn: "ಸಲ್ಲಿಸಿದ ವಿವರಗಳ ಅಂತಿಮ ಪರಿಶೀಲನೆ.", ml: "സമർപ്പിച്ച വിവരങ്ങളുടെ അവസാന വിലയിരുത്തൽ." }
        }
      }
    }
  }
};

langs.forEach(lang => {
  function applyObj(srcObj, pathPrefix = []) {
    for (const k in srcObj) {
      const currentPath = [...pathPrefix, k];
      const item = srcObj[k];
      if (item && typeof item === 'object' && !item[lang]) {
        applyObj(item, currentPath);
      } else if (item && item[lang]) {
        setDeep(dicts[lang], currentPath.join('.'), item[lang]);
      }
    }
  }

  applyObj(newTranslations);
  fs.writeFileSync(path.join(localesDir, lang, 'translation.json'), JSON.stringify(dicts[lang], null, 2) + '\n', 'utf8');
  console.log(`Updated translations for ${lang}`);
});

console.log('ALL BUYER & MARKETPLACE TRANSLATIONS INJECTED SUCCESSFULLY!');
