import { describe, it, expect } from 'vitest';
import {
  getCountryGreeting,
  getCountryAffectionateName,
  getLocalizedGreeting,
} from '../../utils/greetings';
import type { SupportedLanguage, TimeOfDay } from '../../types';

describe('getLocalizedGreeting', () => {
  it('returns English morning greeting', () => {
    expect(getLocalizedGreeting('en', 'morning')).toBe('Hello, Good Morning!');
  });

  it('returns French evening greeting', () => {
    expect(getLocalizedGreeting('fr', 'evening')).toBe('Bonsoir, Good Evening!');
  });

  it('returns Arabic night greeting', () => {
    expect(getLocalizedGreeting('ar', 'night')).toContain('تصبح على خير');
  });

  it('falls back to English for an unknown language', () => {
    // 'si' is Sinhala — verify it returns a defined string
    const result = getLocalizedGreeting('si', 'afternoon');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('getCountryGreeting', () => {
  it('returns country-specific greeting for known codes', () => {
    const langs: SupportedLanguage[] = ['en'];
    const times: TimeOfDay[] = ['morning'];
    expect(getCountryGreeting('LK', langs[0], times[0])).toBe('Ayubowan!');
    expect(getCountryGreeting('PH', langs[0], times[0])).toBe('Mabuhay!');
    expect(getCountryGreeting('VN', langs[0], times[0])).toBe('Xin chào!');
  });

  it('falls back to localized greeting for unknown country code', () => {
    const result = getCountryGreeting('XX', 'en', 'morning');
    expect(result).toBe('Hello, Good Morning!');
  });

  it('falls back to localized greeting for undefined country code', () => {
    const result = getCountryGreeting(undefined, 'en', 'afternoon');
    expect(result).toBe('Hello, Good Afternoon!');
  });
});

describe('getCountryAffectionateName', () => {
  it('returns affectionate name for known countries', () => {
    expect(getCountryAffectionateName('LK', 'Sri Lanka')).toBe('the Pearl of the Indian Ocean');
    expect(getCountryAffectionateName('AU', 'Australia')).toBe('the Land Down Under');
  });

  it('returns raw country name for unknown codes', () => {
    expect(getCountryAffectionateName('XX', 'Unnamed Country')).toBe('Unnamed Country');
    expect(getCountryAffectionateName(undefined, 'Some Place')).toBe('Some Place');
  });
});
