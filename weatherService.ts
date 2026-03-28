export const fetchTemperature = async (latitude: number, longitude: number): Promise<number | null> => {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.current_weather?.temperature ?? null;
  } catch (error) {
    console.error("Failed to fetch temperature", error);
    return null;
  }
};
