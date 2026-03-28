import { SupportedLanguage } from '../types';

export const COUNTRY_TO_LANGUAGE: Record<string, SupportedLanguage> = {
  FR: 'fr', // France
  ES: 'es', // Spain
  MX: 'es', // Mexico
  AE: 'ar', // UAE
  SA: 'ar', // Saudi Arabia
  LK: 'si', // Sri Lanka
  US: 'en', // USA
  GB: 'en', // UK
  // Add more mappings as needed
};

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: "English",
  fr: "Français",
  es: "Español",
  ar: "العربية",
  si: "සිංහල"
};

export const getLanguageFromCountry = (countryCode: string): SupportedLanguage => {
  return COUNTRY_TO_LANGUAGE[countryCode] || 'en';
};

export const getLanguageFromBrowser = (): SupportedLanguage => {
  if (typeof navigator === 'undefined') return 'en';
  
  // Extract primary language code (e.g., 'en-US' -> 'en')
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  
  // Explicitly check against supported languages
  const supported: SupportedLanguage[] = ['fr', 'es', 'ar', 'si', 'en'];
  
  if (supported.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage;
  }
  
  return 'en';
};

export const isRTL = (lang: SupportedLanguage): boolean => {
  return lang === 'ar';
};
