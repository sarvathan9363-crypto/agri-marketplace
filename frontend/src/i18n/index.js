import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import ta from './locales/ta/translation.json';
import hi from './locales/hi/translation.json';
import te from './locales/te/translation.json';
import kn from './locales/kn/translation.json';
import ml from './locales/ml/translation.json';
import productDetails from './productDetails';
import uploadLocales from './uploadLocales';

export const LANGUAGE_STORAGE_KEY = 'agri_language';
export const SUPPORTED_LANGUAGES = ['en-IN', 'ta-IN', 'hi-IN', 'te-IN', 'kn-IN', 'ml-IN'];

const legacyLanguage = localStorage.getItem('agribazaar-language');
if (!localStorage.getItem(LANGUAGE_STORAGE_KEY) && legacyLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, `${legacyLanguage}-IN`);
}

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    'en-IN': { translation: en }, 'ta-IN': { translation: ta }, 'hi-IN': { translation: hi },
    'te-IN': { translation: te }, 'kn-IN': { translation: kn }, 'ml-IN': { translation: ml },
  },
  fallbackLng: 'en-IN',
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: { escapeValue: false },
  saveMissing: import.meta.env.DEV,
  missingKeyHandler: (languages, namespace, key) => {
    if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${languages.join(',')} ${namespace}:${key}`);
  },
  detection: { order: ['localStorage', 'navigator'], lookupLocalStorage: LANGUAGE_STORAGE_KEY, caches: ['localStorage'] },
  returnEmptyString: false,
});

Object.entries(productDetails).forEach(([language, resources]) => i18n.addResourceBundle(language, 'translation', resources, true, true));
Object.entries(uploadLocales).forEach(([language, resources]) => i18n.addResourceBundle(language, 'translation', resources, true, true));

const applyLanguageAttributes = (language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = 'ltr';
  document.documentElement.setAttribute('translate', 'no');
  document.documentElement.classList.add('notranslate');
};

i18n.on('languageChanged', applyLanguageAttributes);
applyLanguageAttributes(i18n.resolvedLanguage || i18n.language || 'en-IN');

export default i18n;
