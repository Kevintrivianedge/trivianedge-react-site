import { GeoLocationData } from '../types';

// In production, use a backend proxy to hide API keys or avoid rate limits.
// Using ipapi.co for this implementation.
const API_URL = 'https://ipapi.co/json/';

export const GEO_CACHE_KEY = 'trivian_geo_cache_v2';
const LEGACY_CACHE_KEY = 'trivian_geo_cache_v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface GeoCache {
  data: GeoLocationData;
  expiresAt: number;
}

/** Purge any stale keys from previous versions of the cache schema. */
function purgeStaleCache(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LEGACY_CACHE_KEY);
    // sessionStorage used by the pre-v2 implementation
    try { sessionStorage.removeItem('trivian_geo_cache_v1'); } catch { /* no-op */ }
  }
}

// Run cleanup once on module load (no-op if keys don't exist)
purgeStaleCache();

export const fetchGeoLocation = async (): Promise<GeoLocationData> => {
  // 1. Check localStorage (persists across tabs; expires after 24 h)
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as GeoCache;
        if (Date.now() < parsed.expiresAt) {
          return parsed.data;
        }
        localStorage.removeItem(GEO_CACHE_KEY);
      } catch {
        localStorage.removeItem(GEO_CACHE_KEY);
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

    // Store only non-sensitive location fields.
    // Coordinates (latitude/longitude) are held in memory for the current session
    // (passed to the weather API) but intentionally excluded from persistent storage.
    const geoData: GeoLocationData = {
      country_code: typeof data.country_code === 'string' ? data.country_code : 'US',
      country_name: typeof data.country_name === 'string' ? data.country_name : 'Unknown',
      timezone: typeof data.timezone === 'string' ? data.timezone : Intl.DateTimeFormat().resolvedOptions().timeZone,
      city: typeof data.city === 'string' ? data.city : undefined,
      // Coordinates kept in memory only — not persisted to localStorage
      latitude: typeof data.latitude === 'number' ? data.latitude : undefined,
      longitude: typeof data.longitude === 'number' ? data.longitude : undefined,
    };

    // 3. Cache non-sensitive fields in localStorage for 24 hours
    if (typeof window !== 'undefined') {
      const { latitude: _lat, longitude: _lon, ...cacheable } = geoData;
      const entry: GeoCache = { data: cacheable, expiresAt: Date.now() + CACHE_TTL_MS };
      localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(entry));
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
