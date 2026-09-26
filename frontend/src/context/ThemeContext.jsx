import { useTranslation } from 'react-i18next';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
export const THEME_STORAGE_KEY = 'agri_bazaar_theme';

export function ThemeProvider({ children }) {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || t('common.light'));
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme: () => setTheme(value => value === t('common.dark') ? t('common.light') : t('common.dark')) }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
