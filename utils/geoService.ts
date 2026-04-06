import { GeoLocationData } from '../types';

// In production, use a backend proxy to hide API keys or avoid rate limits.
// Using ipapi.co for this implementation.
const API_URL = 'https://ipapi.co/json/';

const CACHE_KEY = 'trivian_geo_cache_v2';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface GeoCache {
  data: GeoLocationData;
  expiresAt: number;
}

export const fetchGeoLocation = async (): Promise<GeoLocationData> => {
  // 1. Check localStorage (persists across tabs; expires after 24 h)
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as GeoCache;
        if (Date.now() < parsed.expiresAt) {
          return parsed.data;
        }
        localStorage.removeItem(CACHE_KEY);
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }
  }

  try {
    // 2. Fetch from API with a timeout to prevent blocking UI
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Geo API failure');
    }

    const data = await response.json() as Record<string, unknown>;

    const geoData: GeoLocationData = {
      country_code: typeof data.country_code === 'string' ? data.country_code : 'US',
      country_name: typeof data.country_name === 'string' ? data.country_name : 'Unknown',
      timezone: typeof data.timezone === 'string' ? data.timezone : Intl.DateTimeFormat().resolvedOptions().timeZone,
      city: typeof data.city === 'string' ? data.city : undefined,
      latitude: typeof data.latitude === 'number' ? data.latitude : undefined,
      longitude: typeof data.longitude === 'number' ? data.longitude : undefined,
    };

    // 3. Cache result in localStorage for 24 hours
    if (typeof window !== 'undefined') {
      const entry: GeoCache = { data: geoData, expiresAt: Date.now() + CACHE_TTL_MS };
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    }

    return geoData;
  } catch (error) {
    console.warn("Geolocation failed, falling back to defaults.", error);
    // Return default fallback (English / System Timezone)
    return {
      country_code: 'US',
      country_name: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }
};
