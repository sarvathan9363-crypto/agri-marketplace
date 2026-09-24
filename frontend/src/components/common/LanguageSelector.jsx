import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_STORAGE_KEY } from '../../i18n';

const languages = [
  { code: 'en', name: 'English' }, { code: 'ta', name: 'தமிழ்' }, { code: 'hi', name: 'हिन्दी' },
];

export default function LanguageSelector({ compact = false }) {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage || 'en';
  const changeLanguage = async ({ target }) => {
    await i18n.changeLanguage(target.value);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, target.value);
  };
  return <label className={`relative flex items-center gap-1.5 rounded-lg border border-[#E2E8E5] bg-white px-2 py-1.5 text-sm font-semibold text-[#082B36] focus-within:ring-2 focus-within:ring-[#00C853] ${compact ? 'max-w-28' : ''}`}>
    <Globe className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="sr-only">{t('navigation.language')}</span>
    <select aria-label={t('navigation.language')} value={currentLanguage} onChange={changeLanguage} className="min-w-0 cursor-pointer appearance-none bg-transparent pr-3 outline-none">
      {languages.map(({ code, name }) => <option key={code} value={code}>{name}</option>)}
    </select><span className="pointer-events-none absolute right-2 text-xs" aria-hidden="true">▼</span>
  </label>;
}
