import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import { getLanguageFromBrowser, isRTL as checkRTL } from '../utils/countryLanguageMap';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state synchronously to ensure children render immediately.
  // This prevents race conditions with IntersectionObservers in parent components.
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_language') as SupportedLanguage;
      if (stored) return stored;
      return getLanguageFromBrowser();
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('user_language', lang);
  };

  const isRTL = checkRTL(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
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
