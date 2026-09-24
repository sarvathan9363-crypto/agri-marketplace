import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import ta from './locales/ta/translation.json';
import hi from './locales/hi/translation.json';

export const LANGUAGE_STORAGE_KEY = 'agribazaar-language';
export const SUPPORTED_LANGUAGES = ['en', 'ta', 'hi'];

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: { en: { translation: en }, ta: { translation: ta }, hi: { translation: hi } },
  fallbackLng: 'en',
  supportedLngs: SUPPORTED_LANGUAGES,
  load: 'languageOnly',
  interpolation: { escapeValue: false },
  saveMissing: import.meta.env.DEV,
  missingKeyHandler: (languages, namespace, key) => {
    if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${languages.join(',')} ${namespace}:${key}`);
  },
  detection: { order: ['localStorage', 'navigator'], lookupLocalStorage: LANGUAGE_STORAGE_KEY, caches: ['localStorage'] },
  returnEmptyString: false,
});

const applyLanguageAttributes = (language) => {
  document.documentElement.lang = language;
  document.documentElement.dir = 'ltr';
  document.documentElement.setAttribute('translate', 'no');
  document.documentElement.classList.add('notranslate');
};

i18n.on('languageChanged', applyLanguageAttributes);
applyLanguageAttributes(i18n.resolvedLanguage || i18n.language || 'en');

export default i18n;
