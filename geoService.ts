import { GeoLocationData } from '../types';

// In production, use a backend proxy to hide API keys or avoid rate limits.
// Using ipapi.co for this implementation.
const API_URL = 'https://ipapi.co/json/';

const CACHE_KEY = 'trivian_geo_cache_v1';

export const fetchGeoLocation = async (): Promise<GeoLocationData> => {
  // 1. Check Session Storage (Privacy-safe: clears when tab closes)
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
        return JSON.parse(cached);
    } catch (e) {
        sessionStorage.removeItem(CACHE_KEY);
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

    const data = await response.json();

    const geoData: GeoLocationData = {
      country_code: data.country_code,
      country_name: data.country_name,
      timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
    };

    // 3. Cache result
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(geoData));
    
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
