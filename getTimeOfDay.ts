import { TimeOfDay } from '../types';

/**
 * Determines the time of day based on a specific timezone.
 * Morning: 05:00 – 11:59
 * Afternoon: 12:00 – 16:59
 * Evening: 17:00 – 20:59
 * Night: 21:00 – 04:59
 */
export const getTimeOfDay = (timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): TimeOfDay => {
  try {
    // Get the current hour in the specific timezone
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone
    });
    
    const hour = parseInt(formatter.format(date), 10);

    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night'; // Covers 21:00 to 04:59
  } catch (error) {
    console.error("Timezone error, falling back to local system time", error);
    return 'morning'; // Safe fallback
  }
};
