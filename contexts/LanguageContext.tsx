import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, startTransition } from 'react';
import { SupportedLanguage } from '../types';
import { getLanguageFromBrowser, isRTL as checkRTL } from '../utils/countryLanguageMap';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const VALID_LANGUAGES: SupportedLanguage[] = ['en', 'fr', 'es', 'ar', 'si'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 'en' on the server and the first client render so hydration matches; the
  // stored or browser-detected language is applied right after mount.
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const stored = localStorage.getItem('user_language');
    // Validate stored value against the known set of supported languages
    // so tampered/outdated localStorage values don't cause undefined behaviour (#21).
    const next = stored && VALID_LANGUAGES.includes(stored as SupportedLanguage)
      ? (stored as SupportedLanguage)
      : getLanguageFromBrowser();
    if (next !== 'en') startTransition(() => setLanguageState(next));
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('user_language', lang);
  }, []);

  // Memoise derived values so the Provider value object has a stable reference
  // — prevents every useLanguage() consumer from re-rendering on every parent
  // render even when language hasn't changed.
  const isRTL = useMemo(() => checkRTL(language), [language]);
  const value = useMemo(() => ({ language, setLanguage, isRTL }), [language, setLanguage, isRTL]);

  return (
    <LanguageContext.Provider value={value}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className="contents">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
