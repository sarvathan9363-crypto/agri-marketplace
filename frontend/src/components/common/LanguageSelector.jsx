import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_STORAGE_KEY } from '../../i18n';

const languages = [
  { code: 'en-IN', name: 'English' },
  { code: 'ta-IN', name: 'தமிழ்' },
  { code: 'hi-IN', name: 'हिन्दी' },
  { code: 'te-IN', name: 'తెలుగు' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ' },
  { code: 'ml-IN', name: 'മലയാളം' },
];

export default function LanguageSelector({ compact = false }) {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'en-IN';

  const changeLanguage = async (e) => {
    const selectedLang = e.target.value;
    await i18n.changeLanguage(selectedLang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLang);
    const shortCode = selectedLang.split('-')[0];
    localStorage.setItem('agribazaar-language', shortCode);
  };

  return (
    <label className={`relative flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold text-[var(--text-primary)] transition-colors ${compact ? 'max-w-[130px]' : ''}`}>
      <Globe className="h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
      <span className="sr-only">{t('navigation.language', { defaultValue: 'Language' })}</span>
      <select
        aria-label={t('navigation.language', { defaultValue: 'Language' })}
        value={currentLanguage}
        onChange={changeLanguage}
        className="min-w-0 cursor-pointer appearance-none bg-transparent pr-4 font-display font-bold text-[var(--text-primary)] outline-none"
      >
        {languages.map(({ code, name }) => (
          <option key={code} value={code} className="bg-[var(--surface)] text-[var(--text-primary)]">
            {name}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-[10px] text-[var(--text-secondary)]" aria-hidden="true">▼</span>
    </label>
  );
}
