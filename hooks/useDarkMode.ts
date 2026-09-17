import { useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light' | 'system';

interface DarkModeState {
  isDark: boolean;
  theme: ThemeMode;
  toggleDarkMode: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useDarkMode = (): DarkModeState => {
  const [isDark, setIsDark] = useState(true); // Default to dark
  const [theme, setThemeState] = useState<ThemeMode>('system');

  useEffect(() => {
    // Get stored theme preference
    const stored = localStorage.getItem('theme') as ThemeMode | null;
    const preferredTheme = stored || 'system';
    setThemeState(preferredTheme);

    // Determine if dark mode should be active
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = preferredTheme === 'dark' || (preferredTheme === 'system' && systemPrefersDark);

    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (preferredTheme === 'system') {
        setIsDark(e.matches);
        applyTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    setThemeState(newIsDark ? 'dark' : 'light');
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    applyTheme(newIsDark);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = newTheme === 'dark' || (newTheme === 'system' && systemPrefersDark);

    setIsDark(shouldBeDark);
    applyTheme(shouldBeDark);
  };

  return {
    isDark,
    theme,
    toggleDarkMode,
    setTheme,
  };
};

const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }
};
