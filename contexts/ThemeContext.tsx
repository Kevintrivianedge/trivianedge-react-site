import React, { createContext, useContext, useState, useEffect, useRef, startTransition } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dark-first (OLED colour system). Server and first client render both use
  // 'dark' so hydration matches; index.html ships data-theme="dark" so there's
  // no flash. A stored 'light' preference is applied right after mount.
  const [theme, setTheme] = useState<Theme>('dark');
  // The stored preference, until it has been applied to state. While set,
  // the DOM/storage sync below skips so the default never flashes or
  // overwrites the saved choice.
  const pending = useRef<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light') {
      pending.current = stored;
      startTransition(() => setTheme(stored));
    }
  }, []);

  useEffect(() => {
    if (pending.current && pending.current !== theme) return;
    pending.current = null;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
