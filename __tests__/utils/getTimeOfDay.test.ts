import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { vi } from 'vitest';
import { getTimeOfDay } from '../../utils/getTimeOfDay';

describe('getTimeOfDay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Helper: set the system clock to a specific UTC hour and call getTimeOfDay with UTC tz
  const withHour = (utcHour: number, tz = 'UTC') => {
    vi.setSystemTime(new Date(Date.UTC(2024, 0, 15, utcHour, 0, 0)));
    return getTimeOfDay(tz);
  };

  it('returns "morning" for hours 5–11 in UTC', () => {
    expect(withHour(5)).toBe('morning');
    expect(withHour(9)).toBe('morning');
    expect(withHour(11)).toBe('morning');
  });

  it('returns "afternoon" for hours 12–16 in UTC', () => {
    expect(withHour(12)).toBe('afternoon');
    expect(withHour(14)).toBe('afternoon');
    expect(withHour(16)).toBe('afternoon');
  });

  it('returns "evening" for hours 17–20 in UTC', () => {
    expect(withHour(17)).toBe('evening');
    expect(withHour(20)).toBe('evening');
  });

  it('returns "night" for hours 21–4 in UTC', () => {
    expect(withHour(21)).toBe('night');
    expect(withHour(0)).toBe('night');
    expect(withHour(4)).toBe('night');
  });

  it('returns a valid fallback for an invalid timezone', () => {
    const result = getTimeOfDay('Invalid/Timezone');
    expect(['morning', 'afternoon', 'evening', 'night']).toContain(result);
  });
});
