import { useTranslation } from 'react-i18next';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';
  return <button type="button" onClick={toggleTheme} aria-label="Toggle color theme" title={t('common.toggleColorTheme')} className="theme-toggle inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors">
    {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
  </button>;
}
