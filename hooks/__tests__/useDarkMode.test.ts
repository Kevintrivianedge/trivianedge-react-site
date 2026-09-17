import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDarkMode, type ThemeMode } from '../useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    vi.clearAllMocks();
  });

  it('defaults to dark mode', () => {
    const { isDark } = useDarkMode();
    expect(isDark).toBe(true);
  });

  it('defaults to system theme preference', () => {
    const { theme } = useDarkMode();
    expect(theme).toBe('system');
  });

  it('persists theme preference to localStorage', () => {
    const { setTheme } = useDarkMode();
    setTheme('light');

    const stored = localStorage.getItem('theme');
    expect(stored).toBe('light');
  });

  it('toggles dark mode on and off', () => {
    const { toggleDarkMode, isDark: initialDark } = useDarkMode();

    toggleDarkMode();
    const { isDark: afterToggle } = useDarkMode();
    expect(afterToggle).not.toBe(initialDark);
  });

  it('applies theme class to document root', () => {
    const { setTheme } = useDarkMode();
    setTheme('dark');

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('switches to light mode correctly', () => {
    const { setTheme, isDark } = useDarkMode();
    setTheme('light');

    expect(isDark).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('loads persisted theme from localStorage', () => {
    localStorage.setItem('theme', 'light');
    const { theme, isDark } = useDarkMode();

    expect(theme).toBe('light');
    expect(isDark).toBe(false);
  });

  it('respects system preference when theme is system', () => {
    const mockMediaQuery = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    window.matchMedia = vi.fn(() => mockMediaQuery as any);

    localStorage.setItem('theme', 'system');
    const { isDark } = useDarkMode();

    expect(isDark).toBe(true);
  });

  it('ignores system preference when theme is explicitly set', () => {
    const mockMediaQuery = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    window.matchMedia = vi.fn(() => mockMediaQuery as any);

    const { setTheme } = useDarkMode();
    setTheme('dark');

    const { isDark } = useDarkMode();
    expect(isDark).toBe(true);
  });

  it('handles all valid theme modes', () => {
    const { setTheme, theme } = useDarkMode();
    const modes: ThemeMode[] = ['dark', 'light', 'system'];

    for (const mode of modes) {
      setTheme(mode);
      expect(theme).toBe(mode);
    }
  });
});
