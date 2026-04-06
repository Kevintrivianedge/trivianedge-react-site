import { describe, it, expect } from 'vitest';
import {
  COUNTRY_TO_LANGUAGE,
  LANGUAGE_NAMES,
  getLanguageFromCountry,
  getLanguageFromBrowser,
  isRTL,
} from '../../utils/countryLanguageMap';
import type { SupportedLanguage } from '../../types';

describe('COUNTRY_TO_LANGUAGE', () => {
  it('maps France to French', () => {
    expect(COUNTRY_TO_LANGUAGE['FR']).toBe('fr');
  });

  it('maps UAE to Arabic', () => {
    expect(COUNTRY_TO_LANGUAGE['AE']).toBe('ar');
  });

  it('maps Sri Lanka to Sinhala', () => {
    expect(COUNTRY_TO_LANGUAGE['LK']).toBe('si');
  });
});

describe('LANGUAGE_NAMES', () => {
  it('contains entries for all supported languages', () => {
    const supported: SupportedLanguage[] = ['en', 'fr', 'es', 'ar', 'si'];
    for (const lang of supported) {
      expect(LANGUAGE_NAMES[lang]).toBeTruthy();
    }
  });
});

describe('getLanguageFromCountry', () => {
  it('returns correct language for a known country', () => {
    expect(getLanguageFromCountry('ES')).toBe('es');
    expect(getLanguageFromCountry('SA')).toBe('ar');
  });

  it('returns "en" for an unknown country code', () => {
    expect(getLanguageFromCountry('ZZ')).toBe('en');
  });
});

describe('getLanguageFromBrowser', () => {
  it('returns a supported language', () => {
    const supported: SupportedLanguage[] = ['en', 'fr', 'es', 'ar', 'si'];
    const result = getLanguageFromBrowser();
    expect(supported).toContain(result);
  });
});

describe('isRTL', () => {
  it('returns true for Arabic', () => {
    expect(isRTL('ar')).toBe(true);
  });

  it('returns false for non-RTL languages', () => {
    expect(isRTL('en')).toBe(false);
    expect(isRTL('fr')).toBe(false);
    expect(isRTL('es')).toBe(false);
    expect(isRTL('si')).toBe(false);
  });
});
