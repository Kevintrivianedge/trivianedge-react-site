const WEATHER_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export const fetchTemperature = async (latitude: number, longitude: number): Promise<number | null> => {
  // Use a rounded cache key to avoid near-duplicate requests for the same area.
  const cacheKey = `trivian_weather_${latitude.toFixed(2)}_${longitude.toFixed(2)}`;

  // Check sessionStorage cache first (resets on tab close — appropriate for live weather).
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { value, expiresAt } = JSON.parse(cached) as { value: number; expiresAt: number };
      if (Date.now() < expiresAt) return value;
      sessionStorage.removeItem(cacheKey);
    }
  } catch {
    // sessionStorage unavailable — fall through to network request
  }

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    if (!response.ok) return null;
    const data = await response.json();
    const temp: number | null = data.current_weather?.temperature ?? null;

    if (temp !== null) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({ value: temp, expiresAt: Date.now() + WEATHER_CACHE_TTL_MS }));
      } catch {
        // Ignore storage errors
      }
    }

    return temp;
  } catch (error) {
    console.error("Failed to fetch temperature", error);
    return null;
  }
};
